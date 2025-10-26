"use client";

import { bytesToHex, padHex } from 'viem/utils';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAccount, useWriteContract, useChainId, useSwitchChain, useConnect } from 'wagmi' // Added useConnect, useSwitchChain
import { Calendar, Clock, DollarSign, MapPin, Users, Plug } from "lucide-react"; // Added Plug icon
import AppLayout from "@/app/components/common/AppLayout";
import { Button } from "@/app/components/common/Button";
import { getEventDetail, getEventByParticipant } from "@/app/services/event.service";
import { Event } from "@/app/types";
import { Spinner } from "@/app/components/common/Spinner";
import { useUserStore } from "@/app/store/useUserStore";
// Assuming these are correct (e.g., 11155111 for Sepolia)
import { REQUIRED_CHAIN_ID } from "@/app/config";
import { BaseError } from "viem"; // For better error handling from wagmi
import { HUDDLEUP_ABI, HUDDLEUP_CONTRACT_ADDRESS } from "@/app/abis/huddle";


const EventDetail = () => {
    const router = useRouter();

    const { writeContract, isPending, isSuccess, error, writeContractAsync } = useWriteContract();
    const { address, isConnected } = useAccount(); // Check connection status
    const chainId = useChainId();
    const { switchChain } = useSwitchChain(); // For switching networks
    const { connect, connectors } = useConnect(); // For connecting a wallet

    // 2. Component/App States
    const { user } = useUserStore();
    const { id } = useParams(); // Should be the string/hex event ID
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [participantData, setParticipantData] = useState<Event | null>(null);
    const [loadingParticipant, setLoadingParticipant] = useState(false);

    const isReadyToInteract = isConnected && chainId === REQUIRED_CHAIN_ID;
    const isWrongChain = isConnected && chainId !== REQUIRED_CHAIN_ID;

    const huddleContractAddress = HUDDLEUP_CONTRACT_ADDRESS as `0x${string}`;

    // Handle successful transaction redirect
    useEffect(() => {
        if (isSuccess) {
            console.log('Transaction successful! Redirecting to my events...');
            router.push('/myevents?tab=going');
        }
    }, [isSuccess, router]);

    // Fetch participant data when user is a participant
    useEffect(() => {
        if (!user?.id || !event || event.relationship !== "PARTICIPANT_OF") return;

        const fetchParticipantData = async () => {
            try {
                setLoadingParticipant(true);
                const participantEvents = await getEventByParticipant(user.id, true);
                const currentEventData = participantEvents.find((e: Event) => e.id === event.id);
                if (currentEventData) {
                    setParticipantData(currentEventData);
                }
            } catch (error) {
                console.error('Error fetching participant data:', error);
            } finally {
                setLoadingParticipant(false);
            }
        };

        fetchParticipantData();
    }, [user?.id, event]);

    // 3. Data Fetching
    useEffect(() => {
        if (!id) return;

        const fetchEvent = async () => {
            try {
                setLoading(true);
                const data = await getEventDetail({
                    id,
                    ...(user?.id && { userId: user.id }),
                });
                setEvent(data);
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id, user?.id]);

    // 4. Contract Interaction
    const handleJoin = async () => {
        if (isPending || !isReadyToInteract || !event) return;

        console.log('Original onchainEventId:', event.onchainEventId);

        let onchainEventIdBytes32: `0x${string}`;

        // Method 1: Try using padHex from viem (more reliable)
        try {
            if (event.onchainEventId.startsWith('0x')) {
                onchainEventIdBytes32 = padHex(event.onchainEventId as `0x${string}`, { size: 32 });
            } else {
                // Convert string to hex first, then pad
                const hexString = bytesToHex(new TextEncoder().encode(event.onchainEventId)) as `0x${string}`;
                onchainEventIdBytes32 = padHex(hexString, { size: 32 });
            }
        } catch (error) {
            console.warn('padHex failed, falling back to manual method:', error);
            // Fallback method
            if (event.onchainEventId.startsWith('0x')) {
                onchainEventIdBytes32 = `0x${event.onchainEventId.slice(2).padStart(64, '0')}` as `0x${string}`;
            } else {
                const bytes = new TextEncoder().encode(event.onchainEventId);
                const paddedBytes = new Uint8Array(32);
                paddedBytes.set(bytes.slice(0, 32));
                onchainEventIdBytes32 = bytesToHex(paddedBytes) as `0x${string}`;
            }
        }

        console.log('Converted onchainEventIdBytes32:', onchainEventIdBytes32);
        console.log('Length:', onchainEventIdBytes32.length);
        console.log('Is valid hex:', /^0x[0-9a-fA-F]{64}$/.test(onchainEventIdBytes32));

        try {
            // Try with explicit ABI definition to ensure correct encoding
            const joinEventABI = [
                {
                    "inputs": [{ "internalType": "bytes32", "name": "_eventId", "type": "bytes32" }],
                    "name": "joinEvent",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ] as const;

            const hash = await writeContractAsync({
                abi: joinEventABI,
                address: huddleContractAddress,
                functionName: 'joinEvent',
                args: [onchainEventIdBytes32],
                chainId: REQUIRED_CHAIN_ID,
            });

            console.log('Transaction sent! Hash:', hash);
            console.log('Transaction submitted successfully. You will be redirected to your events once confirmed.');
        } catch (err) {
            console.error('Error in handleJoin:', err);
            console.error('Error details:', {
                onchainEventId: event.onchainEventId,
                onchainEventIdBytes32,
                contractAddress: huddleContractAddress,
                chainId: REQUIRED_CHAIN_ID
            });
        }
    }

    // 5. Conditional Button Rendering
    const renderButton = () => {
        const isOrganizer = event?.relationship === "ORGANIZER_OF";
        const isParticipant = event?.relationship === "PARTICIPANT_OF";
        const isNoRelationship = event?.relationship === "NO_RELATIONSHIP";

        if (isOrganizer) {
            // Organizer button logic (Verify)
            const today = new Date();
            const eventDate = new Date(event.eventDate);
            const isToday =
                eventDate.getFullYear() === today.getFullYear() &&
                eventDate.getMonth() === today.getMonth() &&
                eventDate.getDate() === today.getDate();

            return (
                <Button
                    variant="dark"
                    size="lg"
                    disabled={!isToday}
                    className="mt-4 w-full lg:w-auto"
                >
                    Verify {isToday ? '' : '(Not Today)'}
                </Button>
            );
        }

        if (isNoRelationship) {
            // Join button logic (requires wallet connection and correct chain)
            if (!isConnected) {
                return (
                    <Button
                        onClick={() => connect({ connector: connectors[0] })}
                        variant="dark"
                        size="lg"
                        className="mt-4 w-full lg:w-auto"
                    >
                        <Plug size={20} className="mr-2" /> Connect Wallet to Join
                    </Button>
                );
            }

            if (isWrongChain) {
                return (
                    <Button
                        onClick={() => switchChain({ chainId: REQUIRED_CHAIN_ID })}
                        variant="dark"
                        size="lg"
                        className="mt-4 w-full lg:w-auto"
                    >
                        Switch to Correct Network Sepolia
                    </Button>
                );
            }

            // Ready to Join
            return (
                <Button
                    onClick={handleJoin}
                    variant="dark"
                    size="lg"
                    className="mt-4 w-full lg:w-auto"
                    disabled={isPending || isSuccess} // Disable during transaction
                >
                    {isPending ? <Spinner /> : 'Join'}
                </Button>
            );
        }

        // isParticipant_OF or other relationship → show nothing

        if (isParticipant) {
            if (loadingParticipant) {
                return (
                    <div className="flex items-center justify-center p-4">
                        <Spinner />
                        <span className="ml-2">Loading QR Code...</span>
                    </div>
                );
            }

            if (participantData?.qrCodeUrl) {
                return (
                    <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Your Event QR Code
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Show this QR code to the organizer for verification
                            </p>
                            <div className="flex justify-center">
                                <Image
                                    src={participantData.qrCodeUrl}
                                    alt="Event QR Code"
                                    width={200}
                                    height={200}
                                    className="border-2 border-gray-200 rounded-lg"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Keep this QR code safe - you'll need it for event verification
                            </p>
                        </div>
                    </div>
                );
            }

            return (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-800">
                                QR code is being generated. Please refresh the page in a few moments.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    // 6. Loading and Not Found Handlers
    if (loading) {
        // ... (loading state remains the same)
        return (
            <AppLayout>
                <main className="w-full min-h-[calc(100vh-220px)] flex items-center justify-center">
                    <Spinner />
                </main>
            </AppLayout>
        );
    }

    if (!event) {
        // ... (not found state remains the same)
        return (
            <AppLayout>
                <main className="w-full min-h-[calc(100vh-220px)] flex items-center justify-center">
                    <p className="text-gray-500">Event not found.</p>
                </main>
            </AppLayout>
        );
    }

    // 7. Render UI
    const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const today = new Date();
    const eventDate = new Date(event.eventDate);



    return (
        <AppLayout>
            <main className="w-full min-h-[calc(100vh-220px)] overflow-y-scroll relative overflow-hidden p-4">
                {/* Event Details Section */}
                <div className="w-full relative grid grid-cols-12 gap-4">
                    {/* ... (Image and detail info) ... */}
                    <div className="col-span-12 lg:col-span-5">
                        <span className="absolute top-2 left-2 px-4 py-2 text-base rounded-xl border text-primary bg-white min-w-[150px]">
                            {event.eventType}
                        </span>
                        <Image
                            src={event.bannerImage || "/assets/event.jpeg"}
                            alt={event.title?.trim() || "Event banner image"}
                            width={800}
                            height={400}
                            className="rounded-xl mx-auto"
                        />
                    </div>

                    <div className="col-span-12 lg:col-span-7 p-2">
                        <h1 className="text-2xl lg:text-4xl font-bold text-black">
                            {event.title}
                        </h1>
                        <p className="text-base text-foreground mt-2">{event.description}</p>

                        <div className="flex items-center justify-between gap-4 mt-4">
                            <p className="flex items-center gap-2 text-foreground text-base">
                                <Calendar size={20} /> {formattedDate}
                            </p>
                            <p className="flex items-center gap-2 text-foreground text-base">
                                <Clock size={20} /> 7PM
                            </p>
                            <p className="flex items-center gap-2 text-foreground text-base">
                                <Users size={20} /> {event.currentParticipants} Participants
                            </p>
                        </div>

                        <hr className="my-6 border-b border-gray-200" />

                        <div className="flex items-center gap-4 mt-4">
                            <span className="w-9 h-9 rounded-xl bg-success/20 flex items-center justify-center">
                                <MapPin size={18} className="text-black" />
                            </span>
                            <p className="text-base text-black">{event.location}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <span className="w-9 h-9 rounded-xl bg-secondary/50 flex items-center justify-center">
                                <DollarSign size={18} className="text-black" />
                            </span>
                            <p className="text-base text-black">
                                {event.airdropAmount} PYUSD
                            </p>
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-b border-gray-200" />

                {/* Footer/Action Section */}
                <div className="w-full my-4 flex flex-col lg:flex-row items-start gap-4 lg:items-center justify-between">
                    <div className="flex items-start gap-4">
                        <Image
                            src="/assets/user.png"
                            alt="Organizer"
                            width={50}
                            height={50}
                            className="rounded-full"
                        />
                        <div>
                            <h6 className="text-lg lg:text-xl font-medium">Organizer</h6>
                            <p className="text-base text-foreground">{event.organizerId}</p>
                        </div>
                    </div>

                    {renderButton()}
                </div>

                {/* Transaction Feedback */}
                {isSuccess && (
                    <p className="text-green-600 mt-4 text-center p-2 bg-green-100 rounded-md">
                        ✅ Transaction successful! You have joined the event.
                    </p>
                )}
                {error && (
                    <p className="text-red-600 mt-4 text-center p-2 bg-red-100 rounded-md">
                        ❌ Transaction failed: {(error as BaseError).shortMessage || error.message}
                    </p>
                )}
            </main>
        </AppLayout>
    );
};

export default EventDetail;