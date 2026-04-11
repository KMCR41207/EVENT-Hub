import { useEffect, useState } from "react";
import { supabase, DbEvent } from "./supabase";

export function useEvents(clubId: string) {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("club_id", clubId)
      .order("date", { ascending: true });
    setEvents(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [clubId]);

  const addEvent = async (ev: Omit<DbEvent, "id" | "created_at" | "club_id">) => {
    const { error } = await supabase
      .from("events")
      .insert({ ...ev, club_id: clubId });
    if (!error) fetch();
    return error;
  };

  const updateEvent = async (id: string, ev: Partial<DbEvent>) => {
    const { error } = await supabase
      .from("events")
      .update(ev)
      .eq("id", id);
    if (!error) fetch();
    return error;
  };

  const deleteEvent = async (id: string) => {
    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);
    if (!error) fetch();
    return error;
  };

  return { events, loading, addEvent, updateEvent, deleteEvent };
}
