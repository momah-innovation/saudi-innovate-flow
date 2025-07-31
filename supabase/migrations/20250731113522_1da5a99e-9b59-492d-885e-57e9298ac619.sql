-- Partnership Opportunities Table
CREATE TABLE public.partnership_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  description_ar TEXT NOT NULL,
  description_en TEXT,
  opportunity_type VARCHAR(50) NOT NULL DEFAULT 'sponsorship',
  budget_min NUMERIC,
  budget_max NUMERIC,
  deadline DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'open',
  sector_id UUID REFERENCES public.sectors(id),
  department_id UUID REFERENCES public.departments(id),
  contact_person VARCHAR(255),
  contact_email VARCHAR(255),
  requirements JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Partnership Applications Table
CREATE TABLE public.partnership_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES public.partnership_opportunities(id) ON DELETE CASCADE,
  applicant_user_id UUID REFERENCES auth.users(id) NOT NULL,
  partner_id UUID REFERENCES public.partners(id),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50),
  proposed_contribution NUMERIC,
  company_background TEXT,
  proposal_summary TEXT NOT NULL,
  supporting_documents JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Partnership Analytics Table
CREATE TABLE public.partnership_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES public.partners(id),
  partnership_type VARCHAR(50) NOT NULL,
  partnership_id UUID NOT NULL,
  metric_name VARCHAR(100) NOT NULL,
  metric_value NUMERIC NOT NULL,
  measurement_date DATE DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partnership_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Opportunities
CREATE POLICY "Anyone can view open opportunities" ON public.partnership_opportunities
FOR SELECT USING (status = 'open');

CREATE POLICY "Team members can manage opportunities" ON public.partnership_opportunities
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.innovation_team_members itm 
          WHERE itm.user_id = auth.uid() AND itm.status = 'active')
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for Applications
CREATE POLICY "Users can view their own applications" ON public.partnership_applications
FOR SELECT USING (applicant_user_id = auth.uid());

CREATE POLICY "Users can create applications" ON public.partnership_applications
FOR INSERT WITH CHECK (applicant_user_id = auth.uid());

CREATE POLICY "Users can update their pending applications" ON public.partnership_applications
FOR UPDATE USING (
  applicant_user_id = auth.uid() AND status = 'pending'
);

CREATE POLICY "Team members can view all applications" ON public.partnership_applications
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.innovation_team_members itm 
          WHERE itm.user_id = auth.uid() AND itm.status = 'active')
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can update application status" ON public.partnership_applications
FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.innovation_team_members itm 
          WHERE itm.user_id = auth.uid() AND itm.status = 'active')
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for Analytics
CREATE POLICY "Partners can view their own analytics" ON public.partnership_analytics
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.partners p 
          WHERE p.id = partnership_analytics.partner_id 
          AND p.email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

CREATE POLICY "Team members can view all analytics" ON public.partnership_analytics
FOR ALL USING (
  EXISTS (SELECT 1 FROM public.innovation_team_members itm 
          WHERE itm.user_id = auth.uid() AND itm.status = 'active')
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Add indexes for performance
CREATE INDEX idx_partnership_opportunities_status ON public.partnership_opportunities(status);
CREATE INDEX idx_partnership_opportunities_deadline ON public.partnership_opportunities(deadline);
CREATE INDEX idx_partnership_applications_status ON public.partnership_applications(status);
CREATE INDEX idx_partnership_applications_user ON public.partnership_applications(applicant_user_id);
CREATE INDEX idx_partnership_analytics_partner ON public.partnership_analytics(partner_id);

-- Add triggers for updated_at
CREATE TRIGGER update_partnership_opportunities_updated_at
  BEFORE UPDATE ON public.partnership_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_partnership_applications_updated_at
  BEFORE UPDATE ON public.partnership_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();