'use client';

import { Web3AuthProvider, type Web3AuthContextConfig } from '@web3auth/modal/react';
import { WagmiProvider } from '@web3auth/modal/react/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import web3AuthConfig from '@/config/web3auth';
import React from 'react';

interface Web3AuthWrapperProps {
    children: React.ReactNode;
}

// Create a query client for React Query
const queryClient = new QueryClient();

export default function Web3AuthWrapper({ children }: Web3AuthWrapperProps) {
    const isWeb3AuthConfigured = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

    // If Web3Auth is not configured, show a helpful message in development
    if (!isWeb3AuthConfigured) {
        if (process.env.NODE_ENV === 'development') {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Web3Auth Not Configured
                        </h2>
                        <p className="text-gray-600 mb-4">
                            To enable wallet functionality, please add your Web3Auth client ID to your environment variables.
                        </p>
                        <code className="block bg-gray-100 p-2 rounded text-sm">
                            NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_client_id
                        </code>
                    </div>
                </div>
            );
        }

        // In production, just return children without Web3Auth
        return <>{children}</>;
    }

    try {
        return (
            <Web3AuthProvider config={web3AuthConfig}>
                <QueryClientProvider client={queryClient}>
                    <WagmiProvider>
                        {children}
                    </WagmiProvider>
                </QueryClientProvider>
            </Web3AuthProvider>
        );
    } catch (error) {
        console.error('Failed to initialize Web3Auth:', error);

        // Fallback UI for Web3Auth initialization errors
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">
                        Wallet Connection Error
                    </h2>
                    <p className="text-gray-600 mb-4">
                        There was an error initializing the wallet connection. Please refresh the page and try again.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }
}
