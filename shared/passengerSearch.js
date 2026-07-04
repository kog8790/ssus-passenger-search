import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function searchPassengers(searchTerm, page = 1) {
  const term = searchTerm.trim();
  const pageSize = 25;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  if (!term) {
    return {
      results: [],
      totalCount: 0,
    };
  }

  const { data, error, count } = await supabase
    .from("vw_public_search")
    .select("*", { count: "exact" })
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
            `ports_of_call.ilike.%${term}%`,
            `notes.ilike.%${term}%`,
        ].join(",")
        )
    .order("sailing_date", { ascending: true })
    .range(from, to);

  if (error) {
    console.error(error);
    throw error;
  }

  return {
    results: data,
    totalCount: count || 0,
  };
}