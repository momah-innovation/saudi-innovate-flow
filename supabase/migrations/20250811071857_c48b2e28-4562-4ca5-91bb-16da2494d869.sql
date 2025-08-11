-- Add only missing translation keys for AdvancedSearch and ChallengeForm components
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES
-- Missing UI translations
('ui.less', 'Less', 'أقل', 'ui'),
('challenge_form.cancel', 'Cancel', 'إلغاء', 'forms'),
('challenge_form.tag_selector_coming_soon', 'Tag selector coming soon...', 'محدد العلامات قريباً...', 'forms');