import { Injectable, NestMiddleware, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './interfaces/jwt-payload.interface';

// Extend Express Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly authService: AuthService) { }

    async use(req: Request, res: Response, next: NextFunction) {
        try {
            // Extract JWT token from Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new UnauthorizedException('No valid authorization header');
            }

            const idToken = authHeader.split(' ')[1];

            if (!idToken) {
                throw new UnauthorizedException('No token provided');
            }

            // Verify JWT and get user
            const user = await this.authService.verifyAndGetUser(idToken);

            // Attach user to request
            req.user = user;

            next();
        } catch (error) {
            if (error instanceof BadRequestException) {
                // JWT verification failed - return 400 to trigger wallet disconnection
                return res.status(400).json({
                    error: 'JWT verification failed',
                    message: error.message,
                });
            }

            if (error instanceof UnauthorizedException) {
                return res.status(401).json({
                    error: 'Unauthorized',
                    message: error.message,
                });
            }

            // For other errors, return 500
            console.error('Auth middleware error:', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Authentication failed',
            });
        }
    }
}

