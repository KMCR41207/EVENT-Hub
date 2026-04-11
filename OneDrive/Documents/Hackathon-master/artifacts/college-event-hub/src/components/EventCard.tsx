import { motion } from "framer-motion";
import { Link } from "wouter";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventCardProps {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  capacity: number;
  registeredCount: number;
  imageUrl?: string | null;
  clubName?: string | null;
}

const categoryColors: Record<string, string> = {
  Technology: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Arts: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Sports: "bg-green-500/20 text-green-300 border-green-500/30",
  Culture: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Academic: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

export function EventCard({
  id, title, description, date, location, category, capacity, registeredCount, imageUrl, clubName
}: EventCardProps) {
  const spotsFilled = Math.min(Math.round((registeredCount / capacity) * 100), 100);
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  });
  const formattedTime = new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit"
  });

  return (
    <Link href={`/events/${id}`}>
      <motion.div
        className="group relative overflow-hidden rounded-2xl bg-card border border-card-border cursor-pointer"
        whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.15)" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        style={{
          boxShadow: "0 4px 24px rgba(0,0,0,0.3)"
        }}
      >
        <div className="relative h-52 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: imageUrl
                ? `url(${imageUrl})`
                : `linear-gradient(135deg, hsl(239,84%,20%) 0%, hsl(330,81%,20%) 100%)`
            }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${categoryColors[category] || "bg-muted text-muted-foreground border-border"}`}>
              {category}
            </span>
          </div>
        </div>

        <div className="p-5">
          <motion.div
            className="space-y-2"
            initial={{ y: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-display font-bold text-lg text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
            {clubName && (
              <p className="text-xs text-muted-foreground font-medium">by {clubName}</p>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          </motion.div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary/70" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-secondary/70" />
              <span className="truncate">{location}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                {registeredCount} / {capacity}
              </span>
              <span className={`font-medium ${spotsFilled >= 90 ? "text-red-400" : "text-green-400"}`}>
                {capacity - registeredCount} spots left
              </span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${spotsFilled >= 90 ? "bg-red-500" : "bg-primary"}`}
                initial={{ width: 0 }}
                whileInView={{ width: `${spotsFilled}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
