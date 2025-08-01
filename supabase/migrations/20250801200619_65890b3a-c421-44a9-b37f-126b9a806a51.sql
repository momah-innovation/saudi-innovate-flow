-- Create function to update database file paths for migration
CREATE OR REPLACE FUNCTION public.update_file_paths_for_migration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update challenges table
  UPDATE challenges 
  SET image_url = replace(image_url, '/challenge-attachments/', '/challenges-attachments-private/attachments/')
  WHERE image_url LIKE '%/challenge-attachments/%';

  -- Update challenge_submissions attachment_urls array
  UPDATE challenge_submissions 
  SET attachment_urls = array(
    SELECT replace(unnest(attachment_urls), '/challenge-attachments/', '/challenges-attachments-private/attachments/')
  )
  WHERE attachment_urls IS NOT NULL 
  AND array_to_string(attachment_urls, ',') LIKE '%/challenge-attachments/%';

  -- Update event_resources table
  UPDATE event_resources 
  SET file_url = replace(file_url, '/event-resources/', '/events-resources-public/resources/')
  WHERE file_url LIKE '%/event-resources/%';

  -- Update events recording_url
  UPDATE events 
  SET recording_url = replace(recording_url, '/event-resources/', '/events-resources-public/resources/')
  WHERE recording_url LIKE '%/event-resources/%';

  -- Update ideas table for idea-images
  UPDATE ideas 
  SET image_url = replace(image_url, '/idea-images/', '/ideas-images-public/images/')
  WHERE image_url LIKE '%/idea-images/%';

  -- Update ideas table for saved-images
  UPDATE ideas 
  SET image_url = replace(image_url, '/saved-images/', '/ideas-images-public/saved/')
  WHERE image_url LIKE '%/saved-images/%';

  -- Update partners table for partner-images
  UPDATE partners 
  SET logo_url = replace(logo_url, '/partner-images/', '/partners-logos-public/partners/images/')
  WHERE logo_url LIKE '%/partner-images/%';

  -- Update partners table for partner-logos
  UPDATE partners 
  SET logo_url = replace(logo_url, '/partner-logos/', '/partners-logos-public/partners/logos/')
  WHERE logo_url LIKE '%/partner-logos/%';

  -- Update innovation_teams table for team-logos
  UPDATE innovation_teams 
  SET logo_url = replace(logo_url, '/team-logos/', '/partners-logos-public/teams/')
  WHERE logo_url LIKE '%/team-logos/%';

  -- Update innovation_success_stories for dashboard-images
  UPDATE innovation_success_stories 
  SET featured_image_url = replace(featured_image_url, '/dashboard-images/', '/system-assets-public/dashboard/')
  WHERE featured_image_url LIKE '%/dashboard-images/%';

  -- Update sectors table for sector-images
  UPDATE sectors 
  SET image_url = replace(image_url, '/sector-images/', '/sectors-images-public/images/')
  WHERE image_url LIKE '%/sector-images/%';

  -- Update opportunity_applications attachment_urls array
  UPDATE opportunity_applications 
  SET attachment_urls = array(
    SELECT replace(unnest(attachment_urls), '/opportunity-attachments/', '/opportunities-attachments-private/attachments/')
  )
  WHERE attachment_urls IS NOT NULL 
  AND array_to_string(attachment_urls, ',') LIKE '%/opportunity-attachments/%';

  -- Log the migration
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, details, risk_level
  ) VALUES (
    auth.uid(), 'STORAGE_MIGRATION', 'file_paths', 
    jsonb_build_object(
      'action', 'updated_database_file_paths',
      'legacy_buckets', ARRAY[
        'challenge-attachments', 'event-resources', 'idea-images', 
        'partner-images', 'partner-logos', 'team-logos', 'saved-images',
        'dashboard-images', 'sector-images', 'opportunity-attachments'
      ]
    ), 'medium'
  );
END;
$$;