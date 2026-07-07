import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY
) as string | undefined;

export const supabaseConfigured = Boolean(
  supabaseUrl &&
    supabasePublishableKey &&
    !supabaseUrl.includes("seu-projeto") &&
    !supabasePublishableKey.includes("sua-chave"),
);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl!, supabasePublishableKey!)
  : null;
