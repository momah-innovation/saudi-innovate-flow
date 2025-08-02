-- Create file_records table for comprehensive file tracking
CREATE TABLE public.file_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  bucket_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  upload_type TEXT NOT NULL,
  entity_id UUID,
  entity_table TEXT,
  entity_column TEXT,
  uploaded_by UUID NOT NULL,
  is_temporary BOOLEAN NOT NULL DEFAULT false,
  temp_session_id TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create file_lifecycle_events table for tracking file events
CREATE TABLE public.file_lifecycle_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_record_id UUID NOT NULL REFERENCES public.file_records(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  performed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.file_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_lifecycle_events ENABLE ROW LEVEL SECURITY;

-- Create policies for file_records
CREATE POLICY "Users can view their own file records" 
ON public.file_records 
FOR SELECT 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can create their own file records" 
ON public.file_records 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own file records" 
ON public.file_records 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own file records" 
ON public.file_records 
FOR DELETE 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Team members can view all file records" 
ON public.file_records 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create policies for file_lifecycle_events
CREATE POLICY "Users can view events for their own files" 
ON public.file_lifecycle_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.file_records fr 
    WHERE fr.id = file_record_id AND fr.uploaded_by = auth.uid()
  )
);

CREATE POLICY "System can create lifecycle events" 
ON public.file_lifecycle_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Team members can view all lifecycle events" 
ON public.file_lifecycle_events 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_file_records_updated_at
BEFORE UPDATE ON public.file_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_file_records_uploaded_by ON public.file_records(uploaded_by);
CREATE INDEX idx_file_records_entity ON public.file_records(entity_id, entity_table);
CREATE INDEX idx_file_records_temp_session ON public.file_records(temp_session_id) WHERE is_temporary = true;
CREATE INDEX idx_file_records_expires_at ON public.file_records(expires_at) WHERE is_temporary = true;
CREATE INDEX idx_file_lifecycle_events_file_record ON public.file_lifecycle_events(file_record_id);
CREATE INDEX idx_file_lifecycle_events_type ON public.file_lifecycle_events(event_type);

-- Create function to automatically cleanup expired temporary files
CREATE OR REPLACE FUNCTION public.cleanup_expired_temp_files()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  expired_count INTEGER := 0;
  file_record RECORD;
BEGIN
  -- Find expired temporary files
  FOR file_record IN 
    SELECT id, file_path, bucket_name
    FROM public.file_records 
    WHERE is_temporary = true 
    AND expires_at < now()
    AND status = 'active'
  LOOP
    -- Mark as expired
    UPDATE public.file_records 
    SET status = 'expired', updated_at = now()
    WHERE id = file_record.id;
    
    -- Log lifecycle event
    INSERT INTO public.file_lifecycle_events (file_record_id, event_type, event_data)
    VALUES (file_record.id, 'expired', jsonb_build_object('auto_cleanup', true));
    
    expired_count := expired_count + 1;
  END LOOP;
  
  RETURN expired_count;
END;
$$;