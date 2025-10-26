"use client";

import { useChainId } from 'wagmi';
import { REQUIRED_CHAIN_ID } from '@/app/config';
import { ExternalLink } from 'lucide-react';

export default function NeedTestEthBanner() {
  const chainId = useChainId();
  
  // Only show on Sepolia
  if (chainId !== REQUIRED_CHAIN_ID) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 mb-1">
            Need Test ETH
          </h3>
          <p className="text-sm text-yellow-800 mb-2">
            You need Sepolia ETH to join events. Get free test ETH from a faucet:
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://sepoliafaucet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded-md text-yellow-900 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Sepolia Faucet
              <ExternalLink size={12} />
            </a>
            <a
              href="https://faucets.chain.link/sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded-md text-yellow-900 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Chainlink Faucet
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
