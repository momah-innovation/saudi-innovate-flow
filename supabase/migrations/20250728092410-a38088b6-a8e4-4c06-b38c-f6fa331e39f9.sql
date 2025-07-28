-- Update stakeholder_type values to Arabic
UPDATE stakeholders 
SET stakeholder_type = CASE 
  WHEN stakeholder_type = 'government' OR stakeholder_type = 'حكومي' THEN 'حكومي'
  WHEN stakeholder_type = 'private_sector' OR stakeholder_type = 'خاص' THEN 'خاص'
  WHEN stakeholder_type = 'academic' OR stakeholder_type = 'أكاديمي' THEN 'أكاديمي'
  WHEN stakeholder_type = 'ngo' OR stakeholder_type = 'غير ربحي' THEN 'غير ربحي'
  WHEN stakeholder_type = 'community' OR stakeholder_type = 'مجتمعي' THEN 'مجتمعي'
  WHEN stakeholder_type = 'international' OR stakeholder_type = 'دولي' THEN 'دولي'
  ELSE stakeholder_type
END;

-- Update influence_level values to Arabic
UPDATE stakeholders 
SET influence_level = CASE 
  WHEN influence_level = 'high' OR influence_level = 'عالي' THEN 'عالي'
  WHEN influence_level = 'medium' OR influence_level = 'متوسط' THEN 'متوسط'
  WHEN influence_level = 'low' OR influence_level = 'منخفض' THEN 'منخفض'
  ELSE influence_level
END;

-- Update interest_level values to Arabic
UPDATE stakeholders 
SET interest_level = CASE 
  WHEN interest_level = 'high' OR interest_level = 'عالي' THEN 'عالي'
  WHEN interest_level = 'medium' OR interest_level = 'متوسط' THEN 'متوسط'
  WHEN interest_level = 'low' OR interest_level = 'منخفض' THEN 'منخفض'
  ELSE interest_level
END;

-- Update engagement_status values to Arabic
UPDATE stakeholders 
SET engagement_status = CASE 
  WHEN engagement_status = 'active' OR engagement_status = 'نشط' THEN 'نشط'
  WHEN engagement_status = 'passive' OR engagement_status = 'غير نشط' THEN 'غير نشط'
  WHEN engagement_status = 'neutral' OR engagement_status = 'معلق' THEN 'معلق'
  WHEN engagement_status = 'resistant' OR engagement_status = 'محظور' THEN 'محظور'
  WHEN engagement_status = 'supporter' THEN 'نشط'
  ELSE engagement_status
END;