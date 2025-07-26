-- First, migrate existing data from ARRAY columns to junction tables
-- Handle campaign_stakeholder_links
INSERT INTO campaign_stakeholder_links (campaign_id, stakeholder_id)
SELECT 
  c.id as campaign_id,
  unnest(c.target_stakeholder_groups)::uuid as stakeholder_id
FROM campaigns c
WHERE c.target_stakeholder_groups IS NOT NULL 
  AND array_length(c.target_stakeholder_groups, 1) > 0
ON CONFLICT (campaign_id, stakeholder_id) DO NOTHING;

-- Handle campaign_partner_links  
INSERT INTO campaign_partner_links (campaign_id, partner_id)
SELECT 
  c.id as campaign_id,
  unnest(c.partner_organizations)::uuid as partner_id
FROM campaigns c
WHERE c.partner_organizations IS NOT NULL 
  AND array_length(c.partner_organizations, 1) > 0
ON CONFLICT (campaign_id, partner_id) DO NOTHING;

-- Create foreign key constraints for better data integrity
ALTER TABLE campaign_stakeholder_links
ADD CONSTRAINT fk_campaign_stakeholder_links_campaign
FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE;

ALTER TABLE campaign_stakeholder_links
ADD CONSTRAINT fk_campaign_stakeholder_links_stakeholder
FOREIGN KEY (stakeholder_id) REFERENCES stakeholders(id) ON DELETE CASCADE;

ALTER TABLE campaign_partner_links
ADD CONSTRAINT fk_campaign_partner_links_campaign
FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE;

ALTER TABLE campaign_partner_links
ADD CONSTRAINT fk_campaign_partner_links_partner
FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE CASCADE;

-- Add unique constraints to prevent duplicate relationships
ALTER TABLE campaign_stakeholder_links
ADD CONSTRAINT unique_campaign_stakeholder
UNIQUE (campaign_id, stakeholder_id);

ALTER TABLE campaign_partner_links
ADD CONSTRAINT unique_campaign_partner
UNIQUE (campaign_id, partner_id);

-- Remove the ARRAY columns from campaigns table since we're using junction tables now
ALTER TABLE campaigns DROP COLUMN IF EXISTS target_stakeholder_groups;
ALTER TABLE campaigns DROP COLUMN IF EXISTS partner_organizations;