-- Update sectors with image URLs
UPDATE sectors SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/sector-images/digital-transformation.jpg'
WHERE name = 'Digital Transformation';

UPDATE sectors SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/sector-images/healthcare-innovation.jpg'
WHERE name = 'Healthcare Innovation';

UPDATE sectors SET image_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/sector-images/smart-cities.jpg'
WHERE name = 'Smart Cities';

-- Update innovation teams with logo URLs
UPDATE innovation_teams SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/team-logos/content-communication.jpg'
WHERE focus_area = 'Content & Communication';

UPDATE innovation_teams SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/team-logos/analytics-research.jpg'
WHERE focus_area = 'Analytics & Research';

UPDATE innovation_teams SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/team-logos/campaign-management.jpg'
WHERE focus_area = 'Campaign Management';

UPDATE innovation_teams SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/team-logos/technology-digital.jpg'
WHERE focus_area = 'Technology & Digital';

UPDATE innovation_teams SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/team-logos/strategy-planning.jpg'
WHERE focus_area = 'Strategy & Planning';

-- Update partners with logo URLs by partner type
UPDATE partners SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/partner-logos/corporate-partner.jpg'
WHERE partner_type = 'corporate';

UPDATE partners SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/partner-logos/academic-partner.jpg'
WHERE partner_type = 'academic';

UPDATE partners SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/partner-logos/government-partner.jpg'
WHERE partner_type = 'government';

UPDATE partners SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/partner-logos/technology-partner.jpg'
WHERE partner_type = 'technology';

UPDATE partners SET logo_url = 'https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/partner-logos/media-partner.jpg'
WHERE partner_type = 'media';