'use client';

import { useState, useEffect } from 'react';

/**
 * ModalCloseButton Component
 * 
 * Provides a manual close button for Web3Auth modals as a fallback
 * when automatic closing fails.
 */
export default function ModalCloseButton() {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        // Show button if modal is open
        const checkForModal = () => {
            const modal = document.querySelector('[data-web3auth-modal]') ||
                document.querySelector('.w3a-modal__container');
            setShowButton(!!modal);
        };

        // Check initially
        checkForModal();

        // Check periodically
        const interval = setInterval(checkForModal, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleClose = () => {
        // Remove all modal elements
        const selectors = [
            '[data-web3auth-modal]',
            '[data-web3auth-overlay]',
            '[data-web3auth-backdrop]',
            '.w3a-modal__container',
            '.w3a-modal__overlay',
            '[class*="modal"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.textContent?.includes('Web3Auth') ||
                    element.textContent?.includes('wallet') ||
                    element.textContent?.includes('Connect')) {
                    element.remove();
                }
            });
        });

        // Remove wallet-connected class
        document.body.classList.remove('wallet-connected');

        setShowButton(false);
    };

    if (!showButton) return null;

    return (
        <div className="fixed top-4 right-4 z-[10000]">
            <button
                onClick={handleClose}
                className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                title="Close Modal"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Close Modal</span>
            </button>
        </div>
    );
}