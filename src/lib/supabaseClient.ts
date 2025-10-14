import { createClient } from '@supabase/supabase-js'

// Variables del proyecto
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase Config:', { 
  url: supabaseUrl, 
  hasKey: !!supabaseAnonKey 
});
// Crear cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)