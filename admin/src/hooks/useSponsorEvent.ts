'use client';

import { useState, useCallback } from 'react';
import { useConfig } from 'wagmi';
import { useAccount } from 'wagmi';
import { contractService, type SponsorEventParams, type ContractError } from '@/services/contract.service';

export interface SponsorshipState {
    isApproving: boolean;
    isFunding: boolean;
    isComplete: boolean;
    error: ContractError | null;
    approveHash: string | null;
    fundHash: string | null;
}

export interface UseSponsorEventReturn {
    state: SponsorshipState;
    sponsorEvent: (event: any) => Promise<void>;
    reset: () => void;
}

/**
 * Hook for managing event sponsorship flow
 */
export function useSponsorEvent(): UseSponsorEventReturn {
    const [state, setState] = useState<SponsorshipState>({
        isApproving: false,
        isFunding: false,
        isComplete: false,
        error: null,
        approveHash: null,
        fundHash: null,
    });

    const config = useConfig();
    const { address } = useAccount();

    const sponsorEvent = useCallback(async (event: any) => {
        if (!address) {
            setState(prev => ({
                ...prev,
                error: {
                    code: 'NO_WALLET',
                    message: 'Please connect your wallet first',
                },
            }));
            return;
        }

        // Reset state
        setState({
            isApproving: false,
            isFunding: false,
            isComplete: false,
            error: null,
            approveHash: null,
            fundHash: null,
        });

        try {
            // Prepare sponsorship parameters with correct field mappings
            const params: SponsorEventParams = {
                onchainEventId: event.onchainEventId, // bytes32 from DB
                organizer: event.organizerWalletAddress, // address from DB
                fundingRequired: event.fundingRequired, // will be converted to wei (6 decimals)
                airdropAmount: event.airdropAmount, // will be converted to wei (6 decimals)
                eventDate: Math.floor(new Date(event.eventDate).getTime() / 1000), // Convert ISO string to Unix timestamp
                fundingAmount: event.fundingRequired, // Sponsor the full amount (will be converted to wei)
            };

            // Start approval phase
            setState(prev => ({ ...prev, isApproving: true }));

            // Execute the complete sponsorship flow
            const result = await contractService.sponsorEvent(params, config);

            // Update state with success
            setState({
                isApproving: false,
                isFunding: false,
                isComplete: true,
                error: null,
                approveHash: result.approveHash,
                fundHash: result.fundHash,
            });

            console.log('Sponsorship completed successfully!');
            console.log('Approval transaction:', result.approveHash);
            console.log('Funding transaction:', result.fundHash);

        } catch (error: any) {
            console.error('Sponsorship failed:', error);

            setState(prev => ({
                ...prev,
                isApproving: false,
                isFunding: false,
                isComplete: false,
                error: error as ContractError,
            }));
        }
    }, [address, config]);

    const reset = useCallback(() => {
        setState({
            isApproving: false,
            isFunding: false,
            isComplete: false,
            error: null,
            approveHash: null,
            fundHash: null,
        });
    }, []);

    return {
        state,
        sponsorEvent,
        reset,
    };
}
