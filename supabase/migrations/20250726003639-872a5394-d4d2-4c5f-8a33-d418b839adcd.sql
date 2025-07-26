-- First migration: Only expand the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'user_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'role_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'challenge_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'expert_coordinator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'system_auditor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'data_analyst';