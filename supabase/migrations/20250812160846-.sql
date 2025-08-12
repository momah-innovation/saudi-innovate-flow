-- =============================================
-- PART 1: ADD ENUM VALUE AND HIERARCHY STRUCTURE
-- =============================================

-- 1. Add organization_member to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'organization_member';

-- 2. Add entity_id to hierarchical tables for proper linking
ALTER TABLE public.deputies ADD COLUMN IF NOT EXISTS entity_id UUID;
ALTER TABLE public.domains ADD COLUMN IF NOT EXISTS department_id UUID;
ALTER TABLE public.sub_domains ADD COLUMN IF NOT EXISTS domain_id UUID;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sub_domain_id UUID;