import { Injectable, BadRequestException } from '@nestjs/common';
import * as jose from 'jose';
import { ethers } from 'ethers';
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
     * Extracts the EVM wallet address from the Web3Auth JWT payload.
     * It prioritizes external wallets, then derives the address from the
     * secp256k1 app key provided for social logins.
     */
    extractWalletAddress(payload: Web3AuthJWTPayload): string | null {
        const wallets = payload.wallets || [];

        // 1. Priority: Look for an external wallet (e.g., MetaMask)
        // This is for users who connected an existing wallet.
        const ethereumWallet = wallets.find(wallet =>
            wallet.type === 'ethereum' && wallet.address
        );
        if (ethereumWallet?.address) {
            return ethereumWallet.address.toLowerCase();
        }

        // 2. Main Logic: Find the social login (app key) for the EVM chain (secp256k1)
        // This is the key we MUST derive the address from.
        const evmAppKeyWallet = wallets.find(wallet =>
            wallet.curve === 'secp256k1' &&
            wallet.type === 'web3auth_app_key' && // This is the user's main app key
            wallet.public_key
        );

        if (evmAppKeyWallet?.public_key) {
            try {
                // *** THE FIX ***
                // The public key from the payload needs a '0x' prefix for ethers
                const publicKey = evmAppKeyWallet.public_key.startsWith('0x')
                    ? evmAppKeyWallet.public_key
                    : `0x${evmAppKeyWallet.public_key}`;

                // This will now correctly compute the address from "0x03aa...cfc"
                const walletAddress = ethers.computeAddress(publicKey);
                return walletAddress.toLowerCase();
            } catch (error) {
                console.error('Failed to derive Ethereum address from secp256k1 app key:', error, evmAppKeyWallet);
                // If this fails, something is seriously wrong with the JWT key.
            }
        }

        // 3. Fallback: Check for *any* secp256k1 key (e.g., the threshold key)
        // This is less ideal but can serve as a backup if the 'web3auth_app_key' type isn't present.
        const anySecp256k1Wallet = wallets.find(wallet =>
            wallet.curve === 'secp256k1' && wallet.public_key
        );

        if (anySecp256k1Wallet?.public_key) {
            try {
                const publicKey = anySecp256k1Wallet.public_key.startsWith('0x')
                    ? anySecp256k1Wallet.public_key
                    : `0x${anySecp256k1Wallet.public_key}`;

                const walletAddress = ethers.computeAddress(publicKey);
                return walletAddress.toLowerCase();
            } catch (error) {
                console.error('Failed to derive Ethereum address from fallback secp256k1 public key:', error, anySecp256k1Wallet);
            }
        }

        // 4. Final Fallback: Look for any wallet with an address field
        const anyWalletWithAddress = wallets.find(wallet => wallet.address);
        if (anyWalletWithAddress?.address) {
            return anyWalletWithAddress.address.toLowerCase();
        }

        // If we're here, we couldn't find an EVM-compatible address
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
        // Extract wallet address from JWT payload
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
