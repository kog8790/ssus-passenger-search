import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function searchPassengers(searchTerm) {
  const term = searchTerm.trim();

  if (!term) return [];

  const { data, error } = await supabase
    .from("vw_public_search")
    .select("*")
    .or(
        [
            `full_name.ilike.%${term}%`,
            `prefix.ilike.%${term}%`,
            `first_name.ilike.%${term}%`,
            `middle_name.ilike.%${term}%`,
            `last_name.ilike.%${term}%`,
            `suffix.ilike.%${term}%`,
            `voyage_number.ilike.%${term}%`,
            `direction.ilike.%${term}%`,
            `passenger_class.ilike.%${term}%`,
            `cabin_number.ilike.%${term}%`,
            `embarking_port.ilike.%${term}%`,
            `debarking_port.ilike.%${term}%`,
        ].join(",")
        )
    .order("sailing_date", { ascending: true })
    .limit(100);

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}