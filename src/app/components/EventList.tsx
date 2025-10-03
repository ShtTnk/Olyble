import { EventCard, getColorForDate } from "./EventCard";
import type { Event } from "@/app/lib/scrapeLabola";

export function EventList({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {events.map((event, index) => (
        <EventCard key={index} event={event} index={index} />
      ))}
    </div>
  );
}
