import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { QrCode, Calendar, MapPin, X, ArrowRight, Clock, User } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import {
  useGetUpcomingEvents,
  useListRegistrations,
  useGetRegistrationQr,
  getGetRegistrationQrQueryKey
} from "@workspace/api-client-react";

const studentName = "Student";
const studentEmail = "";

function QRCodeDisplay({ code }: { code: string }) {
  const size = 20;
  const grid: boolean[][] = [];

  for (let r = 0; r < size; r++) {
    grid[r] = [];
    for (let c = 0; c < size; c++) {
      const charIndex = (r * size + c) % code.length;
      grid[r][c] = code.charCodeAt(charIndex) % 2 === 0;
    }
  }

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      grid[i][j] = (i === 0 || i === 6 || j === 0 || j === 6) ? true : (i === 1 || i === 5 || j === 1 || j === 5) ? false : true;
    }
  }
  for (let i = 0; i < 7; i++) {
    for (let j = 13; j < 20; j++) {
      grid[i][j] = (i === 0 || i === 6 || j === 13 || j === 19) ? true : (i === 1 || i === 5 || j === 14 || j === 18) ? false : true;
    }
  }
  for (let i = 13; i < 20; i++) {
    for (let j = 0; j < 7; j++) {
      grid[i][j] = (i === 13 || i === 19 || j === 0 || j === 6) ? true : (i === 14 || i === 18 || j === 1 || j === 5) ? false : true;
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="bg-white p-4 rounded-2xl">
        <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className={cell ? "bg-black" : "bg-white"}
                style={{ width: 12, height: 12 }}
              />
            ))
          )}
        </div>
      </div>
      <p className="text-xs font-mono text-muted-foreground text-center break-all max-w-xs">{code}</p>
    </div>
  );
}

function QRModal({ registrationId, eventTitle, onClose }: { registrationId: number; eventTitle: string; onClose: () => void }) {
  const { data: qrData, isLoading } = useGetRegistrationQr(registrationId, {
    query: { queryKey: getGetRegistrationQrQueryKey(registrationId) }
  });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card border border-card-border rounded-3xl overflow-hidden max-w-sm w-full"
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Your QR Code for</p>
            <h3 className="font-display font-bold text-lg">{eventTitle}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : qrData ? (
          <QRCodeDisplay code={qrData.qrCode} />
        ) : (
          <p className="text-center py-8 text-muted-foreground">Failed to load QR code</p>
        )}

        <div className="px-6 pb-6">
          <p className="text-xs text-center text-muted-foreground">
            Show this QR code at the event entrance for instant check-in
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function StudentDashboard() {
  const [qrModal, setQrModal] = useState<{ id: number; title: string } | null>(null);

  const { data: upcomingEvents } = useGetUpcomingEvents({ limit: 4 });
  const { data: registrations } = useListRegistrations({ studentName });

  const now = new Date();
  const nextEvent = upcomingEvents?.[0];

  const getTimeUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return "Starting soon";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm text-white">
              {studentName[0]}
            </div>
            <p className="text-muted-foreground">Welcome back,</p>
          </div>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl">{studentName}</h1>
        </motion.div>

        {/* Bento grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Next event banner - spans 2 cols */}
          {nextEvent && (
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 relative overflow-hidden rounded-2xl min-h-[280px] flex flex-col justify-end p-6 cursor-pointer group"
              style={{ boxShadow: "0 8px 32px rgba(99,102,241,0.2)" }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={() => {}}
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                style={{
                  backgroundImage: nextEvent.imageUrl
                    ? `url(${nextEvent.imageUrl})`
                    : `linear-gradient(135deg, hsl(239,84%,20%) 0%, hsl(330,81%,20%) 100%)`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/30 border border-primary/40 text-primary">
                    Next Up
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/70">
                    <Clock className="h-3 w-3" />
                    {getTimeUntil(nextEvent.date)} away
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">{nextEvent.title}</h2>
                <div className="flex flex-wrap gap-3 mb-4">
                  <span className="flex items-center gap-1 text-xs text-white/70">
                    <Calendar className="h-3 w-3" />
                    {new Date(nextEvent.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-white/70">
                    <MapPin className="h-3 w-3" />
                    {nextEvent.location}
                  </span>
                </div>

                <motion.button
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-background rounded-full font-semibold text-sm hover:bg-white/90 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  onClick={() => {
                    const reg = registrations?.find(r => r.eventId === nextEvent.id);
                    if (reg) setQrModal({ id: reg.id, title: nextEvent.title });
                  }}
                >
                  <QrCode className="h-4 w-4" />
                  Show My QR Code
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Registered events */}
          <motion.div
            variants={itemVariants}
            className="glass-panel rounded-2xl p-5"
          >
            <h3 className="font-display font-semibold text-lg mb-4">My Registrations</h3>
            {!registrations || registrations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No registrations yet</p>
                <Link href="/events" className="mt-3 text-primary text-sm hover:underline flex items-center justify-center gap-1">
                  Discover events <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.slice(0, 4).map((reg) => (
                  <motion.div
                    key={reg.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-background/50 hover:bg-background/80 transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">Event #{reg.eventId}</p>
                      <p className="text-xs text-muted-foreground">
                        {reg.attended ? "Attended" : "Registered"}
                      </p>
                    </div>
                    <motion.button
                      className="ml-3 p-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQrModal({ id: reg.id, title: `Event #${reg.eventId}` })}
                    >
                      <QrCode className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upcoming events */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-xl">Upcoming Events</h2>
              <Link href="/events" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(Array.isArray(upcomingEvents) ? upcomingEvents : []).map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/events/${event.id}`}>
                    <div className="glass-panel rounded-xl p-4 hover-glow cursor-pointer group h-full">
                      <div className="h-28 rounded-lg overflow-hidden mb-3 relative">
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{
                            backgroundImage: event.imageUrl
                              ? `url(${event.imageUrl})`
                              : `linear-gradient(135deg, hsl(239,84%,20%) 0%, hsl(330,81%,20%) 100%)`
                          }}
                        />
                      </div>
                      <h4 className="font-display font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">{event.title}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{event.location}</span>
                        <span className="text-xs font-medium text-primary">{getTimeUntil(event.date)}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {qrModal && (
          <QRModal
            registrationId={qrModal.id}
            eventTitle={qrModal.title}
            onClose={() => setQrModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
