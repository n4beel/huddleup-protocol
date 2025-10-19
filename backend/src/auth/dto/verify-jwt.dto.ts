import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyJwtDto {
    @ApiProperty({
        description: 'Web3Auth JWT token',
        example: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    @IsString()
    @IsNotEmpty()
    idToken: string;
}

export class VerifyJwtResponseDto {
    @ApiProperty({ description: 'Verification success status' })
    success: boolean;

    @ApiProperty({ description: 'User information' })
    user: {
        id: string;
        walletAddress: string;
        connectionMethod: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        profileImage?: string;
    };

    @ApiProperty({ description: 'Response message' })
    message: string;
}
