import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute, Link } from "wouter";
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, X } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useGetEvent, useCreateRegistration, getListRegistrationsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Arts: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Sports: "bg-green-500/20 text-green-300 border-green-500/30",
  Culture: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Academic: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

export default function EventDetailPage() {
  const [, params] = useRoute("/events/:id");
  const eventId = params ? Number(params.id) : 0;
  const { data: event, isLoading } = useGetEvent(eventId, {
    query: { enabled: !!eventId }
  });

  const qc = useQueryClient();
  const createRegistration = useCreateRegistration();

  const [form, setForm] = useState({ name: "", email: "" });
  const [registered, setRegistered] = useState<{ name: string; id: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    try {
      const result = await createRegistration.mutateAsync({
        data: { eventId: event.id, studentName: form.name, studentEmail: form.email }
      });
      setRegistered({ name: form.name, id: result.id });
      setShowSuccess(true);
      qc.invalidateQueries({ queryKey: getListRegistrationsQueryKey() });
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-muted-foreground">Event not found.</p>
          <Link href="/events" className="mt-4 text-primary hover:underline block">Back to Events</Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric"
  });
  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit"
  });
  const spotsFilled = Math.min(Math.round((event.registeredCount / event.capacity) * 100), 100);
  const spotsLeft = event.capacity - event.registeredCount;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero with Ken Burns */}
      <div className="relative h-[55vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{
            backgroundImage: event.imageUrl
              ? `url(${event.imageUrl})`
              : `linear-gradient(135deg, hsl(239,84%,20%) 0%, hsl(330,81%,20%) 100%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-transparent" />

        <div className="absolute bottom-8 left-4 right-4 max-w-7xl mx-auto">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border mb-3 ${categoryColors[event.category] || "bg-muted text-muted-foreground border-border"}`}>
              {event.category}
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl max-w-3xl leading-tight">
              {event.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main content */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm glass-panel px-4 py-2 rounded-xl">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{formattedDate} at {formattedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm glass-panel px-4 py-2 rounded-xl">
                <MapPin className="h-4 w-4 text-secondary" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm glass-panel px-4 py-2 rounded-xl">
                <Users className="h-4 w-4 text-accent" />
                <span>{event.registeredCount} registered</span>
              </div>
            </div>

            {event.clubName && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center font-bold text-sm">
                  {event.clubName[0]}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Organized by</p>
                  <p className="font-semibold">{event.clubName}</p>
                </div>
              </div>
            )}

            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-display font-bold text-xl mb-4">About this event</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h2 className="font-display font-bold text-xl mb-4">Capacity</h2>
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-muted-foreground">{event.registeredCount} of {event.capacity} registered</span>
                <span className={`font-semibold ${spotsLeft <= 20 ? "text-red-400" : "text-green-400"}`}>
                  {spotsLeft} spots remaining
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${spotsFilled >= 90 ? "bg-red-500" : "bg-primary"}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${spotsFilled}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Sticky sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="sticky top-24">
              <div className="glass-panel rounded-2xl p-6 border border-primary/20">
                <h2 className="font-display font-bold text-xl mb-6">Register for this event</h2>

                {registered && showSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">You're registered!</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Welcome, {registered.name}. Your QR code is ready in your Student Portal.
                    </p>
                    <Link
                      href="/student"
                      className="block w-full py-3 bg-primary text-white rounded-xl font-semibold text-center hover:bg-primary/90 transition-colors"
                    >
                      View My QR Code
                    </Link>
                  </motion.div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={createRegistration.isPending || spotsLeft <= 0}
                      className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    >
                      {createRegistration.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Registering...
                        </span>
                      ) : spotsLeft <= 0 ? "Event Full" : "Register Now"}
                    </motion.button>

                    {createRegistration.isError && (
                      <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
