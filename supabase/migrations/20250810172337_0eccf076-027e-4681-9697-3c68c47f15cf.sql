-- Add missing translation keys for TeamMemberWizard success messages
INSERT INTO public.system_translations (translation_key, text_ar, text_en, category) VALUES
('success.add_successful', 'تم الإضافة بنجاح', 'Added Successfully', 'success'),
('success.member_added', 'تم إضافة عضو جديد إلى فريق الابتكار', 'New member added to innovation team', 'success')
ON CONFLICT (translation_key) DO UPDATE SET
text_ar = EXCLUDED.text_ar,
text_en = EXCLUDED.text_en,
category = EXCLUDED.category;