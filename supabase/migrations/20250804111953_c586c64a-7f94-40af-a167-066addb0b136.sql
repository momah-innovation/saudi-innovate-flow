-- Add sample data for challenges to populate the system

DO $$
DECLARE
  tech_tag_id UUID;
  innovation_tag_id UUID;
  healthcare_tag_id UUID;
  education_tag_id UUID;
  finance_tag_id UUID;
  challenge1_id UUID;
  challenge2_id UUID;
  challenge3_id UUID;
BEGIN
  -- Get tag IDs
  SELECT id INTO tech_tag_id FROM public.tags WHERE name_en = 'Technology' LIMIT 1;
  SELECT id INTO innovation_tag_id FROM public.tags WHERE name_en = 'Innovation' LIMIT 1;
  SELECT id INTO healthcare_tag_id FROM public.tags WHERE name_en = 'Healthcare' LIMIT 1;
  SELECT id INTO education_tag_id FROM public.tags WHERE name_en = 'Education' LIMIT 1;
  SELECT id INTO finance_tag_id FROM public.tags WHERE name_en = 'Finance' LIMIT 1;

  -- Insert sample challenges if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.challenges WHERE title_ar = 'تحدي الذكاء الاصطناعي في التعليم') THEN
    -- Challenge 1: AI in Education
    INSERT INTO public.challenges (
      title_ar, 
      description_ar,
      status,
      priority_level,
      start_date,
      end_date,
      estimated_budget,
      challenge_type,
      sensitivity_level
    ) VALUES (
      'تحدي الذكاء الاصطناعي في التعليم',
      'تطوير حلول مبتكرة باستخدام الذكاء الاصطناعي لتحسين جودة التعليم وجعله أكثر تفاعلية ومخصصة لاحتياجات الطلاب المختلفة.',
      'active',
      'عالي',
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '90 days',
      500000,
      'innovation',
      'normal'
    ) RETURNING id INTO challenge1_id;

    -- Add tags to challenge 1
    IF tech_tag_id IS NOT NULL AND innovation_tag_id IS NOT NULL AND education_tag_id IS NOT NULL THEN
      INSERT INTO public.challenge_tags (challenge_id, tag_id) VALUES
        (challenge1_id, tech_tag_id),
        (challenge1_id, innovation_tag_id),
        (challenge1_id, education_tag_id);
    END IF;

    -- Challenge 2: Digital Healthcare Solutions
    INSERT INTO public.challenges (
      title_ar,
      description_ar,
      status,
      priority_level,
      start_date,
      end_date,
      estimated_budget,
      challenge_type,
      sensitivity_level
    ) VALUES (
      'حلول الرعاية الصحية الرقمية',
      'ابتكار تطبيقات وأنظمة رقمية لتحسين خدمات الرعاية الصحية وتسهيل الوصول إلى الخدمات الطبية للمواطنين.',
      'active',
      'متوسط',
      CURRENT_DATE,
      CURRENT_DATE + INTERVAL '120 days',
      750000,
      'technology',
      'normal'
    ) RETURNING id INTO challenge2_id;

    -- Add tags to challenge 2
    IF tech_tag_id IS NOT NULL AND healthcare_tag_id IS NOT NULL THEN
      INSERT INTO public.challenge_tags (challenge_id, tag_id) VALUES
        (challenge2_id, tech_tag_id),
        (challenge2_id, healthcare_tag_id);
    END IF;

    -- Challenge 3: Fintech Innovation
    INSERT INTO public.challenges (
      title_ar,
      description_ar,
      status,
      priority_level,
      start_date,
      end_date,
      estimated_budget,
      challenge_type,
      sensitivity_level
    ) VALUES (
      'ابتكارات التقنية المالية',
      'تطوير حلول مالية رقمية مبتكرة لتحسين الخدمات المصرفية والمالية وتعزيز الشمول المالي في المملكة.',
      'planning',
      'عالي',
      CURRENT_DATE + INTERVAL '30 days',
      CURRENT_DATE + INTERVAL '150 days',
      1000000,
      'fintech',
      'high'
    ) RETURNING id INTO challenge3_id;

    -- Add tags to challenge 3
    IF tech_tag_id IS NOT NULL AND finance_tag_id IS NOT NULL AND innovation_tag_id IS NOT NULL THEN
      INSERT INTO public.challenge_tags (challenge_id, tag_id) VALUES
        (challenge3_id, tech_tag_id),
        (challenge3_id, finance_tag_id),
        (challenge3_id, innovation_tag_id);
    END IF;
  END IF;
END $$;