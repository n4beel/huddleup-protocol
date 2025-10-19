'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useIdentityToken } from '@web3auth/modal/react';
import { authService, type UserInfo } from '@/services/auth.service';

export default function Profile() {
    const { isAuthenticated, user, isLoading, error } = useAuth();
    const { token: idToken, getIdentityToken } = useIdentityToken();
    const [backendUser, setBackendUser] = useState<UserInfo | null>(null);
    const [backendLoading, setBackendLoading] = useState(false);
    const [backendError, setBackendError] = useState<string | null>(null);


    // Fetch user data from backend when authenticated (only once)
    useEffect(() => {
        const fetchUserFromBackend = async () => {
            // Only fetch if authenticated, have a token, and haven't already fetched backend user
            if (isAuthenticated && idToken && !backendUser && !backendLoading) {
                setBackendLoading(true);
                setBackendError(null);

                try {
                    const userData = await authService.getCurrentUser(idToken);
                    setBackendUser(userData);
                } catch (error) {
                    setBackendError(error instanceof Error ? error.message : 'Failed to fetch user data');
                } finally {
                    setBackendLoading(false);
                }
            }
        };

        fetchUserFromBackend();
    }, [isAuthenticated, idToken, backendUser, backendLoading]);

    // Show loading state
    if (isLoading || backendLoading) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                    <p className="text-gray-600">Loading your profile...</p>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || backendError) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                    <p className="text-gray-600">Error loading your profile</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Error</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error || backendError}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show not authenticated state
    if (!isAuthenticated || !user) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                    <p className="text-gray-600">Please connect your wallet to view your profile</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-yellow-800">Wallet Not Connected</h3>
                            <div className="mt-2 text-sm text-yellow-700">
                                <p>Connect your wallet to view and manage your profile.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Use backend user data if available, otherwise fall back to local user data
    const displayUser = backendUser || user;
    const displayName = displayUser.firstName || displayUser.email || 'User';
    const walletAddress = displayUser.walletAddress;
    const connectionMethod = displayUser.connectionMethod;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                <p className="text-gray-600">Manage your HuddleUp profile and settings</p>
                {backendUser && (
                    <div className="mt-2 text-sm text-green-600">
                        ✅ Data loaded from backend
                    </div>
                )}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                {displayUser.profileImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={displayUser.profileImage}
                                        alt="Profile"
                                        className="w-24 h-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">{displayName}</h3>
                            <p className="text-gray-600">{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet'}</p>
                            <p className="text-sm text-gray-500 mt-2 capitalize">{connectionMethod} User</p>
                        </div>
                        <div className="mt-6 space-y-3">
                            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                                Edit Profile
                            </button>
                            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors">
                                Share Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <input
                                    type="text"
                                    value={displayUser.firstName || ''}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={displayUser.lastName || ''}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={displayUser.email || ''}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Connection Method</label>
                                <input
                                    type="text"
                                    value={displayUser.connectionMethod || ''}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 capitalize"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                            <input
                                type="text"
                                value={displayUser.id || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                                <input
                                    type="url"
                                    placeholder="https://twitter.com/username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                                <input
                                    type="url"
                                    placeholder="https://github.com/username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                                <input
                                    type="url"
                                    placeholder="https://linkedin.com/in/username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Connected Wallet</label>
                                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 capitalize">{connectionMethod}</p>
                                        <p className="text-sm text-gray-500 font-mono">{walletAddress}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600">
                                <p><strong>Authentication Status:</strong> {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}</p>
                                <p><strong>Backend Data:</strong> {backendUser ? '✅ Loaded' : '❌ Not Loaded'}</p>
                                <p><strong>JWT Token:</strong> {idToken ? '✅ Available' : '❌ Not Available'}</p>
                            </div>

                            {/* Debug Information - Only show in development */}
                            {process.env.NODE_ENV === 'development' && (
                                <details className="mt-4">
                                    <summary className="text-sm font-medium text-gray-700 cursor-pointer">Debug Information</summary>
                                    <div className="mt-2 p-3 bg-gray-100 rounded-md text-xs font-mono">
                                        <div><strong>Backend User Data:</strong></div>
                                        <pre className="whitespace-pre-wrap">{JSON.stringify(backendUser, null, 2)}</pre>
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

