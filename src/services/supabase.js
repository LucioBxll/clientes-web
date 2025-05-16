
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://vhxdycwrrvtoqiwuebly.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoeGR5Y3dycnZ0b3Fpd3VlYmx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODA3ODIsImV4cCI6MjA2MTI1Njc4Mn0.FQAmSgxmJKxXyMwHRIJ7IVCbLiu_1gTugaJVYrIowek";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;