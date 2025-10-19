import { Controller, Post, Get, Body, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { VerifyJwtDto, VerifyJwtResponseDto } from './dto/verify-jwt.dto';
import { AuthMiddleware } from './auth.middleware';
import type { Request } from 'express';
import { AuthenticatedUser } from './interfaces/jwt-payload.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('verify-jwt')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Verify Web3Auth JWT and create/update user',
        description: 'Verifies the Web3Auth JWT token and creates or updates the user in the database'
    })
    @ApiResponse({
        status: 200,
        description: 'JWT verification successful and user created/updated',
        type: VerifyJwtResponseDto
    })
    @ApiResponse({
        status: 400,
        description: 'JWT verification failed - wallet should be disconnected'
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error'
    })
    async verifyJWT(@Body() verifyJwtDto: VerifyJwtDto): Promise<VerifyJwtResponseDto> {
        try {
            const user = await this.authService.verifyAndGetUser(verifyJwtDto.idToken);

            return {
                success: true,
                user: {
                    id: user.id,
                    walletAddress: user.walletAddress,
                    connectionMethod: user.connectionMethod,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    profileImage: user.profileImage,
                },
                message: 'JWT verification successful and user created/updated',
            };
        } catch (error) {
            // Re-throw the error to be handled by the global exception filter
            throw error;
        }
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Get current user information',
        description: 'Returns the current authenticated user information'
    })
    @ApiResponse({
        status: 200,
        description: 'User information retrieved successfully',
        type: VerifyJwtResponseDto
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT'
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async getCurrentUser(@Req() req: Request): Promise<VerifyJwtResponseDto> {
        const user = req.user as AuthenticatedUser;

        if (!user) {
            throw new Error('User not found in request context');
        }

        return {
            success: true,
            user: {
                id: user.id,
                walletAddress: user.walletAddress,
                connectionMethod: user.connectionMethod,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                profileImage: user.profileImage,
            },
            message: 'User information retrieved successfully',
        };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refresh user session',
        description: 'Updates the last login time for the current user'
    })
    @ApiResponse({
        status: 200,
        description: 'Session refreshed successfully'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - invalid or missing JWT'
    })
    async refreshSession(@Req() req: Request): Promise<{ success: boolean; message: string }> {
        const user = req.user as AuthenticatedUser;

        if (!user) {
            throw new Error('User not found in request context');
        }

        // Update last login time
        await this.authService.getUserByWalletAddress(user.walletAddress);

        return {
            success: true,
            message: 'Session refreshed successfully',
        };
    }
}
