'use client';

import { useState, useEffect } from 'react';
import { useSponsorEvent } from '@/hooks/useSponsorEvent';

interface SponsorEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: {
        id: string;
        title: string;
        fundingRequired: number;
        airdropAmount: number;
        onchainEventId: string;
        organizerId: string;
        organizerWalletAddress: string;
        eventDate: string;
    };
}

export default function SponsorEventModal({ isOpen, onClose, event }: SponsorEventModalProps) {
    const { state, sponsorEvent, reset } = useSponsorEvent();
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            reset();
            setIsConfirmed(false);
        }
    }, [isOpen]); // Remove reset from dependencies to prevent infinite loop

    const handleSponsor = async () => {
        if (!isConfirmed) {
            setIsConfirmed(true);
            return;
        }

        await sponsorEvent(event);
    };

    const handleClose = () => {
        reset();
        setIsConfirmed(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Sponsor Event</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                        disabled={state.isApproving || state.isFunding}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>

                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Funding Required:</span>
                            <span className="font-medium">${event.fundingRequired.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Airdrop per Participant:</span>
                            <span className="font-medium">${event.airdropAmount} PYUSD</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Max Participants:</span>
                            <span className="font-medium">{Math.floor(event.fundingRequired / event.airdropAmount)}</span>
                        </div>
                    </div>
                </div>

                {/* Confirmation Step */}
                {!isConfirmed && (
                    <div className="mb-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <div className="flex">
                                <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-yellow-800">Important</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        This will sponsor the full amount of ${event.fundingRequired.toLocaleString()} PYUSD.
                                        You will need to approve the transaction and then fund the event.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Steps */}
                {isConfirmed && (
                    <div className="mb-6">
                        <div className="space-y-3">
                            {/* Step 1: Approval */}
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.isApproving
                                    ? 'bg-blue-100 text-blue-600'
                                    : state.approveHash
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {state.isApproving ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    ) : state.approveHash ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="text-sm font-medium">1</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Approve PYUSD Spending</p>
                                    <p className="text-xs text-gray-500">
                                        {state.isApproving ? 'Waiting for confirmation...' :
                                            state.approveHash ? 'Approved successfully' : 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {/* Step 2: Funding */}
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.isFunding
                                    ? 'bg-blue-100 text-blue-600'
                                    : state.fundHash
                                        ? 'bg-green-100 text-green-600'
                                        : state.approveHash
                                            ? 'bg-gray-100 text-gray-400'
                                            : 'bg-gray-100 text-gray-300'
                                    }`}>
                                    {state.isFunding ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                    ) : state.fundHash ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="text-sm font-medium">2</span>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Fund Event</p>
                                    <p className="text-xs text-gray-500">
                                        {state.isFunding ? 'Waiting for confirmation...' :
                                            state.fundHash ? 'Event funded successfully' :
                                                state.approveHash ? 'Ready to fund' : 'Waiting for approval'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {state.error && (
                    <div className="mb-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-red-800">Transaction Failed</h4>
                                    <p className="text-sm text-red-700 mt-1">{state.error.message}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Display */}
                {state.isComplete && (
                    <div className="mb-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-green-800">Event Sponsored Successfully!</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        The event has been funded and is now active.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        disabled={state.isApproving || state.isFunding}
                    >
                        {state.isComplete ? 'Close' : 'Cancel'}
                    </button>

                    {!state.isComplete && (
                        <button
                            onClick={handleSponsor}
                            disabled={state.isApproving || state.isFunding}
                            className={`flex-1 px-4 py-2 rounded-md transition-colors ${state.isApproving || state.isFunding
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {!isConfirmed ? 'Confirm Sponsorship' :
                                state.isApproving ? 'Approving...' :
                                    state.isFunding ? 'Funding...' : 'Start Sponsorship'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
