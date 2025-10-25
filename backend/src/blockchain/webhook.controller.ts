import { Controller, Post, Body, Headers, HttpCode, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { WebhookHandlerService } from './webhook-handler.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(
        private readonly webhookHandlerService: WebhookHandlerService,
        private readonly configService: ConfigService,
    ) { }

    @Post('alchemy')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Handle Alchemy webhook for smart contract events' })
    @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
    @ApiResponse({ status: 400, description: 'Invalid webhook payload' })
    @ApiHeader({ name: 'x-alchemy-signature', description: 'Alchemy webhook signature' })
    async handleAlchemyWebhook(
        @Body() payload: any,
        @Headers('x-alchemy-signature') signature: string,
    ) {
        this.logger.log('Received Alchemy webhook');

        try {
            // Verify webhook signature for security
            await this.verifyAlchemySignature(payload, signature);

            // Process the webhook
            await this.webhookHandlerService.handleWebhook(payload);

            this.logger.log('Webhook processed successfully');
            return { success: true, message: 'Webhook processed successfully' };
        } catch (error) {
            this.logger.error('Error processing webhook:', error);
            throw error; // This will cause Alchemy to retry the webhook
        }
    }

    private async verifyAlchemySignature(payload: any, signature: string) {
        const signingKey = this.configService.get<string>('ALCHEMY_SIGNING_KEY');

        if (!signingKey) {
            this.logger.warn('ALCHEMY_SIGNING_KEY not configured, skipping signature verification');
            return;
        }

        if (!signature) {
            throw new UnauthorizedException('Missing webhook signature');
        }

        // Convert payload to raw string (must be raw string body, not JSON transformed)
        const body = JSON.stringify(payload);

        // Generate HMAC SHA256 hash
        const hmac = crypto.createHmac('sha256', signingKey);
        hmac.update(body, 'utf8');
        const digest = hmac.digest('hex');

        // Compare signatures
        if (signature !== digest) {
            this.logger.error('Invalid webhook signature');
            throw new UnauthorizedException('Invalid webhook signature');
        }

        this.logger.log('Webhook signature verified successfully');
    }
}
