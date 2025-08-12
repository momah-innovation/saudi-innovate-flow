-- =============================================
-- COMPLETE ORGANIZATIONAL HIERARCHY MIGRATION (FIXED)
-- Sectors ➝ Entity ➝ Deputies ➝ Departments ➝ Domains ➝ Sub-domains ➝ Services
-- =============================================

-- 1. Add entity_id to all hierarchical tables that are missing it
ALTER TABLE public.deputies ADD COLUMN IF NOT EXISTS entity_id UUID;
ALTER TABLE public.domains ADD COLUMN IF NOT EXISTS department_id UUID;
ALTER TABLE public.sub_domains ADD COLUMN IF NOT EXISTS domain_id UUID;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sub_domain_id UUID;

-- 2. Create foreign key constraints for proper hierarchy
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_deputies_entity') THEN
        ALTER TABLE public.deputies ADD CONSTRAINT fk_deputies_entity FOREIGN KEY (entity_id) REFERENCES public.entities(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_departments_deputy') THEN
        ALTER TABLE public.departments ADD CONSTRAINT fk_departments_deputy FOREIGN KEY (deputy_id) REFERENCES public.deputies(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_domains_department') THEN
        ALTER TABLE public.domains ADD CONSTRAINT fk_domains_department FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_sub_domains_domain') THEN
        ALTER TABLE public.sub_domains ADD CONSTRAINT fk_sub_domains_domain FOREIGN KEY (domain_id) REFERENCES public.domains(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_services_sub_domain') THEN
        ALTER TABLE public.services ADD CONSTRAINT fk_services_sub_domain FOREIGN KEY (sub_domain_id) REFERENCES public.sub_domains(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. Create organization and organization_members tables
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar VARCHAR NOT NULL,
  name_en VARCHAR,
  organization_type VARCHAR DEFAULT 'government',
  description_ar TEXT,
  description_en TEXT,
  website_url TEXT,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  address_ar TEXT,
  address_en TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  member_role VARCHAR DEFAULT 'member',
  department VARCHAR,
  position VARCHAR,
  join_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR DEFAULT 'active',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- 4. Create focus_question_entity_links table
CREATE TABLE IF NOT EXISTS public.focus_question_entity_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  focus_question_id UUID NOT NULL REFERENCES public.focus_questions(id) ON DELETE CASCADE,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Create focus_question_challenge_links table
CREATE TABLE IF NOT EXISTS public.focus_question_challenge_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  focus_question_id UUID NOT NULL REFERENCES public.focus_questions(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
  relevance_score INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(focus_question_id, challenge_id)
);

-- 6. Create user_entity_assignments table
CREATE TABLE IF NOT EXISTS public.user_entity_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  assignment_role VARCHAR NOT NULL,
  assigned_by UUID,
  assignment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR DEFAULT 'active',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, entity_type, entity_id)
);

-- 7. Create team_entity_assignments table
CREATE TABLE IF NOT EXISTS public.team_entity_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.innovation_teams(id) ON DELETE CASCADE,
  entity_type VARCHAR NOT NULL,
  entity_id UUID NOT NULL,
  assignment_type VARCHAR DEFAULT 'support',
  assigned_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 8. Enable RLS on new tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_question_entity_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_question_challenge_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_entity_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_entity_assignments ENABLE ROW LEVEL SECURITY;

-- 9. Add the organization_member role to role hierarchy (corrected)
INSERT INTO public.role_hierarchy (role, hierarchy_level, can_assign_roles, requires_approval_for)
VALUES (
  'organization_member'::app_role, 
  'specialist'::hierarchy_level, 
  ARRAY[]::app_role[], 
  ARRAY[]::app_role[]
) ON CONFLICT (role) DO NOTHING;

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deputies_entity_id ON public.deputies(entity_id);
CREATE INDEX IF NOT EXISTS idx_departments_deputy_id ON public.departments(deputy_id);
CREATE INDEX IF NOT EXISTS idx_domains_department_id ON public.domains(department_id);
CREATE INDEX IF NOT EXISTS idx_sub_domains_domain_id ON public.sub_domains(domain_id);
CREATE INDEX IF NOT EXISTS idx_services_sub_domain_id ON public.services(sub_domain_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON public.organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_org_id ON public.organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_user_entity_assignments_user_id ON public.user_entity_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_question_entity_links_entity ON public.focus_question_entity_links(entity_type, entity_id);