//src/lib/supabaseClient
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://efkkjgpopztqdsiliyld.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVma2tqZ3BvcHp0cWRzaWxpeWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNzU5NTMsImV4cCI6MjA2Nzc1MTk1M30.cdhmY3SuNElDe4ZDU6PHgVq8uDWXKPwkJL12Y8wRagI"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)