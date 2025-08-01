-- Update innovation_teams table to use team-logos-public bucket
UPDATE innovation_teams 
SET logo_url = replace(logo_url, '/team-logos/', '/team-logos-public/')
WHERE logo_url LIKE '%/team-logos/%';

-- Log the migration for audit purposes
INSERT INTO public.security_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'STORAGE_URL_UPDATE', 'innovation_teams', 
  jsonb_build_object(
    'action', 'updated_team_logo_urls',
    'old_bucket', 'team-logos',
    'new_bucket', 'team-logos-public'
  ), 'low'
);