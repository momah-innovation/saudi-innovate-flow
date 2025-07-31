-- Create sample partnership applications for demonstration
INSERT INTO partnership_applications (
  opportunity_id, applicant_user_id, organization_name, contact_person, contact_email,
  proposed_contribution, application_details, application_status, 
  submitted_at, reviewed_at, reviewer_notes
) VALUES 

-- Sample applications for current user (for demo purposes)
(
  (SELECT id FROM partnership_opportunities WHERE title_ar LIKE '%الذكاء الاصطناعي%' LIMIT 1),
  '8066cfaf-4a91-4985-922b-74f6a286c441',
  'شركة التقنيات المتقدمة المحدودة',
  'د. أحمد الراشد',
  'ahmed@techcorp.sa',
  750000,
  'نحن شركة رائدة في مجال الذكاء الاصطناعي مع خبرة تزيد عن 10 سنوات في تطوير حلول ذكية للقطاع الحكومي. نقترح تمويل وتطوير منصة ذكية للخدمات الحكومية.',
  'approved',
  '2024-01-15 10:00:00',
  '2024-01-20 15:30:00',
  'طلب ممتاز مع خبرة تقنية قوية ومقترح واضح. تم الموافقة على الشراكة.'
),

(
  (SELECT id FROM partnership_opportunities WHERE title_ar LIKE '%الصحة الرقمية%' LIMIT 1),
  '8066cfaf-4a91-4985-922b-74f6a286c441',
  'مجموعة الصحة الذكية',
  'د. سارة محمد',
  'sara@healthtech.sa',
  500000,
  'مجموعة متخصصة في تطوير حلول الصحة الرقمية مع تركيز على تحسين تجربة المرضى وكفاءة الخدمات الطبية.',
  'under_review',
  '2024-01-20 14:00:00',
  NULL,
  NULL
),

(
  (SELECT id FROM partnership_opportunities WHERE title_ar LIKE '%المدن الذكية%' LIMIT 1),
  '8066cfaf-4a91-4985-922b-74f6a286c441',
  'مؤسسة الابتكار الحضري',
  'م. عمر حسان',
  'omar@urbancorp.sa',
  1200000,
  'نتطلع لتطوير حلول متكاملة للمدن الذكية تشمل إنترنت الأشياء والذكاء الاصطناعي لتحسين جودة الحياة الحضرية.',
  'pending',
  '2024-01-25 09:30:00',
  NULL,
  NULL
),

(
  (SELECT id FROM partnership_opportunities WHERE title_ar LIKE '%التعليم التفاعلي%' LIMIT 1),
  '8066cfaf-4a91-4985-922b-74f6a286c441',
  'شركة التعليم الرقمي المبتكر',
  'د. فاطمة الزهراء',
  'fatima@edtech.sa',
  800000,
  'شركة متخصصة في تطوير منصات التعليم الإلكتروني التفاعلية مع تقنيات الواقع المعزز والذكاء الاصطناعي.',
  'rejected',
  '2024-01-10 16:45:00',
  '2024-01-18 11:20:00',
  'متطلبات الميزانية غير متوافقة مع الأولويات الحالية. يرجى إعادة النظر في المقترح.'
);