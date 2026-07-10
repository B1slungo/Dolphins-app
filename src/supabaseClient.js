import { createClient } from '@supabase/supabase-js';

// Recuperiamo le chiavi dal file .env in modo sicuro
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Creiamo e esportiamo il client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);