-- Create missing tables for event relationships

-- Create partners table if not exists
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  partner_type VARCHAR(50) DEFAULT 'corporate',
  logo_url TEXT,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(255),
  address TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stakeholders table if not exists  
CREATE TABLE IF NOT EXISTS public.stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255),
  organization VARCHAR(255) NOT NULL,
  position VARCHAR(255),
  stakeholder_type VARCHAR(50) NOT NULL DEFAULT 'خاص',
  engagement_status VARCHAR(50) DEFAULT 'نشط',
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create focus_questions table if not exists
CREATE TABLE IF NOT EXISTS public.focus_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_text_ar TEXT NOT NULL,
  question_text TEXT,
  question_type VARCHAR(50) DEFAULT 'open_ended',
  is_sensitive BOOLEAN DEFAULT false,
  category VARCHAR(100),
  order_sequence INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event_stakeholders table for invitation/attendance tracking
CREATE TABLE IF NOT EXISTS public.event_stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  stakeholder_id UUID NOT NULL,
  invitation_status VARCHAR(50) DEFAULT 'pending',
  attendance_status VARCHAR(50) DEFAULT 'pending',
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, stakeholder_id)
);

-- Add foreign key constraints
ALTER TABLE public.event_partner_links 
ADD CONSTRAINT fk_event_partner_links_partner 
FOREIGN KEY (partner_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.event_partner_links 
ADD CONSTRAINT fk_event_partner_links_event 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_challenge_links 
ADD CONSTRAINT fk_event_challenge_links_challenge 
FOREIGN KEY (challenge_id) REFERENCES public.challenges(id) ON DELETE CASCADE;

ALTER TABLE public.event_challenge_links 
ADD CONSTRAINT fk_event_challenge_links_event 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_focus_question_links 
ADD CONSTRAINT fk_event_focus_question_links_question 
FOREIGN KEY (focus_question_id) REFERENCES public.focus_questions(id) ON DELETE CASCADE;

ALTER TABLE public.event_focus_question_links 
ADD CONSTRAINT fk_event_focus_question_links_event 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_stakeholders 
ADD CONSTRAINT fk_event_stakeholders_event 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE public.event_stakeholders 
ADD CONSTRAINT fk_event_stakeholders_stakeholder 
FOREIGN KEY (stakeholder_id) REFERENCES public.stakeholders(id) ON DELETE CASCADE;

-- Enable RLS on new tables
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_stakeholders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view partners" ON public.partners FOR SELECT USING (true);
CREATE POLICY "Team members can manage partners" ON public.partners FOR ALL USING (
  EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Anyone can view stakeholders" ON public.stakeholders FOR SELECT USING (true);
CREATE POLICY "Team members can manage stakeholders" ON public.stakeholders FOR ALL USING (
  EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Anyone can view focus questions" ON public.focus_questions FOR SELECT USING (true);
CREATE POLICY "Team members can manage focus questions" ON public.focus_questions FOR ALL USING (
  EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage event stakeholders" ON public.event_stakeholders FOR ALL USING (
  EXISTS (SELECT 1 FROM innovation_team_members itm WHERE itm.user_id = auth.uid()) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add updated_at triggers
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stakeholders_updated_at BEFORE UPDATE ON public.stakeholders  
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_focus_questions_updated_at BEFORE UPDATE ON public.focus_questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();