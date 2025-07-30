-- Create storage buckets for organizations
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('team-logos', 'team-logos', true),
  ('sector-images', 'sector-images', true),
  ('partner-logos', 'partner-logos', true);

-- Add image_url columns to the tables
ALTER TABLE sectors ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE partners ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE innovation_teams ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Create storage policies for team logos
CREATE POLICY "Team logos are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'team-logos');

CREATE POLICY "Team members can upload team logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'team-logos' AND (EXISTS (
  SELECT 1 FROM innovation_team_members itm 
  WHERE itm.user_id = auth.uid() AND itm.status = 'active'
)));

CREATE POLICY "Team members can update team logos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'team-logos' AND (EXISTS (
  SELECT 1 FROM innovation_team_members itm 
  WHERE itm.user_id = auth.uid() AND itm.status = 'active'
)));

-- Create storage policies for sector images
CREATE POLICY "Sector images are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'sector-images');

CREATE POLICY "Admins can upload sector images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'sector-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update sector images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'sector-images' AND has_role(auth.uid(), 'admin'));

-- Create storage policies for partner logos
CREATE POLICY "Partner logos are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'partner-logos');

CREATE POLICY "Team members can upload partner logos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'partner-logos' AND (EXISTS (
  SELECT 1 FROM innovation_team_members itm 
  WHERE itm.user_id = auth.uid() AND itm.status = 'active'
)));

CREATE POLICY "Team members can update partner logos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'partner-logos' AND (EXISTS (
  SELECT 1 FROM innovation_team_members itm 
  WHERE itm.user_id = auth.uid() AND itm.status = 'active'
)));