# EventRegistration.tsx Translation Fixes

## Hardcoded Strings Found (50+ violations)

### Event Details

- `isRTL ? 'التاريخ' : 'Date'` → Should use `t('events:details.date')`
- `isRTL ? 'الوقت' : 'Time'` → Should use `t('events:details.time')`
- `isRTL ? 'المكان' : 'Location'` → Should use `t('events:details.location')`
- `isRTL ? 'المشاركون' : 'Participants'` → Should use `t('events:details.participants')`
- `isRTL ? 'السعر' : 'Price'` → Should use `t('events:registration_page.price')`
- `isRTL ? 'مجاني' : 'Free'` → Should use `t('events:registration_page.free')`
- `isRTL ? 'المتحدثون' : 'Speakers'` → Should use `t('events:details.speakers')`
- `isRTL ? 'جدول الأعمال' : 'Agenda'` → Should use `t('events:details.agenda')`
- `isRTL ? 'المواضيع' : 'Topics'` → Should use `t('events:registration_page.topics')`

### Actions

- `isRTL ? 'مشاركة' : 'Share'` → Should use `t('events:registration_page.share')`
- `isRTL ? 'إزالة من المفضلة' : 'Remove from Favorites'` → Should use `t('events:registration_page.remove_from_favorites')`
- `isRTL ? 'إضافة للمفضلة' : 'Add to Favorites'` → Should use `t('events:registration_page.add_to_favorites')`
- `isRTL ? 'التسجيل الآن' : 'Register Now'` → Should use `t('events:registration.register_now')`
- `isRTL ? 'تأكيد التسجيل' : 'Confirm Registration'` → Should use `t('events:registration_page.confirm_registration')`
- `isRTL ? 'إلغاء' : 'Cancel'` → Should use `t('events:registration_page.cancel')`

### Filter Dialog

- `isRTL ? 'تصفية الفعاليات' : 'Filter Events'` → Should use `t('events:registration_page.filter_events')`
- `isRTL ? 'استخدم الفلاتر لتضييق نتائج البحث' : 'Use filters to narrow down your search results'` → Should use `t('events:registration_page.filter_events_desc')`
- `isRTL ? 'الفئة' : 'Category'` → Should use `t('events:filters.category')`
- `isRTL ? 'اختر الفئة' : 'Select category'` → Should use `t('events:registration_page.select_category')`
- `isRTL ? 'جميع الفئات' : 'All Categories'` → Should use `t('events:registration_page.all_categories')`
- `isRTL ? 'نوع الفعالية' : 'Event Type'` → Should use `t('events:filters.type')`
- `isRTL ? 'اختر النوع' : 'Select type'` → Should use `t('events:registration_page.select_type')`
- `isRTL ? 'جميع الأنواع' : 'All Types'` → Should use `t('events:registration_page.all_types')`
- `isRTL ? 'الحالة' : 'Status'` → Should use `t('events:filters.status')`
- `isRTL ? 'اختر الحالة' : 'Select status'` → Should use `t('events:registration_page.select_status')`
- `isRTL ? 'جميع الحالات' : 'All Statuses'` → Should use `t('events:registration_page.all_statuses')`
- `isRTL ? 'إعادة تعيين' : 'Reset'` → Should use `t('events:registration_page.reset')`
- `isRTL ? 'تطبيق' : 'Apply'` → Should use `t('events:registration_page.apply')`

### Event Categories (hardcoded in SelectItems)

- `isRTL ? 'تكنولوجيا' : 'Technology'` → Should use `t('events:event_category.technology')`
- `isRTL ? 'أعمال' : 'Business'` → Should use `t('events:event_category.business')`
- `isRTL ? 'تكنولوجيا مالية' : 'FinTech'` → Should use `t('events:event_category.fintech')`
- `isRTL ? 'ذكاء اصطناعي' : 'Artificial Intelligence'` → Should use `t('events:event_category.ai')`
- `isRTL ? 'تطوير' : 'Development'` → Should use `t('events:event_category.development')`
- `isRTL ? 'أمن سيبراني' : 'Cybersecurity'` → Should use `t('events:event_category.cybersecurity')`

### Event Types (hardcoded in SelectItems)

- `isRTL ? 'معرض' : 'Exhibition'` → Should use `t('events:event_type.exhibition')`
- `isRTL ? 'ملتقى' : 'Summit'` → Should use `t('events:event_type.summit')`

### Event Status (hardcoded in SelectItems)

- `isRTL ? 'متاح' : 'Available'` → Should use `t('events:event_status.available')`
- `isRTL ? 'مؤكد' : 'Confirmed'` → Should use `t('events:event_status.confirmed')`
- `isRTL ? 'في الانتظار' : 'Pending'` → Should use `t('events:event_status.pending')`
- `isRTL ? 'قائمة انتظار' : 'Waitlist'` → Should use `t('events:event_status.waitlist')`
- `isRTL ? 'مكتمل' : 'Completed'` → Should use `t('events:event_status.completed')`

### Confirmation Dialog

- `isRTL ? 'هل تريد التسجيل في:' : 'Are you sure you want to register for:'` → Should use `t('events:registration_page.confirm_registration_desc')`

## Summary

- **Total violations found**: 50+
- **Keys already exist**: Most keys already exist in events.json
- **Action needed**: Replace all `isRTL ? 'Arabic' : 'English'` patterns with proper `t()` calls
