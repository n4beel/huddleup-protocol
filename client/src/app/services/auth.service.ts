/**
 * Authentication Service
 * 
 * Handles communication with the backend authentication APIs
 * and manages JWT token operations.
 */

interface VerifyJWTResponse {
    success: boolean;
    user: {
        id: string;
        walletAddress: string;
        connectionMethod: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        profileImage?: string;
    };
    message: string;
}

interface UserInfo {
    id: string;
    walletAddress: string;
    connectionMethod: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    profileImage?: string;
}

class AuthService {
    private baseURL: string;

    constructor() {
        // Get API URL from environment or default to localhost
        this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        // Test backend connectivity on initialization
        // this.testBackendConnectivity();
    }

    /**
     * Test if backend is accessible
     */
    private async testBackendConnectivity() {
        try {
            await fetch(`${this.baseURL}/health`);
        } catch (error) {
            console.error('Backend connectivity test failed:', error);
        }
    }

    /**
     * Verify Web3Auth JWT with backend
     */
    async verifyJWT(idToken: string): Promise<VerifyJWTResponse> {
        const response = await fetch(`${this.baseURL}/auth/verify-jwt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Get current user information
     */
    async getCurrentUser(idToken: string): Promise<UserInfo> {
        const response = await fetch(`${this.baseURL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ /auth/me error response:', errorData);
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data.user;
    }

    /**
     * Refresh user session
     */
    async refreshSession(idToken: string): Promise<{ success: boolean; message: string }> {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    /**
     * Make authenticated API call with JWT token
     */
    async authenticatedRequest<T>(
        endpoint: string,
        options: RequestInit = {},
        idToken: string
    ): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }
}

// Export singleton instance
export const authService = new AuthService();
export type { VerifyJWTResponse, UserInfo };