'use client';

import { useEffect } from 'react';
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from '@web3auth/modal/react';
import { useAccount } from 'wagmi';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/store/useUserStore';



interface WalletConnectionProps {
  className?: string;
  children: React.ReactNode;
}

export default function WalletConnection({ className, children }: WalletConnectionProps) {
  const router = useRouter();
  const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { address } = useAccount();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { setUser } = useUserStore();

  // Redirect & save user when both conditions are met
  useEffect(() => {
    if (isConnected && address && isAuthenticated) {
      setUser(address, true);
      router.push('/'); // redirect to home
    }
  }, [isConnected, address, isAuthenticated]);

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connection failed:', error);
    }
  };

  if (connectLoading || disconnectLoading || authLoading) {
    return (
      <button className={`${className} bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed`} disabled>
        Loading...
      </button>
    );
  }

  if (isConnected && address && isAuthenticated) return null;

  return (
    <button
      onClick={handleConnect}
      disabled={connectLoading}
      className={`${className} bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/80 transition-colors`}
    >
      {children}
      {connectError && <span className="text-red-500 text-xs">{connectError.message}</span>}
    </button>
  );
}
