-- Create opportunity workflow triggers and functions

-- 1. Create notification function for opportunity status changes
CREATE OR REPLACE FUNCTION public.notify_opportunity_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify when opportunity status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Insert notification for the opportunity creator
    IF NEW.created_by IS NOT NULL THEN
      INSERT INTO public.opportunity_notifications (
        opportunity_id,
        recipient_id,
        sender_id,
        notification_type,
        title,
        message,
        metadata
      ) VALUES (
        NEW.id,
        NEW.created_by,
        auth.uid(),
        'status_change',
        CASE NEW.status
          WHEN 'open' THEN 'تم فتح الفرصة'
          WHEN 'closed' THEN 'تم إغلاق الفرصة'
          WHEN 'paused' THEN 'تم إيقاف الفرصة مؤقتاً'
          ELSE 'تم تحديث حالة الفرصة'
        END,
        'تم تغيير حالة فرصة "' || NEW.title_ar || '" من ' || OLD.status || ' إلى ' || NEW.status,
        jsonb_build_object(
          'old_status', OLD.status,
          'new_status', NEW.status,
          'opportunity_id', NEW.id
        )
      );
    END IF;
    
    -- Update analytics on status change
    INSERT INTO public.opportunity_analytics (
      opportunity_id,
      view_count,
      like_count,
      application_count,
      last_updated
    ) VALUES (
      NEW.id,
      0,
      0,
      (SELECT COUNT(*) FROM public.opportunity_applications WHERE opportunity_id = NEW.id),
      NOW()
    ) ON CONFLICT (opportunity_id) DO UPDATE SET
      application_count = (SELECT COUNT(*) FROM public.opportunity_applications WHERE opportunity_id = NEW.id),
      last_updated = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create opportunity audit trigger
CREATE OR REPLACE FUNCTION public.audit_opportunity_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.opportunity_audit_log (
    opportunity_id,
    action_type,
    changed_by,
    old_values,
    new_values,
    change_reason
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'CREATE'
      WHEN TG_OP = 'UPDATE' THEN 'UPDATE'
      WHEN TG_OP = 'DELETE' THEN 'DELETE'
      ELSE TG_OP
    END,
    auth.uid(),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(OLD) END,
    CASE WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW) ELSE to_jsonb(NEW) END,
    'Automatic audit log entry'
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Auto-populate analytics when opportunity is created
CREATE OR REPLACE FUNCTION public.init_opportunity_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.opportunity_analytics (
    opportunity_id,
    view_count,
    like_count,
    application_count,
    last_updated
  ) VALUES (
    NEW.id,
    0,
    0,
    0,
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Update application count when applications change
CREATE OR REPLACE FUNCTION public.update_opportunity_application_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.opportunity_analytics 
  SET 
    application_count = (
      SELECT COUNT(*) 
      FROM public.opportunity_applications 
      WHERE opportunity_id = COALESCE(NEW.opportunity_id, OLD.opportunity_id)
    ),
    last_updated = NOW()
  WHERE opportunity_id = COALESCE(NEW.opportunity_id, OLD.opportunity_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create triggers
CREATE TRIGGER opportunity_status_change_trigger
  AFTER UPDATE ON public.partnership_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_opportunity_status_change();

CREATE TRIGGER opportunity_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.partnership_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_opportunity_changes();

CREATE TRIGGER opportunity_analytics_init_trigger
  AFTER INSERT ON public.partnership_opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.init_opportunity_analytics();

CREATE TRIGGER opportunity_application_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.opportunity_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_opportunity_application_count();