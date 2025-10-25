'use client';

import React from 'react';
import { Web3AuthProvider } from '@web3auth/modal/react';
import { WagmiProvider } from '@web3auth/modal/react/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import web3AuthConfig from '@/app/config/web3auth';
import Web3AuthModalHandler from './Web3AuthModalHandler';
import ModalCloseButton from './ModalCloseButton';

const queryClient = new QueryClient();

export default function Web3AuthWrapper({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

  // Handle missing Web3Auth configuration
  if (!clientId) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <FallbackMessage
          title="Web3Auth Not Configured"
          message="Add your Web3Auth client ID to your .env file."
          code="NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_client_id"
        />
      );
    }
    return <>{children}</>;
  }

  try {
    return (
      <Web3AuthProvider config={web3AuthConfig}>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider>
            <Web3AuthModalHandler />
            <ModalCloseButton />
            {children}
          </WagmiProvider>
        </QueryClientProvider>
      </Web3AuthProvider>
    );
  } catch (error) {
    console.error('Web3Auth initialization failed:', error);
    return (
      <FallbackMessage
        title="Wallet Connection Error"
        message="There was an error initializing the wallet. Please refresh and try again."
        button
      />
    );
  }
}

// ✅ Small reusable fallback UI
function FallbackMessage({ title, message, code, button }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>
        <p className="text-gray-600 mb-4">{message}</p>
        {code && <code className="block bg-gray-100 p-2 rounded text-sm">{code}</code>}
        {button && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Refresh Page
          </button>
        )}
      </div>
    </div>
  );
}
