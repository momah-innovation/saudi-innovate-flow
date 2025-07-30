-- Create missing bookmark tables

-- Focus question bookmarks
CREATE TABLE IF NOT EXISTS public.focus_question_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  focus_question_id UUID NOT NULL,
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Partner bookmarks  
CREATE TABLE IF NOT EXISTS public.partner_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_id UUID NOT NULL,
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Bookmark collections
CREATE TABLE IF NOT EXISTS public.bookmark_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name_ar VARCHAR NOT NULL,
  name_en VARCHAR NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  color VARCHAR DEFAULT '#EF4444',
  icon VARCHAR DEFAULT 'bookmark',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Collection items (link any bookmarked item to collections)
CREATE TABLE IF NOT EXISTS public.collection_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.bookmark_collections(id) ON DELETE CASCADE,
  bookmark_type VARCHAR NOT NULL, -- 'challenge', 'event', 'idea', etc.
  bookmark_id UUID NOT NULL, -- ID of the actual bookmark record
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(collection_id, bookmark_type, bookmark_id)
);

-- Enable RLS
ALTER TABLE public.focus_question_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for focus_question_bookmarks
CREATE POLICY "Users can manage their own focus question bookmarks"
ON public.focus_question_bookmarks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for partner_bookmarks
CREATE POLICY "Users can manage their own partner bookmarks"
ON public.partner_bookmarks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for bookmark_collections
CREATE POLICY "Users can manage their own collections"
ON public.bookmark_collections
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public collections"
ON public.bookmark_collections
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- RLS Policies for collection_items
CREATE POLICY "Users can manage items in their collections"
ON public.collection_items
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.bookmark_collections bc 
    WHERE bc.id = collection_items.collection_id 
    AND bc.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookmark_collections bc 
    WHERE bc.id = collection_items.collection_id 
    AND bc.user_id = auth.uid()
  )
);

-- Add unique constraints to prevent duplicate bookmarks
ALTER TABLE public.focus_question_bookmarks 
ADD CONSTRAINT unique_user_focus_question 
UNIQUE (user_id, focus_question_id);

ALTER TABLE public.partner_bookmarks 
ADD CONSTRAINT unique_user_partner 
UNIQUE (user_id, partner_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_focus_question_bookmarks_user_id ON public.focus_question_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_partner_bookmarks_user_id ON public.partner_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_collections_user_id ON public.bookmark_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON public.collection_items(collection_id);

-- Add updated_at trigger for bookmark_collections
CREATE TRIGGER update_bookmark_collections_updated_at
  BEFORE UPDATE ON public.bookmark_collections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();