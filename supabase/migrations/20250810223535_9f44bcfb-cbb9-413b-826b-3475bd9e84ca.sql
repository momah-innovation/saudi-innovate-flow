-- Fix database security issues from linter warnings
-- Fix function search_path for security

-- Correct the search_path for existing functions (without IF EXISTS)
ALTER FUNCTION public.cleanup_expired_temp_files() SET search_path = '';
ALTER FUNCTION public.get_basic_storage_info() SET search_path = '';
ALTER FUNCTION public.validate_role_assignment_trigger() SET search_path = '';
ALTER FUNCTION public.find_duplicate_files(text, bigint) SET search_path = '';
ALTER FUNCTION public.test_realtime_config() SET search_path = '';
ALTER FUNCTION public.validate_idea_submission() SET search_path = '';
ALTER FUNCTION public.send_challenge_notification(uuid, uuid, character varying, character varying, text, text, jsonb) SET search_path = '';
ALTER FUNCTION public.auto_create_campaign_assignment() SET search_path = '';
ALTER FUNCTION public.should_send_notification(uuid, character varying, character varying) SET search_path = '';
ALTER FUNCTION public.update_avatar_metadata() SET search_path = '';
ALTER FUNCTION public.auto_create_event_assignment() SET search_path = '';
ALTER FUNCTION public.ensure_innovator_exists(uuid) SET search_path = '';
ALTER FUNCTION public.send_idea_workflow_notifications(uuid, character varying, character varying) SET search_path = '';
ALTER FUNCTION public.create_idea_version_snapshot() SET search_path = '';
ALTER FUNCTION public.update_team_member_workload() SET search_path = '';
ALTER FUNCTION public.auto_log_team_activity() SET search_path = '';
ALTER FUNCTION public.auto_track_weekly_capacity() SET search_path = '';
ALTER FUNCTION public.update_weekly_capacity() SET search_path = '';
ALTER FUNCTION public.trigger_idea_workflow_change(uuid, character varying, text) SET search_path = '';
ALTER FUNCTION public.calculate_idea_analytics(uuid) SET search_path = '';
ALTER FUNCTION public.get_event_stats(uuid) SET search_path = '';
ALTER FUNCTION public.update_file_paths_for_migration() SET search_path = '';
ALTER FUNCTION public.validate_role_assignment(uuid, app_role) SET search_path = '';
ALTER FUNCTION public.notify_opportunity_status_change() SET search_path = '';
ALTER FUNCTION public.admin_cleanup_temp_files() SET search_path = '';
ALTER FUNCTION public.can_view_event(uuid, text, text) SET search_path = '';
ALTER FUNCTION public.audit_opportunity_changes() SET search_path = '';
ALTER FUNCTION public.init_opportunity_analytics() SET search_path = '';
ALTER FUNCTION public.update_opportunity_application_count() SET search_path = '';
ALTER FUNCTION public.increment_opportunity_views(uuid) SET search_path = '';
ALTER FUNCTION public.refresh_opportunity_analytics(uuid) SET search_path = '';
ALTER FUNCTION public.get_opportunity_analytics_summary(uuid) SET search_path = '';
ALTER FUNCTION public.send_event_notification(uuid, uuid, character varying, character varying, text, text, jsonb) SET search_path = '';
ALTER FUNCTION public.audit_opportunity_status_changes() SET search_path = '';
ALTER FUNCTION public.cleanup_legacy_buckets() SET search_path = '';
ALTER FUNCTION public.verify_storage_rls_coverage() SET search_path = '';
ALTER FUNCTION public.update_opportunity_analytics_on_bookmark() SET search_path = '';
ALTER FUNCTION public.trigger_manual_cleanup() SET search_path = '';
ALTER FUNCTION public.create_file_version(uuid, text, bigint, text, text) SET search_path = '';

-- Update any functions missing search_path from system
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT routine_name, specific_name
        FROM information_schema.routines
        WHERE routine_schema = 'public'
        AND routine_type = 'FUNCTION'
        AND routine_name NOT IN (
            SELECT proname 
            FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public'
            AND array_to_string(p.proconfig, ' ') LIKE '%search_path%'
        )
    LOOP
        BEGIN
            EXECUTE format('ALTER FUNCTION public.%I SET search_path = ''''', func_record.routine_name);
        EXCEPTION WHEN OTHERS THEN
            -- Skip functions that can't be altered (system functions, etc.)
            CONTINUE;
        END;
    END LOOP;
END $$;