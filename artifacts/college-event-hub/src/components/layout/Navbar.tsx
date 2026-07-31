import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Discover", href: "/events" },
    { name: "Clubs", href: "/clubs" },
    { name: "Student Portal", href: "/student" },
    { name: "Organizer", href: "/organizer" },
  ];

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-panel shadow-2xl shadow-primary/10 border border-white/10 bg-background/90 backdrop-blur-2xl" : "glass-panel bg-background/75 backdrop-blur-xl border border-white/10"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-display font-bold group-hover:scale-105 transition-transform">
                C
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Event<span className="text-primary">Hub</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <nav className="flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-muted-foreground transition hover:border-primary/30 hover:text-primary"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link href="/clubs">Clubs</Link>
            </Button>
            <Button asChild variant="default" className="rounded-full font-medium">
              <Link href="/events">Explore Events</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 360, damping: 18 }}
              className="p-2 rounded-full text-muted-foreground hover:text-white hover:bg-white/10 transition-colors ring-1 ring-white/10"
            >
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-background/95 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/10 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 text-base font-medium rounded-2xl hover:bg-primary/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-3 rounded-3xl bg-white/5 p-4 border border-white/10">
                <p className="text-sm text-muted-foreground mb-3">
                  Fast access to the best campus events and QR check-in tools.
                </p>
                <Button asChild className="w-full rounded-full">
                  <Link href="/events" onClick={() => setIsOpen(false)}>Explore Events</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
