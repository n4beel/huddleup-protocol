import { Module } from '@nestjs/common';
import { WebhookHandlerService } from './webhook-handler.service';
import { WebhookController } from './webhook.controller';

@Module({
    providers: [WebhookHandlerService],
    controllers: [WebhookController],
    exports: [WebhookHandlerService],
})
export class BlockchainModule { }
