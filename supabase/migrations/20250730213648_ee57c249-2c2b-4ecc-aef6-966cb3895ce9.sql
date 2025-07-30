-- Create additional bookmark tables for all content types

-- Focus question bookmarks
CREATE TABLE IF NOT EXISTS public.focus_question_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  focus_question_id UUID REFERENCES public.focus_questions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, focus_question_id)
);

-- Campaign bookmarks
CREATE TABLE IF NOT EXISTS public.campaign_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, campaign_id)
);

-- Sector bookmarks
CREATE TABLE IF NOT EXISTS public.sector_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sector_id UUID REFERENCES public.sectors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, sector_id)
);

-- Stakeholder bookmarks
CREATE TABLE IF NOT EXISTS public.stakeholder_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stakeholder_id UUID REFERENCES public.stakeholders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, stakeholder_id)
);

-- Expert bookmarks (for saving expert profiles)
CREATE TABLE IF NOT EXISTS public.expert_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, expert_id)
);

-- Enable RLS on all new bookmark tables
ALTER TABLE public.focus_question_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_bookmarks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for all bookmark tables
CREATE POLICY "Users can manage their own focus question bookmarks" ON public.focus_question_bookmarks
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own campaign bookmarks" ON public.campaign_bookmarks
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sector bookmarks" ON public.sector_bookmarks
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own stakeholder bookmarks" ON public.stakeholder_bookmarks
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own expert bookmarks" ON public.expert_bookmarks
FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_focus_question_bookmarks_user_id ON public.focus_question_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_bookmarks_user_id ON public.campaign_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_sector_bookmarks_user_id ON public.sector_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_stakeholder_bookmarks_user_id ON public.stakeholder_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_expert_bookmarks_user_id ON public.expert_bookmarks(user_id);

-- Enable realtime for existing and new bookmark tables
ALTER TABLE public.challenge_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.event_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.focus_question_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.campaign_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.sector_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.stakeholder_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.expert_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.idea_bookmarks REPLICA IDENTITY FULL;
ALTER TABLE public.bookmark_collections REPLICA IDENTITY FULL;
ALTER TABLE public.collection_items REPLICA IDENTITY FULL;