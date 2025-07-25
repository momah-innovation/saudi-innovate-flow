-- COMPREHENSIVE INNOVATION MANAGEMENT SYSTEM SCHEMA

-- 1. ENTERPRISE STRUCTURE (Organizational Hierarchy)
CREATE TABLE public.sectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    description TEXT,
    vision_2030_alignment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.deputies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    sector_id UUID REFERENCES public.sectors(id),
    deputy_minister VARCHAR(255),
    contact_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    deputy_id UUID REFERENCES public.deputies(id),
    department_head VARCHAR(255),
    budget_allocation DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    department_id UUID REFERENCES public.departments(id),
    domain_lead VARCHAR(255),
    specialization TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.sub_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    domain_id UUID REFERENCES public.domains(id),
    technical_focus TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    sub_domain_id UUID REFERENCES public.sub_domains(id),
    service_type VARCHAR(100), -- 'digital', 'physical', 'hybrid'
    citizen_facing BOOLEAN DEFAULT false,
    digital_maturity_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. INNOVATION LIFECYCLE CORE
CREATE TABLE public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    title_ar VARCHAR(500),
    description TEXT NOT NULL,
    description_ar TEXT,
    
    -- Organizational linkage
    sector_id UUID REFERENCES public.sectors(id),
    deputy_id UUID REFERENCES public.deputies(id),
    department_id UUID REFERENCES public.departments(id),
    domain_id UUID REFERENCES public.domains(id),
    sub_domain_id UUID REFERENCES public.sub_domains(id),
    service_id UUID REFERENCES public.services(id),
    
    -- Challenge metadata
    priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'evaluation', 'pilot', 'scaled', 'archived'
    challenge_type VARCHAR(100), -- 'operational', 'strategic', 'innovation', 'digital_transformation'
    
    -- Timeline and budget
    start_date DATE,
    end_date DATE,
    estimated_budget DECIMAL,
    actual_budget DECIMAL,
    
    -- Strategic alignment
    vision_2030_goal TEXT,
    kpi_alignment TEXT,
    
    -- Ownership
    challenge_owner_id UUID,
    created_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.focus_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_text_ar TEXT,
    question_type VARCHAR(50), -- 'problem_definition', 'solution_scope', 'constraints', 'success_criteria'
    order_sequence INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    title_ar VARCHAR(500),
    description TEXT NOT NULL,
    description_ar TEXT,
    
    -- Linkage
    challenge_id UUID REFERENCES public.challenges(id),
    focus_question_id UUID REFERENCES public.focus_questions(id),
    innovator_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Idea details
    solution_approach TEXT,
    implementation_plan TEXT,
    expected_impact TEXT,
    resource_requirements TEXT,
    
    -- Evaluation metrics
    feasibility_score INTEGER DEFAULT 0, -- 1-10
    impact_score INTEGER DEFAULT 0, -- 1-10
    innovation_score INTEGER DEFAULT 0, -- 1-10
    alignment_score INTEGER DEFAULT 0, -- 1-10
    overall_score DECIMAL DEFAULT 0,
    
    -- Status tracking
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted', 'under_review', 'approved', 'rejected', 'pilot', 'implemented'
    maturity_level VARCHAR(50) DEFAULT 'concept', -- 'concept', 'prototype', 'mvp', 'production'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.idea_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES public.ideas(id),
    evaluator_id UUID NOT NULL REFERENCES auth.users(id),
    evaluator_type VARCHAR(50), -- 'expert', 'team_member', 'stakeholder'
    
    -- Detailed scoring
    technical_feasibility INTEGER, -- 1-10
    financial_viability INTEGER, -- 1-10
    market_potential INTEGER, -- 1-10
    strategic_alignment INTEGER, -- 1-10
    innovation_level INTEGER, -- 1-10
    implementation_complexity INTEGER, -- 1-10
    
    -- Qualitative feedback
    strengths TEXT,
    weaknesses TEXT,
    recommendations TEXT,
    next_steps TEXT,
    
    evaluation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. STAKEHOLDERS & ROLES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    phone VARCHAR(50),
    department VARCHAR(255),
    position VARCHAR(255),
    bio TEXT,
    profile_image_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.innovators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    innovation_background TEXT,
    areas_of_interest TEXT[],
    experience_level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced', 'expert'
    total_ideas_submitted INTEGER DEFAULT 0,
    total_ideas_approved INTEGER DEFAULT 0,
    innovation_score DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.experts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    expertise_areas TEXT[] NOT NULL,
    certifications TEXT[],
    experience_years INTEGER,
    education_background TEXT,
    consultation_rate DECIMAL,
    availability_status VARCHAR(50) DEFAULT 'available',
    expert_level VARCHAR(50), -- 'junior', 'senior', 'lead', 'principal'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    partner_type VARCHAR(100), -- 'academic', 'private_sector', 'international', 'ngo'
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    capabilities TEXT[],
    funding_capacity DECIMAL,
    collaboration_history TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.innovation_team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    cic_role VARCHAR(50) NOT NULL, -- 'connector', 'promoter', 'enabler'
    specialization TEXT[],
    current_workload INTEGER DEFAULT 0,
    max_concurrent_projects INTEGER DEFAULT 5,
    performance_rating DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. RBAC SYSTEM
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'sector_lead', 'department_head', 'domain_expert', 'evaluator', 'innovator', 'viewer');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE (user_id, role)
);

CREATE TABLE public.role_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50), -- 'challenge', 'idea', 'campaign', 'event'
    entity_id UUID,
    assigned_to_id UUID,
    assigned_to_type VARCHAR(50), -- 'innovator', 'expert', 'partner', 'team_member'
    role VARCHAR(100), -- 'lead', 'contributor', 'reviewer', 'mentor', 'sponsor'
    assignment_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    status VARCHAR(50) DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. ENGAGEMENT & ACTIVATION
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    title_ar VARCHAR(500),
    description TEXT,
    description_ar TEXT,
    theme VARCHAR(255), -- 'quality_of_life', 'urban_design', 'digital_transformation'
    
    -- Timeline
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_deadline DATE,
    
    -- Targets and goals
    target_participants INTEGER,
    target_ideas INTEGER,
    success_metrics TEXT,
    
    -- Campaign details
    budget DECIMAL,
    campaign_manager_id UUID REFERENCES auth.users(id),
    status VARCHAR(50) DEFAULT 'planning', -- 'planning', 'active', 'completed', 'cancelled'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.campaigns(id),
    title VARCHAR(500) NOT NULL,
    title_ar VARCHAR(500),
    description TEXT,
    description_ar TEXT,
    
    event_type VARCHAR(100), -- 'hackathon', 'workshop', 'sandbox', 'pitch_session', 'expert_panel'
    
    -- Event details
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    virtual_link TEXT,
    format VARCHAR(50), -- 'in_person', 'virtual', 'hybrid'
    
    -- Capacity and registration
    max_participants INTEGER,
    registered_participants INTEGER DEFAULT 0,
    actual_participants INTEGER DEFAULT 0,
    
    -- Resources
    budget DECIMAL,
    event_manager_id UUID REFERENCES auth.users(id),
    
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. KNOWLEDGE & TRENDS
CREATE TABLE public.trend_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    title_ar VARCHAR(500),
    content TEXT NOT NULL,
    content_ar TEXT,
    
    -- Classification
    report_type VARCHAR(100), -- 'global_trend', 'local_case_study', 'best_practice', 'technology_forecast'
    sector_tags TEXT[],
    domain_tags TEXT[],
    geographic_scope VARCHAR(100), -- 'global', 'regional', 'national', 'local'
    
    -- Source information
    source_organization VARCHAR(255),
    source_url TEXT,
    publication_date DATE,
    credibility_score INTEGER DEFAULT 5, -- 1-10
    
    -- Relevance scoring
    relevance_score DECIMAL DEFAULT 0,
    impact_potential INTEGER DEFAULT 5, -- 1-10
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trend_report_id UUID REFERENCES public.trend_reports(id),
    insight_text TEXT NOT NULL,
    insight_text_ar TEXT,
    insight_type VARCHAR(100), -- 'opportunity', 'threat', 'best_practice', 'lesson_learned'
    applicable_domains TEXT[],
    actionability_score INTEGER DEFAULT 5, -- 1-10
    extracted_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 7. GOVERNANCE & METRICS
CREATE TABLE public.opportunity_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES public.challenges(id),
    current_stage VARCHAR(50) NOT NULL, -- 'submit', 'screen', 'evaluate', 'approve', 'pilot', 'scale'
    stage_start_date DATE DEFAULT CURRENT_DATE,
    stage_owner_id UUID REFERENCES auth.users(id),
    stage_notes TEXT,
    next_milestone_date DATE,
    stage_completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.challenge_scorecards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES public.challenges(id),
    
    -- KPI scores (1-10)
    strategic_alignment_score INTEGER,
    feasibility_score INTEGER,
    cost_effectiveness_score INTEGER,
    impact_potential_score INTEGER,
    innovation_level_score INTEGER,
    resource_availability_score INTEGER,
    stakeholder_support_score INTEGER,
    
    -- Calculated metrics
    overall_score DECIMAL,
    risk_assessment VARCHAR(50), -- 'low', 'medium', 'high'
    recommendation VARCHAR(100), -- 'proceed', 'modify', 'defer', 'reject'
    
    -- Evaluation metadata
    evaluated_by UUID REFERENCES auth.users(id),
    evaluation_date DATE DEFAULT CURRENT_DATE,
    evaluation_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.implementation_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES public.challenges(id),
    
    -- SLA and timeline
    sla_deadline DATE,
    estimated_completion_date DATE,
    actual_completion_date DATE,
    
    -- Ownership and responsibility
    implementation_owner_id UUID REFERENCES auth.users(id),
    project_manager_id UUID REFERENCES auth.users(id),
    stakeholder_sponsor_id UUID REFERENCES auth.users(id),
    
    -- Financial tracking
    approved_budget DECIMAL,
    spent_budget DECIMAL DEFAULT 0,
    remaining_budget DECIMAL,
    
    -- Progress tracking
    implementation_stage VARCHAR(100),
    completion_percentage INTEGER DEFAULT 0,
    milestones_completed INTEGER DEFAULT 0,
    total_milestones INTEGER,
    
    -- Status and health
    health_status VARCHAR(50) DEFAULT 'on_track', -- 'on_track', 'at_risk', 'delayed', 'critical'
    last_update_date DATE DEFAULT CURRENT_DATE,
    next_review_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE public.innovation_maturity_index (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Scope of measurement
    measurement_scope VARCHAR(50), -- 'ministry', 'sector', 'department', 'domain'
    scope_id UUID, -- ID of the organizational unit
    
    -- Maturity dimensions (scores 1-5)
    strategy_maturity INTEGER,
    process_maturity INTEGER,
    technology_maturity INTEGER,
    culture_maturity INTEGER,
    governance_maturity INTEGER,
    
    -- Calculated index
    overall_maturity_score DECIMAL,
    maturity_level VARCHAR(50), -- 'initial', 'developing', 'defined', 'managed', 'optimizing'
    
    -- Benchmarking
    national_benchmark_score DECIMAL,
    international_benchmark_score DECIMAL,
    
    -- Assessment metadata
    assessment_period VARCHAR(50), -- 'Q1_2024', 'H1_2024', '2024'
    assessment_date DATE DEFAULT CURRENT_DATE,
    assessed_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deputies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.implementation_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.innovation_maturity_index ENABLE ROW LEVEL SECURITY;

-- CREATE SECURITY DEFINER FUNCTION FOR ROLE CHECKING
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;

-- CREATE BASIC RLS POLICIES
-- Profiles - users can view and update their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ideas - users can view all ideas, create their own, and update their own
CREATE POLICY "Anyone can view ideas" ON public.ideas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create their own ideas" ON public.ideas
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = innovator_id);

CREATE POLICY "Users can update their own ideas" ON public.ideas
  FOR UPDATE TO authenticated USING (auth.uid() = innovator_id);

-- Challenges - basic viewing for authenticated users
CREATE POLICY "Authenticated users can view challenges" ON public.challenges
  FOR SELECT TO authenticated USING (true);

-- Admin policies for critical tables
CREATE POLICY "Admins can manage sectors" ON public.sectors
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- PERFORMANCE INDEXES
CREATE INDEX idx_challenges_sector ON public.challenges(sector_id);
CREATE INDEX idx_challenges_status ON public.challenges(status);
CREATE INDEX idx_ideas_challenge ON public.ideas(challenge_id);
CREATE INDEX idx_ideas_innovator ON public.ideas(innovator_id);
CREATE INDEX idx_role_assignments_entity ON public.role_assignments(entity_type, entity_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_active ON public.user_roles(user_id, is_active) WHERE is_active = true;

-- MULTILINGUAL FULL-TEXT SEARCH INDEXES
CREATE INDEX idx_challenges_search_en ON public.challenges USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_challenges_search_ar ON public.challenges USING gin(to_tsvector('arabic', COALESCE(title_ar, '') || ' ' || COALESCE(description_ar, '')));
CREATE INDEX idx_ideas_search_en ON public.ideas USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_ideas_search_ar ON public.ideas USING gin(to_tsvector('arabic', COALESCE(title_ar, '') || ' ' || COALESCE(description_ar, '')));

-- CREATE FUNCTION FOR AUTOMATIC TIMESTAMP UPDATES
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ADD TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
CREATE TRIGGER update_sectors_updated_at BEFORE UPDATE ON public.sectors FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_challenges_updated_at BEFORE UPDATE ON public.challenges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON public.ideas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();