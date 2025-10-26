'use client';

import { useReadContract, useChainId } from 'wagmi';
import { useAccount } from 'wagmi';

// PYUSD contract addresses for different networks
const PYUSD_CONTRACT_ADDRESSES = {
    // Sepolia testnet
    11155111: '0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9',
    // Ethereum mainnet - using a mock address for now since PYUSD might not be deployed there
    1: '0x0000000000000000000000000000000000000000', // This will cause an error, which is expected
} as const;

// ERC20 ABI for balanceOf function
const ERC20_ABI = [
    {
        inputs: [{ name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export function usePYUSDBalance() {
    const { address } = useAccount();
    const chainId = useChainId();
    console.log("🚀 ~ usePYUSDBalance ~ chainId:", chainId)

    // Get the contract address for the current chain
    const contractAddress = PYUSD_CONTRACT_ADDRESSES[chainId as keyof typeof PYUSD_CONTRACT_ADDRESSES];

    // Check if we have a valid contract address for this chain
    const isSupportedChain = !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000';

    const { data: balance, isLoading, error, refetch } = useReadContract({
        address: contractAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address && isSupportedChain,
            refetchInterval: 10000, // Refetch every 10 seconds
        },
    });

    // Format balance with 6 decimals
    const formattedBalance = balance
        ? (Number(balance) / 1000000).toFixed(2)
        : '0.00';

    return {
        balance: balance || BigInt(0),
        formattedBalance,
        isLoading,
        error: !isSupportedChain ? new Error(`PYUSD not supported on chain ${chainId}`) : error,
        refetch,
        isSupportedChain,
        chainId,
    };
}
