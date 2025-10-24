"use client";

import { Event } from "@/app/types";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface EventCardProps {
  event: Event;
  past?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, past = false }) => {
  const bg = past ? "bg-gray-200" : "bg-white";
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/events/${event.id}`);
  };

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // ✅ Provide a safe fallback image
  const imageSrc =
    event.bannerImage && event.bannerImage.trim() !== ""
      ? event.bannerImage
      : "/assets/placeholder-event.jpg"; // Add a local placeholder image

  return (
    <div
      onClick={handleNavigate}
      className={`w-full p-3 ${bg} shadow-xl rounded-lg border border-gray-300 overflow-hidden transition-all cursor-pointer`}
    >
      <div className="flex items-start gap-4">
        {event ? (
          <Image
            src={imageSrc}
              alt={event.title?.trim() || "Event banner image"}
            width={100}
            height={100}
            className="rounded-md object-cover"
          />
        ) : null}
        <div>
          <h6 className="text-base lg:text-lg text-black">{event.title}</h6>
          <div className="flex items-center gap-4 mt-1">
            <small className="flex items-center gap-2 text-foreground">
              <Calendar size={15} /> {formattedDate}
            </small>
          </div>
        </div>
      </div>

      <hr className="border-b border-gray-100 mt-4 mb-2" />

      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-xl bg-success/20 flex items-center justify-center">
            <MapPin size={18} className="text-black" />
          </span>
          <p className="text-base text-black">{event.location}</p>
        </div>
        <div className="p-2 bg-primary rounded-xl">
          <p className="text-white text-sm">
            {event.airdropAmount ? `${event.airdropAmount} PYUSD` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
