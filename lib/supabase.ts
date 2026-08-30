import { createClient } from "@supabase/supabase-js";
import { Club } from "./recommendEngine";
import localClubs from "@/data/clubs.json";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Fetch all clubs:
 * If Supabase is connected, fetch live data from the 'clubs' table.
 * If not connected or upon query error, gracefully fall back to local clubs.json.
 */
export async function getClubs(): Promise<Club[]> {
  if (!supabase) {
    return localClubs as unknown as Club[];
  }

  try {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Supabase fetch failed or empty, falling back to local clubs.json:", error?.message);
      return localClubs as unknown as Club[];
    }

    return data as unknown as Club[];
  } catch (err) {
    console.error("Error fetching clubs from Supabase:", err);
    return localClubs as unknown as Club[];
  }
}
