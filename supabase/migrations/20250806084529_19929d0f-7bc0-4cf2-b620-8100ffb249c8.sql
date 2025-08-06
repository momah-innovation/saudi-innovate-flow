-- Add missing translation keys for better settings management
INSERT INTO system_translations (translation_key, language_code, translation_text, category) VALUES
-- Array/Object Editor translations
('settings.array_editor', 'en', 'Array Editor', 'settings'),
('settings.array_editor', 'ar', 'محرر المصفوفة', 'settings'),
('settings.object_editor', 'en', 'Object Editor', 'settings'),
('settings.object_editor', 'ar', 'محرر الكائن', 'settings'),
('settings.open_editor', 'en', 'Open Editor', 'settings'),
('settings.open_editor', 'ar', 'فتح المحرر', 'settings'),
('settings.close_editor', 'en', 'Close Editor', 'settings'),
('settings.close_editor', 'ar', 'إغلاق المحرر', 'settings'),
('settings.visual_mode', 'en', 'Visual Mode', 'settings'),
('settings.visual_mode', 'ar', 'الوضع المرئي', 'settings'),
('settings.code_mode', 'en', 'Code Mode', 'settings'),
('settings.code_mode', 'ar', 'وضع الكود', 'settings'),

-- Save/Revert functionality
('settings.save', 'en', 'Save', 'settings'),
('settings.save', 'ar', 'حفظ', 'settings'),
('settings.revert', 'en', 'Revert', 'settings'),
('settings.revert', 'ar', 'تراجع', 'settings'),
('settings.modified', 'en', 'Modified', 'settings'),
('settings.modified', 'ar', 'معدل', 'settings'),
('settings.unsaved_changes', 'en', 'You have unsaved changes', 'settings'),
('settings.unsaved_changes', 'ar', 'لديك تغييرات غير محفوظة', 'settings'),

-- Array editor specific
('settings.total_items', 'en', 'Total items', 'settings'),
('settings.total_items', 'ar', 'إجمالي العناصر', 'settings'),
('settings.no_items', 'en', 'No items added yet', 'settings'),
('settings.no_items', 'ar', 'لم تتم إضافة عناصر بعد', 'settings'),
('settings.click_add', 'en', 'Click "Add Item" to get started', 'settings'),
('settings.click_add', 'ar', 'انقر على "إضافة عنصر" للبدء', 'settings'),
('settings.array.item_placeholder', 'en', 'Enter item value...', 'settings'),
('settings.array.item_placeholder', 'ar', 'أدخل قيمة العنصر...', 'settings'),

-- Object editor specific
('settings.property_name', 'en', 'Property name...', 'settings'),
('settings.property_name', 'ar', 'اسم الخاصية...', 'settings'),
('settings.add_property', 'en', 'Add', 'settings'),
('settings.add_property', 'ar', 'إضافة', 'settings'),
('settings.no_properties', 'en', 'No properties added yet', 'settings'),
('settings.no_properties', 'ar', 'لم تتم إضافة خصائص بعد', 'settings'),
('settings.add_property_hint', 'en', 'Add a property name and click "Add"', 'settings'),
('settings.add_property_hint', 'ar', 'أضف اسم الخاصية وانقر على "إضافة"', 'settings'),
('settings.object.nested_placeholder', 'en', 'Enter nested object...', 'settings'),
('settings.object.nested_placeholder', 'ar', 'أدخل كائن متداخل...', 'settings'),
('settings.object.array_placeholder', 'en', 'Enter array...', 'settings'),
('settings.object.array_placeholder', 'ar', 'أدخل مصفوفة...', 'settings'),
('settings.object.item_placeholder', 'en', 'Enter JSON object...', 'settings'),
('settings.object.item_placeholder', 'ar', 'أدخل كائن JSON...', 'settings'),
('settings.json_placeholder', 'en', 'Enter JSON object...', 'settings'),
('settings.json_placeholder', 'ar', 'أدخل كائن JSON...', 'settings'),

-- General UI improvements
('settings.items', 'en', 'items', 'settings'),
('settings.items', 'ar', 'عناصر', 'settings'),
('settings.properties', 'en', 'properties', 'settings'),
('settings.properties', 'ar', 'خصائص', 'settings')

ON CONFLICT (translation_key, language_code) DO UPDATE SET
translation_text = EXCLUDED.translation_text,
updated_at = now();