-- First migration: Add team_member to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'team_member';