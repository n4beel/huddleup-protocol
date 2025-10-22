import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
    constructor(private readonly configService: ConfigService) {
        // Configure Cloudinary
        cloudinary.config({
            cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
        });
    }

    /**
     * Upload a single image to Cloudinary
     */
    async uploadImage(file: Express.Multer.File): Promise<string> {
        try {
            // Validate file buffer exists
            if (!file.buffer) {
                throw new BadRequestException('File buffer is missing');
            }

            // Convert buffer to data URI for Cloudinary
            const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

            console.log(`Uploading image: ${file.originalname}, size: ${file.size} bytes, type: ${file.mimetype}`);

            const result = await cloudinary.uploader.upload(dataUri, {
                folder: 'huddleup-protocol',
                resource_type: 'auto',
                quality: 'auto',
                fetch_format: 'auto',
            });

            console.log(`Successfully uploaded: ${result.secure_url}`);
            return result.secure_url;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new BadRequestException('Failed to upload image to Cloudinary');
        }
    }

    /**
     * Upload multiple images to Cloudinary
     */
    async uploadImages(files: Express.Multer.File[]): Promise<string[]> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided');
        }

        // Validate file types
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const invalidFiles = files.filter(file => !allowedMimeTypes.includes(file.mimetype));

        if (invalidFiles.length > 0) {
            throw new BadRequestException(
                `Invalid file types. Only ${allowedMimeTypes.join(', ')} are allowed`
            );
        }

        // Validate file sizes (max 10MB per file)
        const maxSize = 10 * 1024 * 1024; // 10MB
        const oversizedFiles = files.filter(file => file.size > maxSize);

        if (oversizedFiles.length > 0) {
            throw new BadRequestException('File size too large. Maximum size is 10MB per file');
        }

        try {
            // Upload all files in parallel
            const uploadPromises = files.map(file => this.uploadImage(file));
            const urls = await Promise.all(uploadPromises);

            return urls;
        } catch (error) {
            console.error('Multiple image upload error:', error);
            throw new BadRequestException('Failed to upload images');
        }
    }

    /**
     * Delete an image from Cloudinary
     */
    async deleteImage(publicId: string): Promise<boolean> {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result.result === 'ok';
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            return false;
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     */
    extractPublicId(url: string): string | null {
        const regex = /\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)$/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
}
