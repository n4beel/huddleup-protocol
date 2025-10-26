"use client";

import React, { useEffect, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Image from "next/image";
import { useUserStore } from "@/app/store/useUserStore";
import { Copy, Check } from "lucide-react";
import { Spinner } from "@/app/components/common/Spinner";
import { getEventByOrganizer, getEventByParticipant } from "@/app/services/event.service";
import { Event } from "@/app/types";
import EventCard from "@/app/components/Events/EventCard";

const Profile = () => {
    const { user } = useUserStore();
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    // --- Handle wallet copy ---
    const handleCopy = async () => {
        if (!user?.walletAddress) return;
        await navigator.clipboard.writeText(user.walletAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    // --- Fetch Events ---
    const fetchEvents = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const isActive = true;

            // Call both APIs
            const [created, going] = await Promise.all([
                getEventByOrganizer(user.id, isActive),
                getEventByParticipant(user.id, isActive),
            ]);

            // Merge unique events (if any overlap)
            const merged = [...(created || []), ...(going || [])];
            setEvents(merged);
        } catch (err) {
            console.error("Error fetching user events:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchEvents();
    }, [user]);

    if (!user) {
        return (
            <AppLayout>
                <main className="w-full min-h-screen flex items-center justify-center text-gray-600">
                    <Spinner />
                </main>
            </AppLayout>
        );
    }

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const walletShort = user.walletAddress
        ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
        : "N/A";

    return (
        <AppLayout>
            <main className="w-full min-h-screen relative overflow-hidden p-4">
                <div className="w-full grid grid-cols-12 gap-4">
                    {/* Left Section: Profile Info */}
                    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <section className="w-full bg-white border border-gray-200 shadow-md rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <Image
                                    src={user.profileImage || "/assets/user.png"}
                                    alt="User"
                                    width={80}
                                    height={80}
                                    className="rounded-full border border-gray-200"
                                />
                                <div>
                                    <h6 className="text-lg lg:text-xl font-semibold text-gray-900">
                                        {fullName || "Unnamed User"}
                                    </h6>
                                    <p className="text-sm text-gray-500">
                                        {user.connectionMethod === "email" ? "Organizer" : "User"}
                                    </p>
                                    <p className="text-sm text-gray-700 mt-1">{user.email}</p>
                                </div>
                            </div>

                            {user.walletAddress && (
                                <div className="flex items-center gap-2 mt-4 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full w-fit">
                                    <span className="font-mono text-xs text-gray-700">
                                        {walletShort}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="text-gray-500 hover:text-primary transition-colors"
                                        title={copied ? "Copied!" : "Copy address"}
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Section: Stats */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                        <section className="w-full grid grid-cols-12 gap-2 lg:gap-4">
                            <div className="col-span-6 lg:col-span-4 flex flex-col items-center justify-center gap-4 bg-white border border-gray-200 shadow-md rounded-xl p-4">
                                <p className="text-sm text-foreground text-center">
                                    Total Events
                                </p>
                                <h6 className="text-lg lg:text-xl font-semibold text-center">
                                    {events.length}
                                </h6>
                            </div>

                            <div className="col-span-6 lg:col-span-4 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 shadow-md rounded-xl p-4">
                                <p className="text-sm text-foreground text-center">
                                    Participants Verified
                                </p>
                                <h6 className="text-lg lg:text-xl font-semibold text-center">
                                    10,000
                                </h6>
                            </div>

                            <div className="col-span-12 lg:col-span-4 flex flex-col items-center justify-center gap-2 bg-white border border-gray-200 shadow-md rounded-xl p-4">
                                <p className="text-sm text-foreground text-center">
                                    Total PYUSD Funded
                                </p>
                                <h6 className="text-lg lg:text-xl font-semibold text-center">
                                    1,250 PYUSD
                                </h6>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Events Section */}
                <section className="flex items-center justify-between mt-8">
                    <h4 className="text-lg lg:text-xl font-semibold text-dark">
                        My Events
                    </h4>
                </section>

                <section className="grid lg:grid-cols-3 gap-4 mt-6">
                    {loading ? (
                        <div className="w-full flex items-center justify-center py-8">
                            <Spinner />
                        </div>
                    ) : events.length > 0 ? (
                        events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))
                    ) : (
                        <p className="text-gray-500">No active events found.</p>
                    )}
                </section>
            </main>
        </AppLayout>
    );
};

export default Profile;
