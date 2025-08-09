-- Create performance and use case views with corrected table relationships

-- Challenge Overview View with proper joins
CREATE OR REPLACE VIEW challenge_overview AS
SELECT 
    c.id,
    c.title_ar,
    c.description_ar,
    c.status,
    c.challenge_type,
    c.priority_level,
    c.start_date,
    c.end_date,
    c.estimated_budget,
    c.actual_budget,
    s.name_ar as sector_name,
    d.name_ar as department_name,
    dep.name_ar as deputy_name,
    dom.name_ar as domain_name,
    COUNT(DISTINCT cp.id) as participant_count,
    COUNT(DISTINCT cs.id) as submission_count,
    COUNT(DISTINCT cl.id) as likes_count,
    COUNT(DISTINCT cb.id) as bookmark_count,
    ca.view_count,
    ca.engagement_rate,
    c.created_at,
    c.updated_at
FROM challenges c
LEFT JOIN sectors s ON c.sector_id = s.id
LEFT JOIN departments d ON c.department_id = d.id
LEFT JOIN deputies dep ON c.deputy_id = dep.id
LEFT JOIN domains dom ON c.domain_id = dom.id
LEFT JOIN challenge_participants cp ON c.id = cp.challenge_id
LEFT JOIN challenge_submissions cs ON c.id = cs.challenge_id
LEFT JOIN challenge_likes cl ON c.id = cl.challenge_id
LEFT JOIN challenge_bookmarks cb ON c.id = cb.challenge_id
LEFT JOIN challenge_analytics ca ON c.id = ca.challenge_id
GROUP BY c.id, s.name_ar, d.name_ar, dep.name_ar, dom.name_ar, ca.view_count, ca.engagement_rate;

-- Event Overview View with corrected joins (events don't have department_id)
CREATE OR REPLACE VIEW event_overview AS
SELECT 
    e.id,
    e.title_ar,
    e.description_ar,
    e.status,
    e.format,
    e.event_date,
    e.max_participants,
    e.event_visibility,
    s.name_ar as sector_name,
    COUNT(DISTINCT ep.id) as participant_count,
    COUNT(DISTINCT el.id) as likes_count,
    COUNT(DISTINCT eb.id) as bookmark_count,
    AVG(ef.rating) as average_rating,
    COUNT(DISTINCT ef.id) as feedback_count,
    e.created_at
FROM events e
LEFT JOIN sectors s ON e.sector_id = s.id
LEFT JOIN event_participants ep ON e.id = ep.event_id
LEFT JOIN event_likes el ON e.id = el.event_id
LEFT JOIN event_bookmarks eb ON e.id = eb.event_id
LEFT JOIN event_feedback ef ON e.id = ef.event_id
GROUP BY e.id, s.name_ar;

-- Opportunity Overview View
CREATE OR REPLACE VIEW opportunity_overview AS
SELECT 
    o.id,
    o.title_ar,
    o.description_ar,
    o.status,
    o.opportunity_type,
    o.priority_level,
    o.deadline,
    o.budget_min,
    o.budget_max,
    s.name_ar as sector_name,
    d.name_ar as department_name,
    COUNT(DISTINCT oa.id) as application_count,
    COUNT(DISTINCT ol.id) as likes_count,
    COUNT(DISTINCT ob.id) as bookmark_count,
    oana.view_count,
    oana.conversion_rate,
    o.created_at,
    o.updated_at
FROM opportunities o
LEFT JOIN sectors s ON o.sector_id = s.id
LEFT JOIN departments d ON o.department_id = d.id
LEFT JOIN opportunity_applications oa ON o.id = oa.opportunity_id
LEFT JOIN opportunity_likes ol ON o.id = ol.opportunity_id
LEFT JOIN opportunity_bookmarks ob ON o.id = ob.opportunity_id
LEFT JOIN opportunity_analytics oana ON o.id = oana.opportunity_id
GROUP BY o.id, s.name_ar, d.name_ar, oana.view_count, oana.conversion_rate;

-- Campaign Overview View with proper joins
CREATE OR REPLACE VIEW campaign_overview AS
SELECT 
    c.id,
    c.title_ar,
    c.description_ar,
    c.status,
    c.theme,
    c.start_date,
    c.end_date,
    c.registration_deadline,
    c.target_participants,
    c.target_ideas,
    c.budget,
    s.name_ar as sector_name,
    d.name_ar as department_name,
    dep.name_ar as deputy_name,
    COUNT(DISTINCT cp.id) as participant_count,
    COUNT(DISTINCT cb.id) as bookmark_count,
    ca.view_count,
    ca.engagement_rate,
    c.created_at,
    c.updated_at
FROM campaigns c
LEFT JOIN sectors s ON c.sector_id = s.id
LEFT JOIN departments d ON c.department_id = d.id
LEFT JOIN deputies dep ON c.deputy_id = dep.id
LEFT JOIN campaign_participants cp ON c.id = cp.campaign_id
LEFT JOIN campaign_bookmarks cb ON c.id = cb.campaign_id
LEFT JOIN campaign_analytics ca ON c.id = ca.campaign_id
GROUP BY c.id, s.name_ar, d.name_ar, dep.name_ar, ca.view_count, ca.engagement_rate;

-- Idea Overview View with proper joins
CREATE OR REPLACE VIEW idea_overview AS
SELECT 
    i.id,
    i.title_ar,
    i.description_ar,
    i.status,
    i.innovation_type,
    i.implementation_status,
    i.impact_assessment,
    c.title_ar as challenge_title,
    fq.question_ar as focus_question,
    COUNT(DISTINCT il.id) as likes_count,
    COUNT(DISTINCT ib.id) as bookmark_count,
    COUNT(DISTINCT ic.id) as comment_count,
    AVG(ie.overall_score) as average_evaluation,
    i.created_at,
    i.updated_at
FROM ideas i
LEFT JOIN challenges c ON i.challenge_id = c.id
LEFT JOIN focus_questions fq ON i.focus_question_id = fq.id
LEFT JOIN idea_likes il ON i.id = il.idea_id
LEFT JOIN idea_bookmarks ib ON i.id = ib.idea_id
LEFT JOIN idea_comments ic ON i.id = ic.idea_id
LEFT JOIN idea_evaluations ie ON i.id = ie.idea_id
GROUP BY i.id, c.title_ar, fq.question_ar;

-- Expert Overview View
CREATE OR REPLACE VIEW expert_overview AS
SELECT 
    e.id,
    e.name_ar,
    e.title_ar,
    e.expertise_areas,
    e.status,
    e.availability_status,
    e.experience_years,
    COUNT(DISTINCT ce.id) as challenge_assignments,
    COUNT(DISTINCT ie.id) as idea_evaluations,
    AVG(ef.rating) as average_rating,
    COUNT(DISTINCT ef.id) as feedback_count,
    ea.consultation_count,
    ea.response_rate,
    e.created_at,
    e.updated_at
FROM experts e
LEFT JOIN challenge_experts ce ON e.id = ce.expert_id
LEFT JOIN idea_evaluations ie ON e.id = ie.expert_id
LEFT JOIN expert_feedback ef ON e.id = ef.expert_id
LEFT JOIN expert_analytics ea ON e.id = ea.expert_id
GROUP BY e.id, ea.consultation_count, ea.response_rate;

-- Partner Overview View
CREATE OR REPLACE VIEW partner_overview AS
SELECT 
    p.id,
    p.name_ar,
    p.organization_type,
    p.sector,
    p.status,
    p.partnership_level,
    COUNT(DISTINCT cp.id) as challenge_partnerships,
    COUNT(DISTINCT cam.id) as campaign_partnerships,
    COUNT(DISTINCT ep.id) as event_partnerships,
    AVG(pf.rating) as average_rating,
    COUNT(DISTINCT pf.id) as feedback_count,
    pa.collaboration_count,
    pa.engagement_rate,
    p.created_at,
    p.updated_at
FROM partners p
LEFT JOIN challenge_partners cp ON p.id = cp.partner_id
LEFT JOIN campaign_partners cam ON p.id = cam.partner_id
LEFT JOIN event_partner_links ep ON p.id = ep.partner_id
LEFT JOIN partner_feedback pf ON p.id = pf.partner_id
LEFT JOIN partner_analytics pa ON p.id = pa.partner_id
GROUP BY p.id, pa.collaboration_count, pa.engagement_rate;

-- User Engagement Summary View
CREATE OR REPLACE VIEW user_engagement_summary AS
SELECT 
    p.id as user_id,
    p.display_name,
    p.user_type,
    p.organization,
    COUNT(DISTINCT cp.id) as challenge_participations,
    COUNT(DISTINCT ep.id) as event_participations,
    COUNT(DISTINCT oa.id) as opportunity_applications,
    COUNT(DISTINCT i.id) as ideas_submitted,
    COUNT(DISTINCT cl.id) + COUNT(DISTINCT el.id) + COUNT(DISTINCT ol.id) + COUNT(DISTINCT il.id) as total_likes,
    COUNT(DISTINCT cb.id) + COUNT(DISTINCT eb.id) + COUNT(DISTINCT ob.id) + COUNT(DISTINCT ib.id) as total_bookmarks,
    p.last_activity_at,
    p.created_at
FROM profiles p
LEFT JOIN challenge_participants cp ON p.id = cp.user_id
LEFT JOIN event_participants ep ON p.id = ep.user_id
LEFT JOIN opportunity_applications oa ON p.id = oa.applicant_id
LEFT JOIN ideas i ON p.id = i.created_by
LEFT JOIN challenge_likes cl ON p.id = cl.user_id
LEFT JOIN event_likes el ON p.id = el.user_id
LEFT JOIN opportunity_likes ol ON p.id = ol.user_id
LEFT JOIN idea_likes il ON p.id = il.user_id
LEFT JOIN challenge_bookmarks cb ON p.id = cb.user_id
LEFT JOIN event_bookmarks eb ON p.id = eb.user_id
LEFT JOIN opportunity_bookmarks ob ON p.id = ob.user_id
LEFT JOIN idea_bookmarks ib ON p.id = ib.user_id
GROUP BY p.id, p.display_name, p.user_type, p.organization, p.last_activity_at, p.created_at;

-- Platform Analytics Dashboard View
CREATE OR REPLACE VIEW platform_analytics_dashboard AS
SELECT 
    'platform_overview' as metric_category,
    (SELECT COUNT(*) FROM challenges WHERE status = 'active') as active_challenges,
    (SELECT COUNT(*) FROM events WHERE status = 'upcoming') as upcoming_events,
    (SELECT COUNT(*) FROM opportunities WHERE status = 'open') as open_opportunities,
    (SELECT COUNT(*) FROM campaigns WHERE status = 'active') as active_campaigns,
    (SELECT COUNT(*) FROM ideas WHERE status IN ('approved', 'in_development')) as active_ideas,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_users_30_days,
    (SELECT COUNT(DISTINCT user_id) FROM challenge_participants WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_participants_30_days,
    (SELECT AVG(engagement_rate) FROM challenge_analytics) as avg_challenge_engagement,
    (SELECT COUNT(*) FROM challenge_submissions WHERE status = 'submitted') as total_submissions;

-- Grant SELECT permissions to authenticated users
GRANT SELECT ON challenge_overview TO authenticated;
GRANT SELECT ON event_overview TO authenticated;
GRANT SELECT ON opportunity_overview TO authenticated;
GRANT SELECT ON campaign_overview TO authenticated;
GRANT SELECT ON idea_overview TO authenticated;
GRANT SELECT ON expert_overview TO authenticated;
GRANT SELECT ON partner_overview TO authenticated;
GRANT SELECT ON user_engagement_summary TO authenticated;
GRANT SELECT ON platform_analytics_dashboard TO authenticated;