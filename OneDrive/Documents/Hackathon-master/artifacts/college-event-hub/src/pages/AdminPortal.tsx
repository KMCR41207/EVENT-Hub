import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "sonner";
import ClubSelection from "../components/admin/ClubSelection";
import AccessCode from "../components/admin/AccessCode";
import ClubDashboard from "../components/admin/ClubDashboard";

// Club type — data comes from Supabase, no hardcoded list
export type Club = {
  id: string;
  name: string;
  code: string; // used only as a transient value during access validation
};

type Screen = "select" | "access" | "dashboard";

export default function AdminPortal() {
  const [screen, setScreen] = useState<Screen>("select");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    setScreen("access");
  };

  const handleBack = () => {
    if (screen === "access") setScreen("select");
    if (screen === "dashboard") setScreen("access");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {screen === "select" && (
          <motion.div key="select" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}>
            <ClubSelection onSelect={handleClubSelect} />
          </motion.div>
        )}
        {screen === "access" && selectedClub && (
          <motion.div key="access" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <AccessCode club={selectedClub} onBack={handleBack} onSuccess={() => setScreen("dashboard")} />
          </motion.div>
        )}
        {screen === "dashboard" && selectedClub && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}>
            <ClubDashboard club={selectedClub} onBack={handleBack} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
