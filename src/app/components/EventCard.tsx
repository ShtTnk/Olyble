// src/app/components/EventCard.tsx

import type { Event } from "@/app/lib/scrapeLabola"; // Event型は既存のやつ使う

const dateColors = ["bg-red-100", "bg-green-100", "bg-blue-100", "bg-yellow-100", "bg-purple-100"];

const dateColorMap: Record<string, string> = {};
let colorIndex = 0;

function getColorForDate(date: string) {
  if (!dateColorMap[date]) {
    dateColorMap[date] = dateColors[colorIndex % dateColors.length];
    colorIndex++;
  }
  return dateColorMap[date];
}

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
