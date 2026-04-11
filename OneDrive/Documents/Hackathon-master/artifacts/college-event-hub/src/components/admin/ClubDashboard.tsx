import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";
import { Club } from "../../pages/AdminPortal";
import { ClubEvent, EventStatus } from "./types";
import { useEvents } from "../../lib/useEvents";
import EventCard from "./EventCard";
import EventModal from "./EventModal";

const TABS: { label: string; value: EventStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
];

type Props = { club: Club; onBack: () => void };

export default function ClubDashboard({ club, onBack }: Props) {
  const { events, loading, addEvent, updateEvent, deleteEvent } = useEvents(club.id);
  const [activeTab, setActiveTab] = useState<EventStatus>("upcoming");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);

  // Map DbEvent → ClubEvent for UI
  const mapped: ClubEvent[] = events.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    description: e.description,
    category: e.category,
    status: e.status,
    image: e.image_url ?? "",
  }));

  const filtered = mapped.filter((e) => e.status === activeTab);

  const handleSave = async (event: ClubEvent) => {
    const payload = {
      title: event.title,
      date: event.date,
      category: event.category,
      description: event.description,
      image_url: event.image || null,
      status: event.status,
    };

    if (editingEvent) {
      const err = await updateEvent(event.id, payload);
      if (err) { toast.error("Failed to update event"); return; }
      toast.success("Event updated");
    } else {
      const err = await addEvent(payload);
      if (err) { toast.error("Failed to add event"); return; }
      toast.success("Event added successfully");
    }
    setModalOpen(false);
    setEditingEvent(null);
  };

  const handleDelete = async (id: string) => {
    const err = await deleteEvent(id);
    if (err) { toast.error("Failed to delete event"); return; }
    toast.error("Event deleted");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-gray-900 text-base leading-tight">{club.name} Dashboard</h1>
            <p className="text-xs text-gray-400">Manage your club events</p>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.value
                    ? "bg-white text-[#e11d2e] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className={`ml-1 text-xs ${activeTab === tab.value ? "text-[#e11d2e]" : "text-gray-400"}`}>
                  ({mapped.filter((e) => e.status === tab.value).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event list */}
      <div className="max-w-lg mx-auto px-4 pt-4 space-y-3">
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading events...</div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm">No {activeTab} events yet</p>
              </motion.div>
            ) : (
              filtered.map((event) => (
                <motion.div key={event.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <EventCard
                    event={event}
                    onEdit={(e) => { setEditingEvent(e); setModalOpen(true); }}
                    onDelete={handleDelete}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        )}
      </div>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => { setEditingEvent(null); setModalOpen(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#e11d2e] text-white rounded-full shadow-lg flex items-center justify-center z-20"
      >
        <Plus size={26} />
      </motion.button>

      <AnimatePresence>
        {modalOpen && (
          <EventModal
            event={editingEvent}
            onSave={handleSave}
            onClose={() => { setModalOpen(false); setEditingEvent(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
