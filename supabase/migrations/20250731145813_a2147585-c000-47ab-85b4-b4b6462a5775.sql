-- Update existing opportunities with appropriate image URLs based on their type
UPDATE partnership_opportunities 
SET image_url = CASE 
  WHEN opportunity_type = 'funding' THEN '/opportunity-images/funding-opportunity.jpg'
  WHEN opportunity_type = 'partnership' THEN '/opportunity-images/tech-partnership.jpg'
  WHEN opportunity_type = 'collaboration' THEN '/opportunity-images/research-collaboration.jpg'
  WHEN opportunity_type = 'research' THEN '/opportunity-images/innovation-hub.jpg'
  WHEN opportunity_type = 'development' THEN '/opportunity-images/startup-incubator.jpg'
  WHEN opportunity_type = 'education' THEN '/opportunity-images/education-partnership.jpg'
  ELSE '/opportunity-images/partnership-collaboration.jpg'
END
WHERE image_url IS NULL OR image_url = '';

-- Add some variety to existing opportunities if any exist
UPDATE partnership_opportunities 
SET image_url = CASE 
  WHEN id IN (
    SELECT id FROM partnership_opportunities 
    ORDER BY created_at 
    LIMIT (SELECT COUNT(*)/6 FROM partnership_opportunities)
  ) THEN '/opportunity-images/tech-partnership.jpg'
  WHEN id IN (
    SELECT id FROM partnership_opportunities 
    ORDER BY created_at 
    LIMIT (SELECT COUNT(*)/3 FROM partnership_opportunities) 
    OFFSET (SELECT COUNT(*)/6 FROM partnership_opportunities)
  ) THEN '/opportunity-images/research-collaboration.jpg'
  WHEN id IN (
    SELECT id FROM partnership_opportunities 
    ORDER BY created_at 
    LIMIT (SELECT COUNT(*)/2 FROM partnership_opportunities) 
    OFFSET (SELECT COUNT(*)/3 FROM partnership_opportunities)
  ) THEN '/opportunity-images/funding-opportunity.jpg'
  ELSE '/opportunity-images/innovation-hub.jpg'
END;

-- Ensure all opportunities have images
UPDATE partnership_opportunities 
SET image_url = '/opportunity-images/partnership-collaboration.jpg'
WHERE image_url IS NULL;