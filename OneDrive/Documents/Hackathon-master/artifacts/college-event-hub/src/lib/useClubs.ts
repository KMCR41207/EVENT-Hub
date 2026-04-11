import { useEffect, useState } from "react";
import { supabase, DbClub } from "./supabase";

export function useClubs() {
  const [clubs, setClubs] = useState<DbClub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("clubs")
      .select("*")
      .order("name")
      .then(({ data, error }: { data: DbClub[] | null; error: { message: string } | null }) => {
        if (error) setError(error.message);
        else setClubs(data ?? []);
        setLoading(false);
      });
  }, []);

  return { clubs, loading, error };
}

export async function validateClubCode(clubId: string, code: string): Promise<boolean> {
  const { data } = await supabase
    .from("clubs")
    .select("code_hash")
    .eq("id", clubId)
    .single();
  return data?.code_hash === code;
}
