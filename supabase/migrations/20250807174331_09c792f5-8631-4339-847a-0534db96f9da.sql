-- Add Translation Management interface translation keys
INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Translation Management Section
('translation_management.title', 'Translation Management', 'إدارة الترجمة', 'translation_management'),
('translation_management.description', 'Manage system translations and language settings', 'إدارة ترجمات النظام وإعدادات اللغة', 'translation_management'),

-- JSON Download Section
('translation_management.json_download.title', 'JSON Download', 'تحميل JSON', 'translation_management'),
('translation_management.json_download.description', 'Download translation JSON files to manually update static translations', 'تحميل ملفات JSON للترجمة لتحديث الترجمات الثابتة يدوياً', 'translation_management'),
('translation_management.complete_files.title', 'Complete Translation Files', 'ملفات الترجمة الكاملة', 'translation_management'),
('translation_management.complete_files.description', 'Downloads merge existing static translations with database translations. Database values take precedence for updated keys.', 'التحميلات تدمج الترجمات الثابتة الموجودة مع ترجمات قاعدة البيانات. قيم قاعدة البيانات لها الأولوية للمفاتيح المحدثة.', 'translation_management'),
('translation_management.download_english', 'Download English JSON', 'تحميل JSON الإنجليزية', 'translation_management'),
('translation_management.download_arabic', 'Download Arabic JSON', 'تحميل JSON العربية', 'translation_management'),

-- Add Translation Form
('translation_management.add_translation.title', 'Add Translation', 'إضافة ترجمة', 'translation_management'),
('translation_management.add_translation.description', 'Add new translation keys with both Arabic and English text', 'إضافة مفاتيح ترجمة جديدة بالنص العربي والإنجليزي', 'translation_management'),
('translation_management.form.translation_key', 'Translation Key', 'مفتاح الترجمة', 'translation_management'),
('translation_management.form.translation_key_placeholder', 'e.g., settings.ui.theme', 'مثال: settings.ui.theme', 'translation_management'),
('translation_management.form.category', 'Category', 'الفئة', 'translation_management'),
('translation_management.form.category_placeholder', 'Select category', 'اختر الفئة', 'translation_management'),
('translation_management.form.english_text', 'English Text', 'النص الإنجليزي', 'translation_management'),
('translation_management.form.english_placeholder', 'English translation', 'الترجمة الإنجليزية', 'translation_management'),
('translation_management.form.arabic_text', 'Arabic Text', 'النص العربي', 'translation_management'),
('translation_management.form.arabic_placeholder', 'النص العربي', 'النص العربي', 'translation_management'),
('translation_management.form.add_button', 'Add Translation', 'إضافة ترجمة', 'translation_management'),

-- Database Translations Section
('translation_management.database_translations.title', 'Database Translations', 'ترجمات قاعدة البيانات', 'translation_management'),
('translation_management.database_translations.description', 'Manage dynamic translations stored in the database (recommended)', 'إدارة الترجمات الديناميكية المخزنة في قاعدة البيانات (موصى به)', 'translation_management'),
('translation_management.search_placeholder', 'Search translations...', 'البحث في الترجمات...', 'translation_management'),
('translation_management.all_categories', 'All Categories', 'جميع الفئات', 'translation_management'),

-- Statistics
('translation_management.stats.total_keys', 'Total Keys', 'إجمالي المفاتيح', 'translation_management'),
('translation_management.stats.categories', 'Categories', 'الفئات', 'translation_management'),
('translation_management.stats.complete', 'Complete', 'مكتمل', 'translation_management'),

-- Actions and Messages
('translation_management.success.added', 'Translation added successfully', 'تمت إضافة الترجمة بنجاح', 'translation_management'),
('translation_management.success.updated', 'Translation updated successfully', 'تم تحديث الترجمة بنجاح', 'translation_management'),
('translation_management.success.deleted', 'Translation deleted successfully', 'تم حذف الترجمة بنجاح', 'translation_management'),
('translation_management.error.key_exists', 'Translation key already exists', 'مفتاح الترجمة موجود بالفعل', 'translation_management'),
('translation_management.error.invalid_key', 'Invalid translation key format', 'تنسيق مفتاح الترجمة غير صحيح', 'translation_management'),
('translation_management.error.required_fields', 'All fields are required', 'جميع الحقول مطلوبة', 'translation_management'),

-- Table Headers
('translation_management.table.key', 'Key', 'المفتاح', 'translation_management'),
('translation_management.table.english', 'English', 'الإنجليزية', 'translation_management'),
('translation_management.table.arabic', 'العربية', 'العربية', 'translation_management'),
('translation_management.table.category', 'Category', 'الفئة', 'translation_management'),
('translation_management.table.actions', 'Actions', 'الإجراءات', 'translation_management'),
('translation_management.table.edit', 'Edit', 'تحرير', 'translation_management'),
('translation_management.table.delete', 'Delete', 'حذف', 'translation_management'),
('translation_management.table.save', 'Save', 'حفظ', 'translation_management'),
('translation_management.table.cancel', 'Cancel', 'إلغاء', 'translation_management')

ON CONFLICT (translation_key) 
DO UPDATE SET 
  text_en = EXCLUDED.text_en,
  text_ar = EXCLUDED.text_ar,
  category = EXCLUDED.category,
  updated_at = NOW();