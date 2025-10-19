'use client';

import { useState } from 'react';
import { useWeb3AuthDisconnect, useWeb3AuthUser } from '@web3auth/modal/react';
import { useAccount } from 'wagmi';

interface WalletInfoProps {
    className?: string;
}

/**
 * WalletInfo Component
 * 
 * Displays connected wallet information including user details, wallet address,
 * and provides disconnect functionality. Works with both social login and
 * external wallet connections.
 */
export default function WalletInfo({ className }: WalletInfoProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
    const { userInfo } = useWeb3AuthUser();
    const { address, connector } = useAccount();

    // Only render if wallet is connected
    if (!address) {
        return null;
    }

    const displayName = userInfo?.name || userInfo?.email || connector?.name || 'Connected';
    const displaySubtitle = userInfo?.email || 'External Wallet';
    const formattedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    const handleDisconnect = async () => {
        try {
            await disconnect();
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Failed to disconnect wallet:', error);
        }
    };

    const copyAddress = async () => {
        try {
            await navigator.clipboard.writeText(address);
            // Could add a toast notification here
        } catch (error) {
            console.error('Failed to copy address:', error);
        }
    };

    return (
        <div className={`relative ${className}`}>
            {/* Main wallet info button */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-3 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
            >
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckIcon />
                </div>
                <div className="text-left">
                    <div className="text-sm font-medium">{displayName}</div>
                    <div className="text-xs text-green-600">{formattedAddress}</div>
                </div>
                <ChevronIcon isOpen={isDropdownOpen} />
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
                <>
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4">
                            {/* User profile section */}
                            <UserProfileSection
                                userInfo={userInfo}
                                connectorName={connector?.name}
                                displaySubtitle={displaySubtitle}
                            />

                            {/* Wallet address section */}
                            <WalletAddressSection address={address} onCopy={copyAddress} />

                            {/* Disconnect button */}
                            <DisconnectButton
                                onDisconnect={handleDisconnect}
                                isLoading={disconnectLoading}
                            />
                        </div>
                    </div>

                    {/* Backdrop to close dropdown */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                </>
            )}
        </div>
    );
}

// User profile section component
function UserProfileSection({
    userInfo,
    connectorName,
    displaySubtitle
}: {
    userInfo: { name?: string; email?: string; profileImage?: string } | null;
    connectorName?: string;
    displaySubtitle: string;
}) {
    return (
        <div className="border-b border-gray-200 pb-4 mb-4">
            <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    {userInfo?.profileImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={userInfo.profileImage}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <UserIcon />
                    )}
                </div>
                <div>
                    <div className="font-medium text-gray-900">
                        {userInfo?.name || connectorName || 'User'}
                    </div>
                    <div className="text-sm text-gray-500">{displaySubtitle}</div>
                </div>
            </div>
        </div>
    );
}

// Wallet address section component
function WalletAddressSection({
    address,
    onCopy
}: {
    address: string;
    onCopy: () => void;
}) {
    return (
        <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Wallet Address</div>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div className="font-mono text-sm text-gray-800 break-all">
                    {address}
                </div>
                <button
                    onClick={onCopy}
                    className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                    title="Copy address"
                >
                    <CopyIcon />
                </button>
            </div>
        </div>
    );
}

// Disconnect button component
function DisconnectButton({
    onDisconnect,
    isLoading
}: {
    onDisconnect: () => void;
    isLoading: boolean;
}) {
    return (
        <div className="flex space-x-2">
            <button
                onClick={onDisconnect}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
                <LogoutIcon />
                <span>{isLoading ? 'Disconnecting...' : 'Disconnect'}</span>
            </button>
        </div>
    );
}

// Icon components
function CheckIcon() {
    return (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
    return (
        <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}

function CopyIcon() {
    return (
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
}