import { ApiProperty } from '@nestjs/swagger';

export class User {
    @ApiProperty({ description: 'Unique user identifier' })
    id: string;

    @ApiProperty({ description: 'Wallet address' })
    walletAddress: string;

    @ApiProperty({ description: 'Connection method used', enum: ['google', 'metamask', 'email', 'other'] })
    connectionMethod: 'google' | 'metamask' | 'email' | 'other';

    @ApiProperty({ description: 'First name', required: false })
    firstName?: string;

    @ApiProperty({ description: 'Last name', required: false })
    lastName?: string;

    @ApiProperty({ description: 'Email address', required: false })
    email?: string;

    @ApiProperty({ description: 'Profile image URL', required: false })
    profileImage?: string;

    @ApiProperty({ description: 'User creation timestamp' })
    createdAt: Date;

    @ApiProperty({ description: 'Last login timestamp' })
    lastLoginAt: Date;

    @ApiProperty({ description: 'Whether user is active' })
    isActive: boolean;
}

export interface CreateUserDto {
    walletAddress: string;
    connectionMethod: 'google' | 'metamask' | 'email' | 'other';
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
}

export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
    lastLoginAt?: Date;
}
