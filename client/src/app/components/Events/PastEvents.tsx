"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { getPastEvents } from "@/app/services/event.service";
import { Event } from "@/app/types";
import { Spinner } from "../common/Spinner";

const PastEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getPastEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch past events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-auto text-center py-10">
                <Spinner/>
            </div>
        );
    }

    return (
        <div className="w-full h-auto relative">
            <section className="flex items-center justify-between">
                <h4 className="text-lg lg:text-xl font-semibold text-dark">
                    Past Events
                </h4>
                <Link href="/events/all" className="text-primary text-base">
                    See More
                </Link>
            </section>

            <section className="flex flex-col lg:flex-row gap-4 my-6">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard past={true} key={event.id} event={event} />
                    ))
                ) : (
                    <p className="text-gray-500">No past events available.</p>
                )}
            </section>
        </div>
    );
};

export default PastEvents;
