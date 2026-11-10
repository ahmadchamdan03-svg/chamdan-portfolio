import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://cgolcbdcnkmugwnikmwe.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnb2xjYmRjbmttdWd3bmlrbXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyODgwOTksImV4cCI6MjEwOTg2NDA5OX0.L2ttXvwfBGtY2KKZo82LNieI-wevoNRPuGGvvwfoZkg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
