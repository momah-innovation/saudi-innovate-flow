-- Temporarily allow null values in the changed_by column
ALTER TABLE idea_versions ALTER COLUMN changed_by DROP NOT NULL;

-- Drop any remaining triggers that might interfere
DROP TRIGGER IF EXISTS create_idea_version_snapshot ON ideas;

-- Update ideas table
UPDATE ideas 
SET status = CASE 
  WHEN status = 'submitted' THEN 'status.submitted'
  WHEN status = 'under_review' THEN 'status.under_review'
  WHEN status = 'approved' THEN 'status.approved'
  WHEN status = 'rejected' THEN 'status.rejected'
  WHEN status = 'in_development' THEN 'status.in_development'
  WHEN status = 'implemented' THEN 'status.implemented'
  WHEN status = 'archived' THEN 'status.archived'
  ELSE status
END
WHERE status IN ('submitted', 'under_review', 'approved', 'rejected', 'in_development', 'implemented', 'archived');

-- Update challenges table
UPDATE challenges 
SET status = CASE 
  WHEN status = 'draft' THEN 'status.draft'
  WHEN status = 'published' THEN 'status.published'
  WHEN status = 'active' THEN 'status.active'
  WHEN status = 'closed' THEN 'status.closed'
  WHEN status = 'archived' THEN 'status.archived'
  ELSE status
END
WHERE status IN ('draft', 'published', 'active', 'closed', 'archived');

UPDATE challenges 
SET challenge_type = CASE 
  WHEN challenge_type = 'innovation' THEN 'challenge_type.innovation'
  WHEN challenge_type = 'improvement' THEN 'challenge_type.improvement'
  WHEN challenge_type = 'research' THEN 'challenge_type.research'
  WHEN challenge_type = 'technology' THEN 'challenge_type.technology'
  ELSE challenge_type
END
WHERE challenge_type IN ('innovation', 'improvement', 'research', 'technology');

UPDATE challenges 
SET sensitivity_level = CASE 
  WHEN sensitivity_level = 'normal' THEN 'sensitivity.normal'
  WHEN sensitivity_level = 'sensitive' THEN 'sensitivity.sensitive'
  WHEN sensitivity_level = 'classified' THEN 'sensitivity.classified'
  ELSE sensitivity_level
END
WHERE sensitivity_level IN ('normal', 'sensitive', 'classified');

-- Update campaigns table
UPDATE campaigns 
SET status = CASE 
  WHEN status = 'planning' THEN 'status.planning'
  WHEN status = 'active' THEN 'status.active'
  WHEN status = 'paused' THEN 'status.paused'
  WHEN status = 'completed' THEN 'status.completed'
  WHEN status = 'cancelled' THEN 'status.cancelled'
  ELSE status
END
WHERE status IN ('planning', 'active', 'paused', 'completed', 'cancelled');

-- Update events table
UPDATE events 
SET status = CASE 
  WHEN status = 'draft' THEN 'status.draft'
  WHEN status = 'published' THEN 'status.published'
  WHEN status = 'registration_open' THEN 'status.registration_open'
  WHEN status = 'registration_closed' THEN 'status.registration_closed'
  WHEN status = 'ongoing' THEN 'status.ongoing'
  WHEN status = 'completed' THEN 'status.completed'
  WHEN status = 'cancelled' THEN 'status.cancelled'
  ELSE status
END
WHERE status IN ('draft', 'published', 'registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled');

UPDATE events 
SET format = CASE 
  WHEN format = 'in_person' THEN 'format.in_person'
  WHEN format = 'virtual' THEN 'format.virtual'
  WHEN format = 'hybrid' THEN 'format.hybrid'
  ELSE format
END
WHERE format IN ('in_person', 'virtual', 'hybrid');

-- Update opportunities table
UPDATE opportunities 
SET status = CASE 
  WHEN status = 'open' THEN 'status.open'
  WHEN status = 'closed' THEN 'status.closed'
  WHEN status = 'paused' THEN 'status.paused'
  WHEN status = 'draft' THEN 'status.draft'
  ELSE status
END
WHERE status IN ('open', 'closed', 'paused', 'draft');

UPDATE opportunities 
SET opportunity_type = CASE 
  WHEN opportunity_type = 'partnership' THEN 'opportunity_type.partnership'
  WHEN opportunity_type = 'investment' THEN 'opportunity_type.investment'
  WHEN opportunity_type = 'collaboration' THEN 'opportunity_type.collaboration'
  WHEN opportunity_type = 'procurement' THEN 'opportunity_type.procurement'
  ELSE opportunity_type
END
WHERE opportunity_type IN ('partnership', 'investment', 'collaboration', 'procurement');

UPDATE opportunities 
SET visibility = CASE 
  WHEN visibility = 'public' THEN 'visibility.public'
  WHEN visibility = 'private' THEN 'visibility.private'
  WHEN visibility = 'internal' THEN 'visibility.internal'
  ELSE visibility
END
WHERE visibility IN ('public', 'private', 'internal');

-- Update partners table
UPDATE partners 
SET status = CASE 
  WHEN status = 'active' THEN 'status.active'
  WHEN status = 'inactive' THEN 'status.inactive'
  WHEN status = 'pending' THEN 'status.pending'
  WHEN status = 'suspended' THEN 'status.suspended'
  ELSE status
END
WHERE status IN ('active', 'inactive', 'pending', 'suspended');

-- Restore the not null constraint and recreate trigger
ALTER TABLE idea_versions ALTER COLUMN changed_by SET NOT NULL;

-- Recreate the trigger with proper null handling
CREATE OR REPLACE FUNCTION public.create_idea_version_snapshot()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
    IF OLD.title_ar IS DISTINCT FROM NEW.title_ar OR 
       OLD.description_ar IS DISTINCT FROM NEW.description_ar OR
       OLD.status IS DISTINCT FROM NEW.status OR
       OLD.solution_approach IS DISTINCT FROM NEW.solution_approach OR
       OLD.implementation_plan IS DISTINCT FROM NEW.implementation_plan THEN
       
        -- Only create version if we have a valid user
        IF auth.uid() IS NOT NULL THEN
            INSERT INTO public.idea_versions (
                idea_id,
                version_number,
                changes_summary,
                changed_by,
                field_changes
            ) VALUES (
                NEW.id,
                COALESCE((SELECT MAX(version_number) FROM public.idea_versions WHERE idea_id = NEW.id), 0) + 1,
                CASE 
                    WHEN OLD.status IS DISTINCT FROM NEW.status THEN 'تغيير الحالة من ' || OLD.status || ' إلى ' || NEW.status
                    ELSE 'تحديث محتوى الفكرة'
                END,
                auth.uid(),
                jsonb_build_object(
                    'title_ar', jsonb_build_object('old', OLD.title_ar, 'new', NEW.title_ar),
                    'description_ar', jsonb_build_object('old', OLD.description_ar, 'new', NEW.description_ar),
                    'status', jsonb_build_object('old', OLD.status, 'new', NEW.status)
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$function$;

CREATE TRIGGER create_idea_version_snapshot
    BEFORE UPDATE ON ideas
    FOR EACH ROW
    EXECUTE FUNCTION create_idea_version_snapshot();