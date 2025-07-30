-- Update challenges table to add image_url if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'challenges' AND column_name = 'image_url') THEN
        ALTER TABLE public.challenges ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Create challenge_bookmarks table
CREATE TABLE IF NOT EXISTS public.challenge_bookmarks (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    challenge_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, challenge_id)
);

-- Create challenge_feedback table
CREATE TABLE IF NOT EXISTS public.challenge_feedback (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    challenge_id UUID NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback_text TEXT,
    would_recommend BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.challenge_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_feedback ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenge_bookmarks
CREATE POLICY "Users can manage their own challenge bookmarks" 
ON public.challenge_bookmarks 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- RLS policies for challenge_feedback  
CREATE POLICY "Users can manage their own feedback" 
ON public.challenge_feedback 
FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view challenge feedback" 
ON public.challenge_feedback 
FOR SELECT 
USING (true);

-- Create storage bucket for challenge attachments if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('challenge-attachments', 'challenge-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for challenge attachments
CREATE POLICY "Anyone can view challenge attachments" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'challenge-attachments');

CREATE POLICY "Authenticated users can upload challenge attachments" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'challenge-attachments' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own challenge attachments" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'challenge-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own challenge attachments" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'challenge-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed challenge data with images
INSERT INTO public.challenges (
    title_ar,
    description_ar,
    status,
    priority_level,
    challenge_type,
    start_date,
    end_date,
    estimated_budget,
    sensitivity_level,
    image_url,
    created_by
) VALUES 
(
    'تطوير حلول ذكية للنقل المستدام',
    'ابتكار حلول تقنية متطورة لتحسين وسائل النقل العام وتقليل الانبعاثات الكربونية باستخدام تقنيات الذكاء الاصطناعي وإنترنت الأشياء',
    'active',
    'عالي',
    'تقني',
    '2024-01-15',
    '2024-12-31',
    50000,
    'normal',
    '/challenge-images/smart-city.jpg',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'منصة رقمية لدعم المشاريع الصغيرة',
    'تطوير منصة شاملة ومتكاملة لدعم وتمويل المشاريع الصغيرة والمتوسطة مع أدوات تحليل مالي وإدارة المخاطر',
    'active',
    'عالي',
    'أعمال',
    '2024-02-01',
    '2024-11-15',
    75000,
    'normal',
    '/challenge-images/digital-transformation.jpg',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'نظام ذكي لإدارة الموارد المائية',
    'تصميم نظام متطور لمراقبة وإدارة استخدام الموارد المائية بكفاءة عالية مع التنبؤ بالاستهلاك وتحسين التوزيع',
    'planning',
    'متوسط',
    'بيئي',
    '2024-03-01',
    '2025-01-20',
    60000,
    'normal',
    '/challenge-images/innovation-lightbulb-blue.jpg',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'تطبيق ذكي للصحة النفسية',
    'تطوير تطبيق يستخدم الذكاء الاصطناعي لدعم الصحة النفسية وتقديم الاستشارات الأولية والمتابعة المستمرة',
    'active',
    'عالي',
    'صحي',
    '2024-01-20',
    '2024-10-30',
    40000,
    'normal',
    '/challenge-images/ai-technology.jpg',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'منصة تعليمية تفاعلية للأطفال',
    'إنشاء منصة تعليمية مبتكرة تجعل التعلم ممتعاً وتفاعلياً للأطفال باستخدام الألعاب التعليمية والواقع المعزز',
    'completed',
    'متوسط',
    'تعليمي',
    '2024-01-01',
    '2024-08-15',
    30000,
    'normal',
    '/challenge-images/programming-challenge.jpg',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'تطوير أدوات البرمجة المتقدمة',
    'ابتكار أدوات برمجية متطورة لتسريع عملية التطوير وتحسين جودة الكود المكتوب',
    'active',
    'متوسط',
    'تقني',
    '2024-02-15',
    '2024-12-01',
    45000,
    'normal',
    '/challenge-images/code-development.jpg',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'حلول الذكاء الاصطناعي للأعمال',
    'تطوير حلول ذكاء اصطناعي قابلة للتطبيق في بيئة الأعمال لتحسين الكفاءة والإنتاجية',
    'active',
    'عالي',
    'تقني',
    '2024-01-10',
    '2024-11-30',
    80000,
    'normal',
    '/challenge-images/circuit-board-tech.jpg',
    (SELECT id FROM auth.users LIMIT 1)
),
(
    'مبادرة الابتكار في البيئة الرقمية',
    'تطوير حلول مبتكرة للتحديات البيئية باستخدام التقنيات الرقمية المتطورة',
    'planning',
    'متوسط',
    'بيئي',
    '2024-04-01',
    '2024-12-15',
    55000,
    'normal',
    '/challenge-images/innovation-lightbulb.jpg',
    (SELECT id FROM auth.users LIMIT 1)
)
ON CONFLICT (title_ar) DO UPDATE SET
    image_url = EXCLUDED.image_url,
    updated_at = now();

-- Add triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables that have updated_at columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_challenge_feedback_updated_at') THEN
        CREATE TRIGGER update_challenge_feedback_updated_at 
        BEFORE UPDATE ON public.challenge_feedback 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;