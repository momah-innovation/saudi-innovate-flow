-- Final comprehensive seeding with correct foreign key references

-- Seed team_assignments using existing innovation team members
INSERT INTO team_assignments (
  team_member_id, assignment_type, assignment_id, role_in_assignment,
  workload_percentage, status, assigned_date, start_date, estimated_hours
) 
SELECT 
  itm.id as team_member_id,
  'challenge' as assignment_type,
  c.id as assignment_id,
  'evaluator' as role_in_assignment,
  25 as workload_percentage,
  'active' as status,
  CURRENT_DATE as assigned_date,
  CURRENT_DATE as start_date,
  30 as estimated_hours
FROM innovation_team_members itm
CROSS JOIN challenges c
WHERE itm.status = 'active'
LIMIT 5
ON CONFLICT (team_member_id, assignment_type, assignment_id) DO NOTHING;

-- Seed idea_evaluations using correct user reference (not expert table)
INSERT INTO idea_evaluations (
  idea_id, evaluator_id, technical_feasibility, financial_viability, 
  market_potential, strategic_alignment, innovation_level, implementation_complexity,
  strengths, weaknesses, recommendations, next_steps, evaluator_type
) 
SELECT 
  i.id as idea_id,
  e.user_id as evaluator_id, -- Use user_id instead of expert id
  8 as technical_feasibility, 
  7 as financial_viability,
  9 as market_potential,
  8 as strategic_alignment,
  9 as innovation_level,
  6 as implementation_complexity,
  'فكرة مبتكرة ومفيدة مع إمكانيات جيدة للتطبيق والتطوير' as strengths,
  'تحتاج إلى دراسة أعمق لبعض الجوانب التقنية والمالية' as weaknesses,
  'ننصح بالمضي قدماً مع إجراء المزيد من البحوث' as recommendations,
  'إعداد نموذج أولي وإجراء دراسة جدوى مفصلة' as next_steps,
  'technical_expert' as evaluator_type
FROM ideas i
CROSS JOIN experts e
LIMIT 3;

-- Seed idea_tag_links
INSERT INTO idea_tag_links (idea_id, tag_id, added_by) 
SELECT DISTINCT
  i.id as idea_id,
  it.id as tag_id,
  inn.user_id as added_by
FROM ideas i
CROSS JOIN idea_tags it
JOIN innovators inn ON i.innovator_id = inn.id
WHERE it.name_ar IN ('التعليم', 'التقنية', 'البيئة', 'الاستدامة')
  AND NOT EXISTS (
    SELECT 1 FROM idea_tag_links itl 
    WHERE itl.idea_id = i.id AND itl.tag_id = it.id
  )
LIMIT 8;

-- Add idea notifications
INSERT INTO idea_notifications (
  idea_id, recipient_id, sender_id, notification_type, title, message
)
SELECT 
  i.id as idea_id,
  inn.user_id as recipient_id,
  e.user_id as sender_id,
  'evaluation_completed' as notification_type,
  'تم الانتهاء من تقييم فكرتك' as title,
  'تم الانتهاء من تقييم فكرة "' || i.title_ar || '" من قبل الخبراء المختصين' as message
FROM ideas i
JOIN innovators inn ON i.innovator_id = inn.id
CROSS JOIN experts e
WHERE i.status IN ('submitted', 'under_review')
LIMIT 3;

-- Add more linking entries with conflict handling
INSERT INTO event_partner_links (event_id, partner_id) 
SELECT e.id, p.id
FROM events e
CROSS JOIN partners p
LIMIT 4
ON CONFLICT (event_id, partner_id) DO NOTHING;

INSERT INTO campaign_department_links (campaign_id, department_id) 
SELECT c.id, d.id
FROM campaigns c
CROSS JOIN departments d
WHERE NOT EXISTS (
  SELECT 1 FROM campaign_department_links cdl 
  WHERE cdl.campaign_id = c.id AND cdl.department_id = d.id
)
LIMIT 3;

INSERT INTO campaign_sector_links (campaign_id, sector_id) 
SELECT c.id, s.id
FROM campaigns c
CROSS JOIN sectors s
WHERE NOT EXISTS (
  SELECT 1 FROM campaign_sector_links csl 
  WHERE csl.campaign_id = c.id AND csl.sector_id = s.id
)
LIMIT 3;