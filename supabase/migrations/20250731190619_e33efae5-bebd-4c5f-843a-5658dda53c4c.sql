-- Create opportunities table and seed with sample data
CREATE TABLE IF NOT EXISTS public.opportunities (
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

-- Now seed analytics tables with realistic data based on the opportunities we just created
DO $$
DECLARE
    opp_record RECORD;
    session_id TEXT;
    i INTEGER;
BEGIN
    -- For each opportunity, create realistic analytics data
    FOR opp_record IN (SELECT id FROM public.opportunities WHERE status = 'open') LOOP
        
        -- Seed opportunity_analytics
        INSERT INTO public.opportunity_analytics (
            opportunity_id, view_count, like_count, application_count, share_count, last_updated
        ) VALUES (
            opp_record.id,
            FLOOR(RANDOM() * 500 + 50)::INTEGER,
            FLOOR(RANDOM() * 50 + 5)::INTEGER,
            FLOOR(RANDOM() * 20 + 2)::INTEGER,
            FLOOR(RANDOM() * 15 + 1)::INTEGER,
            NOW() - INTERVAL '1 day' * RANDOM() * 30
        ) ON CONFLICT (opportunity_id) DO UPDATE SET
            view_count = EXCLUDED.view_count,
            like_count = EXCLUDED.like_count,
            application_count = EXCLUDED.application_count,
            share_count = EXCLUDED.share_count;
        
        -- Seed opportunity_geographic_analytics
        INSERT INTO public.opportunity_geographic_analytics (
            opportunity_id, country_code, country_name, region, city, view_count, application_count, last_updated
        ) VALUES 
            (opp_record.id, 'SA', 'Saudi Arabia', 'Riyadh Province', 'Riyadh', FLOOR(RANDOM() * 200 + 20), FLOOR(RANDOM() * 8 + 1), NOW()),
            (opp_record.id, 'SA', 'Saudi Arabia', 'Makkah Province', 'Jeddah', FLOOR(RANDOM() * 150 + 15), FLOOR(RANDOM() * 6 + 1), NOW()),
            (opp_record.id, 'SA', 'Saudi Arabia', 'Eastern Province', 'Dammam', FLOOR(RANDOM() * 100 + 10), FLOOR(RANDOM() * 4 + 1), NOW()),
            (opp_record.id, 'AE', 'United Arab Emirates', 'Dubai', 'Dubai', FLOOR(RANDOM() * 80 + 8), FLOOR(RANDOM() * 3 + 1), NOW()),
            (opp_record.id, 'KW', 'Kuwait', 'Al Asimah', 'Kuwait City', FLOOR(RANDOM() * 60 + 6), FLOOR(RANDOM() * 2 + 1), NOW())
        ON CONFLICT (opportunity_id, country_code, region, city) DO UPDATE SET
            view_count = EXCLUDED.view_count,
            application_count = EXCLUDED.application_count;
        
        -- Seed opportunity_view_sessions (create 20-50 sessions per opportunity)
        FOR i IN 1..FLOOR(RANDOM() * 30 + 20) LOOP
            session_id := 'session_' || opp_record.id || '_' || i;
            
            INSERT INTO public.opportunity_view_sessions (
                opportunity_id, session_id, user_agent, referrer_url, 
                start_time, end_time, page_views, time_spent_seconds, 
                is_bounce, country_code, city, created_at
            ) VALUES (
                opp_record.id,
                session_id,
                CASE FLOOR(RANDOM() * 3)
                    WHEN 0 THEN 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    WHEN 1 THEN 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                    ELSE 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
                END,
                CASE FLOOR(RANDOM() * 4)
                    WHEN 0 THEN 'https://google.com'
                    WHEN 1 THEN 'https://twitter.com'
                    WHEN 2 THEN 'direct'
                    ELSE 'https://linkedin.com'
                END,
                NOW() - INTERVAL '1 hour' * RANDOM() * 720,
                NOW() - INTERVAL '1 hour' * RANDOM() * 720 + INTERVAL '1 minute' * (RANDOM() * 45 + 5),
                FLOOR(RANDOM() * 8 + 1)::INTEGER,
                FLOOR(RANDOM() * 600 + 30)::INTEGER,
                RANDOM() < 0.3,
                CASE FLOOR(RANDOM() * 5)
                    WHEN 0 THEN 'SA'
                    WHEN 1 THEN 'AE' 
                    WHEN 2 THEN 'KW'
                    WHEN 3 THEN 'QA'
                    ELSE 'BH'
                END,
                CASE FLOOR(RANDOM() * 5)
                    WHEN 0 THEN 'Riyadh'
                    WHEN 1 THEN 'Dubai'
                    WHEN 2 THEN 'Kuwait City'
                    WHEN 3 THEN 'Doha'
                    ELSE 'Manama'
                END,
                NOW() - INTERVAL '1 hour' * RANDOM() * 720
            );
        END LOOP;
        
    END LOOP;
    
    RAISE NOTICE 'Seeded analytics data for all opportunities';
END $$;