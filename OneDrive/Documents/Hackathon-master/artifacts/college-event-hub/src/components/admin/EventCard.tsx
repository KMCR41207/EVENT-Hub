import { motion } from "framer-motion";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { ClubEvent } from "./types";

const categoryColors: Record<string, string> = {
  Hackathon: "bg-purple-100 text-purple-700",
  Club: "bg-blue-100 text-blue-700",
  Traditional: "bg-amber-100 text-amber-700",
};

type Props = { event: ClubEvent; onEdit: (e: ClubEvent) => void; onDelete: (id: string) => void };

export default function EventCard({ event, onEdit, onDelete }: Props) {
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <motion.div
      whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="flex gap-3 p-3">
        <img
          src={event.image}
          alt={event.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80?text=Event"; }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{event.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${categoryColors[event.category]}`}>
              {event.category}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-xs">
            <Calendar size={11} />
            <span>{formattedDate}</span>
          </div>
          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{event.description}</p>
        </div>
      </div>

      <div className="border-t border-gray-50 flex">
        <button
          onClick={() => onEdit(event)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Pencil size={13} /> Edit
        </button>
        <div className="w-px bg-gray-100" />
        <button
          onClick={() => onDelete(event.id)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-[#e11d2e] hover:bg-red-50 transition-colors"
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </motion.div>
  );
}
