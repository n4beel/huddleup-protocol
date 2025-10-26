'use client';

import { useEffect, useState } from 'react';

/**
 * ModalCloseButton
 *
 * Displays a manual "Close Modal" button if Web3Auth modal gets stuck.
 */
export default function ModalCloseButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const modal = document.querySelector('[data-web3auth-modal], .w3a-modal__container');
      setShow(!!modal);
    });

    // Observe body for added/removed modals
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const handleClose = () => {
    document.querySelectorAll('[data-web3auth-modal], .w3a-modal__container, .w3a-modal__overlay')
      .forEach(el => el.remove());
    document.body.classList.remove('wallet-connected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <button
      onClick={handleClose}
      title="Close Modal"
      className="fixed top-4 right-4 z-[10000] bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition flex items-center space-x-2"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      <span>Close Modal</span>
    </button>
  );
}
