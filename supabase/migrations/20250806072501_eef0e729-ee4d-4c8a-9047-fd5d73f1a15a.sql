-- Fix security issues identified by linter

-- Add search_path to functions that are missing it
ALTER FUNCTION public.user_has_access_to_challenge(uuid) SET search_path TO 'public';
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path TO 'public';