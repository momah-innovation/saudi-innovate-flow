-- Create storage bucket for idea images
INSERT INTO storage.buckets (id, name, public) VALUES ('idea-images', 'idea-images', true);

-- Create policies for idea images bucket
CREATE POLICY "Anyone can view idea images" ON storage.objects FOR SELECT USING (bucket_id = 'idea-images');

CREATE POLICY "Authenticated users can upload idea images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'idea-images' AND 
  auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own idea images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'idea-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own idea images" ON storage.objects FOR DELETE USING (
  bucket_id = 'idea-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);