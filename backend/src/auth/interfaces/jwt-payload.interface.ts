export interface Web3AuthJWTPayload {
    iss: string;
    aud: string;
    sub: string;
    iat: number;
    exp: number;
    wallets: Array<{
        type: string;
        address?: string;
        public_key?: string;
        curve?: string;
    }>;
    name?: string;
    email?: string;
    profileImage?: string;
    firstName?: string;
    lastName?: string;
    [key: string]: any;
}

export interface AuthenticatedUser {
    id: string;
    walletAddress: string;
    connectionMethod: 'google' | 'metamask' | 'email' | 'other';
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
}
