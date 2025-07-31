-- Create audit trigger for opportunity status changes and updates
CREATE OR REPLACE FUNCTION public.audit_opportunity_status_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log status changes specifically
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.opportunity_audit_log (
      opportunity_id,
      action_type,
      changed_by,
      old_values,
      new_values,
      change_reason
    ) VALUES (
      NEW.id,
      'STATUS_CHANGE',
      auth.uid(),
      jsonb_build_object('status', OLD.status),
      jsonb_build_object('status', NEW.status),
      'Status changed from ' || OLD.status || ' to ' || NEW.status
    );
  END IF;

  -- Log significant field changes
  IF OLD.title_ar IS DISTINCT FROM NEW.title_ar OR
     OLD.description_ar IS DISTINCT FROM NEW.description_ar OR
     OLD.deadline IS DISTINCT FROM NEW.deadline OR
     OLD.budget_min IS DISTINCT FROM NEW.budget_min OR
     OLD.budget_max IS DISTINCT FROM NEW.budget_max THEN
    INSERT INTO public.opportunity_audit_log (
      opportunity_id,
      action_type,
      changed_by,
      old_values,
      new_values,
      change_reason
    ) VALUES (
      NEW.id,
      'CONTENT_UPDATE',
      auth.uid(),
      to_jsonb(OLD),
      to_jsonb(NEW),
      'Opportunity content updated'
    );
  END IF;

  -- Update the updated_at timestamp
  NEW.updated_at = NOW();
  
  RETURN NEW;
END;
$function$

-- Create the trigger
DROP TRIGGER IF EXISTS opportunity_audit_trigger ON public.partnership_opportunities;
CREATE TRIGGER opportunity_audit_trigger
  BEFORE UPDATE ON public.partnership_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_opportunity_status_changes();

-- Create function to automatically update analytics when applications change
CREATE OR REPLACE FUNCTION public.update_opportunity_analytics_on_application()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Refresh analytics when applications are inserted, updated, or deleted
  PERFORM public.refresh_opportunity_analytics(
    COALESCE(NEW.opportunity_id, OLD.opportunity_id)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$function$

-- Create triggers for application changes
DROP TRIGGER IF EXISTS application_analytics_trigger ON public.opportunity_applications;
CREATE TRIGGER application_analytics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.opportunity_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_opportunity_analytics_on_application();

-- Create function to track user interaction timestamps
CREATE OR REPLACE FUNCTION public.update_user_interaction_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update last interaction timestamp for analytics
  INSERT INTO public.opportunity_user_journeys (
    opportunity_id,
    user_id,
    session_id,
    section_name,
    action_type,
    metadata,
    created_at
  ) VALUES (
    NEW.opportunity_id,
    NEW.user_id,
    'system-generated',
    CASE TG_TABLE_NAME
      WHEN 'opportunity_likes' THEN 'interaction'
      WHEN 'opportunity_shares' THEN 'sharing'
      WHEN 'opportunity_bookmarks' THEN 'bookmarking'
      WHEN 'opportunity_applications' THEN 'application'
      ELSE 'other'
    END,
    TG_OP,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'operation', TG_OP,
      'timestamp', NOW()
    ),
    NOW()
  );
  
  RETURN NEW;
END;
$function$

-- Create triggers for user interactions
DROP TRIGGER IF EXISTS user_interaction_likes_trigger ON public.opportunity_likes;
CREATE TRIGGER user_interaction_likes_trigger
  AFTER INSERT OR DELETE ON public.opportunity_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_interaction_timestamp();

DROP TRIGGER IF EXISTS user_interaction_shares_trigger ON public.opportunity_shares;
CREATE TRIGGER user_interaction_shares_trigger
  AFTER INSERT ON public.opportunity_shares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_interaction_timestamp();

DROP TRIGGER IF EXISTS user_interaction_bookmarks_trigger ON public.opportunity_bookmarks;
CREATE TRIGGER user_interaction_bookmarks_trigger
  AFTER INSERT OR DELETE ON public.opportunity_bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_interaction_timestamp();