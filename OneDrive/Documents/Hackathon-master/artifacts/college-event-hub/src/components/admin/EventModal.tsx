import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X, Upload, ImageIcon } from "lucide-react";
import { ClubEvent, EventCategory, EventStatus } from "./types";

type Props = {
  event: ClubEvent | null;
  onSave: (event: ClubEvent) => void;
  onClose: () => void;
};

const CATEGORIES: EventCategory[] = ["Hackathon", "Club", "Traditional"];
const STATUSES: { label: string; value: EventStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
];

export default function EventModal({ event, onSave, onClose }: Props) {
  const [title, setTitle] = useState(event?.title ?? "");
  const [date, setDate] = useState(event?.date ?? "");
  const [category, setCategory] = useState<EventCategory>(event?.category ?? "Club");
  const [description, setDescription] = useState(event?.description ?? "");
  const [status, setStatus] = useState<EventStatus>(event?.status ?? "upcoming");
  const [image, setImage] = useState(event?.image ?? "");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleImageFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;
    onSave({
      id: event?.id ?? "",
      title, date, category, description, status,
      image: image || "https://placehold.co/400x200?text=Event",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-30 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">{event ? "Edit Event" : "Add New Event"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 pb-8">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Event Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Hackathon 2025"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d2e]/30 focus:border-[#e11d2e]"
            />
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Date & Time *</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d2e]/30 focus:border-[#e11d2e]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as EventCategory)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d2e]/30 focus:border-[#e11d2e] bg-white"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the event..."
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e11d2e]/30 focus:border-[#e11d2e] resize-none"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Event Image</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                dragOver ? "border-[#e11d2e] bg-red-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {image ? (
                <img src={image} alt="preview" className="w-full h-32 object-cover rounded-lg" />
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-gray-400">
                  <Upload size={22} />
                  <p className="text-xs">Drag & drop or <span className="text-[#e11d2e] font-medium">browse</span></p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); }}
              />
            </div>
            {image && (
              <button type="button" onClick={() => setImage("")} className="text-xs text-gray-400 hover:text-red-500 mt-1 flex items-center gap-1">
                <ImageIcon size={11} /> Remove image
              </button>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-2 block">Status</label>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    status === s.value
                      ? "bg-[#e11d2e] text-white border-[#e11d2e]"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#e11d2e] text-white text-sm font-semibold hover:bg-red-700 transition-colors"
            >
              Save Event
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
