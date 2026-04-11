import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import ClubSelection from "@/components/admin/ClubSelection";
import AccessCode from "@/components/admin/AccessCode";
import ClubDashboard from "@/components/admin/ClubDashboard";
import { Club } from "./AdminPortal";

type Screen = "select" | "access" | "dashboard";

export default function OrganizerDashboard() {
  const [screen, setScreen] = useState<Screen>("select");
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  const handleClubSelect = (club: Club) => {
    setSelectedClub(club);
    setScreen("access");
  };

  const handleAccessGranted = () => {
    setScreen("dashboard");
  };

  const handleBack = () => {
    if (screen === "access") setScreen("select");
    if (screen === "dashboard") setScreen("access");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="pt-20">
        <Toaster position="top-center" richColors />
        <AnimatePresence mode="wait">
          {screen === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <ClubSelection onSelect={handleClubSelect} />
            </motion.div>
          )}
          {screen === "access" && selectedClub && (
            <motion.div
              key="access"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <AccessCode club={selectedClub} onBack={handleBack} onSuccess={handleAccessGranted} />
            </motion.div>
          )}
          {screen === "dashboard" && selectedClub && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <ClubDashboard club={selectedClub} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
