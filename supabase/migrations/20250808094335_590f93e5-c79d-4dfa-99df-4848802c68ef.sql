-- Add missing translation keys for remaining hardcoded strings
INSERT INTO system_translations (translation_key, category, text_en, text_ar) VALUES
-- Toast messages
('toast.assign_expert_failed', 'toast', 'Failed to assign expert. Please try again.', 'فشل في تعيين الخبير. يرجى المحاولة مرة أخرى.'),
('toast.bulk_assignment_failed', 'toast', 'Failed to complete bulk assignment. Please try again.', 'فشل في إكمال التعيين المجمع. يرجى المحاولة مرة أخرى.'),
('toast.update_assignment_failed', 'toast', 'Failed to update assignment. Please try again.', 'فشل في تحديث التعيين. يرجى المحاولة مرة أخرى.'),
('toast.remove_assignment_failed', 'toast', 'Failed to remove assignment. Please try again.', 'فشل في إزالة التعيين. يرجى المحاولة مرة أخرى.'),
('toast.role_already_assigned', 'toast', 'You already have this role assigned', 'لديك هذا الدور مُعيّن بالفعل'),
('toast.pending_request_exists', 'toast', 'You already have a pending request for this role. Please wait for review.', 'لديك طلب معلق لهذا الدور بالفعل. يرجى انتظار المراجعة.'),
('toast.role_request_success', 'toast', 'Role request submitted successfully! An administrator will review your request.', 'تم إرسال طلب الدور بنجاح! سيقوم مشرف بمراجعة طلبك.'),
('toast.invitation_failed', 'toast', 'Failed to send invitation. Please try again.', 'فشل في إرسال الدعوة. يرجى المحاولة مرة أخرى.'),
('toast.load_requests_failed', 'toast', 'Failed to load role requests.', 'فشل في تحميل طلبات الأدوار.'),
('toast.review_request_failed', 'toast', 'Failed to review the request.', 'فشل في مراجعة الطلب.'),
('toast.dashboard_error', 'toast', 'خطأ في تحميل بيانات لوحة القيادة', 'Error loading dashboard data'),
('toast.organization_data_error', 'toast', 'Error loading organization data', 'خطأ في تحميل بيانات المنظمة'),
('toast.team_workspace_failed', 'toast', 'Failed to load team workspace data.', 'فشل في تحميل بيانات مساحة عمل الفريق.'),

-- Placeholder texts
('placeholder.assignment_notes', 'placeholder', 'Additional notes about this assignment...', 'ملاحظات إضافية حول هذا التعيين...'),
('placeholder.bulk_assignment_notes', 'placeholder', 'Notes applied to all assignments...', 'ملاحظات تُطبق على جميع التعيينات...'),
('placeholder.assignment_notes_short', 'placeholder', 'Assignment notes...', 'ملاحظات التعيين...'),
('placeholder.add_new_item', 'placeholder', 'Add new item...', 'إضافة عنصر جديد...'),
('placeholder.role_description', 'placeholder', 'Describe what this role can do...', 'صف ما يمكن لهذا الدور فعله...'),
('placeholder.name_or_email', 'placeholder', 'Name or email...', 'الاسم أو البريد الإلكتروني...'),
('placeholder.decision_notes', 'placeholder', 'Add notes about your decision (optional)...', 'أضف ملاحظات حول قرارك (اختياري)...'),
('placeholder.role_qualifications', 'placeholder', 'Please provide detailed information about your qualifications for this role. For Domain Expert: List your areas of expertise, education, certifications, and relevant experience. For Evaluator: Describe your experience evaluating projects, innovations, or similar work. Include specific examples and how you plan to contribute to the platform...', 'يرجى تقديم معلومات مفصلة حول مؤهلاتك لهذا الدور. للخبير في المجال: اذكر مجالات خبرتك وتعليمك وشهاداتك وخبرتك ذات الصلة. للمقيم: صف خبرتك في تقييم المشاريع أو الابتكارات أو العمل المماثل. قدم أمثلة محددة وكيف تخطط للمساهمة في المنصة...'),
('placeholder.search_sectors', 'placeholder', 'Search sectors by name, description, or Vision 2030 alignment...', 'البحث في القطاعات بالاسم أو الوصف أو التوافق مع رؤية 2030...'),
('placeholder.search_translations', 'placeholder', 'Search translations...', 'البحث في الترجمات...'),
('placeholder.slack_webhook', 'placeholder', 'https://hooks.slack.com/services/...', 'https://hooks.slack.com/services/...'),
('placeholder.teams_webhook', 'placeholder', 'https://outlook.office.com/webhook/...', 'https://outlook.office.com/webhook/...'),
('placeholder.meeting_link', 'placeholder', 'https://meet.google.com/...', 'https://meet.google.com/...'),
('placeholder.website_url', 'placeholder', 'https://example.com', 'https://example.com'),
('placeholder.search_challenges', 'placeholder', 'Search challenges...', 'البحث في التحديات...'),
('placeholder.event_url', 'placeholder', 'https://...', 'https://...'),
('placeholder.search_participants', 'placeholder', 'Search participants...', 'البحث في المشاركين...'),
('placeholder.search_organizations', 'placeholder', 'Search organizations...', 'البحث في المنظمات...'),

-- Select placeholders
('select.role_request', 'placeholder', 'Select the role you want to request...', 'اختر الدور الذي تريد طلبه...'),
('select.role_reason', 'placeholder', 'Select why you need this role...', 'اختر سبب حاجتك لهذا الدور...'),
('select.deputy', 'placeholder', 'Select deputy', 'اختر النائب'),
('select.department', 'placeholder', 'Select department', 'اختر القسم'),
('select.domain', 'placeholder', 'Select domain', 'اختر المجال'),
('select.subdomain', 'placeholder', 'Select sub-domain', 'اختر المجال الفرعي'),
('select.bucket', 'placeholder', 'Select a bucket', 'اختر حاوية'),
('select.category', 'placeholder', 'Select category', 'اختر الفئة'),
('select.status', 'placeholder', 'Select status', 'اختر الحالة'),
('select.sort', 'placeholder', 'Sort', 'ترتيب'),

-- Confirm messages
('confirm.delete_partner', 'confirm', 'Are you sure you want to delete this partner?', 'هل أنت متأكد من حذف هذا الشريك؟'),
('confirm.delete_translation', 'confirm', 'Are you sure you want to delete this translation?', 'هل أنت متأكد من حذف هذه الترجمة؟'),
('confirm.delete_focus_question', 'confirm', 'هل أنت متأكد من حذف هذا السؤال المحوري؟', 'Are you sure you want to delete this focus question?'),
('confirm.delete_bucket', 'confirm', 'هل أنت متأكد من حذف هذا الباقة؟', 'Are you sure you want to delete this bucket?'),

-- Form validation
('validation.fill_required_fields', 'validation', 'Please fill in all required fields', 'يرجى ملء جميع الحقول المطلوبة'),
('validation.login_required', 'validation', 'You must be logged in to request a role', 'يجب تسجيل الدخول لطلب دور')
ON CONFLICT (translation_key) DO UPDATE SET
text_en = EXCLUDED.text_en,
text_ar = EXCLUDED.text_ar,
category = EXCLUDED.category,
updated_at = now();