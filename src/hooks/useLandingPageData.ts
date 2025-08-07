import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface FAQ {
  id: string;
  question_ar: string;
  answer_ar: string;
  category: string;
  order_sequence: number;
}

interface PublicStatistic {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_description_en: string | null;
  metric_description_ar: string | null;
  icon_name: string | null;
  display_order: number;
}

interface ContentSection {
  id: string;
  section_key: string;
  title_ar: string;
  content_ar: string;
  section_type: string;
  display_order: number;
}

export const useLandingPageData = (language: 'en' | 'ar' = 'en') => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [statistics, setStatistics] = useState<PublicStatistic[]>([]);
  const [content, setContent] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch FAQs
        const { data: faqData } = await supabase
          .from('landing_page_faqs')
          .select('*')
          .eq('is_active', true)
          .order('order_sequence');

        // Fetch public statistics
        const { data: statsData } = await supabase
          .from('public_statistics')
          .select('*')
          .eq('is_visible', true)
          .order('display_order');

        // Fetch content sections
        const { data: contentData } = await supabase
          .from('landing_page_content')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        setFaqs(faqData || []);
        setStatistics(statsData || []);
        setContent(contentData || []);
      } catch (error) {
        logger.error('Failed to fetch landing page data', { component: 'useLandingPageData', action: 'fetchLandingPageData' }, error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getText = (enText: string, arText: string | null): string => {
    return language === 'ar' && arText ? arText : enText;
  };

  const getProcessSteps = () => {
    return content.filter(item => item.section_type === 'process_step');
  };

  return {
    faqs,
    statistics,
    content,
    loading,
    getText,
    getProcessSteps
  };
};