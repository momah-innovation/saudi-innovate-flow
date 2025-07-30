-- Seed challenge data with images if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.challenges WHERE title_ar = 'تطوير حلول ذكية للنقل المستدام') THEN
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
            image_url
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
            '/challenge-images/smart-city.jpg'
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
            '/challenge-images/digital-transformation.jpg'
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
            '/challenge-images/innovation-lightbulb-blue.jpg'
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
            '/challenge-images/ai-technology.jpg'
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
            '/challenge-images/programming-challenge.jpg'
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
            '/challenge-images/code-development.jpg'
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
            '/challenge-images/circuit-board-tech.jpg'
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
            '/challenge-images/innovation-lightbulb.jpg'
        );
    END IF;
END $$;

-- Apply triggers to tables that have updated_at columns
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'update_challenge_feedback_updated_at') THEN
        CREATE TRIGGER update_challenge_feedback_updated_at 
        BEFORE UPDATE ON public.challenge_feedback 
        FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;