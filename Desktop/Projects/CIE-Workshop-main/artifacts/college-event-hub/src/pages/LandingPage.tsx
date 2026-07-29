import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CalendarDays, QrCode, Users, Zap, Star, TrendingUp } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { useListEvents, useListClubs, useGetDashboardSummary } from "@workspace/api-client-react";

const clubNames = [
  "Tech Innovators", "Harmony Music", "Canvas Collective", "SportsFest", "Cultural Fusion",
  "Debate Society", "Robotics Club", "Drama Guild", "Photography Society", "Entrepreneurship Cell",
  "Film Collective", "Dance Ensemble", "Coding Club", "Environmental Club", "Literary Circle"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const features = [
  {
    icon: <CalendarDays className="h-6 w-6" />,
    title: "Discover Events",
    desc: "Find the perfect events curated for your interests, from tech talks to cultural nights.",
    color: "text-primary"
  },
  {
    icon: <QrCode className="h-6 w-6" />,
    title: "QR Attendance",
    desc: "Instant check-in with personalized QR codes. No queues, no paperwork.",
    color: "text-secondary"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Club Connect",
    desc: "Join clubs, follow their events, and build your campus community.",
    color: "text-accent"
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Real-Time Stats",
    desc: "Organizers track registrations and attendance with live dashboards.",
    color: "text-primary"
  }
];

const heroActions = [
  { label: "Browse Events", href: "/events", variant: "default" as const },
  { label: "Explore Clubs", href: "/clubs", variant: "outline" as const },
  { label: "Student Portal", href: "/student", variant: "secondary" as const },
  { label: "Organizer Hub", href: "/organizer", variant: "ghost" as const },
];

export default function LandingPage() {
  const { data: events } = useListEvents({ upcoming: true, limit: 6 });
  const { data: clubs } = useListClubs();
  const { data: summary } = useGetDashboardSummary();

  const duplicatedClubs = [...clubNames, ...clubNames];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="aurora-bg" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Zap className="h-4 w-4" />
              <span>Your campus, amplified</span>
            </motion.div>

            <h1 className="font-display font-extrabold text-6xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tight mb-6">
              <span className="block text-foreground">Discover.</span>
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Connect.
              </span>
              <span className="block text-foreground">Experience.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              The hub for every campus event. Register instantly, get your QR pass, and make every moment count.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                <Link
                  href="/events"
                  className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary/90 transition-all border border-primary/40 shadow-lg shadow-primary/30"
                >
                  Browse Events <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                <Link
                  href="/student"
                  className="flex items-center gap-2 px-8 py-4 border border-border bg-card/50 backdrop-blur-sm text-foreground rounded-full font-semibold text-base hover:bg-card hover:border-primary/40 transition-all"
                >
                  Student Portal
                </Link>
              </motion.div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {heroActions.map((action) => (
                <motion.div key={action.label} whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                  <Button asChild variant={action.variant} className="rounded-full">
                    <Link href={action.href}>{action.label}</Link>
                  </Button>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href="/events">View Calendar</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="ghost" size="sm" className="rounded-full">
                  <Link href="/clubs">Meet Clubs</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button asChild variant="secondary" size="sm" className="rounded-full">
                  <Link href="/organizer">Become Organizer</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats row */}
          {summary && (
            <motion.div
              className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { label: "Events", value: summary.totalEvents },
                { label: "Registered", value: summary.totalRegistrations },
                { label: "Clubs", value: summary.totalClubs },
                { label: "Upcoming", value: summary.upcomingEventsCount },
              ].map((stat) => (
                <div key={stat.label} className="text-center glass-panel rounded-2xl py-4 px-3">
                  <p className="font-display font-bold text-3xl text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  <Button asChild variant="ghost" size="sm" className="mt-3 rounded-full">
                    <Link href="/events">See more</Link>
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Club Marquee */}
      <section className="py-12 border-y border-border overflow-hidden">
        <div className="flex">
          <motion.div
            className="flex items-center gap-8 whitespace-nowrap animate-marquee"
          >
            {duplicatedClubs.map((name, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/20 flex items-center justify-center">
                  <Star className="h-3 w-3 text-primary/70" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">{name}</span>
                <span className="text-muted/30">•</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Happening Soon</p>
              <h2 className="font-display font-bold text-4xl sm:text-5xl">
                Upcoming Events
              </h2>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link href="/events">View all</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/student">Register now</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {(events || []).map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <EventCard {...event} />
              </motion.div>
            ))}
            {!events && Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants} className="h-80 rounded-2xl bg-card animate-pulse" />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative">
        <div className="aurora-bg opacity-50" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
              Everything you need
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              A complete platform for students and organizers — discovery, registration, and attendance all in one place.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className="glass-panel rounded-2xl p-6 hover-glow"
              >
                <div className={`w-12 h-12 rounded-xl bg-card flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild variant="ghost" size="sm" className="rounded-full">
                    <Link href="/events">Open</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link href="/clubs">Learn more</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            className="glass-panel rounded-3xl p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            <div className="relative z-10">
              <h2 className="font-display font-bold text-4xl sm:text-5xl mb-4">
                Ready to dive in?
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Join thousands of students who use EventHub to make the most of campus life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                  <Link
                    href="/student"
                    className="flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
                  >
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                  <Link
                    href="/organizer"
                    className="flex items-center gap-2 px-8 py-4 border border-border text-foreground rounded-full font-semibold hover:bg-card transition-colors"
                  >
                    I'm an Organizer
                  </Link>
                </motion.div>
              </div>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Button asChild variant="secondary" size="sm" className="rounded-full">
                  <Link href="/events">Reserve a Spot</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="rounded-full">
                  <Link href="/clubs">See Club Picks</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
              C
            </div>
            <span className="font-display font-bold">EventHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Made for campus life. Built with passion.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/events">Events</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/clubs">Clubs</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/student">Students</Link>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
