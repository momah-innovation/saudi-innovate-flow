-- Create team-documents-private bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-documents-private',
  'team-documents-private',
  false, -- Private bucket
  52428800, -- 50MB limit for documents
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ]
);

-- Create team-attachments-private bucket  
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-attachments-private',
  'team-attachments-private', 
  false, -- Private bucket
  104857600, -- 100MB limit for attachments
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'application/zip',
    'application/x-rar-compressed'
  ]
);

-- RLS policies for team-documents-private bucket
CREATE POLICY "Team members can view team documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'team-documents-private' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Team members can upload team documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'team-documents-private' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Team members can update team documents"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'team-documents-private' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Team members can delete team documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'team-documents-private' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

-- RLS policies for team-attachments-private bucket
CREATE POLICY "Team members can view team attachments"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'team-attachments-private' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Team members can upload team attachments"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'team-attachments-private' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Team members can update team attachments"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'team-attachments-private' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Team members can delete team attachments"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'team-attachments-private' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);