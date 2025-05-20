import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: Las variables de entorno de Supabase no están configuradas correctamente');
    throw new Error('Las variables de entorno de Supabase son requeridas');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;