-- Run this once in Supabase Dashboard -> SQL Editor -> New query
-- Disables Row Level Security on ALL tables in the public schema (dev mode).
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('ALTER TABLE public.%I NO FORCE ROW LEVEL SECURITY;', t);
  END LOOP;
END $$;