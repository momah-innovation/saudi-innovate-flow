-- Add new translation keys for profile components (TeamProfileCard, PartnerProfileCard, SectorProfileCard)
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- TeamProfileCard translations
('team_status.active', 'Active', 'نشط', 'team'),
('team_status.inactive', 'Inactive', 'غير نشط', 'team'),
('team_status.forming', 'Forming', 'قيد التكوين', 'team'),
('team_profile.max_members', 'Max {{count}} members', 'حد أقصى {{count}} عضو', 'team'),
('team_profile.view_details', 'View Details', 'عرض التفاصيل', 'team'),

-- PartnerProfileCard translations
('partner_status.active', 'Active', 'نشط', 'partner'),
('partner_status.inactive', 'Inactive', 'غير نشط', 'partner'),
('partner_status.pending', 'Pending', 'في الانتظار', 'partner'),
('partner_type.corporate', 'Corporate', 'شركات', 'partner'),
('partner_type.academic', 'Academic', 'أكاديمي', 'partner'),
('partner_type.government', 'Government', 'حكومي', 'partner'),
('partner_type.technology', 'Technology', 'تقنية', 'partner'),
('partner_type.media', 'Media', 'إعلام', 'partner'),
('partner_profile.contact_label', 'Contact', 'جهة الاتصال', 'partner'),
('partner_profile.more_capabilities', '+{{count}} more', '+{{count}} المزيد', 'partner'),
('partner_profile.view_details', 'View Details', 'عرض التفاصيل', 'partner'),

-- SectorProfileCard translations
('sector_profile.vision_2030_alignment', 'Vision 2030 Alignment', 'التوافق مع رؤية 2030', 'sector'),
('sector_profile.government_sector', 'Government Sector', 'القطاع الحكومي', 'sector'),
('sector_profile.strategic_priority', 'Strategic Priority', 'أولوية استراتيجية', 'sector'),
('sector_profile.view_details', 'View Details', 'عرض التفاصيل', 'sector');