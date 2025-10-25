import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as QRCode from 'qrcode';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class QrService {
    constructor(private readonly configService: ConfigService) {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    /**
     * Generate QR code for event participation verification
     * @param userId - User ID
     * @param eventId - Event ID
     * @returns Cloudinary URL of the generated QR code
     */
    async generateParticipationQR(walletAddress: string, eventId: string): Promise<string> {
        try {
            // Create QR data with user and event information
            const qrData = JSON.stringify({
                walletAddress,
                eventId,
                type: 'participation_verification',
                timestamp: new Date().toISOString(),
            });

            console.log(`Generating QR code for user, wallet address: ${walletAddress}, and event, onchain event id: ${eventId}`);

            // Generate QR code as buffer
            const qrBuffer = await QRCode.toBuffer(qrData, {
                type: 'png',
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF',
                },
                errorCorrectionLevel: 'M',
            });

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(
                `data:image/png;base64,${qrBuffer.toString('base64')}`,
                {
                    folder: 'huddleup-protocol/qr-codes',
                    public_id: `participation_${walletAddress}_${eventId}`,
                    resource_type: 'image',
                    quality: 'auto',
                    fetch_format: 'auto',
                }
            );

            console.log(`QR code uploaded successfully: ${result.secure_url}`);
            return result.secure_url;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw new Error('Failed to generate QR code');
        }
    }

    /**
     * Verify QR code data
     * @param qrData - QR code data string
     * @returns Parsed QR data or null if invalid
     */
    verifyQRData(qrData: string): { userId: string; eventId: string; type: string; timestamp: string } | null {
        try {
            const parsed = JSON.parse(qrData);

            // Validate required fields
            if (!parsed.userId || !parsed.eventId || !parsed.type || !parsed.timestamp) {
                return null;
            }

            // Validate type
            if (parsed.type !== 'participation_verification') {
                return null;
            }

            // Validate timestamp (not older than 1 year)
            const qrTimestamp = new Date(parsed.timestamp);
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

            if (qrTimestamp < oneYearAgo) {
                return null;
            }

            return parsed;
        } catch (error) {
            console.error('Error parsing QR data:', error);
            return null;
        }
    }

    /**
     * Delete QR code from Cloudinary
     * @param qrUrl - Cloudinary URL of the QR code
     * @returns Success status
     */
    async deleteQRCode(qrUrl: string): Promise<boolean> {
        try {
            // Extract public ID from Cloudinary URL
            const publicId = this.extractPublicId(qrUrl);
            if (!publicId) {
                return false;
            }

            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('Error deleting QR code:', error);
            return false;
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     * @param url - Cloudinary URL
     * @returns Public ID or null
     */
    private extractPublicId(url: string): string | null {
        const regex = /\/v\d+\/(.+)\.(png|jpg|jpeg|gif|webp)$/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}
