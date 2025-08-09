-- Create final comprehensive performance views with correct column references

-- Analytics Overview View
CREATE OR REPLACE VIEW analytics_overview AS
SELECT 
    'platform_metrics' as category,
    COUNT(DISTINCT a.id) as total_events,
    COUNT(DISTINCT a.user_id) as unique_users,
    COUNT(DISTINCT DATE(a.timestamp)) as active_days,
    COUNT(*) FILTER (WHERE a.event_type = 'page_view') as page_views,
    COUNT(*) FILTER (WHERE a.event_type = 'click') as clicks,
    COUNT(*) FILTER (WHERE a.event_type = 'engagement') as engagements,
    DATE_TRUNC('day', NOW()) as report_date
FROM analytics_events a
WHERE a.timestamp >= CURRENT_DATE - INTERVAL '30 days';

-- File Management Overview View (with correct profile column)
CREATE OR REPLACE VIEW file_management_overview AS
SELECT 
    fr.id,
    fr.original_filename,
    fr.stored_filename,
    fr.bucket_name,
    fr.file_path,
    fr.file_size,
    fr.mime_type,
    fr.uploader_id,
    fr.is_temporary,
    fr.is_committed,
    fr.expires_at,
    fr.created_at,
    fr.committed_at,
    p.name as uploader_name,
    COUNT(fv.id) as version_count,
    COUNT(fle.id) as lifecycle_events_count
FROM file_records fr
LEFT JOIN profiles p ON fr.uploader_id = p.id
LEFT JOIN file_versions fv ON fr.id = fv.file_record_id
LEFT JOIN file_lifecycle_events fle ON fr.id = fle.file_record_id
GROUP BY fr.id, p.name;

-- Innovation Teams Overview View
CREATE OR REPLACE VIEW innovation_teams_overview AS
SELECT 
    it.id,
    it.name_ar,
    it.name_en,
    it.description_ar,
    it.type,
    it.status,
    it.established_date,
    it.budget_allocation,
    COUNT(DISTINCT itm.id) as member_count,
    COUNT(DISTINCT ta.id) as assignment_count,
    COUNT(DISTINCT c.id) as managed_challenges,
    COUNT(DISTINCT e.id) as managed_events,
    it.created_at,
    it.updated_at
FROM innovation_teams it
LEFT JOIN innovation_team_members itm ON it.id = itm.team_id AND itm.status = 'active'
LEFT JOIN team_assignments ta ON itm.id = ta.team_member_id
LEFT JOIN challenges c ON itm.user_id = c.challenge_owner_id
LEFT JOIN events e ON itm.user_id = e.event_manager_id
GROUP BY it.id;

-- AI Usage Analytics View
CREATE OR REPLACE VIEW ai_usage_analytics AS
SELECT 
    aut.feature_name,
    aut.usage_type,
    COUNT(*) as total_usage,
    COUNT(DISTINCT aut.user_id) as unique_users,
    AVG(aut.input_tokens) as avg_input_tokens,
    AVG(aut.output_tokens) as avg_output_tokens,
    AVG(aut.execution_time_ms) as avg_execution_time,
    SUM(aut.cost_estimate) as total_cost,
    COUNT(*) FILTER (WHERE aut.success = true) as successful_requests,
    COUNT(*) FILTER (WHERE aut.success = false) as failed_requests,
    DATE_TRUNC('day', aut.created_at) as usage_date
FROM ai_usage_tracking aut
WHERE aut.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY aut.feature_name, aut.usage_type, DATE_TRUNC('day', aut.created_at);

-- Knowledge Base Overview View
CREATE OR REPLACE VIEW knowledge_base_overview AS
SELECT 
    kb.id,
    kb.title_ar,
    kb.title_en,
    kb.content_type,
    kb.category,
    kb.status,
    kb.view_count,
    kb.like_count,
    kb.created_by,
    p.name as author_name,
    COUNT(DISTINCT kbt.tag_id) as tag_count,
    kb.created_at,
    kb.updated_at
FROM knowledge_base kb
LEFT JOIN profiles p ON kb.created_by = p.id
LEFT JOIN knowledge_base_tags kbt ON kb.id = kbt.knowledge_base_id
GROUP BY kb.id, p.name;

-- Media Content Overview View
CREATE OR REPLACE VIEW media_content_overview AS
SELECT 
    mc.id,
    mc.title_ar,
    mc.title_en,
    mc.content_type,
    mc.media_type,
    mc.file_url,
    mc.file_size,
    mc.duration_seconds,
    mc.view_count,
    mc.download_count,
    mc.status,
    mc.uploaded_by,
    p.name as uploader_name,
    COUNT(DISTINCT mct.tag_id) as tag_count,
    mc.created_at,
    mc.updated_at
FROM media_content mc
LEFT JOIN profiles p ON mc.uploaded_by = p.id
LEFT JOIN media_content_tags mct ON mc.id = mct.media_content_id
GROUP BY mc.id, p.name;

-- Focus Questions Overview View
CREATE OR REPLACE VIEW focus_questions_overview AS
SELECT 
    fq.id,
    fq.question_ar,
    fq.question_en,
    fq.description_ar,
    fq.category,
    fq.difficulty_level,
    fq.status,
    c.title_ar as challenge_title,
    COUNT(DISTINCT i.id) as ideas_count,
    COUNT(DISTINCT fqb.id) as bookmark_count,
    fq.created_at,
    fq.updated_at
FROM focus_questions fq
LEFT JOIN challenges c ON fq.challenge_id = c.id
LEFT JOIN ideas i ON fq.id = i.focus_question_id
LEFT JOIN focus_question_bookmarks fqb ON fq.id = fqb.focus_question_id
GROUP BY fq.id, c.title_ar;

-- Tags Usage Overview View
CREATE OR REPLACE VIEW tags_usage_overview AS
SELECT 
    t.id,
    t.name_ar,
    t.name_en,
    t.category,
    t.color,
    t.usage_count,
    COUNT(DISTINCT ct.challenge_id) as challenge_usage,
    COUNT(DISTINCT et.event_id) as event_usage,
    COUNT(DISTINCT it.idea_id) as idea_usage,
    COUNT(DISTINCT pt.partner_id) as partner_usage,
    t.created_at,
    t.updated_at
FROM tags t
LEFT JOIN challenge_tags ct ON t.id = ct.tag_id
LEFT JOIN event_tags et ON t.id = et.tag_id
LEFT JOIN idea_tags it ON t.id = it.tag_id
LEFT JOIN partner_tags pt ON t.id = pt.tag_id
GROUP BY t.id;

-- Organizational Structure Overview View
CREATE OR REPLACE VIEW organizational_structure_overview AS
SELECT 
    'departments' as entity_type,
    d.id,
    d.name_ar as name,
    d.name as name_en,
    dep.name_ar as parent_name,
    COUNT(DISTINCT c.id) as challenges_count,
    COUNT(DISTINCT o.id) as opportunities_count,
    d.created_at
FROM departments d
LEFT JOIN deputies dep ON d.deputy_id = dep.id
LEFT JOIN challenges c ON d.id = c.department_id
LEFT JOIN opportunities o ON d.id = o.department_id
GROUP BY d.id, dep.name_ar

UNION ALL

SELECT 
    'sectors' as entity_type,
    s.id,
    s.name_ar as name,
    s.name_en,
    NULL as parent_name,
    COUNT(DISTINCT c.id) as challenges_count,
    COUNT(DISTINCT o.id) as opportunities_count,
    s.created_at
FROM sectors s
LEFT JOIN challenges c ON s.id = c.sector_id
LEFT JOIN opportunities o ON s.id = o.sector_id
GROUP BY s.id

UNION ALL

SELECT 
    'domains' as entity_type,
    dom.id,
    dom.name_ar as name,
    dom.name_en,
    NULL as parent_name,
    COUNT(DISTINCT c.id) as challenges_count,
    0 as opportunities_count,
    dom.created_at
FROM domains dom
LEFT JOIN challenges c ON dom.id = c.domain_id
GROUP BY dom.id;

-- System Statistics Dashboard View
CREATE OR REPLACE VIEW system_statistics_dashboard AS
SELECT 
    'system_overview' as category,
    (SELECT COUNT(*) FROM challenges) as total_challenges,
    (SELECT COUNT(*) FROM events) as total_events,
    (SELECT COUNT(*) FROM opportunities) as total_opportunities,
    (SELECT COUNT(*) FROM campaigns) as total_campaigns,
    (SELECT COUNT(*) FROM ideas) as total_ideas,
    (SELECT COUNT(*) FROM profiles) as total_users,
    (SELECT COUNT(*) FROM partners) as total_partners,
    (SELECT COUNT(*) FROM experts) as total_experts,
    (SELECT COUNT(*) FROM innovation_teams) as total_teams,
    (SELECT COUNT(*) FROM file_records) as total_files,
    (SELECT COUNT(*) FROM knowledge_base) as total_kb_articles,
    (SELECT COUNT(*) FROM media_content) as total_media_items,
    (SELECT COUNT(*) FROM analytics_events WHERE timestamp >= CURRENT_DATE - INTERVAL '24 hours') as events_last_24h;

-- Grant SELECT permissions to authenticated users
GRANT SELECT ON analytics_overview TO authenticated;
GRANT SELECT ON file_management_overview TO authenticated;
GRANT SELECT ON innovation_teams_overview TO authenticated;
GRANT SELECT ON ai_usage_analytics TO authenticated;
GRANT SELECT ON knowledge_base_overview TO authenticated;
GRANT SELECT ON media_content_overview TO authenticated;
GRANT SELECT ON focus_questions_overview TO authenticated;
GRANT SELECT ON tags_usage_overview TO authenticated;
GRANT SELECT ON organizational_structure_overview TO authenticated;
GRANT SELECT ON system_statistics_dashboard TO authenticated;