"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, DollarSign, MapPin, Users } from "lucide-react";
import AppLayout from "@/app/components/common/AppLayout";
import { Button } from "@/app/components/common/Button";
import { getEventDetail } from "@/app/services/event.service";
import { Event } from "@/app/types";
import { Spinner } from "@/app/components/common/Spinner";

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchEvent = async () => {
            const data = await getEventDetail(id as string);
            setEvent(data);
            setLoading(false);
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <AppLayout>
                <main className="w-full min-h-[calc(100vh-220px)] flex items-center justify-center">
                    <Spinner/>
                </main>
            </AppLayout>
        );
    }

    if (!event) {
        return (
            <AppLayout>
                <main className="w-full min-h-[calc(100vh-220px)] flex items-center justify-center">
                    <p className="text-gray-500">Event not found.</p>
                </main>
            </AppLayout>
        );
    }

    const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <AppLayout>
            <main className="w-full min-h-[calc(100vh-220px)] overflow-y-scroll relative overflow-hidden p-4">
                <div className="w-full relative grid grid-cols-12 gap-4">
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
                    <Button variant="dark" size="lg" className="mt-4 w-full lg:w-auto">
                        Interested
                    </Button>
                </div>
            </main>
        </AppLayout>
    );
};

export default EventDetail;
