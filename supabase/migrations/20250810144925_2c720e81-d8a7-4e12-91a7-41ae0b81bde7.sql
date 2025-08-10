-- PHASE 8: CRITICAL DATABASE VALUE MIGRATION
-- Replace all hardcoded values with English translation keys

-- Step 1: Update challenges table
UPDATE challenges SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'active' THEN 'status.active' 
    WHEN 'published' THEN 'status.published'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'on_hold' THEN 'status.on_hold'
    WHEN 'planning' THEN 'status.planning'
    WHEN 'scheduled' THEN 'status.scheduled'
    WHEN 'ongoing' THEN 'status.ongoing'
    WHEN 'postponed' THEN 'status.postponed'
    ELSE 'status.draft'
  END,
  priority_level = CASE priority_level
    WHEN 'low' THEN 'priority.low'
    WHEN 'medium' THEN 'priority.medium'
    WHEN 'high' THEN 'priority.high'
    WHEN 'urgent' THEN 'priority.urgent'
    WHEN 'منخفض' THEN 'priority.low'
    WHEN 'متوسط' THEN 'priority.medium'
    WHEN 'عالي' THEN 'priority.high'
    WHEN 'عاجل' THEN 'priority.urgent'
    ELSE 'priority.medium'
  END,
  challenge_type = CASE challenge_type
    WHEN 'innovation' THEN 'type.innovation'
    WHEN 'research' THEN 'type.research'
    WHEN 'development' THEN 'type.development'
    WHEN 'design' THEN 'type.design'
    WHEN 'technical' THEN 'type.technical'
    WHEN 'business' THEN 'type.business'
    WHEN 'social' THEN 'type.social'
    WHEN 'environmental' THEN 'type.environmental'
    ELSE 'type.innovation'
  END,
  sensitivity_level = CASE sensitivity_level
    WHEN 'normal' THEN 'sensitivity.normal'
    WHEN 'sensitive' THEN 'sensitivity.sensitive'
    WHEN 'classified' THEN 'sensitivity.classified'
    WHEN 'confidential' THEN 'sensitivity.confidential'
    ELSE 'sensitivity.normal'
  END
WHERE status NOT LIKE 'status.%' OR priority_level NOT LIKE 'priority.%' 
   OR challenge_type NOT LIKE 'type.%' OR sensitivity_level NOT LIKE 'sensitivity.%';

-- Step 2: Update ideas table
UPDATE ideas SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'under_review' THEN 'status.under_review'
    WHEN 'approved' THEN 'status.approved'
    WHEN 'rejected' THEN 'status.rejected'
    WHEN 'in_development' THEN 'status.in_development'
    WHEN 'implemented' THEN 'status.implemented'
    WHEN 'archived' THEN 'status.archived'
    ELSE 'status.draft'
  END,
  category = CASE category
    WHEN 'technical' THEN 'category.technical'
    WHEN 'business' THEN 'category.business'
    WHEN 'social' THEN 'category.social'
    WHEN 'environmental' THEN 'category.environmental'
    WHEN 'educational' THEN 'category.educational'
    WHEN 'healthcare' THEN 'category.healthcare'
    WHEN 'finance' THEN 'category.finance'
    WHEN 'transportation' THEN 'category.transportation'
    ELSE 'category.technical'
  END,
  innovation_level = CASE innovation_level
    WHEN 'incremental' THEN 'innovation.incremental'
    WHEN 'radical' THEN 'innovation.radical'
    WHEN 'disruptive' THEN 'innovation.disruptive'
    WHEN 'breakthrough' THEN 'innovation.breakthrough'
    ELSE 'innovation.incremental'
  END
WHERE status NOT LIKE 'status.%' OR category NOT LIKE 'category.%' 
   OR innovation_level NOT LIKE 'innovation.%';

-- Step 3: Update events table
UPDATE events SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'published' THEN 'status.published'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'postponed' THEN 'status.postponed'
    WHEN 'ongoing' THEN 'status.ongoing'
    ELSE 'status.draft'
  END,
  event_type = CASE event_type
    WHEN 'workshop' THEN 'type.workshop'
    WHEN 'conference' THEN 'type.conference'
    WHEN 'webinar' THEN 'type.webinar'
    WHEN 'seminar' THEN 'type.seminar'
    WHEN 'training' THEN 'type.training'
    WHEN 'networking' THEN 'type.networking'
    WHEN 'competition' THEN 'type.competition'
    ELSE 'type.workshop'
  END,
  format = CASE format
    WHEN 'in_person' THEN 'format.in_person'
    WHEN 'virtual' THEN 'format.virtual'
    WHEN 'hybrid' THEN 'format.hybrid'
    ELSE 'format.in_person'
  END,
  visibility = CASE visibility
    WHEN 'public' THEN 'visibility.public'
    WHEN 'private' THEN 'visibility.private'
    WHEN 'internal' THEN 'visibility.internal'
    WHEN 'restricted' THEN 'visibility.restricted'
    ELSE 'visibility.public'
  END
WHERE status NOT LIKE 'status.%' OR event_type NOT LIKE 'type.%' 
   OR format NOT LIKE 'format.%' OR visibility NOT LIKE 'visibility.%';

-- Step 4: Update campaigns table
UPDATE campaigns SET 
  status = CASE status
    WHEN 'planning' THEN 'status.planning'
    WHEN 'active' THEN 'status.active'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'paused' THEN 'status.paused'
    ELSE 'status.planning'
  END,
  theme = CASE theme
    WHEN 'innovation' THEN 'theme.innovation'
    WHEN 'sustainability' THEN 'theme.sustainability'
    WHEN 'digital_transformation' THEN 'theme.digital_transformation'
    WHEN 'healthcare' THEN 'theme.healthcare'
    WHEN 'education' THEN 'theme.education'
    WHEN 'smart_cities' THEN 'theme.smart_cities'
    ELSE 'theme.innovation'
  END
WHERE status NOT LIKE 'status.%' OR theme NOT LIKE 'theme.%';

-- Step 5: Update opportunities table
UPDATE opportunities SET 
  status = CASE status
    WHEN 'open' THEN 'status.open'
    WHEN 'closed' THEN 'status.closed'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'draft' THEN 'status.draft'
    ELSE 'status.open'
  END,
  opportunity_type = CASE opportunity_type
    WHEN 'funding' THEN 'type.funding'
    WHEN 'partnership' THEN 'type.partnership'
    WHEN 'collaboration' THEN 'type.collaboration'
    WHEN 'mentorship' THEN 'type.mentorship'
    WHEN 'investment' THEN 'type.investment'
    WHEN 'grant' THEN 'type.grant'
    ELSE 'type.funding'
  END
WHERE status NOT LIKE 'status.%' OR opportunity_type NOT LIKE 'type.%';

-- Step 6: Update partners table
UPDATE partners SET 
  partner_type = CASE partner_type
    WHEN 'government' THEN 'type.government'
    WHEN 'corporate' THEN 'type.corporate'
    WHEN 'academic' THEN 'type.academic'
    WHEN 'ngo' THEN 'type.ngo'
    WHEN 'startup' THEN 'type.startup'
    WHEN 'international' THEN 'type.international'
    ELSE 'type.government'
  END,
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'suspended' THEN 'status.suspended'
    ELSE 'status.active'
  END
WHERE partner_type NOT LIKE 'type.%' OR status NOT LIKE 'status.%';

-- Step 7: Update innovators table
UPDATE innovators SET 
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'suspended' THEN 'status.suspended'
    ELSE 'status.active'
  END,
  specialization = CASE specialization
    WHEN 'technology' THEN 'specialization.technology'
    WHEN 'business' THEN 'specialization.business'
    WHEN 'design' THEN 'specialization.design'
    WHEN 'research' THEN 'specialization.research'
    WHEN 'engineering' THEN 'specialization.engineering'
    WHEN 'marketing' THEN 'specialization.marketing'
    WHEN 'general' THEN 'specialization.general'
    ELSE 'specialization.general'
  END
WHERE status NOT LIKE 'status.%' OR specialization NOT LIKE 'specialization.%';

-- Step 8: Update experts table
UPDATE experts SET 
  availability_status = CASE availability_status
    WHEN 'available' THEN 'status.available'
    WHEN 'busy' THEN 'status.busy'
    WHEN 'unavailable' THEN 'status.unavailable'
    WHEN 'limited' THEN 'status.limited'
    ELSE 'status.available'
  END,
  expertise_area = CASE expertise_area
    WHEN 'artificial_intelligence' THEN 'expertise.artificial_intelligence'
    WHEN 'blockchain' THEN 'expertise.blockchain'
    WHEN 'cybersecurity' THEN 'expertise.cybersecurity'
    WHEN 'data_science' THEN 'expertise.data_science'
    WHEN 'iot' THEN 'expertise.iot'
    WHEN 'mobile_development' THEN 'expertise.mobile_development'
    WHEN 'web_development' THEN 'expertise.web_development'
    WHEN 'business_strategy' THEN 'expertise.business_strategy'
    WHEN 'product_management' THEN 'expertise.product_management'
    WHEN 'user_experience' THEN 'expertise.user_experience'
    ELSE 'expertise.general'
  END
WHERE availability_status NOT LIKE 'status.%' OR expertise_area NOT LIKE 'expertise.%';

-- Step 9: Update user_roles table
UPDATE user_roles SET 
  role = CASE role::text
    WHEN 'super_admin' THEN 'role.super_admin'
    WHEN 'admin' THEN 'role.admin'
    WHEN 'expert' THEN 'role.expert'
    WHEN 'innovator' THEN 'role.innovator'
    WHEN 'partner' THEN 'role.partner'
    WHEN 'stakeholder' THEN 'role.stakeholder'
    WHEN 'team_member' THEN 'role.team_member'
    ELSE 'role.innovator'
  END::app_role
WHERE role::text NOT LIKE 'role.%';

-- Step 10: Update innovation_team_members table
UPDATE innovation_team_members SET 
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'suspended' THEN 'status.suspended'
    ELSE 'status.active'
  END,
  role = CASE role
    WHEN 'manager' THEN 'role.manager'
    WHEN 'analyst' THEN 'role.analyst'
    WHEN 'coordinator' THEN 'role.coordinator'
    WHEN 'specialist' THEN 'role.specialist'
    WHEN 'lead' THEN 'role.lead'
    ELSE 'role.specialist'
  END
WHERE status NOT LIKE 'status.%' OR role NOT LIKE 'role.%';

-- Log the migration completion
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES 
('migration.database_values_completed', 'Database value migration completed successfully', 'تم إكمال ترحيل قيم قاعدة البيانات بنجاح', 'system')
ON CONFLICT (translation_key) DO NOTHING;