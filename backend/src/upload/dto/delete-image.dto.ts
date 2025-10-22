import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteImageDto {
    @ApiProperty({
        description: 'Cloudinary public ID of the image to delete',
        example: 'huddleup-protocol/abc123def456'
    })
    @IsString()
    @IsNotEmpty()
    publicId: string;
}

export class DeleteImageResponseDto {
    @ApiProperty({
        description: 'Deletion success status',
        example: true
    })
    success: boolean;

    @ApiProperty({
        description: 'Deletion result message',
        example: 'Image deleted successfully'
    })
    message: string;
}
