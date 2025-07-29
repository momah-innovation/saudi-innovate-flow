-- Seed remaining tables with existing data

-- Add more comprehensive linking tables data
INSERT INTO campaign_department_links (campaign_id, department_id) VALUES
((SELECT id FROM campaigns LIMIT 1), 
 (SELECT id FROM departments LIMIT 1)),
((SELECT id FROM campaigns LIMIT 1 OFFSET 1),
 (SELECT id FROM departments LIMIT 1 OFFSET 1));

INSERT INTO campaign_deputy_links (campaign_id, deputy_id) VALUES  
((SELECT id FROM campaigns LIMIT 1),
 (SELECT id FROM deputies LIMIT 1)),
((SELECT id FROM campaigns LIMIT 1 OFFSET 1),
 (SELECT id FROM deputies LIMIT 1 OFFSET 1));

INSERT INTO campaign_sector_links (campaign_id, sector_id) VALUES
((SELECT id FROM campaigns LIMIT 1),
 (SELECT id FROM sectors LIMIT 1)),
((SELECT id FROM campaigns LIMIT 1 OFFSET 1), 
 (SELECT id FROM sectors LIMIT 1 OFFSET 1));

-- Add event stakeholder links  
INSERT INTO event_stakeholder_links (event_id, stakeholder_id) VALUES
((SELECT id FROM events LIMIT 1),
 (SELECT id FROM stakeholders LIMIT 1)),
((SELECT id FROM events LIMIT 1 OFFSET 1),
 (SELECT id FROM stakeholders LIMIT 1 OFFSET 1));

-- Add event challenge links
INSERT INTO event_challenge_links (event_id, challenge_id) VALUES
((SELECT id FROM events LIMIT 1),
 (SELECT id FROM challenges LIMIT 1)),
((SELECT id FROM events LIMIT 1 OFFSET 1), 
 (SELECT id FROM challenges LIMIT 1 OFFSET 1));

-- Add event focus question links
INSERT INTO event_focus_question_links (event_id, focus_question_id) VALUES
((SELECT id FROM events LIMIT 1),
 (SELECT id FROM focus_questions LIMIT 1)),
((SELECT id FROM events LIMIT 1 OFFSET 1),
 (SELECT id FROM focus_questions LIMIT 1 OFFSET 1));

-- Seed idea_tag_links using existing innovators and tags
INSERT INTO idea_tag_links (idea_id, tag_id, added_by) 
SELECT 
  i.id as idea_id,
  it.id as tag_id,
  inn.user_id as added_by
FROM ideas i
CROSS JOIN idea_tags it
JOIN innovators inn ON i.innovator_id = inn.id
WHERE it.name_ar IN ('التعليم', 'التقنية', 'البيئة', 'الاستدامة')
LIMIT 10;

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
LIMIT 5;

-- Add more team assignments for campaigns
INSERT INTO team_assignments (
  team_member_id, assignment_type, assignment_id, role_in_assignment,
  workload_percentage, status, assigned_date, start_date, estimated_hours
) 
SELECT 
  itm.id as team_member_id,
  'campaign' as assignment_type,
  camp.id as assignment_id,
  'coordinator' as role_in_assignment,
  20 as workload_percentage,
  'active' as status,
  CURRENT_DATE as assigned_date,
  CURRENT_DATE as start_date,
  25 as estimated_hours
FROM innovation_team_members itm
CROSS JOIN campaigns camp
WHERE itm.status = 'active'
LIMIT 3;

-- Seed idea_evaluations using the single existing expert
INSERT INTO idea_evaluations (
  idea_id, evaluator_id, technical_feasibility, financial_viability, 
  market_potential, strategic_alignment, innovation_level, implementation_complexity,
  strengths, weaknesses, recommendations, next_steps, evaluator_type
) 
SELECT 
  i.id as idea_id,
  e.id as evaluator_id,
  (RANDOM() * 5 + 5)::integer as technical_feasibility, 
  (RANDOM() * 5 + 5)::integer as financial_viability,
  (RANDOM() * 5 + 5)::integer as market_potential,
  (RANDOM() * 5 + 5)::integer as strategic_alignment,
  (RANDOM() * 5 + 5)::integer as innovation_level,
  (RANDOM() * 5 + 5)::integer as implementation_complexity,
  'فكرة مبتكرة ومفيدة مع إمكانيات جيدة للتطبيق' as strengths,
  'تحتاج إلى دراسة أعمق لبعض الجوانب التقنية والمالية' as weaknesses,
  'ننصح بالمضي قدماً مع إجراء المزيد من البحوث' as recommendations,
  'إعداد نموذج أولي وإجراء دراسة جدوى مفصلة' as next_steps,
  'technical_expert' as evaluator_type
FROM ideas i
CROSS JOIN experts e
LIMIT 3;

-- Add notification for idea submission
INSERT INTO idea_notifications (
  idea_id, recipient_id, sender_id, notification_type, title, message
)
SELECT 
  i.id as idea_id,
  inn.user_id as recipient_id,
  (SELECT user_id FROM experts LIMIT 1) as sender_id,
  'evaluation_received' as notification_type,
  'تم تقييم فكرتك' as title,
  'تم تقييم فكرة "' || i.title_ar || '" من قبل الخبراء المختصين' as message
FROM ideas i
JOIN innovators inn ON i.innovator_id = inn.id
WHERE i.status != 'draft'
LIMIT 3;