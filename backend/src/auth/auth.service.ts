import { Injectable, BadRequestException } from '@nestjs/common';
import * as jose from 'jose';
import { UsersService } from '../users/users.service';
import { Web3AuthJWTPayload, AuthenticatedUser } from './interfaces/jwt-payload.interface';
import { CreateUserDto } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
    ) { }

    /**
     * Verify Web3Auth JWT and extract user information
     */
    async verifyWeb3AuthJWT(idToken: string): Promise<Web3AuthJWTPayload> {
        try {
            // Determine which JWKS endpoint to use based on token structure
            // For now, we'll try both endpoints
            let jwks: any;
            let payload: jose.JWTPayload;

            try {
                // Try social login JWKS first
                jwks = jose.createRemoteJWKSet(new URL('https://api-auth.web3auth.io/jwks'));
                const result = await jose.jwtVerify(idToken, jwks, { algorithms: ['ES256'] });
                payload = result.payload;
            } catch (error) {
                try {
                    // Try external wallet JWKS
                    jwks = jose.createRemoteJWKSet(new URL('https://authjs.web3auth.io/jwks'));
                    const result = await jose.jwtVerify(idToken, jwks, { algorithms: ['ES256'] });
                    payload = result.payload;
                } catch (secondError) {
                    throw new BadRequestException('Invalid JWT token');
                }
            }

            return payload as Web3AuthJWTPayload;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('JWT verification failed');
        }
    }

    /**
     * Extract wallet address from JWT payload
     */
    extractWalletAddress(payload: Web3AuthJWTPayload): string | null {
        const wallets = payload.wallets || [];

        // Look for ethereum wallet first (external wallets)
        const ethereumWallet = wallets.find(wallet =>
            wallet.type === 'ethereum' && wallet.address
        );

        if (ethereumWallet?.address) {
            return ethereumWallet.address.toLowerCase();
        }

        // Look for web3auth app key (social login)
        const appKeyWallet = wallets.find(wallet =>
            wallet.type === 'web3auth_app_key' && wallet.public_key
        );

        if (appKeyWallet?.public_key) {
            // For social login, we might need to derive the address from the public key
            // For now, we'll use the public key as the identifier
            return appKeyWallet.public_key.toLowerCase();
        }

        return null;
    }

    /**
     * Determine connection method from JWT payload
     */
    determineConnectionMethod(payload: Web3AuthJWTPayload): 'google' | 'metamask' | 'email' | 'other' {
        const wallets = payload.wallets || [];

        // Check for ethereum wallet (external wallet like MetaMask)
        const ethereumWallet = wallets.find(wallet => wallet.type === 'ethereum');
        if (ethereumWallet) {
            return 'metamask';
        }

        // Check for social login indicators
        if (payload.email) {
            // Check if it's a Google email
            if (payload.email.includes('@gmail.com') || payload.email.includes('@googlemail.com')) {
                return 'google';
            }
            return 'email';
        }

        return 'other';
    }

    /**
     * Create or update user from JWT payload
     */
    async createOrUpdateUserFromJWT(payload: Web3AuthJWTPayload): Promise<AuthenticatedUser> {
        const walletAddress = this.extractWalletAddress(payload);

        if (!walletAddress) {
            throw new BadRequestException('No wallet address found in JWT');
        }

        const connectionMethod = this.determineConnectionMethod(payload);

        const createUserDto: CreateUserDto = {
            walletAddress,
            connectionMethod,
            firstName: payload.firstName || payload.name?.split(' ')[0],
            lastName: payload.lastName || payload.name?.split(' ').slice(1).join(' '),
            email: payload.email,
            profileImage: payload.profileImage,
        };

        console.log(`Creating/updating user for wallet: ${walletAddress}`);
        const user = await this.usersService.createOrUpdateUser(createUserDto);
        console.log(`Successfully processed user: ${user.id} for wallet: ${walletAddress}`);

        return {
            id: user.id,
            walletAddress: user.walletAddress,
            connectionMethod: user.connectionMethod,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: user.profileImage,
        };
    }

    /**
     * Verify JWT and return authenticated user
     */
    async verifyAndGetUser(idToken: string): Promise<AuthenticatedUser> {
        const payload = await this.verifyWeb3AuthJWT(idToken);
        return this.createOrUpdateUserFromJWT(payload);
    }

    /**
     * Get user by wallet address (for context-aware APIs)
     */
    async getUserByWalletAddress(walletAddress: string): Promise<AuthenticatedUser | null> {
        const user = await this.usersService.findByWalletAddress(walletAddress);

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            walletAddress: user.walletAddress,
            connectionMethod: user.connectionMethod,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: user.profileImage,
        };
    }
}
