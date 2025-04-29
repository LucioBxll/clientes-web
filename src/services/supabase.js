// La carpeta "services" la vamos a usar para guardar los distintos servicios. Un servicio es una biblioteca que ofrece
// funciones para interactuar con alguna funcionalidad.
// Este servicio va a simplemente proveer la instancia del cliente de Supabase para que otros la puedan utilizar.
import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = "https://vhxdycwrrvtoqiwuebly.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeGR5Y3dycnZ0b3Fpd3VlYmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODA3ODIsImV4cCI6MjA2MTI1Njc4Mn0.FQAmSgxmJKxXyMwHRIJ7IVCbLiu_1gTugaJVYrIowek";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;