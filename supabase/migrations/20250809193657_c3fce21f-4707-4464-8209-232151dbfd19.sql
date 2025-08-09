-- Create opportunity participants table
CREATE TABLE public.opportunity_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  user_id UUID NOT NULL,
  participation_type VARCHAR(50) DEFAULT 'applicant',
  status VARCHAR(50) DEFAULT 'applied',
  notes TEXT,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(opportunity_id, user_id)
);

-- Create opportunity experts table
CREATE TABLE public.opportunity_experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  expert_id UUID NOT NULL,
  role_type VARCHAR(50) DEFAULT 'evaluator',
  status VARCHAR(50) DEFAULT 'active',
  assignment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(opportunity_id, expert_id)
);

-- Create opportunity feedback table
CREATE TABLE public.opportunity_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(opportunity_id, user_id)
);

-- Create opportunity comments table
CREATE TABLE public.opportunity_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID,
  likes_count INTEGER DEFAULT 0,
  is_expert_comment BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create opportunity notifications table
CREATE TABLE public.opportunity_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create campaign analytics table
CREATE TABLE public.campaign_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  participant_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0.0,
  conversion_rate NUMERIC DEFAULT 0.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create campaign comments table
CREATE TABLE public.campaign_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID,
  likes_count INTEGER DEFAULT 0,
  is_expert_comment BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create campaign feedback table
CREATE TABLE public.campaign_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- Create campaign notifications table
CREATE TABLE public.campaign_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create campaign participants table
CREATE TABLE public.campaign_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL,
  user_id UUID NOT NULL,
  participation_type VARCHAR(50) DEFAULT 'participant',
  status VARCHAR(50) DEFAULT 'registered',
  notes TEXT,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

-- Create partner comments table
CREATE TABLE public.partner_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID,
  likes_count INTEGER DEFAULT 0,
  is_expert_comment BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create partner feedback table
CREATE TABLE public.partner_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(partner_id, user_id)
);

-- Create partner notifications table
CREATE TABLE public.partner_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create partner analytics table
CREATE TABLE public.partner_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  collaboration_count INTEGER DEFAULT 0,
  feedback_count INTEGER DEFAULT 0,
  average_rating NUMERIC DEFAULT 0.0,
  engagement_rate NUMERIC DEFAULT 0.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expert comments table
CREATE TABLE public.expert_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID,
  likes_count INTEGER DEFAULT 0,
  is_expert_comment BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expert feedback table
CREATE TABLE public.expert_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  would_recommend BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(expert_id, user_id)
);

-- Create expert notifications table
CREATE TABLE public.expert_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  notification_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expert analytics table
CREATE TABLE public.expert_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL UNIQUE,
  view_count INTEGER DEFAULT 0,
  consultation_count INTEGER DEFAULT 0,
  feedback_count INTEGER DEFAULT 0,
  average_rating NUMERIC DEFAULT 0.0,
  expertise_requests INTEGER DEFAULT 0,
  response_rate NUMERIC DEFAULT 0.0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create expert tags table
CREATE TABLE public.expert_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID NOT NULL,
  tag_id UUID NOT NULL,
  added_by UUID,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(expert_id, tag_id)
);

-- Enable RLS on all tables
ALTER TABLE public.opportunity_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Opportunity tables
CREATE POLICY "Users can manage their opportunity participation" ON public.opportunity_participants
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Team members can view all opportunity participants" ON public.opportunity_participants
FOR SELECT USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Team members can manage opportunity experts" ON public.opportunity_experts
FOR ALL USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Users can manage their opportunity feedback" ON public.opportunity_feedback
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Everyone can view opportunity feedback" ON public.opportunity_feedback
FOR SELECT USING (true);

CREATE POLICY "Users can create opportunity comments" ON public.opportunity_comments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own opportunity comments" ON public.opportunity_comments
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Everyone can view opportunity comments" ON public.opportunity_comments
FOR SELECT USING (true);

CREATE POLICY "Users can view their opportunity notifications" ON public.opportunity_notifications
FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their opportunity notifications" ON public.opportunity_notifications
FOR UPDATE USING (recipient_id = auth.uid());

-- RLS Policies for Campaign tables
CREATE POLICY "Everyone can view campaign analytics" ON public.campaign_analytics
FOR SELECT USING (true);

CREATE POLICY "System can update campaign analytics" ON public.campaign_analytics
FOR ALL USING (true);

CREATE POLICY "Users can create campaign comments" ON public.campaign_comments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own campaign comments" ON public.campaign_comments
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Everyone can view campaign comments" ON public.campaign_comments
FOR SELECT USING (true);

CREATE POLICY "Users can manage their campaign feedback" ON public.campaign_feedback
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Everyone can view campaign feedback" ON public.campaign_feedback
FOR SELECT USING (true);

CREATE POLICY "Users can view their campaign notifications" ON public.campaign_notifications
FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their campaign notifications" ON public.campaign_notifications
FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "Users can manage their campaign participation" ON public.campaign_participants
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Team members can view all campaign participants" ON public.campaign_participants
FOR SELECT USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for Partner tables
CREATE POLICY "Users can create partner comments" ON public.partner_comments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own partner comments" ON public.partner_comments
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Everyone can view partner comments" ON public.partner_comments
FOR SELECT USING (true);

CREATE POLICY "Users can manage their partner feedback" ON public.partner_feedback
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Everyone can view partner feedback" ON public.partner_feedback
FOR SELECT USING (true);

CREATE POLICY "Users can view their partner notifications" ON public.partner_notifications
FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their partner notifications" ON public.partner_notifications
FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "Everyone can view partner analytics" ON public.partner_analytics
FOR SELECT USING (true);

CREATE POLICY "System can update partner analytics" ON public.partner_analytics
FOR ALL USING (true);

-- RLS Policies for Expert tables
CREATE POLICY "Users can create expert comments" ON public.expert_comments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own expert comments" ON public.expert_comments
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Everyone can view expert comments" ON public.expert_comments
FOR SELECT USING (true);

CREATE POLICY "Users can manage their expert feedback" ON public.expert_feedback
FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Everyone can view expert feedback" ON public.expert_feedback
FOR SELECT USING (true);

CREATE POLICY "Users can view their expert notifications" ON public.expert_notifications
FOR SELECT USING (recipient_id = auth.uid());

CREATE POLICY "Users can update their expert notifications" ON public.expert_notifications
FOR UPDATE USING (recipient_id = auth.uid());

CREATE POLICY "Everyone can view expert analytics" ON public.expert_analytics
FOR SELECT USING (true);

CREATE POLICY "System can update expert analytics" ON public.expert_analytics
FOR ALL USING (true);

CREATE POLICY "Team members can manage expert tags" ON public.expert_tags
FOR ALL USING (
  EXISTS (SELECT 1 FROM innovation_team_members WHERE user_id = auth.uid() AND status = 'active') OR
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Everyone can view expert tags" ON public.expert_tags
FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_opportunity_participants_opportunity_id ON public.opportunity_participants(opportunity_id);
CREATE INDEX idx_opportunity_participants_user_id ON public.opportunity_participants(user_id);
CREATE INDEX idx_opportunity_experts_opportunity_id ON public.opportunity_experts(opportunity_id);
CREATE INDEX idx_opportunity_experts_expert_id ON public.opportunity_experts(expert_id);
CREATE INDEX idx_opportunity_feedback_opportunity_id ON public.opportunity_feedback(opportunity_id);
CREATE INDEX idx_opportunity_comments_opportunity_id ON public.opportunity_comments(opportunity_id);
CREATE INDEX idx_opportunity_notifications_recipient_id ON public.opportunity_notifications(recipient_id);
CREATE INDEX idx_campaign_comments_campaign_id ON public.campaign_comments(campaign_id);
CREATE INDEX idx_campaign_feedback_campaign_id ON public.campaign_feedback(campaign_id);
CREATE INDEX idx_campaign_notifications_recipient_id ON public.campaign_notifications(recipient_id);
CREATE INDEX idx_campaign_participants_campaign_id ON public.campaign_participants(campaign_id);
CREATE INDEX idx_partner_comments_partner_id ON public.partner_comments(partner_id);
CREATE INDEX idx_partner_feedback_partner_id ON public.partner_feedback(partner_id);
CREATE INDEX idx_partner_notifications_recipient_id ON public.partner_notifications(recipient_id);
CREATE INDEX idx_expert_comments_expert_id ON public.expert_comments(expert_id);
CREATE INDEX idx_expert_feedback_expert_id ON public.expert_feedback(expert_id);
CREATE INDEX idx_expert_notifications_recipient_id ON public.expert_notifications(recipient_id);
CREATE INDEX idx_expert_tags_expert_id ON public.expert_tags(expert_id);
CREATE INDEX idx_expert_tags_tag_id ON public.expert_tags(tag_id);