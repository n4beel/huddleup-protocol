import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
    @ApiProperty({
        description: 'Array of uploaded image URLs',
        example: [
            'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/huddleup-protocol/image1.jpg',
            'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/huddleup-protocol/image2.jpg'
        ],
        type: [String]
    })
    urls: string[];

    @ApiProperty({
        description: 'Number of images uploaded',
        example: 2
    })
    count: number;

    @ApiProperty({
        description: 'Upload success message',
        example: 'Images uploaded successfully'
    })
    message: string;
}
