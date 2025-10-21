import React from 'react'
import AppLayout from '../components/common/AppLayout'
import EventSearch from '../components/Events/EventSearch'
import TagList from '../components/Events/TagList'
import EventCard from '../components/Events/EventCard';


export const events = [
    {
        id: 1,
        name: "Beach Cleanup Drive",
        cause: "Environmental",
        location: "Santa Monica, CA",
        date: "2025-11-05",
        reward: "5 PYUSD",
        image: "/assets/event.jpeg", // example image
    },
    {
        id: 2,
        name: "Community Food Distribution",
        cause: "Hunger Relief",
        location: "Austin, TX",
        date: "2025-11-12",
        reward: "7 PYUSD",
        image: "/assets/event.jpeg", // example image
    },
    {
        id: 3,
        name: "Tree Planting Marathon",
        cause: "Climate Action",
        location: "Portland, OR",
        date: "2025-11-20",
        reward: "6 PYUSD",
        image: "/assets/event.jpeg", // example image
    },

];


const EventsExplore = () => {
    return (
        <AppLayout>
            <main className="w-full min-h-screen relative overflow-hidden p-4">
                <EventSearch />
                <br />
                <TagList />
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