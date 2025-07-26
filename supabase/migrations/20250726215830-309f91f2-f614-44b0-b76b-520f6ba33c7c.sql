-- Clean up duplicate foreign key constraints
ALTER TABLE campaign_partner_links DROP CONSTRAINT IF EXISTS fk_campaign_partner_links_partner_id;
ALTER TABLE campaign_stakeholder_links DROP CONSTRAINT IF EXISTS fk_campaign_stakeholder_links_stakeholder_id;