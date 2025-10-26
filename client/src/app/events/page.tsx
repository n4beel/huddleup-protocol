'use client'
import React, { Suspense, useEffect, useState } from 'react'
import AppLayout from '../components/common/AppLayout'
import EventSearch from '../components/Events/EventSearch'
import TagList from '../components/Events/TagList'
import { Event } from '../types'
import EventCard from '../components/Events/EventCard';
import { Spinner } from '../components/common/Spinner'
import { getAllEvents } from '../services/event.service'



const EventsExplore = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getAllEvents();
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
            <div className="w-full min-h-screen relative overflow-hidden p-4 flex items-center justify-center">
                <Spinner />
            </div>
        );
    }
    return (
        <AppLayout>
            <main className="w-full min-h-screen relative overflow-hidden p-4">
                <Suspense>
                    <EventSearch />
                </Suspense>
                <br />
                <Suspense>
                    <TagList />
                </Suspense>
                <br />
                <section className='grid lg:grid-cols-3 gap-4'>
                    {events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </section>
            </main>
        </AppLayout>
    )
}

export default EventsExplore