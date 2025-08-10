-- PHASE 4A: Complete Database Migration - Part 1 (Core Tables)
-- First drop check constraints that will be violated

-- Drop existing check constraints temporarily
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_priority_level_check;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_sensitivity_level_check;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_challenge_type_check;
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_status_check;

ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check;

ALTER TABLE challenge_experts DROP CONSTRAINT IF EXISTS challenge_experts_role_type_check;
ALTER TABLE challenge_experts DROP CONSTRAINT IF EXISTS challenge_experts_status_check;

ALTER TABLE challenge_partners DROP CONSTRAINT IF EXISTS challenge_partners_partnership_type_check;
ALTER TABLE challenge_partners DROP CONSTRAINT IF EXISTS challenge_partners_status_check;

ALTER TABLE campaign_partners DROP CONSTRAINT IF EXISTS campaign_partners_partnership_role_check;
ALTER TABLE campaign_partners DROP CONSTRAINT IF EXISTS campaign_partners_partnership_status_check;

-- Now update the data to use translation keys
-- 1. campaigns table
UPDATE campaigns 
SET status = CASE status
  WHEN 'planning' THEN 'status.planning'
  WHEN 'active' THEN 'status.active' 
  WHEN 'paused' THEN 'status.paused'
  WHEN 'completed' THEN 'status.completed'
  WHEN 'cancelled' THEN 'status.cancelled'
  WHEN 'draft' THEN 'status.draft'
  WHEN 'published' THEN 'status.published'
  ELSE 'status.' || status
END
WHERE status NOT LIKE 'status.%';

-- 2. challenges table - multiple fields
UPDATE challenges 
SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'active' THEN 'status.active'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'under_review' THEN 'status.under_review'
    WHEN 'approved' THEN 'status.approved'
    WHEN 'rejected' THEN 'status.rejected'
    WHEN 'published' THEN 'status.published'
    ELSE 'status.' || status
  END,
  challenge_type = CASE challenge_type
    WHEN 'innovation' THEN 'challenge_type.innovation'
    WHEN 'improvement' THEN 'challenge_type.improvement'
    WHEN 'research' THEN 'challenge_type.research'
    WHEN 'technology' THEN 'challenge_type.technology'
    ELSE COALESCE('challenge_type.' || challenge_type, challenge_type)
  END,
  priority_level = CASE priority_level
    WHEN 'low' THEN 'priority.low'
    WHEN 'medium' THEN 'priority.medium'
    WHEN 'high' THEN 'priority.high'
    WHEN 'urgent' THEN 'priority.urgent'
    ELSE COALESCE('priority.' || priority_level, priority_level)
  END,
  sensitivity_level = CASE sensitivity_level
    WHEN 'normal' THEN 'sensitivity.normal'
    WHEN 'sensitive' THEN 'sensitivity.sensitive'
    WHEN 'classified' THEN 'sensitivity.classified'
    ELSE COALESCE('sensitivity.' || sensitivity_level, sensitivity_level)
  END
WHERE status NOT LIKE 'status.%' 
   OR challenge_type NOT LIKE 'challenge_type.%'
   OR priority_level NOT LIKE 'priority.%'
   OR sensitivity_level NOT LIKE 'sensitivity.%';

-- 3. challenge_experts table
UPDATE challenge_experts 
SET 
  role_type = CASE role_type
    WHEN 'evaluator' THEN 'expert_role.evaluator'
    WHEN 'mentor' THEN 'expert_role.mentor'
    WHEN 'reviewer' THEN 'expert_role.reviewer'
    WHEN 'advisor' THEN 'expert_role.advisor'
    ELSE 'expert_role.' || role_type
  END,
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'suspended' THEN 'status.suspended'
    ELSE 'status.' || status
  END
WHERE role_type NOT LIKE 'expert_role.%' OR status NOT LIKE 'status.%';

-- 4. challenge_partners table  
UPDATE challenge_partners 
SET 
  partnership_type = CASE partnership_type
    WHEN 'collaborator' THEN 'partnership_type.collaborator'
    WHEN 'sponsor' THEN 'partnership_type.sponsor'
    WHEN 'technical' THEN 'partnership_type.technical'
    WHEN 'financial' THEN 'partnership_type.financial'
    ELSE 'partnership_type.' || partnership_type
  END,
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'expired' THEN 'status.expired'
    ELSE 'status.' || status
  END
WHERE partnership_type NOT LIKE 'partnership_type.%' OR status NOT LIKE 'status.%';

-- 5. campaign_partners table
UPDATE campaign_partners 
SET 
  partnership_role = CASE partnership_role
    WHEN 'sponsor' THEN 'partnership_role.sponsor'
    WHEN 'partner' THEN 'partnership_role.partner'
    WHEN 'supporter' THEN 'partnership_role.supporter'
    WHEN 'collaborator' THEN 'partnership_role.collaborator'
    ELSE 'partnership_role.' || partnership_role
  END,
  partnership_status = CASE partnership_status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'expired' THEN 'status.expired'
    ELSE 'status.' || partnership_status
  END
WHERE partnership_role NOT LIKE 'partnership_role.%' OR partnership_status NOT LIKE 'status.%';