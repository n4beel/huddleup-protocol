import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FundEventDto {
    @ApiProperty({ description: 'Sponsor user ID' })
    @IsString()
    @IsNotEmpty()
    sponsorId: string;

    @ApiProperty({ description: 'Funding amount in USD' })
    @IsNumber()
    @Min(0)
    amount: number;
}

