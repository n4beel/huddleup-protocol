/**
 * Smart Contract Service
 * 
 * Handles interactions with PYUSD and HuddleUp Protocol smart contracts
 */

import { writeContract, waitForTransactionReceipt, readContract } from '@wagmi/core';
import { parseUnits, formatUnits, hexToBytes, bytesToHex } from 'viem';
import { PYUSD_ABI, PYUSD_CONTRACT_ADDRESS, PYUSD_DECIMALS } from '@/contracts/abis/pyusd';
import { HUDDLEUP_ABI, HUDDLEUP_CONTRACT_ADDRESS } from '@/contracts/abis/huddleup';

export interface SponsorEventParams {
    onchainEventId: string; // from event.onchainEventId
    organizer: string; // from event.organizerWalletAddress
    fundingRequired: number; // from event.fundingRequired (will be converted to wei)
    airdropAmount: number; // from event.airdropAmount (will be converted to wei)
    eventDate: number; // from event.eventDate (will be converted to Unix timestamp)
    fundingAmount: number; // from event.fundingRequired (will be converted to wei)
}

export interface ContractError {
    code: string;
    message: string;
    details?: any;
}

class ContractService {
    /**
     * Approve PYUSD spending for HuddleUp Protocol contract
     */
    async approvePYUSD(
        amount: number,
        config: any // wagmi config
    ): Promise<{ hash: string; receipt: any }> {
        try {
            // Convert amount to wei (6 decimals for PYUSD)
            const amountWei = parseUnits(amount.toString(), PYUSD_DECIMALS);

            // Call approve function
            const hash = await writeContract(config, {
                address: PYUSD_CONTRACT_ADDRESS,
                abi: PYUSD_ABI,
                functionName: 'approve',
                args: [HUDDLEUP_CONTRACT_ADDRESS, amountWei],
            });

            // Wait for transaction confirmation
            const receipt = await waitForTransactionReceipt(config, {
                hash,
                confirmations: 1,
            });

            return { hash, receipt };
        } catch (error: any) {
            console.error('PYUSD approval failed:', error);
            throw this.formatContractError(error);
        }
    }

    /**
     * Fund an event using HuddleUp Protocol contract
     */
    async fundEvent(
        params: SponsorEventParams,
        config: any // wagmi config
    ): Promise<{ hash: string; receipt: any }> {
        try {
            // Convert amounts to wei (6 decimals for PYUSD)
            const fundingRequiredWei = parseUnits(params.fundingRequired.toString(), PYUSD_DECIMALS);
            const airdropAmountWei = parseUnits(params.airdropAmount.toString(), PYUSD_DECIMALS);
            const fundingAmountWei = parseUnits(params.fundingAmount.toString(), PYUSD_DECIMALS);

            // Convert onchainEventId to bytes32
            // If it's already a hex string, use it directly, otherwise convert
            let onchainEventIdBytes32: `0x${string}`;
            if (params.onchainEventId.startsWith('0x')) {
                // Already a hex string, pad to 32 bytes (64 hex chars)
                onchainEventIdBytes32 = `0x${params.onchainEventId.slice(2).padStart(64, '0')}` as `0x${string}`;
            } else {
                // Convert string to bytes32
                const bytes = new TextEncoder().encode(params.onchainEventId);
                const paddedBytes = new Uint8Array(32);
                paddedBytes.set(bytes.slice(0, 32));
                onchainEventIdBytes32 = bytesToHex(paddedBytes) as `0x${string}`;
            }

            // Call fundEvent function
            const hash = await writeContract(config, {
                address: HUDDLEUP_CONTRACT_ADDRESS,
                abi: HUDDLEUP_ABI,
                functionName: 'fundEvent',
                args: [
                    onchainEventIdBytes32,
                    params.organizer as `0x${string}`,
                    fundingRequiredWei,
                    airdropAmountWei,
                    BigInt(params.eventDate),
                    fundingAmountWei,
                ],
            });

            // Wait for transaction confirmation
            const receipt = await waitForTransactionReceipt(config, {
                hash,
                confirmations: 1,
            });

            return { hash, receipt };
        } catch (error: any) {
            console.error('Fund event failed:', error);
            throw this.formatContractError(error);
        }
    }

    /**
     * Check PYUSD allowance for HuddleUp Protocol contract
     */
    async checkAllowance(
        owner: string,
        config: any // wagmi config
    ): Promise<number> {
        try {
            const allowance = await readContract(config, {
                address: PYUSD_CONTRACT_ADDRESS,
                abi: PYUSD_ABI,
                functionName: 'allowance',
                args: [owner as `0x${string}`, HUDDLEUP_CONTRACT_ADDRESS],
            });

            // Convert from wei to human readable format
            return parseFloat(formatUnits(allowance as bigint, PYUSD_DECIMALS));
        } catch (error: any) {
            console.error('Check allowance failed:', error);
            throw this.formatContractError(error);
        }
    }

    /**
     * Get PYUSD balance for an address
     */
    async getBalance(
        address: string,
        config: any // wagmi config
    ): Promise<number> {
        try {
            const balance = await readContract(config, {
                address: PYUSD_CONTRACT_ADDRESS,
                abi: PYUSD_ABI,
                functionName: 'balanceOf',
                args: [address as `0x${string}`],
            });

            // Convert from wei to human readable format
            return parseFloat(formatUnits(balance as bigint, PYUSD_DECIMALS));
        } catch (error: any) {
            console.error('Get balance failed:', error);
            throw this.formatContractError(error);
        }
    }

    /**
     * Complete sponsorship flow: approve + fund event
     */
    async sponsorEvent(
        params: SponsorEventParams,
        config: any // wagmi config
    ): Promise<{ approveHash: string; fundHash: string; approveReceipt: any; fundReceipt: any }> {
        try {
            // Step 1: Approve PYUSD spending
            console.log('Step 1: Approving PYUSD spending...');
            const { hash: approveHash, receipt: approveReceipt } = await this.approvePYUSD(
                params.fundingAmount,
                config
            );

            console.log('PYUSD approval confirmed:', approveHash);

            // Step 2: Fund the event
            console.log('Step 2: Funding event...');
            const { hash: fundHash, receipt: fundReceipt } = await this.fundEvent(
                params,
                config
            );

            console.log('Event funding confirmed:', fundHash);

            return {
                approveHash,
                fundHash,
                approveReceipt,
                fundReceipt,
            };
        } catch (error: any) {
            console.error('Sponsor event flow failed:', error);
            throw this.formatContractError(error);
        }
    }

    /**
     * Format contract errors for better user experience
     */
    private formatContractError(error: any): ContractError {
        // Common error patterns
        if (error.message?.includes('insufficient funds')) {
            return {
                code: 'INSUFFICIENT_FUNDS',
                message: 'Insufficient PYUSD balance for this transaction',
            };
        }

        if (error.message?.includes('user rejected')) {
            return {
                code: 'USER_REJECTED',
                message: 'Transaction was rejected by user',
            };
        }

        if (error.message?.includes('gas')) {
            return {
                code: 'GAS_ERROR',
                message: 'Gas estimation failed. Please try again.',
            };
        }

        if (error.message?.includes('allowance')) {
            return {
                code: 'ALLOWANCE_ERROR',
                message: 'Insufficient allowance. Please approve more PYUSD.',
            };
        }

        return {
            code: 'UNKNOWN_ERROR',
            message: error.message || 'An unknown error occurred',
            details: error,
        };
    }
}

// Export singleton instance
export const contractService = new ContractService();
export type { SponsorEventParams, ContractError };
