-- Create file_versions table for versioning support
CREATE TABLE public.file_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_record_id UUID NOT NULL REFERENCES public.file_records(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  version_notes TEXT,
  mime_type TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_current BOOLEAN DEFAULT false,
  replaced_version_id UUID REFERENCES public.file_versions(id),
  metadata JSONB DEFAULT '{}',
  UNIQUE(file_record_id, version_number)
);

-- Enable RLS for file_versions
ALTER TABLE public.file_versions ENABLE ROW LEVEL SECURITY;

-- Create policies for file_versions
CREATE POLICY "Users can view versions of their own files" 
ON public.file_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.file_records fr 
    WHERE fr.id = file_record_id AND fr.uploader_id = auth.uid()
  )
);

CREATE POLICY "Users can create versions of their own files" 
ON public.file_versions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.file_records fr 
    WHERE fr.id = file_record_id AND fr.uploader_id = auth.uid()
  ) AND auth.uid() = created_by
);

CREATE POLICY "Users can update versions of their own files" 
ON public.file_versions 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.file_records fr 
    WHERE fr.id = file_record_id AND fr.uploader_id = auth.uid()
  )
);

CREATE POLICY "Team members can view all file versions" 
ON public.file_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM innovation_team_members itm 
    WHERE itm.user_id = auth.uid()
  ) OR has_role(auth.uid(), 'admin'::app_role)
);

-- Create indexes for better performance
CREATE INDEX idx_file_versions_record_id ON public.file_versions(file_record_id);
CREATE INDEX idx_file_versions_current ON public.file_versions(file_record_id, is_current) WHERE is_current = true;
CREATE INDEX idx_file_versions_number ON public.file_versions(file_record_id, version_number);
CREATE INDEX idx_file_versions_created_by ON public.file_versions(created_by);

-- Create function to create a new file version
CREATE OR REPLACE FUNCTION public.create_file_version(
  p_file_record_id UUID,
  p_file_path TEXT,
  p_file_size BIGINT,
  p_mime_type TEXT,
  p_version_notes TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  next_version_number INTEGER;
  new_version_id UUID;
  current_version_id UUID;
BEGIN
  -- Only allow file owners or admins to create versions
  IF NOT (
    EXISTS (
      SELECT 1 FROM public.file_records fr 
      WHERE fr.id = p_file_record_id AND fr.uploader_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::public.app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges to create file version';
  END IF;

  -- Get the next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 
  INTO next_version_number
  FROM public.file_versions 
  WHERE file_record_id = p_file_record_id;

  -- Get current version ID if exists
  SELECT id INTO current_version_id
  FROM public.file_versions 
  WHERE file_record_id = p_file_record_id AND is_current = true;

  -- Create new version
  INSERT INTO public.file_versions (
    file_record_id,
    version_number,
    file_path,
    file_size,
    mime_type,
    version_notes,
    created_by,
    is_current,
    replaced_version_id
  ) VALUES (
    p_file_record_id,
    next_version_number,
    p_file_path,
    p_file_size,
    p_mime_type,
    p_version_notes,
    auth.uid(),
    true,
    current_version_id
  ) RETURNING id INTO new_version_id;

  -- Mark previous version as not current
  IF current_version_id IS NOT NULL THEN
    UPDATE public.file_versions 
    SET is_current = false 
    WHERE id = current_version_id;
  END IF;

  -- Log lifecycle event
  INSERT INTO public.file_lifecycle_events (
    file_record_id,
    event_type,
    event_details,
    performed_by
  ) VALUES (
    p_file_record_id,
    'versioned',
    jsonb_build_object(
      'version_number', next_version_number,
      'version_id', new_version_id,
      'version_notes', p_version_notes,
      'file_size', p_file_size
    ),
    auth.uid()
  );

  RETURN new_version_id;
END;
$$;

-- Create function to restore a file version
CREATE OR REPLACE FUNCTION public.restore_file_version(p_version_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  version_record RECORD;
BEGIN
  -- Get version details
  SELECT fv.*, fr.uploader_id 
  INTO version_record
  FROM public.file_versions fv
  JOIN public.file_records fr ON fv.file_record_id = fr.id
  WHERE fv.id = p_version_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'File version not found';
  END IF;

  -- Check permissions
  IF NOT (
    version_record.uploader_id = auth.uid() 
    OR has_role(auth.uid(), 'admin'::public.app_role)
  ) THEN
    RAISE EXCEPTION 'Access denied: insufficient privileges to restore file version';
  END IF;

  -- Mark all versions as not current
  UPDATE public.file_versions 
  SET is_current = false 
  WHERE file_record_id = version_record.file_record_id;

  -- Mark specified version as current
  UPDATE public.file_versions 
  SET is_current = true 
  WHERE id = p_version_id;

  -- Log lifecycle event
  INSERT INTO public.file_lifecycle_events (
    file_record_id,
    event_type,
    event_details,
    performed_by
  ) VALUES (
    version_record.file_record_id,
    'restored',
    jsonb_build_object(
      'restored_version_number', version_record.version_number,
      'restored_version_id', p_version_id
    ),
    auth.uid()
  );

  RETURN true;
END;
$$;