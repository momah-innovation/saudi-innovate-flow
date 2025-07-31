-- Create opportunities table
CREATE TABLE public.opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_ar TEXT NOT NULL,
    description_en TEXT,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'paused', 'draft')),
    budget_min DECIMAL(15,2),
    budget_max DECIMAL(15,2),
    deadline DATE,
    requirements TEXT,
    qualifications TEXT,
    location VARCHAR(255),
    type VARCHAR(50) DEFAULT 'project' CHECK (type IN ('project', 'contract', 'partnership', 'investment')),
    sector VARCHAR(100),
    tags TEXT[],
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view open opportunities" ON public.opportunities
    FOR SELECT USING (status = 'open');

CREATE POLICY "Admins can manage all opportunities" ON public.opportunities
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role IN ('admin', 'super_admin') 
            AND ur.is_active = true
        )
    );

-- Insert sample opportunities
INSERT INTO public.opportunities (
    title_ar, title_en, description_ar, description_en, status, budget_min, budget_max, 
    deadline, location, type, sector, tags
) VALUES 
    (
        'تطوير منصة ذكية للصحة الرقمية',
        'Smart Digital Health Platform Development',
        'نبحث عن شريك تقني لتطوير منصة ذكية شاملة للصحة الرقمية تخدم المرضى ومقدمي الرعاية الصحية',
        'Seeking a technical partner to develop a comprehensive smart digital health platform serving patients and healthcare providers',
        'open',
        500000,
        1500000,
        '2024-06-30',
        'الرياض',
        'project',
        'Healthcare',
        ARRAY['تكنولوجيا', 'صحة', 'ذكي']
    ),
    (
        'حلول الطاقة المتجددة للمدن الذكية',
        'Renewable Energy Solutions for Smart Cities',
        'مشروع تطوير حلول الطاقة المتجددة المبتكرة للمدن الذكية في المملكة العربية السعودية',
        'Project to develop innovative renewable energy solutions for smart cities in Saudi Arabia',
        'open',
        2000000,
        5000000,
        '2024-08-15',
        'جدة',
        'partnership',
        'Energy',
        ARRAY['طاقة متجددة', 'مدن ذكية', 'استدامة']
    ),
    (
        'منصة التعليم الإلكتروني التفاعلي',
        'Interactive E-Learning Platform',
        'تطوير منصة تعليم إلكتروني تفاعلية تستخدم تقنيات الذكاء الاصطناعي والواقع المعزز',
        'Developing an interactive e-learning platform using AI and augmented reality technologies',
        'open',
        800000,
        2000000,
        '2024-07-20',
        'الدمام',
        'contract',
        'Education',
        ARRAY['تعليم', 'ذكاء اصطناعي', 'واقع معزز']
    ),
    (
        'نظام إدارة المرور الذكي',
        'Smart Traffic Management System',
        'تطوير نظام ذكي لإدارة المرور باستخدام إنترنت الأشياء والذكاء الاصطناعي',
        'Developing a smart traffic management system using IoT and artificial intelligence',
        'open',
        1200000,
        3000000,
        '2024-09-10',
        'الرياض',
        'project',
        'Transportation',
        ARRAY['مرور', 'إنترنت الأشياء', 'ذكاء اصطناعي']
    ),
    (
        'حلول الزراعة الذكية والمستدامة',
        'Smart and Sustainable Agriculture Solutions',
        'مشروع لتطوير حلول زراعية ذكية ومستدامة تستخدم تقنيات حديثة لتحسين الإنتاجية',
        'Project to develop smart and sustainable agricultural solutions using modern technologies to improve productivity',
        'open',
        600000,
        1800000,
        '2024-10-05',
        'القصيم',
        'investment',
        'Agriculture',
        ARRAY['زراعة', 'استدامة', 'تقنية']
    );