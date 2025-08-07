-- Add missing translation keys for Events settings

INSERT INTO system_translations (translation_key, text_en, text_ar, category) VALUES

-- Event capacity options
('settings.event_capacity_options.label', 'Event Capacity Options', 'خيارات سعة الفعاليات', 'settings'),
('settings.event_capacity_options.description', 'Available capacity options for events', 'خيارات السعة المتاحة للفعاليات', 'settings'),

-- Event capacity range values
('settings.event_capacity_range_values.label', 'Event Capacity Range Values', 'قيم نطاق سعة الفعاليات', 'settings'),
('settings.event_capacity_range_values.description', 'Range values for event capacity filtering', 'قيم النطاق لتصفية سعة الفعاليات', 'settings'),

-- Event dialog tabs
('settings.event_dialog_tabs.label', 'Event Dialog Tabs', 'تبويبات حوار الفعاليات', 'settings'),
('settings.event_dialog_tabs.description', 'Available tabs for event dialog interface', 'التبويبات المتاحة لواجهة حوار الفعاليات', 'settings'),

-- Event dialog visible tabs
('settings.event_dialog_visible_tabs.label', 'Event Dialog Visible Tabs', 'تبويبات حوار الفعاليات المرئية', 'settings'),
('settings.event_dialog_visible_tabs.description', 'Visible tabs in event dialog interface', 'التبويبات المرئية في واجهة حوار الفعاليات', 'settings'),

-- Event format options
('settings.event_format_options.label', 'Event Format Options', 'خيارات أشكال الفعاليات', 'settings'),
('settings.event_format_options.description', 'Available format options for events', 'خيارات الأشكال المتاحة للفعاليات', 'settings'),

-- Event price range values
('settings.event_price_range_values.label', 'Event Price Range Values', 'قيم نطاق أسعار الفعاليات', 'settings'),
('settings.event_price_range_values.description', 'Range values for event price filtering', 'قيم النطاق لتصفية أسعار الفعاليات', 'settings'),

-- Event price ranges
('settings.event_price_ranges.label', 'Event Price Ranges', 'نطاقات أسعار الفعاليات', 'settings'),
('settings.event_price_ranges.description', 'Available price ranges for events', 'نطاقات الأسعار المتاحة للفعاليات', 'settings'),

-- Event visible tabs
('settings.event_visible_tabs.label', 'Event Visible Tabs', 'تبويبات الفعاليات المرئية', 'settings'),
('settings.event_visible_tabs.description', 'Visible tabs in event interface', 'التبويبات المرئية في واجهة الفعاليات', 'settings'),

-- Supported capacity ranges
('settings.supported_capacity_ranges.label', 'Supported Capacity Ranges', 'نطاقات السعة المدعومة', 'settings'),
('settings.supported_capacity_ranges.description', 'Supported capacity ranges for event filtering', 'نطاقات السعة المدعومة لتصفية الفعاليات', 'settings'),

-- Supported price ranges
('settings.supported_price_ranges.label', 'Supported Price Ranges', 'نطاقات الأسعار المدعومة', 'settings'),
('settings.supported_price_ranges.description', 'Supported price ranges for event filtering', 'نطاقات الأسعار المدعومة لتصفية الفعاليات', 'settings')

ON CONFLICT (translation_key) DO UPDATE SET
    text_en = EXCLUDED.text_en,
    text_ar = EXCLUDED.text_ar,
    updated_at = NOW();