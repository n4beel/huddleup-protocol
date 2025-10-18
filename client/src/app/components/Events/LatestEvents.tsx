import Link from 'next/link'
import React from 'react'
import EventCard from './EventCard';



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
    {
        id: 4,
        name: "Blood Donation Camp",
        cause: "Health",
        location: "New York, NY",
        date: "2025-11-25",
        reward: "8 PYUSD",
        image: "/assets/event.jpeg", // example image
    },
    {
        id: 5,
        name: "Clothing Drive for Winter",
        cause: "Poverty Relief",
        location: "Chicago, IL",
        date: "2025-12-01",
        reward: "5 PYUSD",
        image: "/assets/event.jpeg", // example image
    },
];


const LatestEvents = () => {
    return (
        <div className='w-full h-auto relative'>
            <section className='flex items-center justify-between'>
                <h4 className='text-lg lg:text-xl font-semibold text-dark'>
                    latest Events
                </h4>
                <Link href='/events/all' className='text-primary text-base'>
                    See More
                </Link>
            </section>
            <section className='flex flex-col gap-4 my-6'>
                {events.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </section>
        </div>
    )
}

export default LatestEvents