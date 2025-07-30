-- Create missing bookmark tables (with proper error handling)

-- Drop and recreate focus_question_bookmarks if needed
DROP TABLE IF EXISTS public.focus_question_bookmarks CASCADE;
CREATE TABLE public.focus_question_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  focus_question_id UUID NOT NULL,
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, focus_question_id)
);

-- Drop and recreate partner_bookmarks if needed  
DROP TABLE IF EXISTS public.partner_bookmarks CASCADE;
CREATE TABLE public.partner_bookmarks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_id UUID NOT NULL,
  notes TEXT,
  priority VARCHAR DEFAULT 'medium',
  reminder_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, partner_id)
);

-- Drop and recreate bookmark_collections if needed
DROP TABLE IF EXISTS public.bookmark_collections CASCADE;
CREATE TABLE public.bookmark_collections (
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

-- Drop and recreate collection_items if needed
DROP TABLE IF EXISTS public.collection_items CASCADE;
CREATE TABLE public.collection_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.bookmark_collections(id) ON DELETE CASCADE,
  bookmark_type VARCHAR NOT NULL,
  bookmark_id UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(collection_id, bookmark_type, bookmark_id)
);

-- Enable RLS
ALTER TABLE public.focus_question_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can manage their own focus question bookmarks"
ON public.focus_question_bookmarks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own partner bookmarks"
ON public.partner_bookmarks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own collections"
ON public.bookmark_collections
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public collections"
ON public.bookmark_collections
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

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

-- Add indexes for performance
CREATE INDEX idx_focus_question_bookmarks_user_id ON public.focus_question_bookmarks(user_id);
CREATE INDEX idx_partner_bookmarks_user_id ON public.partner_bookmarks(user_id);
CREATE INDEX idx_bookmark_collections_user_id ON public.bookmark_collections(user_id);
CREATE INDEX idx_collection_items_collection_id ON public.collection_items(collection_id);

-- Add updated_at trigger
CREATE TRIGGER update_bookmark_collections_updated_at
  BEFORE UPDATE ON public.bookmark_collections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();