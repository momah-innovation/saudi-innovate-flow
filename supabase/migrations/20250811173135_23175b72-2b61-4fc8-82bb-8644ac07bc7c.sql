-- Handle remaining problematic keys
-- Fix the last few keys that still have issues

UPDATE system_translations 
SET translation_key = 's.enable_partnership_expiry_notif.desc'
WHERE translation_key = 'settings.enable_partnership_expiry_notifications.description';

UPDATE system_translations 
SET translation_key = 's.idea_collab_invite_expiry_hrs.desc'
WHERE translation_key = 'settings.idea_collaboration_invite_expiry_hours.description';

UPDATE system_translations 
SET translation_key = 's.role_justification_max_preview_len.desc'
WHERE translation_key = 'settings.role_justification_max_preview_length.description';

UPDATE system_translations 
SET translation_key = 'team_spec.project_mgmt_execution'
WHERE translation_key = 'team_spec.Project Management & Execution';

UPDATE system_translations 
SET translation_key = 'team_spec.innovation_strategy_planning'
WHERE translation_key = 'team_spec.Innovation Strategy & Planning';