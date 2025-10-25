import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiResponse({
        status: 200,
        description: 'User found',
        type: User
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async findOne(@Param('id') id: string): Promise<User> {
        const user = await this.usersService.findById(id);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    @Get('wallet/:address')
    @ApiOperation({ summary: 'Get user by wallet address' })
    @ApiResponse({
        status: 200,
        description: 'User found',
        type: User
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async findByWalletAddress(@Param('address') address: string): Promise<User> {
        const user = await this.usersService.findByWalletAddress(address);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    @Post('cleanup-duplicates')
    @ApiOperation({ summary: 'Clean up duplicate users (keep most recent)' })
    @ApiResponse({
        status: 200,
        description: 'Duplicate users cleaned up successfully'
    })
    async cleanupDuplicates(): Promise<{ message: string }> {
        await this.usersService.cleanupDuplicateUsers();
        return { message: 'Duplicate users cleaned up successfully' };
    }

    @Post('cleanup-case-sensitive-duplicates')
    @ApiOperation({ summary: 'Clean up users with case-sensitive duplicate wallet addresses' })
    @ApiResponse({
        status: 200,
        description: 'Case-sensitive duplicates cleaned up successfully'
    })
    async cleanupCaseSensitiveDuplicates(): Promise<{ message: string; deleted: number; kept: number }> {
        const result = await this.usersService.cleanupCaseSensitiveDuplicates();
        return {
            message: 'Case-sensitive duplicates cleaned up successfully',
            deleted: result.deleted,
            kept: result.kept
        };
    }
}
