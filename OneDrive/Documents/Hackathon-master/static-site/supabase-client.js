// Supabase client — shared across all pages
const SUPABASE_URL = 'https://pvesonfmcimrpvxsegzh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2ZXNvbmZtY2ltcnB2eHNlZ3poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MTE1NjIsImV4cCI6MjA4ODI4NzU2Mn0.NjlaVsPtOTomJInoQr8KGNquLwHSNReDz5o9EfTpBBs';
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
