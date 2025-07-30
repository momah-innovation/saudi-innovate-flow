-- Create additional bookmark tables and enhance saved items functionality

-- Idea bookmarks table
CREATE TABLE IF NOT EXISTS public.idea_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  priority VARCHAR DEFAULT 'medium', -- high, medium, low
  UNIQUE(user_id, idea_id)
);

-- Team bookmarks table (for following public teams)
CREATE TABLE IF NOT EXISTS public.team_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.innovation_team_members(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notification_enabled BOOLEAN DEFAULT true,
  UNIQUE(user_id, team_id)
);

-- Partner bookmarks table
CREATE TABLE IF NOT EXISTS public.partner_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, partner_id)
);

-- Collections table for organizing bookmarks
CREATE TABLE IF NOT EXISTS public.bookmark_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name_ar VARCHAR NOT NULL,
  name_en VARCHAR NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  color VARCHAR DEFAULT '#3B82F6',
  icon VARCHAR DEFAULT 'folder',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Collection items table
CREATE TABLE IF NOT EXISTS public.collection_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID REFERENCES public.bookmark_collections(id) ON DELETE CASCADE,
  item_type VARCHAR NOT NULL, -- challenge, event, idea, team, partner
  item_id UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  UNIQUE(collection_id, item_type, item_id)
);

-- Enable RLS
ALTER TABLE public.idea_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own idea bookmarks" ON public.idea_bookmarks
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own team bookmarks" ON public.team_bookmarks
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own partner bookmarks" ON public.partner_bookmarks
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own collections" ON public.bookmark_collections
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view public collections" ON public.bookmark_collections
FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own collection items" ON public.collection_items
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.bookmark_collections bc 
  WHERE bc.id = collection_items.collection_id AND bc.user_id = auth.uid()
));

CREATE POLICY "Users can view public collection items" ON public.collection_items
FOR SELECT USING (EXISTS (
  SELECT 1 FROM public.bookmark_collections bc 
  WHERE bc.id = collection_items.collection_id AND (bc.is_public = true OR bc.user_id = auth.uid())
));

-- Add enhanced bookmark metadata
ALTER TABLE public.challenge_bookmarks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.challenge_bookmarks ADD COLUMN IF NOT EXISTS priority VARCHAR DEFAULT 'medium';
ALTER TABLE public.challenge_bookmarks ADD COLUMN IF NOT EXISTS reminder_date TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.event_bookmarks ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.event_bookmarks ADD COLUMN IF NOT EXISTS priority VARCHAR DEFAULT 'medium';
ALTER TABLE public.event_bookmarks ADD COLUMN IF NOT EXISTS reminder_date TIMESTAMP WITH TIME ZONE;

-- Seed data for bookmark collections
INSERT INTO public.bookmark_collections (user_id, name_ar, name_en, description_ar, description_en, color, icon, is_public)
SELECT 
  u.id,
  'مجموعة المفضلة',
  'Favorites Collection',
  'العناصر المفضلة والمهمة',
  'Favorite and important items',
  '#EF4444',
  'heart',
  false
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.bookmark_collections bc WHERE bc.user_id = u.id
)
LIMIT 10;

INSERT INTO public.bookmark_collections (user_id, name_ar, name_en, description_ar, description_en, color, icon, is_public)
SELECT 
  u.id,
  'للمراجعة لاحقاً',
  'Review Later',
  'عناصر للمراجعة في وقت لاحق',
  'Items to review later',
  '#F59E0B',
  'clock',
  false
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.bookmark_collections bc WHERE bc.user_id = u.id AND bc.name_en = 'Review Later'
)
LIMIT 10;

-- Sample idea bookmarks
INSERT INTO public.idea_bookmarks (user_id, idea_id, notes, priority)
SELECT 
  u.id,
  i.id,
  'فكرة مثيرة للاهتمام تستحق المتابعة',
  'high'
FROM auth.users u
CROSS JOIN (SELECT id FROM public.ideas LIMIT 3) i
WHERE NOT EXISTS (
  SELECT 1 FROM public.idea_bookmarks ib WHERE ib.user_id = u.id AND ib.idea_id = i.id
)
LIMIT 30;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_idea_bookmarks_user_id ON public.idea_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_team_bookmarks_user_id ON public.team_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_bookmarks_user_id ON public.partner_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_collections_user_id ON public.bookmark_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON public.collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_type_id ON public.collection_items(item_type, item_id);