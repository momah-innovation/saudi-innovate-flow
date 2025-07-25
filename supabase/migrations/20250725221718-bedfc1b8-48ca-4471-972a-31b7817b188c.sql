-- Add expert assignment and partner organization linking to challenges
-- These fields will only be visible/editable by team members

-- Add columns to link challenges with experts and partners
ALTER TABLE public.challenges 
ADD COLUMN assigned_expert_id uuid REFERENCES public.experts(id),
ADD COLUMN partner_organization_id uuid REFERENCES public.partners(id),
ADD COLUMN internal_team_notes text,
ADD COLUMN collaboration_details text;

-- Create a junction table for multiple expert assignments per challenge
CREATE TABLE public.challenge_experts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    expert_id uuid NOT NULL REFERENCES public.experts(id) ON DELETE CASCADE,
    role_type varchar(50) DEFAULT 'evaluator', -- evaluator, advisor, lead_expert, reviewer
    assignment_date timestamptz DEFAULT now(),
    status varchar(20) DEFAULT 'active', -- active, inactive, completed
    notes text,
    created_at timestamptz DEFAULT now(),
    UNIQUE(challenge_id, expert_id, role_type)
);

-- Create a junction table for multiple partner organizations per challenge  
CREATE TABLE public.challenge_partners (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    partner_id uuid NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    partnership_type varchar(50) DEFAULT 'collaborator', -- sponsor, collaborator, implementation_partner, advisor
    partnership_start_date date,
    partnership_end_date date,
    contribution_details text,
    funding_amount numeric(15,2),
    status varchar(20) DEFAULT 'active', -- active, inactive, completed, proposed
    created_at timestamptz DEFAULT now(),
    UNIQUE(challenge_id, partner_id, partnership_type)
);

-- Enable RLS on the new tables
ALTER TABLE public.challenge_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_partners ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for challenge_experts (team members only)
CREATE POLICY "Team members can view challenge experts" 
ON public.challenge_experts 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage challenge experts" 
ON public.challenge_experts 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create RLS policies for challenge_partners (team members only)
CREATE POLICY "Team members can view challenge partners" 
ON public.challenge_partners 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage challenge partners" 
ON public.challenge_partners 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM innovation_team_members itm 
        WHERE itm.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Add some sample organizations/partners for testing
INSERT INTO public.partners (name, name_ar, partner_type, status, capabilities, contact_person, email) VALUES
('Saudi Aramco', 'أرامكو السعودية', 'corporate', 'active', ARRAY['technology', 'energy', 'innovation'], 'Ahmed Al-Rashid', 'ahmed.rashid@aramco.com'),
('King Fahd University of Petroleum & Minerals', 'جامعة الملك فهد للبترول والمعادن', 'academic', 'active', ARRAY['research', 'education', 'technology'], 'Dr. Sarah Al-Mansouri', 'sarah.mansouri@kfupm.edu.sa'),
('Saudi Technology Development and Investment Company (TAQNIA)', 'شركة التقنية للاستثمار والتطوير', 'government', 'active', ARRAY['technology', 'investment', 'development'], 'Omar Al-Zahrani', 'omar.zahrani@taqnia.com'),
('Elm Information Security', 'شركة علم لأمن المعلومات', 'technology', 'active', ARRAY['cybersecurity', 'digital_services', 'AI'], 'Fatima Al-Qureshi', 'fatima.qureshi@elm.sa'),
('Saudi Research & Marketing Group', 'مجموعة البحوث والتسويق السعودية', 'media', 'active', ARRAY['media', 'research', 'marketing'], 'Mohammed Al-Dubaikhi', 'mohammed.dubaikhi@srmg.com');

-- Add indexes for better performance
CREATE INDEX idx_challenge_experts_challenge_id ON public.challenge_experts(challenge_id);
CREATE INDEX idx_challenge_experts_expert_id ON public.challenge_experts(expert_id);
CREATE INDEX idx_challenge_partners_challenge_id ON public.challenge_partners(challenge_id);
CREATE INDEX idx_challenge_partners_partner_id ON public.challenge_partners(partner_id);
CREATE INDEX idx_challenges_assigned_expert ON public.challenges(assigned_expert_id);
CREATE INDEX idx_challenges_partner_org ON public.challenges(partner_organization_id);