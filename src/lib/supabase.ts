import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://demo-izianalytics.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "demo-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "demo-service-key";

// Client public pour le frontend
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client serveur pour les opérations sécurisées (collecteur d'analytics)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
