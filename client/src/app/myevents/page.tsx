"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppLayout from "../components/common/AppLayout";
import MyEventsTabs from "../components/Events/MyEventsTabs";
import EventCard from "../components/Events/EventCard";
import { getEventByOrganizer, getEventByParticipant } from "../services/event.service";
import { Event } from "../types";
import { Spinner } from "../components/common/Spinner";
import { useUserStore } from "../store/useUserStore";


const MyEvents = () => {
    const { user } = useUserStore();
    const searchParams = useSearchParams();
    const tab = searchParams.get("tab") || "created"; // default tab
    const [isActive, setIsActive] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);


    const fetchEvents = async () => {
        try {
            setLoading(true);

            if (tab === "created") {
                const data = await getEventByOrganizer(user?.id, isActive);
                setEvents(data);
            } else if (tab === "going") {
                const data = await getEventByParticipant(user?.id, isActive);
                setEvents(data);
            }

        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchEvents();
        }
    }, [tab, isActive, user]);


    console.log(events , "events.....")
    return (
        <AppLayout>
            <main className="w-full min-h-screen relative overflow-hidden p-4">
                <section className="flex items-center justify-between gap-4">
                    <Suspense>
                        <MyEventsTabs />
                    </Suspense>

                    <select
                        value={isActive ? "upcoming" : "past"}
                        onChange={(e) => setIsActive(e.target.value === "upcoming")}
                        className="border-b border-gray-300 focus:outline-none focus:border-primary bg-transparent text-gray-800 text-sm px-0 py-1"
                    >
                        <option value="upcoming">Active</option>
                        <option value="past">Past</option>
                    </select>
                </section>

                <section className="grid lg:grid-cols-3 gap-4 mt-6">
                    {loading ? (
                        <div className="w-full flex items-center justify-center">
                            <Spinner />
                        </div>
                    ) : events.length > 0 ? (
                        events.map((event) => <EventCard key={event.id} event={event} />)
                    ) : (
                        <p className="text-gray-500">No events found</p>
                    )}
                </section>
            </main>
        </AppLayout>
    );
};

export default MyEvents;
