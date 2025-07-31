-- Create storage policies for opportunity-images bucket

-- Policy for authenticated users to upload images
CREATE POLICY "Authenticated users can upload opportunity images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'opportunity-images' 
  AND auth.role() = 'authenticated'
);

-- Policy for public read access to opportunity images
CREATE POLICY "Public read access to opportunity images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'opportunity-images');

-- Policy for authenticated users to update their uploaded images
CREATE POLICY "Authenticated users can update opportunity images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'opportunity-images' 
  AND auth.role() = 'authenticated'
);

-- Policy for authenticated users to delete opportunity images
CREATE POLICY "Authenticated users can delete opportunity images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'opportunity-images' 
  AND auth.role() = 'authenticated'
);