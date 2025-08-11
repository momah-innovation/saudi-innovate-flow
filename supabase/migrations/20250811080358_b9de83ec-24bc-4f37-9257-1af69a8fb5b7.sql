-- Add missing translation keys for CampaignsManagement component

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Button actions (if not already exist)
('button.view', 'View', 'عرض', 'ui'),
('button.edit', 'Edit', 'تحرير', 'ui'),
('button.delete', 'Delete', 'حذف', 'ui'),

-- Campaigns Management specific metadata labels 
('campaign.start_date', 'Start Date', 'تاريخ البداية', 'campaign'),
('campaign.participants', 'Participants', 'المشاركون', 'campaign'),
('campaign.ideas', 'Ideas', 'الأفكار', 'campaign'),
('campaign.budget', 'Budget', 'الميزانية', 'campaign'),
('campaign.currency_sar', 'SAR', 'ريال', 'campaign')

ON CONFLICT (translation_key) DO NOTHING;