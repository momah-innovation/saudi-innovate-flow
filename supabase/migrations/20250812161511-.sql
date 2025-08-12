-- Add missing roles to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'entity_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'deputy_manager'; 
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'domain_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'sub_domain_manager';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'service_manager';