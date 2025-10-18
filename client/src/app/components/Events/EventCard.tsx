"use client";
import Image from "next/image";
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
  onClick?: (id: number) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(event.id)}
      className="w-full p-3 bg-white rounded-xl border border-gray-200 overflow-hidden transition-all cursor-pointer flex gap-3 items-start"
    >
      {/* Event Image */}
      <div className="flex-shrink-0">
        <Image
          src={event.image}
          alt={event.name}
          width={100}
          height={100}
          className="rounded-lg object-cover"
        />
      </div>

      {/* Event Info */}
      <div className="flex flex-col justify-between flex-1">
        {/* Title + Cause */}
        <div>
          <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
            {event.name}
          </h3>
          <p className="text-sm text-gray-500">{event.cause}</p>
        </div>

        {/* Date + Location */}
        <div className="text-xs text-gray-600 mt-2 flex flex-col">
          <span>📍 {event.location}</span>
          <span>📅 {event.date}</span>
        </div>

        {/* Reward Badge */}
        <div className="mt-2">
          <span className="inline-block text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
            💰 {event.reward}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
