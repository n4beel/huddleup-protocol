'use client';

import { usePYUSDBalance } from '@/hooks/usePYUSDBalance';

const PYUSDBalance = () => {
    const { formattedBalance, isLoading, error, isSupportedChain, chainId } = usePYUSDBalance();

    if (isLoading) {
        return (
            <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <span className="text-sm text-gray-500">Loading...</span>
            </div>
        );
    }

    if (!isSupportedChain) {
        return (
            <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-yellow-50 border border-yellow-200">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm text-yellow-700">
                    Switch to Sepolia
                </span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-red-50 border border-red-200">
                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-600">Error</span>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2 px-3 py-2 rounded-md bg-green-50 border border-green-200">
            <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">PYUSD</span>
            </div>
            <span className="text-sm font-semibold text-green-900">
                {formattedBalance}
            </span>
        </div>
    );
};

export default PYUSDBalance;
