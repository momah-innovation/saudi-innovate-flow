-- Fixed Database Migration - Update only existing columns
-- Phase 1: Complete Database Migration to Key-Based Translation System

-- 1. Update challenges table (only existing columns)
UPDATE challenges 
SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'planning' THEN 'status.planning'
    WHEN 'active' THEN 'status.active'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'under_review' THEN 'status.under_review'
    WHEN 'approved' THEN 'status.approved'
    WHEN 'rejected' THEN 'status.rejected'
    ELSE COALESCE('status.' || status, status)
  END,
  challenge_type = CASE challenge_type
    WHEN 'innovation' THEN 'challenge_type.innovation'
    WHEN 'research' THEN 'challenge_type.research'
    WHEN 'development' THEN 'challenge_type.development'
    WHEN 'implementation' THEN 'challenge_type.implementation'
    WHEN 'optimization' THEN 'challenge_type.optimization'
    WHEN 'transformation' THEN 'challenge_type.transformation'
    ELSE COALESCE('challenge_type.' || challenge_type, challenge_type)
  END,
  sensitivity_level = CASE sensitivity_level
    WHEN 'public' THEN 'sensitivity.public'
    WHEN 'internal' THEN 'sensitivity.internal'
    WHEN 'confidential' THEN 'sensitivity.confidential'
    WHEN 'restricted' THEN 'sensitivity.restricted'
    WHEN 'normal' THEN 'sensitivity.normal'
    ELSE COALESCE('sensitivity.' || sensitivity_level, sensitivity_level)
  END
WHERE status NOT LIKE 'status.%' 
   OR challenge_type NOT LIKE 'challenge_type.%' 
   OR sensitivity_level NOT LIKE 'sensitivity.%';

-- 2. Update campaigns table
UPDATE campaigns 
SET 
  status = CASE status
    WHEN 'planning' THEN 'status.planning'
    WHEN 'active' THEN 'status.active'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'draft' THEN 'status.draft'
    ELSE COALESCE('status.' || status, status)
  END,
  theme = CASE theme
    WHEN 'innovation' THEN 'theme.innovation'
    WHEN 'sustainability' THEN 'theme.sustainability'
    WHEN 'digital_transformation' THEN 'theme.digital_transformation'
    WHEN 'healthcare' THEN 'theme.healthcare'
    WHEN 'education' THEN 'theme.education'
    WHEN 'environment' THEN 'theme.environment'
    ELSE COALESCE('theme.' || theme, theme)
  END
WHERE status NOT LIKE 'status.%' OR (theme IS NOT NULL AND theme NOT LIKE 'theme.%');

-- 3. Update ideas table
UPDATE ideas 
SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'submitted' THEN 'status.submitted'
    WHEN 'under_review' THEN 'status.under_review'
    WHEN 'approved' THEN 'status.approved'
    WHEN 'rejected' THEN 'status.rejected'
    WHEN 'in_development' THEN 'status.in_development'
    WHEN 'implemented' THEN 'status.implemented'
    WHEN 'archived' THEN 'status.archived'
    ELSE COALESCE('status.' || status, status)
  END
WHERE status NOT LIKE 'status.%';

-- 4. Update events table
UPDATE events 
SET 
  status = CASE status
    WHEN 'draft' THEN 'status.draft'
    WHEN 'scheduled' THEN 'status.scheduled'
    WHEN 'live' THEN 'status.live'
    WHEN 'completed' THEN 'status.completed'
    WHEN 'cancelled' THEN 'status.cancelled'
    WHEN 'postponed' THEN 'status.postponed'
    ELSE COALESCE('status.' || status, status)
  END,
  format = CASE format
    WHEN 'in_person' THEN 'format.in_person'
    WHEN 'virtual' THEN 'format.virtual'
    WHEN 'hybrid' THEN 'format.hybrid'
    ELSE COALESCE('format.' || format, format)
  END
WHERE status NOT LIKE 'status.%' OR (format IS NOT NULL AND format NOT LIKE 'format.%');

-- 5. Update opportunities table
UPDATE opportunities 
SET 
  status = CASE status
    WHEN 'open' THEN 'status.open'
    WHEN 'closed' THEN 'status.closed'
    WHEN 'paused' THEN 'status.paused'
    WHEN 'draft' THEN 'status.draft'
    WHEN 'under_review' THEN 'status.under_review'
    ELSE COALESCE('status.' || status, status)
  END,
  opportunity_type = CASE opportunity_type
    WHEN 'funding' THEN 'opportunity_type.funding'
    WHEN 'partnership' THEN 'opportunity_type.partnership'
    WHEN 'mentorship' THEN 'opportunity_type.mentorship'
    WHEN 'training' THEN 'opportunity_type.training'
    WHEN 'collaboration' THEN 'opportunity_type.collaboration'
    ELSE COALESCE('opportunity_type.' || opportunity_type, opportunity_type)
  END,
  visibility = CASE visibility
    WHEN 'public' THEN 'visibility.public'
    WHEN 'internal' THEN 'visibility.internal'
    WHEN 'restricted' THEN 'visibility.restricted'
    ELSE COALESCE('visibility.' || visibility, visibility)
  END
WHERE status NOT LIKE 'status.%' 
   OR (opportunity_type IS NOT NULL AND opportunity_type NOT LIKE 'opportunity_type.%')
   OR (visibility IS NOT NULL AND visibility NOT LIKE 'visibility.%');

-- 6. Update partners table
UPDATE partners 
SET 
  status = CASE status
    WHEN 'active' THEN 'status.active'
    WHEN 'inactive' THEN 'status.inactive'
    WHEN 'pending' THEN 'status.pending'
    WHEN 'suspended' THEN 'status.suspended'
    ELSE COALESCE('status.' || status, status)
  END
WHERE status NOT LIKE 'status.%';

-- Add more core translation keys to system_translations if they don't exist
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Status translations
('status.draft', 'Draft', 'مسودة', 'status'),
('status.planning', 'Planning', 'تخطيط', 'status'),
('status.active', 'Active', 'نشط', 'status'),
('status.completed', 'Completed', 'مكتمل', 'status'),
('status.cancelled', 'Cancelled', 'ملغي', 'status'),
('status.paused', 'Paused', 'متوقف مؤقتاً', 'status'),
('status.under_review', 'Under Review', 'قيد المراجعة', 'status'),
('status.approved', 'Approved', 'موافق عليه', 'status'),
('status.rejected', 'Rejected', 'مرفوض', 'status'),
('status.scheduled', 'Scheduled', 'مجدول', 'status'),
('status.live', 'Live', 'مباشر', 'status'),
('status.postponed', 'Postponed', 'مؤجل', 'status'),
('status.open', 'Open', 'مفتوح', 'status'),
('status.closed', 'Closed', 'مغلق', 'status'),
('status.registered', 'Registered', 'مسجل', 'status'),
('status.confirmed', 'Confirmed', 'مؤكد', 'status'),
('status.withdrawn', 'Withdrawn', 'منسحب', 'status'),
('status.finalist', 'Finalist', 'مرشح نهائي', 'status'),
('status.winner', 'Winner', 'فائز', 'status'),
('status.submitted', 'Submitted', 'مقدم', 'status'),
('status.in_development', 'In Development', 'قيد التطوير', 'status'),
('status.implemented', 'Implemented', 'منفذ', 'status'),
('status.archived', 'Archived', 'مؤرشف', 'status'),
('status.inactive', 'Inactive', 'غير نشط', 'status'),
('status.pending', 'Pending', 'معلق', 'status'),
('status.suspended', 'Suspended', 'معلق', 'status'),

-- Challenge types
('challenge_type.innovation', 'Innovation', 'ابتكار', 'challenge_type'),
('challenge_type.research', 'Research', 'بحث', 'challenge_type'),
('challenge_type.development', 'Development', 'تطوير', 'challenge_type'),
('challenge_type.implementation', 'Implementation', 'تنفيذ', 'challenge_type'),
('challenge_type.optimization', 'Optimization', 'تحسين', 'challenge_type'),
('challenge_type.transformation', 'Transformation', 'تحول', 'challenge_type'),

-- Sensitivity levels
('sensitivity.public', 'Public', 'عام', 'sensitivity'),
('sensitivity.internal', 'Internal', 'داخلي', 'sensitivity'),
('sensitivity.confidential', 'Confidential', 'سري', 'sensitivity'),
('sensitivity.restricted', 'Restricted', 'مقيد', 'sensitivity'),
('sensitivity.normal', 'Normal', 'عادي', 'sensitivity'),

-- Themes
('theme.innovation', 'Innovation', 'الابتكار', 'theme'),
('theme.sustainability', 'Sustainability', 'الاستدامة', 'theme'),
('theme.digital_transformation', 'Digital Transformation', 'التحول الرقمي', 'theme'),
('theme.healthcare', 'Healthcare', 'الرعاية الصحية', 'theme'),
('theme.education', 'Education', 'التعليم', 'theme'),
('theme.environment', 'Environment', 'البيئة', 'theme'),

-- Formats
('format.in_person', 'In Person', 'شخصياً', 'format'),
('format.virtual', 'Virtual', 'افتراضي', 'format'),
('format.hybrid', 'Hybrid', 'مختلط', 'format'),

-- Visibility
('visibility.public', 'Public', 'عام', 'visibility'),
('visibility.internal', 'Internal', 'داخلي', 'visibility'),
('visibility.restricted', 'Restricted', 'مقيد', 'visibility'),

-- Opportunity types
('opportunity_type.funding', 'Funding', 'تمويل', 'opportunity_type'),
('opportunity_type.partnership', 'Partnership', 'شراكة', 'opportunity_type'),
('opportunity_type.mentorship', 'Mentorship', 'إرشاد', 'opportunity_type'),
('opportunity_type.training', 'Training', 'تدريب', 'opportunity_type'),
('opportunity_type.collaboration', 'Collaboration', 'تعاون', 'opportunity_type'),

-- Partnership types
('partnership_type.strategic', 'Strategic', 'استراتيجي', 'partnership_type'),
('partnership_type.funding', 'Funding', 'تمويل', 'partnership_type'),
('partnership_type.technical', 'Technical', 'تقني', 'partnership_type'),
('partnership_type.academic', 'Academic', 'أكاديمي', 'partnership_type'),
('partnership_type.government', 'Government', 'حكومي', 'partnership_type')

ON CONFLICT (translation_key) DO UPDATE SET
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();

-- Log the migration progress
INSERT INTO public.system_audit_log (
  user_id, action_type, resource_type, details, risk_level
) VALUES (
  auth.uid(), 'DATABASE_MIGRATION', 'translation_system', 
  jsonb_build_object(
    'migration_type', 'key_based_translation_system_fixed',
    'tables_updated', ARRAY[
      'challenges', 'campaigns', 'ideas', 'events', 'opportunities', 'partners'
    ],
    'fields_migrated', ARRAY[
      'status', 'challenge_type', 'sensitivity_level', 'theme',
      'format', 'visibility', 'opportunity_type'
    ],
    'translation_keys_added', 40,
    'migration_completed_at', NOW()
  ), 'medium'
);