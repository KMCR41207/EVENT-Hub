import { motion } from "framer-motion";
import { useClubs } from "../../lib/useClubs";
import { Club } from "../../pages/AdminPortal";

type Props = { onSelect: (club: Club) => void };

const ICONS: Record<string, string> = {
  came:"⚙️", scope:"⚡", nss:"🌿", cie:"💡", stm:"🔬",
  ewb:"🔧", aim:"🎯", squad:"🚀", hacnic:"💻", apex:"🏔️",
  aero:"✈️", literati:"📚",
};

export default function ClubSelection({ onSelect }: Props) {
  const { clubs, loading, error } = useClubs();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-lg mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-block bg-[#e11d2e] text-white text-xs font-bold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
            Admin Portal
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Select Your Club</h1>
          <p className="text-gray-500 text-sm mt-1">Choose a club to manage its events</p>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400 text-sm">Loading clubs...</div>
        )}
        {error && (
          <div className="text-center py-16 text-red-500 text-sm">Failed to load clubs: {error}</div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {clubs.map((club, i) => (
            <motion.button
              key={club.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(225,29,46,0.15)" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect({ id: club.id, name: club.name, code: club.code_hash })}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e11d2e]"
            >
              <div className="h-1.5 bg-[#e11d2e] w-full" />
              <div className="px-4 py-5 flex flex-col items-center justify-center gap-1">
                <span className="text-2xl">{ICONS[club.id] ?? "🏛️"}</span>
                <span className="text-sm font-semibold text-gray-800 text-center leading-tight">{club.name}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
