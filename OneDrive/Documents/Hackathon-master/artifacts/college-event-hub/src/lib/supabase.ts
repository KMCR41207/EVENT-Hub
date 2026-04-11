import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
}

export const supabase = createClient(url, key);

// ── Types matching DB schema ──
export type DbClub = {
  id: string;
  name: string;
  code_hash: string;
  image_url: string | null;
  description: string | null;
  created_at: string;
};

export type DbEvent = {
  id: string;
  club_id: string;
  title: string;
  date: string;
  category: "Hackathon" | "Club" | "Traditional";
  description: string;
  image_url: string | null;
  status: "upcoming" | "ongoing" | "completed";
  created_at: string;
};
