import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Expert {
  id: string;
  name: string;
  name_ar?: string;
  profile_image_url?: string;
  role?: string;
  department?: string;
}

export function useExperts() {
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, name_ar, profile_image_url, department, position')
        .not('profile_image_url', 'is', null)
        .limit(20);

      if (error) throw error;

      const expertsData: Expert[] = (data || []).map(profile => ({
        id: profile.id,
        name: profile.name,
        name_ar: profile.name_ar,
        profile_image_url: profile.profile_image_url,
        role: profile.position,
        department: profile.department
      }));

      setExperts(expertsData);
    } catch (error) {
      console.error('Error loading experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRandomExperts = (count: number = 3): Expert[] => {
    if (experts.length === 0) return [];
    
    const shuffled = [...experts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, experts.length));
  };

  return {
    experts,
    loading,
    getRandomExperts
  };
}