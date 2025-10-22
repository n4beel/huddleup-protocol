import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QrService } from './qr.service';

export class VerifyQRDto {
    qrData: string;
}

export class VerifyQRResponseDto {
    isValid: boolean;
    userId?: string;
    eventId?: string;
    message: string;
}

@ApiTags('qr')
@Controller('qr')
export class QrController {
    constructor(private readonly qrService: QrService) { }

    @Post('verify')
    @ApiOperation({
        summary: 'Verify QR code for event participation',
        description: 'Verifies a QR code and returns participation information'
    })
    @ApiResponse({
        status: 200,
        description: 'QR code verification result',
        type: VerifyQRResponseDto
    })
    async verifyQR(@Body() verifyQRDto: VerifyQRDto): Promise<VerifyQRResponseDto> {
        const qrData = this.qrService.verifyQRData(verifyQRDto.qrData);

        if (!qrData) {
            return {
                isValid: false,
                message: 'Invalid QR code data'
            };
        }

        return {
            isValid: true,
            userId: qrData.userId,
            eventId: qrData.eventId,
            message: 'QR code is valid'
        };
    }
}
