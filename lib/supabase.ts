import { createClient } from "@supabase/supabase-js";

export const supabase = (supabseUrl: string, anonKey: string) =>
  createClient(supabseUrl, anonKey);
