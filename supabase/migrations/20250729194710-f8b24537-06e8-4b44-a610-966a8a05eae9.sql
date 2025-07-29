-- Fix team lead assignments
UPDATE innovation_teams 
SET team_lead_id = (
  SELECT id FROM innovation_team_members 
  WHERE cic_role = 'expert' 
  AND team_id = (SELECT id FROM innovation_teams WHERE name = 'Technology & Digital Team')
  LIMIT 1
)
WHERE name = 'Technology & Digital Team';

-- Also fix the strategy team to have the Innovation Director as lead
UPDATE innovation_teams 
SET team_lead_id = (
  SELECT id FROM innovation_team_members 
  WHERE cic_role = 'Innovation Director'
  LIMIT 1
)
WHERE name = 'Innovation Strategy Team';