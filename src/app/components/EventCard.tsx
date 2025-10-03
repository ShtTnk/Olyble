// 曜日だけ色付け
const dayColors: Record<string, string> = {
  "土": "bg-blue-700",
  "日": "bg-red-700",
};

type Event = {
  id: number;
  title: string;
  description: string;
  date: string; // ← 追加
};

interface EventCardProps {
  event: Event;
  index: number;
}

function getDayColor(day: string) {
  return dayColors[day] || "bg-gray-800";
}

export function EventCard({ event, index }: EventCardProps) {
  const match = event.date.match(/\((.)\)/); // "(日)" の部分
  const day = match ? match[1] : "";
  const dateWithoutDay = event.date.replace(/\(.\)/, "");

  return (
    <div className="relative rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:scale-105 transition-transform bg-gray-900 text-white">
      {/* 左上番号 */}
      <span className="absolute top-1 left-1 text-xs font-bold bg-gray-800 bg-opacity-70 rounded-full w-5 h-5 flex items-center justify-center z-10">
        {index + 1}
      </span>

      <div className="p-5 flex flex-col gap-1">
        {/* 日付 + 曜日 */}
        <p className="text-sm">
          {dateWithoutDay}{" "}
          {day && (
            <span className={`px-1 py-0.5 rounded ${getDayColor(day)}`}>
              ({day})
            </span>
          )}
        </p>
        <h3 className="text-lg font-semibold">{event.name}</h3>
        <p className="text-sm text-gray-300">{event.time}</p>
        <p className="text-sm text-gray-400">{event.court}</p>
      </div>
    </div>
  );
}
