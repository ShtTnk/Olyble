// src/app/components/EventCard.tsx

import type { Event } from "@/app/lib/scrapeLabola"; // Event型は既存のやつ使う

interface EventCardProps {
  event: Event;
  index: number;
}

export function EventCard({ event, index }: EventCardProps) {
  const colorClass = getColorForDate(event.date);

  return (
    <div
      className={`relative p-4 rounded-lg ${colorClass}`}
      style={{ marginBottom: "8px" }}
    >
      <span className="absolute top-2 left-2 text-sm font-bold bg-white rounded-full px-2 py-1">
        {index + 1}
      </span>
      <div className="text-sm">{event.date}</div>
      <div className="font-semibold">{event.name}</div>
    </div>
  );
}
