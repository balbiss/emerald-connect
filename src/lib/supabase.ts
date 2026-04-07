import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://odkoigujqlxudhzriusv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ka29pZ3VqcWx4dWRoenJpdXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1Nzg3MDYsImV4cCI6MjA5MDE1NDcwNn0.dnVnzzcn1TYxlN3XKjluvvaGEGmAhVUjKqfkSAZeYh8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
