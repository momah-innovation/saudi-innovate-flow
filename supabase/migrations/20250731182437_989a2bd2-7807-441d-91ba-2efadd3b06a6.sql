-- Create the audit trigger
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
AS $$
BEGIN
  -- Refresh analytics when applications are inserted, updated, or deleted
  PERFORM public.refresh_opportunity_analytics(
    COALESCE(NEW.opportunity_id, OLD.opportunity_id)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for application changes
CREATE TRIGGER application_analytics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.opportunity_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_opportunity_analytics_on_application();