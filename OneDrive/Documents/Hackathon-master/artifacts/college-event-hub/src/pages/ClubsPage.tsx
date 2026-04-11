import { motion } from "framer-motion";
import { Users, ArrowRight, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { useListClubs, useGetCategoryBreakdown } from "@workspace/api-client-react";

const categoryColors: Record<string, string> = {
  Technology: "from-blue-500/30 to-blue-600/10 border-blue-500/20",
  Arts: "from-purple-500/30 to-purple-600/10 border-purple-500/20",
  Sports: "from-green-500/30 to-green-600/10 border-green-500/20",
  Culture: "from-orange-500/30 to-orange-600/10 border-orange-500/20",
  Academic: "from-cyan-500/30 to-cyan-600/10 border-cyan-500/20",
};

const categoryTextColors: Record<string, string> = {
  Technology: "text-blue-300",
  Arts: "text-purple-300",
  Sports: "text-green-300",
  Culture: "text-orange-300",
  Academic: "text-cyan-300",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ClubsPage() {
  const { data: clubs, isLoading } = useListClubs();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="aurora-bg opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">Campus Clubs</p>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl mb-4">
              Find Your Tribe
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Explore the clubs that make campus life extraordinary. Every passion has a home here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Clubs grid */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-56 rounded-2xl bg-card animate-pulse" />
              ))}
            </div>
          ) : (Array.isArray(clubs) && clubs.length === 0) ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">No clubs available yet.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {(Array.isArray(clubs) ? clubs : []).map((club) => (
                <motion.div
                  key={club.id}
                  variants={itemVariants}
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 hover-glow cursor-pointer group ${categoryColors[club.category] || "from-muted/30 to-muted/10 border-border"}`}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                      {club.logoUrl ? (
                        <img src={club.logoUrl} alt={club.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <span className="font-display font-bold text-xl">
                          {club.name[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg leading-tight">{club.name}</h3>
                      <span className={`text-xs font-semibold ${categoryTextColors[club.category] || "text-muted-foreground"}`}>
                        {club.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {club.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{club.memberCount} members</span>
                    </div>
                    <motion.div
                      className={`flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all ${categoryTextColors[club.category] || "text-primary"}`}
                      whileHover={{ x: 2 }}
                    >
                      View <ArrowRight className="h-3.5 w-3.5" />
                    </motion.div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <Star className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
