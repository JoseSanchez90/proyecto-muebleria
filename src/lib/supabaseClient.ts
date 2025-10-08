import { createClient } from '@supabase/supabase-js'

// Variables del proyecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Crear cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)