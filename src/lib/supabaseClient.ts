//src/lib/supabaseClient
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ewrmwjilemlbrrgztkea.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3cm13amlsZW1sYnJyZ3p0a2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDI5MzYsImV4cCI6MjA2NzY3ODkzNn0.Tm-HcFHAlYTilNaR1ZohcXycNLYLOTsB0Rw-03X8kU0"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)