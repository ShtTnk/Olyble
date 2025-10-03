const dateColors = [
  "bg-gray-800",
  "bg-gray-700",
  "bg-gray-600",
  "bg-gray-500",
  "bg-gray-900",
];

export function EventList({ events }: { events: Event[] }) {
  // 日付ごとに色を決めるマップ
  const dateColorMap: Record<string, string> = {};
  const colorIndex = 0;

  events.forEach((event) => {
    if (!dateColorMap[event.date]) {
      dateColorMap[event.date] = dateColors[colorIndex % dateColors.length];
      colorIndex++;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {events.map((event, index) => {
        const bgColor = dateColorMap[event.date];
        return (
          <div
            key={index}
            className={`${bgColor} text-white rounded-xl shadow-lg relative overflow-hidden border border-gray-700 hover:scale-105 transition-transform`}
          >
            {/* 左上に番号 */}
            <span className="absolute top-1 left-1 bg-gray-800 text-white font-bold text-xs w-5 h-5 flex items-center justify-center rounded-tr-full z-10">
              {index + 1}
            </span>
            <div className="p-6 flex flex-col gap-2">
              <h2 className="text-xl font-bold tracking-wide">{event.name}</h2>
              <p className="text-gray-300">{event.date}</p>
              <p className="text-gray-300">{event.time}</p>
              <p className="text-gray-400">{event.court}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
