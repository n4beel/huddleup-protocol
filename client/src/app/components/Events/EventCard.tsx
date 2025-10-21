"use client";
import { Calendar, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from 'next/navigation'; // For App Router

import React from "react";

type Event = {
    id: number;
    name: string;
    cause: string;
    image: string;
    location: string;
    date: string;
    reward: string;
};

interface EventCardProps {
    event: Event;
    past?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, past = false }) => {
    const bg = past ? 'bg-gray-200' : 'bg-white'
    const router = useRouter();


    const handleNavigate = () => {
        router.push('/events/1')
    }

    return (
        <div
            onClick={handleNavigate}
            className={`w-full p-3 ${bg} shadow-xl rounded-lg border border-gray-300 overflow-hidden transition-all cursor-pointer`}
        >
            <div className="flex items-start gap-4">
                <Image
                    src={event.image}
                    alt={event.name}
                    width={100}
                    height={100}
                    className="rounded-md object-cover"
                />
                <div>
                    <h6 className="text-base lg:text-lg text-black">{event.name}</h6>
                    <div className="flex items-center gap-4 mt-1">
                        <small className="flex items-center gap-2 text-foreground"><Calendar size={15} /> 1 Jan 2025</small>
                        <small className="flex items-center gap-2 text-foreground"><Clock size={15} /> 7PM</small>
                    </div>
                </div>
            </div>
            <hr className="border-b border-gray-100 mt-4 mb-2" />
            <div className="w-full flex items-center justify-between" >
                <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-xl bg-success/20 flex items-center justify-center">
                        <MapPin size={18} className="text-black" />
                    </span>
                    <p className="text-base text-black">{event.location}</p>
                </div>
                <div className="p-2 bg-primary rounded-xl">
                    <p className="text-white text-sm">25 PYUSD</p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
