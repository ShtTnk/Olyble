// コンポーネント外で保持
const dateColors: { [key: string]: string } = {};
const baseColors = [
  "bg-gray-700",
  "bg-green-700",
  "bg-purple-700",
  "bg-yellow-700",
  "bg-indigo-700",
  "bg-pink-700",
];

function getColorForDate(eventDate: string) {
  const dayMatch = eventDate.match(/\((.)\)/); // (日)とか(土)とか
  const day = dayMatch ? dayMatch[1] : "";

  if (day === "土") return "bg-blue-700";
  if (day === "日") return "bg-red-700";

  if (!dateColors[eventDate]) {
    const nextColor = baseColors[Object.keys(dateColors).length % baseColors.length];
    dateColors[eventDate] = nextColor;
  }
  return dateColors[eventDate];
}

export function EventCard({ event, index }: EventCardProps) {
  const colorClass = getColorForDate(event.date);

  return (
    <div className={`relative rounded-lg p-4 text-white shadow-md ${colorClass}`}>
      <div className="absolute -top-2 -left-2 text-xs font-bold bg-black bg-opacity-50 rounded-full w-6 h-6 flex items-center justify-center">
        {index + 1}
      </div>
      <h3 className="text-lg font-semibold">{event.name}</h3>
      <p className="text-sm">{event.date}</p>
      <p className="text-sm">{event.time}</p>
      <p className="text-sm">{event.court}</p>
    </div>
  );
}
