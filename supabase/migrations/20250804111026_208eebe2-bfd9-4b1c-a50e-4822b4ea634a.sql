-- Complete tag system setup with correct syntax

-- Insert seed data for tags using correct column names and syntax
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.tags WHERE name_en = 'Technology') THEN
    INSERT INTO public.tags (name_en, name_ar, description_en, description_ar, category, color, is_system)
    VALUES
      ('Technology', 'تقنية', 'Technology-related content', 'محتوى متعلق بالتقنية', 'technology', '#3B82F6', false),
      ('Innovation', 'ابتكار', 'Innovation and creativity', 'الابتكار والإبداع', 'theme', '#10B981', false),
      ('Healthcare', 'صحة', 'Healthcare and medical', 'الرعاية الصحية والطبية', 'sector', '#EF4444', false),
      ('Education', 'تعليم', 'Education and learning', 'التعليم والتعلم', 'sector', '#F59E0B', false),
      ('Finance', 'مالية', 'Financial services', 'الخدمات المالية', 'sector', '#8B5CF6', false),
      ('Sustainability', 'استدامة', 'Environmental sustainability', 'الاستدامة البيئية', 'theme', '#059669', false),
      ('Digital Transformation', 'تحول رقمي', 'Digital transformation initiatives', 'مبادرات التحول الرقمي', 'technology', '#6366F1', false),
      ('Artificial Intelligence', 'ذكاء اصطناعي', 'AI and machine learning', 'الذكاء الاصطناعي والتعلم الآلي', 'technology', '#EC4899', false),
      ('Blockchain', 'بلوك تشين', 'Blockchain technology', 'تقنية البلوك تشين', 'technology', '#F97316', false),
      ('IoT', 'إنترنت الأشياء', 'Internet of Things', 'إنترنت الأشياء', 'technology', '#06B6D4', false),
      ('Research', 'بحث', 'Research and development', 'البحث والتطوير', 'theme', '#84CC16', false),
      ('Startup', 'شركة ناشئة', 'Startup and entrepreneurship', 'الشركات الناشئة وريادة الأعمال', 'theme', '#F43F5E', false);
  END IF;
END $$;