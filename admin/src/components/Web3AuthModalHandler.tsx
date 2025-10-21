'use client';

import { useEffect } from 'react';
import { useWeb3AuthConnect, useWeb3AuthDisconnect } from '@web3auth/modal/react';
import { useAccount } from 'wagmi';

/**
 * Web3AuthModalHandler Component
 * 
 * This component handles Web3Auth modal events and ensures proper closing
 * after successful connection. It also provides better error handling.
 */
export default function Web3AuthModalHandler() {
    const { connect, isConnected, loading: connectLoading, error: connectError } = useWeb3AuthConnect();
    const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
    const { address } = useAccount();

    // Handle modal closing after successful connection
    useEffect(() => {
        if (isConnected && address && !connectLoading) {
            console.log('Wallet connected, closing modal...');

            // Add class to body to indicate wallet is connected
            document.body.classList.add('wallet-connected');

            // Force close any open modals
            const modal = document.querySelector('[data-web3auth-modal]');
            if (modal) {
                console.log('Removing data-web3auth-modal');
                modal.remove();
            }

            // Remove any overlay elements
            const overlay = document.querySelector('[data-web3auth-overlay]');
            if (overlay) {
                console.log('Removing data-web3auth-overlay');
                overlay.remove();
            }

            // Remove any backdrop elements
            const backdrop = document.querySelector('[data-web3auth-backdrop]');
            if (backdrop) {
                console.log('Removing data-web3auth-backdrop');
                backdrop.remove();
            }

            // Remove Web3Auth modal classes
            const modalContainer = document.querySelector('.w3a-modal__container');
            if (modalContainer) {
                console.log('Removing w3a-modal__container');
                modalContainer.remove();
            }

            const modalOverlay = document.querySelector('.w3a-modal__overlay');
            if (modalOverlay) {
                console.log('Removing w3a-modal__overlay');
                modalOverlay.remove();
            }

            // Force close any remaining modal elements
            const allModals = document.querySelectorAll('[class*="modal"], [class*="Modal"]');
            allModals.forEach((modal, index) => {
                if (modal.textContent?.includes('Web3Auth') || modal.textContent?.includes('wallet')) {
                    console.log(`Removing modal ${index}:`, modal);
                    modal.remove();
                }
            });
        }
    }, [isConnected, address, connectLoading]);

    // Handle connection errors
    useEffect(() => {
        if (connectError) {
            console.error('Web3Auth connection error:', connectError);

            // Force close modal on error
            const modal = document.querySelector('[data-web3auth-modal]');
            if (modal) {
                modal.remove();
            }
        }
    }, [connectError]);

    // Handle disconnection
    useEffect(() => {
        if (!isConnected && !connectLoading) {
            // Remove wallet-connected class
            document.body.classList.remove('wallet-connected');

            // Clean up any remaining modal elements
            const modal = document.querySelector('[data-web3auth-modal]');
            if (modal) {
                modal.remove();
            }
        }
    }, [isConnected, connectLoading]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Remove wallet-connected class on unmount
            document.body.classList.remove('wallet-connected');
        };
    }, []);

    // This component doesn't render anything, it just handles side effects
    return null;
}
