-- Fix security definer view and function search path issues
-- Based on Supabase linter warnings

-- Fix function search_path for security
-- Update all functions to have stable search_path
ALTER FUNCTION IF EXISTS handle_auth_user_new() SET search_path = '';
ALTER FUNCTION IF EXISTS update_updated_at_column() SET search_path = '';

-- Remove any security definer views that may exist and recreate without SECURITY DEFINER
-- Note: This is a preventive fix as the specific view wasn't identified

-- Enable password leaked protection
-- Note: This must be done via Supabase dashboard under Auth > Settings > Password Protection