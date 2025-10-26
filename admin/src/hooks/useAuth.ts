'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
    const router = useRouter();
    const pathname = usePathname();
    const { userInfo: web3AuthUserInfo } = useWeb3AuthUser();
    const { token: idToken, getIdentityToken } = useIdentityToken();
    const { address } = useAccount();

    // Refs to track if operations are in progress
    const isVerifyingRef = useRef(false);
    const isExternalAuthRef = useRef(false);

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

        // Prevent multiple simultaneous calls using ref
        if (isVerifyingRef.current) {
            console.log('Verification already in progress, skipping');
            return;
        }

        isVerifyingRef.current = true;
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await authService.verifyJWT(idToken);

            if (response.success) {
                setAuthState({
                    isAuthenticated: true,
                    isLoading: false,
                    user: response.user,
                    error: null,
                });

                // Don't redirect here - let RouteProtection handle it
                // This prevents redirect loops
            } else {
                throw new Error('JWT verification failed');
            }
        } catch (error) {
            console.error('Backend verification failed:', error);

            // If it's a network error or server error, try external wallet authentication
            if (error instanceof Error && (
                error.message.includes('Failed to fetch') ||
                error.message.includes('Internal server error') ||
                error.message.includes('500') ||
                error.message.includes('NetworkError')
            )) {
                console.log('Backend unavailable, falling back to external wallet authentication');
                // Set a flag to trigger external wallet auth in the main effect
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Backend unavailable, using external wallet authentication',
                }));
                return;
            }

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
        } finally {
            isVerifyingRef.current = false;
        }
    }, [idToken, address]);

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
        // Prevent multiple simultaneous calls
        if (isExternalAuthRef.current) {
            console.log('External wallet authentication already in progress, skipping');
            return;
        }

        isExternalAuthRef.current = true;
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

            // Don't redirect here - let RouteProtection handle it
            // This prevents redirect loops

        } catch (error) {
            console.error('External wallet authentication failed:', error);
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: error instanceof Error ? error.message : 'External wallet authentication failed',
            });
        } finally {
            isExternalAuthRef.current = false;
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
        // Prevent multiple simultaneous calls by checking if we're already authenticated
        if (authState.isAuthenticated) {
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
        } else if (idToken && address && !authState.isAuthenticated) {
            // For external wallets, web3AuthUserInfo might be null, so we only require idToken and address
            console.log('Have both token and address, verifying with backend');
            verifyWithBackend();
        } else if (address && !idToken && !authState.isAuthenticated) {
            // For external wallets without JWT, try to authenticate with just the wallet address
            console.log('Have address but no token, authenticating external wallet');
            authenticateExternalWallet(address);
        } else if (!address && !idToken) {
            // Clear auth state when wallet disconnects
            console.log('No address or token, clearing auth state');
            setAuthState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: null,
            });
        }
    }, [idToken, address, authState.isAuthenticated, authenticateExternalWallet, verifyWithBackend, getIdentityToken]);

    // Effect to handle backend fallback when verification fails
    useEffect(() => {
        // If backend verification failed, fallback to external wallet auth
        if (address && authState.error && authState.error.includes('Backend unavailable') && !authState.isAuthenticated) {
            console.log('Backend unavailable, using external wallet authentication');
            authenticateExternalWallet(address);
        }
    }, [address, authState.error, authState.isAuthenticated, authenticateExternalWallet]);

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
