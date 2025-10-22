'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from '@web3auth/modal/react';
import { useAccount } from 'wagmi';


interface WalletConnectionProps {
    className?: string;
    children: React.ReactNode;
}

/**
 * WalletConnection Component
 * 
 * Handles wallet connection via Web3Auth modal. Supports both social login
 * (Google) and external wallets (MetaMask, etc.). Automatically hides when
 * a wallet is connected.
 */
export default function WalletConnection({ className, children }: WalletConnectionProps) {
    const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
    const { loading: disconnectLoading } = useWeb3AuthDisconnect();
    const { address } = useAccount();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    // Handle connection with proper error handling
    const handleConnect = async () => {
        try {
            await connect();
        } catch (error) {
            console.error('Connection failed:', error);
        }
    };

    // Show loading state during connection/disconnection or auth verification
    if (connectLoading || disconnectLoading || authLoading) {
        return (
            <button
                className={`${className} bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed flex items-center space-x-2`}
                disabled
            >
                <LoadingSpinner />
                {/* <span>{connectLoading ? 'Connecting...' : 'Disconnecting...'}</span> */}
                <span>Loading...</span>
            </button>
        );
    }

    // Hide when wallet is connected and authenticated (WalletInfo component will show instead)
    if (isConnected && address && isAuthenticated) {
        return null;
    }

    return (
        <button
            onClick={handleConnect}
            disabled={connectLoading}
            className={`${className} bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center space-x-2`}
        >
            <WalletIcon />
            <span>{children}</span>
            {connectError && (
                <div className="text-red-500 text-xs mt-1">
                    {connectError.message}
                </div>
            )}
        </button>
    );
}

// Loading spinner component
function LoadingSpinner() {
    return (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );
}

// Wallet icon component
function WalletIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );
}