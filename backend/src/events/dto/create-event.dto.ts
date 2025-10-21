import { IsString, IsNumber, IsDateString, IsNotEmpty, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
    @ApiProperty({ description: 'Event title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Event description' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Event date (ISO string)' })
    @IsDateString()
    eventDate: string;

    @ApiProperty({ description: 'Event location (physical address)' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ description: 'Event type (free-form string)' })
    @IsString()
    @IsNotEmpty()
    eventType: string;

    @ApiProperty({ description: 'Required funding amount in USD' })
    @IsNumber()
    @Min(0)
    fundingRequired: number;

    @ApiProperty({ description: 'Airdrop amount per participant in USD' })
    @IsNumber()
    @Min(0)
    airdropAmount: number;
}
