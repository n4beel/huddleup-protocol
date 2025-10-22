'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWeb3AuthUser, useIdentityToken } from '@web3auth/modal/react';
import { useAccount } from 'wagmi';
import { authService, type UserInfo } from '@/services/auth.service';

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: UserInfo | null;
    error: string | null;
}

/**
 * Custom hook for handling authentication with backend
 * 
 * This hook manages the complete authentication flow:
 * 1. Gets JWT token from Web3Auth
 * 2. Verifies it with backend
 * 3. Manages user state
 * 4. Handles errors and disconnection
 */
export function useAuth() {
    const { userInfo: web3AuthUserInfo } = useWeb3AuthUser();
    const { token: idToken, getIdentityToken } = useIdentityToken();
    const { address } = useAccount();


    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
    });

    /**
     * Verify JWT with backend and update user state
     */
    const verifyWithBackend = useCallback(async () => {
        if (!idToken || !address) {
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: false,
                user: null,
                error: null,
            }));
            return;
        }

        // Prevent multiple simultaneous calls
        if (authState.isLoading) {
            console.log('Already verifying, skipping duplicate call');
            return;
        }

        console.log('Starting backend verification for address:', address);
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authService.verifyJWT(idToken);

            if (response.success) {
                console.log('Backend verification successful');
                setAuthState({
                    isAuthenticated: true,
                    isLoading: false,
                    user: response.user,
                    error: null,
                });
            } else {
                throw new Error('JWT verification failed');
            }
        } catch (error) {
            console.error('Backend verification failed:', error);

            // If verification fails, clear auth state
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: error instanceof Error ? error.message : 'Authentication failed',
            });

            // If it's a 400 error, the wallet should be disconnected
            if (error instanceof Error && error.message.includes('400')) {
                // Trigger wallet disconnection
                window.location.reload(); // Simple approach for now
            }
        }
    }, [idToken, address, authState.isLoading]);

    /**
     * Refresh user session
     */
    const refreshSession = useCallback(async () => {
        if (!idToken || !authState.isAuthenticated) {
            return;
        }

        try {
            await authService.refreshSession(idToken);
        } catch (error) {
            console.error('Session refresh failed:', error);
        }
    }, [idToken, authState.isAuthenticated]);

    /**
     * Authenticate external wallet without JWT
     */
    const authenticateExternalWallet = useCallback(async (walletAddress: string) => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // For external wallets, we'll create a mock JWT or use a different auth strategy
            // For now, let's create a user directly with the wallet address
            const mockUser = {
                id: `ext_${walletAddress}`,
                walletAddress: walletAddress.toLowerCase(),
                connectionMethod: 'metamask' as const,
                firstName: 'External',
                lastName: 'Wallet',
                email: undefined,
                profileImage: undefined,
            };

            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                user: mockUser,
                error: null,
            });

        } catch (error) {
            console.error('External wallet authentication failed:', error);
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: error instanceof Error ? error.message : 'External wallet authentication failed',
            });
        }
    }, []);

    /**
     * Get fresh JWT token and verify with backend
     */
    const refreshAuth = useCallback(async () => {
        try {
            const freshToken = await getIdentityToken();
            if (freshToken) {
                await verifyWithBackend();
            }
        } catch (error) {
            console.error('Failed to refresh auth:', error);
        }
    }, [getIdentityToken, verifyWithBackend]);

    // Effect to verify with backend when wallet connects
    useEffect(() => {
        // Prevent multiple simultaneous calls
        if (authState.isLoading) {
            return;
        }

        if (address && !idToken && getIdentityToken) {
            // If we have an address but no token, try to get the token
            console.log('Getting identity token for address:', address);

            // Add a timeout to wait for the token
            const timeoutId = setTimeout(() => {
                console.log('Timeout reached, authenticating external wallet');
                authenticateExternalWallet(address);
            }, 3000); // Wait 3 seconds for the token

            getIdentityToken().then((token) => {
                clearTimeout(timeoutId);
                if (token) {
                    console.log('Got identity token, verifying with backend');
                    verifyWithBackend();
                } else {
                    console.log('No identity token, authenticating external wallet');
                    authenticateExternalWallet(address);
                }
            }).catch((error) => {
                clearTimeout(timeoutId);
                console.error('Failed to get identity token:', error);
                authenticateExternalWallet(address);
            });
        } else if (idToken && address) {
            // For external wallets, web3AuthUserInfo might be null, so we only require idToken and address
            console.log('Have both token and address, verifying with backend');
            verifyWithBackend();
        } else if (address && !idToken) {
            // For external wallets without JWT, try to authenticate with just the wallet address
            console.log('Have address but no token, authenticating external wallet');
            authenticateExternalWallet(address);
        } else {
            // Clear auth state when wallet disconnects
            console.log('No address or token, clearing auth state');
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: null,
            });
        }
    }, [idToken, address]); // Removed function dependencies to prevent multiple calls

    // Effect to refresh session periodically
    useEffect(() => {
        if (!authState.isAuthenticated) return;

        const interval = setInterval(() => {
            refreshSession();
        }, 5 * 60 * 1000); // Refresh every 5 minutes

        return () => clearInterval(interval);
    }, [authState.isAuthenticated, refreshSession]);

    return {
        ...authState,
        refreshAuth,
        refreshSession,
    };
}
