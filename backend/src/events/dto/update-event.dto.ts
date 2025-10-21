import { IsString, IsNumber, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
    @ApiProperty({ description: 'Event title', required: false })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiProperty({ description: 'Event description', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Event date (ISO string)', required: false })
    @IsOptional()
    @IsDateString()
    eventDate?: string;

    @ApiProperty({ description: 'Event location', required: false })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({ description: 'Event type', required: false })
    @IsOptional()
    @IsString()
    eventType?: string;

    @ApiProperty({ description: 'Required funding amount in USD', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    fundingRequired?: number;

    @ApiProperty({ description: 'Airdrop amount per participant in USD', required: false })
    @IsOptional()
    @IsNumber()
    @Min(0)
    airdropAmount?: number;

    @ApiProperty({ description: 'Event status', required: false })
    @IsOptional()
    @IsString()
    status?: 'draft' | 'funded' | 'completed' | 'cancelled';
}
