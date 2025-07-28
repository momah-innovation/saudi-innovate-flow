-- Update campaigns status values to Arabic
UPDATE campaigns 
SET status = CASE 
  WHEN status = 'planning' THEN 'تخطيط'
  WHEN status = 'active' THEN 'نشط'
  WHEN status = 'completed' THEN 'مكتمل'
  WHEN status = 'draft' THEN 'مسودة'
  WHEN status = 'published' THEN 'منشور'
  WHEN status = 'archived' THEN 'مؤرشف'
  WHEN status = 'cancelled' THEN 'ملغي'
  ELSE status
END;

-- Update challenges status values to Arabic
UPDATE challenges 
SET status = CASE 
  WHEN status = 'draft' THEN 'مسودة'
  WHEN status = 'published' THEN 'منشور'
  WHEN status = 'active' THEN 'نشط'
  WHEN status = 'closed' THEN 'مغلق'
  WHEN status = 'archived' THEN 'مؤرشف'
  WHEN status = 'completed' THEN 'مكتمل'
  ELSE status
END;

-- Update events status values to Arabic
UPDATE events 
SET status = CASE 
  WHEN status = 'scheduled' THEN 'مجدول'
  WHEN status = 'active' THEN 'نشط'
  WHEN status = 'completed' THEN 'مكتمل'
  WHEN status = 'cancelled' THEN 'ملغي'
  WHEN status = 'postponed' THEN 'مؤجل'
  ELSE status
END;

-- Update challenge_partners partnership_type values to Arabic
UPDATE challenge_partners 
SET partnership_type = CASE 
  WHEN partnership_type = 'collaborator' THEN 'متعاون'
  WHEN partnership_type = 'sponsor' THEN 'راعي'
  WHEN partnership_type = 'technical_partner' THEN 'شريك تقني'
  WHEN partnership_type = 'strategic_partner' THEN 'شريك استراتيجي'
  WHEN partnership_type = 'implementation_partner' THEN 'شريك تنفيذ'
  WHEN partnership_type = 'research_collaboration' THEN 'شراكة بحثية'
  WHEN partnership_type = 'technology_sponsor' THEN 'راعي تقني'
  WHEN partnership_type = 'funding_partner' THEN 'شريك تمويل'
  ELSE partnership_type
END;