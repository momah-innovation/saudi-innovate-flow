-- Create entities table to represent actual organizations within sectors
CREATE TABLE public.entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  sector_id UUID NOT NULL REFERENCES public.sectors(id) ON DELETE CASCADE,
  entity_manager_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_type VARCHAR(50) NOT NULL DEFAULT 'government', -- government, private, semi_private
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, inactive, suspended
  establishment_date DATE,
  headquarters_location TEXT,
  website_url TEXT,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  budget_allocation DECIMAL(15,2),
  employee_count INTEGER,
  vision_ar TEXT,
  vision_en TEXT,
  mission_ar TEXT,
  mission_en TEXT,
  logo_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add entity_id to organizational structure tables
ALTER TABLE public.deputies ADD COLUMN entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE;
ALTER TABLE public.departments ADD COLUMN entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE;
ALTER TABLE public.domains ADD COLUMN entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE;
ALTER TABLE public.sub_domains ADD COLUMN entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE;
ALTER TABLE public.services ADD COLUMN entity_id UUID REFERENCES public.entities(id) ON DELETE CASCADE;

-- Create entity_analytics table for tracking
CREATE TABLE public.entity_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  total_deputies INTEGER DEFAULT 0,
  total_departments INTEGER DEFAULT 0,
  total_domains INTEGER DEFAULT 0,
  total_sub_domains INTEGER DEFAULT 0,
  total_services INTEGER DEFAULT 0,
  innovation_projects_count INTEGER DEFAULT 0,
  challenges_created INTEGER DEFAULT 0,
  ideas_submitted INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(entity_id)
);

-- Create entity_manager_assignments table for tracking manager history
CREATE TABLE public.entity_manager_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  manager_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  revoked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  assignment_notes TEXT
);

-- Enable RLS on all new tables
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_manager_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for entities
CREATE POLICY "Super admins can manage all entities" 
ON public.entities FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Entity managers can view and update their entities" 
ON public.entities FOR ALL 
TO authenticated 
USING (entity_manager_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (entity_manager_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Everyone can view active entities" 
ON public.entities FOR SELECT 
TO authenticated 
USING (status = 'active');

-- Create RLS policies for entity_analytics
CREATE POLICY "Admins and entity managers can view analytics" 
ON public.entity_analytics FOR SELECT 
TO authenticated 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  EXISTS (SELECT 1 FROM public.entities e WHERE e.id = entity_id AND e.entity_manager_id = auth.uid())
);

CREATE POLICY "System can update analytics" 
ON public.entity_analytics FOR ALL 
TO authenticated 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role)
);

-- Create RLS policies for entity_manager_assignments
CREATE POLICY "Super admins can manage all assignments" 
ON public.entity_manager_assignments FOR ALL 
TO authenticated 
USING (has_role(auth.uid(), 'super_admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'super_admin'::app_role));

CREATE POLICY "Admins can view assignments" 
ON public.entity_manager_assignments FOR SELECT 
TO authenticated 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  manager_id = auth.uid()
);

-- Update organizational structure RLS policies to include entity context
DROP POLICY IF EXISTS "Team members can manage departments" ON public.departments;
CREATE POLICY "Team members and entity managers can manage departments" 
ON public.departments FOR ALL 
TO authenticated 
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  EXISTS (SELECT 1 FROM public.entities e WHERE e.id = entity_id AND e.entity_manager_id = auth.uid())
)
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'super_admin'::app_role) OR
  EXISTS (SELECT 1 FROM public.entities e WHERE e.id = entity_id AND e.entity_manager_id = auth.uid())
);

-- Create function to update entity analytics
CREATE OR REPLACE FUNCTION public.update_entity_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update analytics for the affected entity
  INSERT INTO public.entity_analytics (
    entity_id, 
    total_deputies, 
    total_departments, 
    total_domains, 
    total_sub_domains, 
    total_services
  )
  SELECT 
    COALESCE(NEW.entity_id, OLD.entity_id),
    (SELECT COUNT(*) FROM public.deputies WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id)),
    (SELECT COUNT(*) FROM public.departments WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id)),
    (SELECT COUNT(*) FROM public.domains WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id)),
    (SELECT COUNT(*) FROM public.sub_domains WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id)),
    (SELECT COUNT(*) FROM public.services WHERE entity_id = COALESCE(NEW.entity_id, OLD.entity_id))
  ON CONFLICT (entity_id) DO UPDATE SET
    total_deputies = EXCLUDED.total_deputies,
    total_departments = EXCLUDED.total_departments,
    total_domains = EXCLUDED.total_domains,
    total_sub_domains = EXCLUDED.total_sub_domains,
    total_services = EXCLUDED.total_services,
    last_updated = now();
    
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic analytics updates
CREATE TRIGGER update_entity_analytics_on_deputies
  AFTER INSERT OR UPDATE OR DELETE ON public.deputies
  FOR EACH ROW EXECUTE FUNCTION public.update_entity_analytics();

CREATE TRIGGER update_entity_analytics_on_departments
  AFTER INSERT OR UPDATE OR DELETE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_entity_analytics();

CREATE TRIGGER update_entity_analytics_on_domains
  AFTER INSERT OR UPDATE OR DELETE ON public.domains
  FOR EACH ROW EXECUTE FUNCTION public.update_entity_analytics();

CREATE TRIGGER update_entity_analytics_on_sub_domains
  AFTER INSERT OR UPDATE OR DELETE ON public.sub_domains
  FOR EACH ROW EXECUTE FUNCTION public.update_entity_analytics();

CREATE TRIGGER update_entity_analytics_on_services
  AFTER INSERT OR UPDATE OR DELETE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_entity_analytics();

-- Create function to handle entity manager assignment
CREATE OR REPLACE FUNCTION public.assign_entity_manager(
  p_entity_id UUID,
  p_manager_id UUID,
  p_assignment_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  assignment_id UUID;
BEGIN
  -- Only super admins can assign entity managers
  IF NOT has_role(auth.uid(), 'super_admin'::app_role) THEN
    RAISE EXCEPTION 'Only super admins can assign entity managers';
  END IF;
  
  -- Revoke any existing active assignments
  UPDATE public.entity_manager_assignments 
  SET is_active = false, revoked_at = now(), revoked_by = auth.uid()
  WHERE entity_id = p_entity_id AND is_active = true;
  
  -- Update entity table
  UPDATE public.entities 
  SET entity_manager_id = p_manager_id, updated_at = now()
  WHERE id = p_entity_id;
  
  -- Create new assignment record
  INSERT INTO public.entity_manager_assignments (
    entity_id, manager_id, assigned_by, assignment_notes
  ) VALUES (
    p_entity_id, p_manager_id, auth.uid(), p_assignment_notes
  ) RETURNING id INTO assignment_id;
  
  RETURN assignment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX idx_entities_sector_id ON public.entities(sector_id);
CREATE INDEX idx_entities_manager_id ON public.entities(entity_manager_id);
CREATE INDEX idx_entities_status ON public.entities(status);
CREATE INDEX idx_deputies_entity_id ON public.deputies(entity_id);
CREATE INDEX idx_departments_entity_id ON public.departments(entity_id);
CREATE INDEX idx_domains_entity_id ON public.domains(entity_id);
CREATE INDEX idx_sub_domains_entity_id ON public.sub_domains(entity_id);
CREATE INDEX idx_services_entity_id ON public.services(entity_id);
CREATE INDEX idx_entity_manager_assignments_entity_id ON public.entity_manager_assignments(entity_id);
CREATE INDEX idx_entity_manager_assignments_manager_id ON public.entity_manager_assignments(manager_id);
CREATE INDEX idx_entity_manager_assignments_active ON public.entity_manager_assignments(is_active) WHERE is_active = true;