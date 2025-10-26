"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import { Event } from "@/app/types";
import { getLatestEvents } from "@/app/services/event.service";
import { Spinner } from "../common/Spinner";

const LatestEvents = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getLatestEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch events:", error);
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
                    Latest Events
                </h4>
                <Link href="/events" className="text-primary text-base">
                    See More
                </Link>
            </section>

            <section className="flex flex-col lg:flex-row gap-4 my-6">
                {events.length > 0 ? (
                    events.map((event) => <EventCard key={event.id} event={event} />)
                ) : (
                    <p className="text-gray-500">No funded events available.</p>
                )}
            </section>
        </div>
    );
};

export default LatestEvents;
