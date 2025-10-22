import {
    Controller,
    Post,
    Delete,
    Body,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { UploadResponseDto } from './dto/upload-response.dto';
import { DeleteImageDto, DeleteImageResponseDto } from './dto/delete-image.dto';
import { memoryStorage } from 'multer';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('images')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FilesInterceptor('images', 10, {
        storage: memoryStorage(),
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB per file
        },
    }))
    @ApiOperation({
        summary: 'Upload multiple images to Cloudinary',
        description: 'Uploads one or more images to Cloudinary and returns their URLs. Supports JPEG, PNG, GIF, and WebP formats. Maximum 10MB per file, up to 10 files.'
    })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({
        status: 200,
        description: 'Images uploaded successfully',
        type: UploadResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid file format, size, or no files provided'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required'
    })
    @ApiBearerAuth()
    async uploadImages(@UploadedFiles() files: Express.Multer.File[]): Promise<UploadResponseDto> {
        if (!files || files.length === 0) {
            throw new BadRequestException('No files provided. Please upload at least one image.');
        }

        if (files.length > 10) {
            throw new BadRequestException('Too many files. Maximum 10 images allowed.');
        }

        // Validate that all files have buffers
        const invalidFiles = files.filter(file => !file.buffer);
        if (invalidFiles.length > 0) {
            throw new BadRequestException('Some files are missing data. Please try uploading again.');
        }

        console.log(`Received ${files.length} files for upload`);

        try {
            const urls = await this.uploadService.uploadImages(files);

            return {
                urls,
                count: urls.length,
                message: `${urls.length} image${urls.length === 1 ? '' : 's'} uploaded successfully`
            };
        } catch (error) {
            console.error('Upload controller error:', error);
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to upload images');
        }
    }

    @Delete('image')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete an image from Cloudinary',
        description: 'Deletes an image from Cloudinary using its public ID'
    })
    @ApiResponse({
        status: 200,
        description: 'Image deleted successfully',
        type: DeleteImageResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid public ID or deletion failed'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - JWT token required'
    })
    @ApiBearerAuth()
    async deleteImage(@Body() deleteImageDto: DeleteImageDto): Promise<DeleteImageResponseDto> {
        try {
            const success = await this.uploadService.deleteImage(deleteImageDto.publicId);

            if (success) {
                return {
                    success: true,
                    message: 'Image deleted successfully'
                };
            } else {
                throw new BadRequestException('Failed to delete image');
            }
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Failed to delete image');
        }
    }
}
