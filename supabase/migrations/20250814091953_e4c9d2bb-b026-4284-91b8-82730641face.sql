-- Create app_role enum with all required roles
DO $$
BEGIN
  -- Create app_role enum if not exists
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE app_role AS ENUM (
      'super_admin','admin','innovator','expert','partner','team_member',
      'domain_expert','evaluator','stakeholder','mentor','department_head',
      'sector_lead','team_lead','project_manager','organization_admin',
      'entity_manager','deputy_manager','domain_manager','sub_domain_manager',
      'service_manager','user_manager','role_manager','challenge_manager',
      'expert_coordinator','content_manager','system_auditor','data_analyst',
      'campaign_manager','event_manager','stakeholder_manager',
      'partnership_manager','research_lead','external_expert','judge',
      'facilitator','viewer','innovation_manager'
    );
  END IF;
END$$;

-- Add missing enum values idempotently
DO $do$
DECLARE v text;
BEGIN
  FOREACH v IN ARRAY ARRAY[
    'super_admin','admin','innovator','expert','partner','team_member',
    'domain_expert','evaluator','stakeholder','mentor','department_head',
    'sector_lead','team_lead','project_manager','organization_admin',
    'entity_manager','deputy_manager','domain_manager','sub_domain_manager',
    'service_manager','user_manager','role_manager','challenge_manager',
    'expert_coordinator','content_manager','system_auditor','data_analyst',
    'campaign_manager','event_manager','stakeholder_manager',
    'partnership_manager','research_lead','external_expert','judge',
    'facilitator','viewer','innovation_manager'
  ] LOOP
    BEGIN
      EXECUTE format('ALTER TYPE app_role ADD VALUE IF NOT EXISTS %L', v);
    EXCEPTION WHEN others THEN
      -- ignore concurrent enum alter errors
      NULL;
    END;
  END LOOP;
END
$do$;

-- Drop existing has_role function to avoid parameter conflicts
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- Enhanced has_role helper with expiration support
CREATE OR REPLACE FUNCTION public.has_role(user_uuid uuid, target_role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = user_uuid
      AND ur.role = target_role
      AND ur.is_active = true
      AND (ur.expires_at IS NULL OR ur.expires_at > now())
  );
$$;

-- Create security event logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event_type text,
  p_resource_type text,
  p_resource_id uuid DEFAULT NULL,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_risk_level text DEFAULT 'low'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action_type,
    resource_type,
    resource_id,
    details,
    risk_level,
    created_at
  ) VALUES (
    auth.uid(),
    p_event_type,
    p_resource_type,
    p_resource_id,
    p_details,
    p_risk_level,
    now()
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Enhanced role validation function
CREATE OR REPLACE FUNCTION public.validate_role_assignment(
  p_assigner_id uuid,
  p_target_role app_role
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Super admins can assign any role
  IF has_role(p_assigner_id, 'super_admin'::app_role) THEN
    RETURN true;
  END IF;
  
  -- Admins can assign most roles except super_admin
  IF has_role(p_assigner_id, 'admin'::app_role) THEN
    RETURN p_target_role != 'super_admin'::app_role;
  END IF;
  
  -- Role managers can assign specific roles
  IF has_role(p_assigner_id, 'role_manager'::app_role) THEN
    RETURN p_target_role IN (
      'innovator', 'expert', 'partner', 'team_member', 
      'evaluator', 'stakeholder', 'mentor'
    );
  END IF;
  
  -- Team leads can assign team member roles
  IF has_role(p_assigner_id, 'team_lead'::app_role) THEN
    RETURN p_target_role = 'team_member'::app_role;
  END IF;
  
  -- Default deny
  RETURN false;
END;
$$;