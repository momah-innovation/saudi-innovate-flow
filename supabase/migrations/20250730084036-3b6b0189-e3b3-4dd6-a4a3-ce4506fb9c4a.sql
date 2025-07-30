-- Update challenges table to add image_url if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'image_url') THEN
        ALTER TABLE public.challenges ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Create challenge_bookmarks table
CREATE TABLE IF NOT EXISTS public.challenge_bookmarks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    challenge_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, challenge_id)
);

-- Create challenge_feedback table
CREATE TABLE IF NOT EXISTS public.challenge_feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    challenge_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    would_recommend BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.challenge_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenge_bookmarks
CREATE POLICY "Users can manage their own challenge bookmarks" 
ON public.challenge_bookmarks 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for challenge_feedback  
CREATE POLICY "Users can manage their own feedback" 
ON public.challenge_feedback 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view challenge feedback" 
ON public.challenge_feedback 
FOR SELECT 
USING (true);

-- Create storage bucket for challenge attachments if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('challenge-attachments', 'challenge-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for challenge attachments
CREATE POLICY "Anyone can view challenge attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'challenge-attachments');

CREATE POLICY "Authenticated users can upload challenge attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'challenge-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own challenge attachments" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'challenge-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own challenge attachments" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'challenge-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);