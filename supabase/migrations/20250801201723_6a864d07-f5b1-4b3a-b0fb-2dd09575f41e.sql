-- Create team-logos-public bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-logos-public',
  'team-logos-public',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
);

-- Create RLS policies for team-logos-public bucket
CREATE POLICY "Anyone can view team logos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'team-logos-public');

CREATE POLICY "Team members can upload team logos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'team-logos-public' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Team members can update team logos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'team-logos-public' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);

CREATE POLICY "Team members can delete team logos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'team-logos-public' AND
  (EXISTS (
    SELECT 1 FROM innovation_team_members
    WHERE user_id = auth.uid() AND status = 'active'
  ) OR has_role(auth.uid(), 'admin'::app_role))
);