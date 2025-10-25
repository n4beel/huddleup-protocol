'use client';

import { useEffect } from 'react';
import { useWeb3AuthConnect, useWeb3AuthDisconnect, useIdentityToken } from '@web3auth/modal/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUserStore } from '@/app/store/useUserStore';
import { verifyJWT } from '@/app/services/auth.service';

interface WalletConnectionProps {
  className?: string;
  children: React.ReactNode;
}

export default function WalletConnection({ className, children }: WalletConnectionProps) {
  const router = useRouter();
  const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
  const { loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { token: idToken, getIdentityToken } = useIdentityToken();
  const { address } = useAccount();

  const {setUser, setIdToken, clearUser } = useUserStore();

  // ✅ Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('idToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setIdToken(savedToken);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, [setIdToken, setUser]);

  // ✅ Redirect if already authenticated
  useEffect(() => {
    if (isConnected && address && idToken) {
      router.push('/');
    }
  }, [isConnected, address, idToken, router]);

  const handleConnect = async () => {
    try {
      await connect();

      // ✅ Fetch identity token from Web3Auth
      const token = await getIdentityToken();

      if (!token) {
        console.error('❌ No ID token received from Web3Auth.');
        return;
      }

      // ✅ Verify JWT with backend
      const response = await verifyJWT(token);

      if (response?.success && response.user) {
        // Save in Zustand + LocalStorage
        setIdToken(token);
        setUser(response.user);

        localStorage.setItem('idToken', token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Set default Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        router.push('/');
      } else {
        console.error('❌ JWT verification failed:', response);
      }
    } catch (error) {
      console.error('❌ Connection or verification failed:', error);
      clearUser();
      localStorage.removeItem('idToken');
      localStorage.removeItem('user');
    }
  };

  if (connectLoading || disconnectLoading) {
    return (
      <button
        className={`${className} bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed`}
        disabled
      >
        Loading...
      </button>
    );
  }

  if (isConnected && address && idToken) return null;

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
