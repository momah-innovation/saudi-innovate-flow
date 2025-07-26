-- Create stakeholders table
CREATE TABLE public.stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name CHARACTER VARYING NOT NULL,
  name_ar CHARACTER VARYING,
  organization CHARACTER VARYING,
  position CHARACTER VARYING,
  email CHARACTER VARYING,
  phone CHARACTER VARYING,
  stakeholder_type CHARACTER VARYING DEFAULT 'government',
  influence_level CHARACTER VARYING DEFAULT 'medium',
  interest_level CHARACTER VARYING DEFAULT 'medium',
  engagement_status CHARACTER VARYING DEFAULT 'neutral',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "All users can view stakeholders" 
ON public.stakeholders 
FOR SELECT 
USING (true);

CREATE POLICY "Team members can manage stakeholders" 
ON public.stakeholders 
FOR ALL
USING (
  (EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  )) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add trigger for updated_at
CREATE TRIGGER update_stakeholders_updated_at
BEFORE UPDATE ON public.stakeholders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with mock data
INSERT INTO public.stakeholders (name, name_ar, organization, position, email, phone, stakeholder_type, influence_level, interest_level, engagement_status, notes) VALUES
('Dr. Ahmed Al-Rashid', 'د. أحمد الراشد', 'Ministry of Innovation', 'Director of Digital Transformation', 'ahmed.rashid@innovation.gov.sa', '+966501234567', 'government', 'high', 'high', 'supporter', 'Key decision maker for innovation initiatives'),
('Sarah Johnson', NULL, 'Tech Innovations Ltd', 'CEO', 'sarah.johnson@techinnovations.com', '+966507654321', 'private_sector', 'high', 'medium', 'active', 'Potential partner for technology implementation'),
('Prof. Mohammed Al-Zahra', 'د. محمد الزهراء', 'King Saud University', 'Professor of Computer Science', 'mohammed.zahra@ksu.edu.sa', '+966509876543', 'academic', 'medium', 'high', 'supporter', 'Research collaboration opportunities'),
('Fatima Al-Mansouri', 'فاطمة المنصوري', 'Innovation Hub Foundation', 'Program Director', 'fatima.mansouri@ihf.org.sa', '+966502468135', 'ngo', 'medium', 'high', 'active', 'Community outreach and engagement'),
('Robert Chen', NULL, 'Global Tech Ventures', 'Investment Director', 'robert.chen@globaltech.com', '+966505551234', 'private_sector', 'high', 'medium', 'neutral', 'Potential investor for scaling innovations');