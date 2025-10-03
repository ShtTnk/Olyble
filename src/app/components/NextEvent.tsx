'use client';

import { useEffect, useState } from 'react';

type Event = {
  name: string;
  date: string;
  time: string;
  court: string;
};

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/api/nextEvent')
      .then(res => res.json())
      .then(data => setEvents(data.events))
      .catch(err => console.error(err));
  }, []);

  if (events.length === 0) return <p>読み込み中...</p>;

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {events.map((event, idx) => (
        <li key={idx} style={{ marginBottom: '10px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <strong>{event.name}</strong><br />
          日付: {event.date} <br />
          時間: {event.time} <br />
          コート: {event.court}
        </li>
      ))}
    </ul>
  );
}
