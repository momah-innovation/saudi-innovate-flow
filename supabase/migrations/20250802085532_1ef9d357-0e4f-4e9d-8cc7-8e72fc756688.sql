-- Create storage bucket for file versions
INSERT INTO storage.buckets (id, name, public) VALUES ('file-versions', 'file-versions', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for file versions bucket
CREATE POLICY "Users can view their own file versions" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'file-versions' AND 
  EXISTS (
    SELECT 1 FROM public.file_versions fv
    JOIN public.file_records fr ON fv.file_record_id = fr.id
    WHERE fv.file_path = name AND fr.uploader_id = auth.uid()
  )
);

CREATE POLICY "Users can upload their own file versions" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'file-versions' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Team members can view all file versions" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'file-versions' AND (
    EXISTS (
      SELECT 1 FROM innovation_team_members itm 
      WHERE itm.user_id = auth.uid()
    ) OR has_role(auth.uid(), 'admin'::app_role)
  )
);