// utils/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kkiuyjofcwlrtskfdtxk.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtraXV5am9mY3dscnRza2ZkdHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MzQ2NzAsImV4cCI6MjA2MDExMDY3MH0.MJWrSbUdW3QuP-H71SlTWW0p56AHXMS3gjvqcSRFkBw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
