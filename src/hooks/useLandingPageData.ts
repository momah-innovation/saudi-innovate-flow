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
      console.log('📊 LANDING DATA DEBUG: Starting fetch', { timestamp: Date.now() });
      try {
        // Add timeout to prevent hanging requests
        const fetchTimeout = (promise: Promise<any>, timeout: number) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
          ]);
        };

        // Fetch FAQs with timeout and limit
        const faqPromise = supabase
          .from('landing_page_faqs')
          .select('*')
          .eq('is_active', true)
          .order('order_sequence')
          .limit(10); // Limit to prevent memory issues

        // Fetch public statistics with timeout and limit
        const statsPromise = supabase
          .from('public_statistics')
          .select('*')
          .eq('is_visible', true)
          .order('display_order')
          .limit(10); // Limit to prevent memory issues

        // Fetch content sections with timeout and limit
        const contentPromise = supabase
          .from('landing_page_content')
          .select('*')
          .eq('is_active', true)
          .order('display_order')
          .limit(20); // Limit to prevent memory issues

        // Execute all promises with 10-second timeout
        const [faqResult, statsResult, contentResult] = await Promise.all([
          fetchTimeout(faqPromise, 10000),
          fetchTimeout(statsPromise, 10000),
          fetchTimeout(contentPromise, 10000)
        ]);

        setFaqs(faqResult.data || []);
        setStatistics(statsResult.data || []);
        setContent(contentResult.data || []);
        console.log('📊 LANDING DATA DEBUG: Fetch successful', {
          faqCount: (faqResult.data || []).length,
          statsCount: (statsResult.data || []).length,
          contentCount: (contentResult.data || []).length,
          timestamp: Date.now()
        });
      } catch (error) {
        console.error('📊 LANDING DATA DEBUG: Fetch failed', error);
        logger.error('Failed to fetch landing page data', { component: 'useLandingPageData', action: 'fetchLandingPageData' }, error as Error);
      } finally {
        console.log('📊 LANDING DATA DEBUG: Setting loading to false', { timestamp: Date.now() });
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