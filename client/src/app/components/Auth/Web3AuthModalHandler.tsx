'use client';

import { useEffect } from 'react';
import { useWeb3AuthConnect } from '@web3auth/modal/react';
import { useAccount } from 'wagmi';

/**
 * Web3AuthModalHandler
 *
 * Handles Web3Auth connection/disconnection side effects.
 * Cleans up leftover modals and manages a body class for styling.
 */
export default function Web3AuthModalHandler() {
  const { isConnected, loading, error } = useWeb3AuthConnect();
  const { address } = useAccount();

  // Handle successful connection
  useEffect(() => {
    if (isConnected && address && !loading) {
      document.body.classList.add('wallet-connected');
      closeWeb3AuthModal();
    }
  }, [isConnected, address, loading]);

  // Handle connection error
  useEffect(() => {
    if (error) {
      console.error('Web3Auth connection error:', error);
      closeWeb3AuthModal();
    }
  }, [error]);

  // Handle disconnection
  useEffect(() => {
    if (!isConnected && !loading) {
      document.body.classList.remove('wallet-connected');
    }
  }, [isConnected, loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => document.body.classList.remove('wallet-connected');
  }, []);

  // ✅ Utility to safely remove leftover modal elements
  function closeWeb3AuthModal() {
    const modalSelectors = [
      '[data-web3auth-modal]',
      '.w3a-modal__container',
      '.w3a-modal__overlay',
    ];
    modalSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });
  }

  return null; // no UI, just logic
}
