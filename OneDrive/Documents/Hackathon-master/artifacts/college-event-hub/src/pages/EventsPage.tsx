import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { EventCard } from "@/components/EventCard";
import { useListEvents } from "@workspace/api-client-react";

const BASE_CATEGORIES = ["All", "Hackathon", "Club", "Traditional"];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.2 } }
};

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: events, isLoading } = useListEvents();

  // Build category list dynamically from actual event data
  const categories = Array.isArray(events) && events.length > 0
    ? ["All", ...Array.from(new Set(events.map((e) => e.category).filter(Boolean)))]
    : BASE_CATEGORIES;

  const filtered = (Array.isArray(events) ? events : []).filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero banner */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="aurora-bg opacity-60" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Discover</p>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl mb-4">
              All Events
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Find your next unforgettable campus experience.
            </p>
          </motion.div>

          {/* Search and filters */}
          <motion.div
            className="mt-10 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-card-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/30"
                      : "bg-card text-muted-foreground border-card-border hover:border-primary/50 hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events grid */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded-2xl bg-card animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground text-lg">No events found for your search.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="mt-4 text-primary hover:underline text-sm"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">{filtered.length} event{filtered.length !== 1 ? "s" : ""} found</p>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={`${activeCategory}-${search}`}
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((event) => (
                    <motion.div key={event.id} variants={itemVariants} layout>
                      <EventCard {...event} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
