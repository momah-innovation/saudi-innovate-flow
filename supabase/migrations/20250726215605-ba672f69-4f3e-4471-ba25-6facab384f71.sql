-- Remove duplicate foreign key constraints if they exist
ALTER TABLE campaign_partner_links DROP CONSTRAINT IF EXISTS fk_campaign_partner_links_campaign_id;
ALTER TABLE campaign_stakeholder_links DROP CONSTRAINT IF EXISTS fk_campaign_stakeholder_links_campaign_id;