-- Create audit trigger for opportunity status changes and updates
CREATE OR REPLACE FUNCTION public.audit_opportunity_status_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;