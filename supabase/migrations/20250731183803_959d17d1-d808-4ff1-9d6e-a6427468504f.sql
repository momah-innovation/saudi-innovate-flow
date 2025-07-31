-- Check if tables exist and create only missing ones
DO $$ 
BEGIN
  -- Create opportunity_comments table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'opportunity_comments') THEN
    CREATE TABLE public.opportunity_comments (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      opportunity_id UUID NOT NULL,
      user_id UUID NOT NULL,
      content TEXT NOT NULL,
      parent_comment_id UUID,
      is_public BOOLEAN DEFAULT true,
      is_pinned BOOLEAN DEFAULT false,
      likes_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      CONSTRAINT fk_opportunity_comments_opportunity_id 
        FOREIGN KEY (opportunity_id) REFERENCES partnership_opportunities(id) ON DELETE CASCADE,
      CONSTRAINT fk_opportunity_comments_parent 
        FOREIGN KEY (parent_comment_id) REFERENCES opportunity_comments(id) ON DELETE CASCADE
    );
    
    -- Enable RLS for opportunity_comments
    ALTER TABLE public.opportunity_comments ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies for opportunity_comments
    CREATE POLICY "Users can view public comments" ON public.opportunity_comments
      FOR SELECT 
      USING (is_public = true);

    CREATE POLICY "Users can create comments" ON public.opportunity_comments
      FOR INSERT 
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can update their own comments" ON public.opportunity_comments
      FOR UPDATE 
      USING (auth.uid() = user_id);

    CREATE POLICY "Users can delete their own comments" ON public.opportunity_comments
      FOR DELETE 
      USING (auth.uid() = user_id);
      
    -- Create indexes
    CREATE INDEX idx_opportunity_comments_opportunity_id ON public.opportunity_comments(opportunity_id);
    CREATE INDEX idx_opportunity_comments_user_id ON public.opportunity_comments(user_id);
    CREATE INDEX idx_opportunity_comments_created_at ON public.opportunity_comments(created_at);
    
    -- Add trigger
    CREATE TRIGGER update_opportunity_comments_updated_at
      BEFORE UPDATE ON public.opportunity_comments
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;

  -- Create opportunity_notifications table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'opportunity_notifications') THEN
    CREATE TABLE public.opportunity_notifications (
      id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
      opportunity_id UUID NOT NULL,
      recipient_id UUID NOT NULL,
      sender_id UUID,
      notification_type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      action_url TEXT,
      metadata JSONB DEFAULT '{}',
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      CONSTRAINT fk_opportunity_notifications_opportunity_id 
        FOREIGN KEY (opportunity_id) REFERENCES partnership_opportunities(id) ON DELETE CASCADE
    );
    
    -- Enable RLS for opportunity_notifications
    ALTER TABLE public.opportunity_notifications ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies for opportunity_notifications
    CREATE POLICY "Users can view their own notifications" ON public.opportunity_notifications
      FOR SELECT 
      USING (recipient_id = auth.uid());

    CREATE POLICY "Users can update their own notifications" ON public.opportunity_notifications
      FOR UPDATE 
      USING (recipient_id = auth.uid());
      
    -- Create indexes
    CREATE INDEX idx_opportunity_notifications_recipient_id ON public.opportunity_notifications(recipient_id);
    CREATE INDEX idx_opportunity_notifications_opportunity_id ON public.opportunity_notifications(opportunity_id);
  END IF;
END $$;

-- Create bookmark analytics trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_opportunity_analytics_on_bookmark()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Refresh analytics when bookmarks are inserted or deleted
  PERFORM public.refresh_opportunity_analytics(
    COALESCE(NEW.opportunity_id, OLD.opportunity_id)
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create bookmark analytics trigger if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'bookmark_analytics_trigger') THEN
    CREATE TRIGGER bookmark_analytics_trigger
      AFTER INSERT OR DELETE ON public.opportunity_bookmarks
      FOR EACH ROW
      EXECUTE FUNCTION public.update_opportunity_analytics_on_bookmark();
  END IF;
END $$;