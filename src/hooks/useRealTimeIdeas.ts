import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Idea {
  id: string;
  title_ar: string;
  description_ar: string;
  status: string;
  maturity_level: string;
  challenge_id?: string;
  focus_question_id?: string;
  innovator_id: string;
  feasibility_score: number;
  impact_score: number;
  innovation_score: number;
  alignment_score: number;
  overall_score: number;
  image_url?: string;
  featured?: boolean;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

interface UseRealTimeIdeasReturn {
  ideas: Idea[];
  loading: boolean;
  error: string | null;
  refreshIdeas: () => Promise<void>;
}

export function useRealTimeIdeas(): UseRealTimeIdeasReturn {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('ideas')
        .select(`
          *,
          innovators!ideas_innovator_id_fkey(
            id,
            user_id
          ),
          challenges!ideas_challenge_id_fkey(
            title_ar,
            sector_id,
            sectors!challenges_sector_id_fkey(name_ar)
          )
        `)
        .neq('status', 'draft')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setIdeas((data as any) || []);
    } catch (err: any) {
      console.error('Error fetching ideas:', err);
      setError(err.message);
      toast({
        title: 'خطأ في تحميل الأفكار',
        description: 'حدث خطأ أثناء تحميل الأفكار',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshIdeas = async () => {
    await fetchIdeas();
  };

  useEffect(() => {
    fetchIdeas();

    // Set up real-time subscription
    const channel = supabase
      .channel('ideas-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ideas'
        },
        (payload) => {
          console.log('Ideas real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newIdea = payload.new as Idea;
            if (newIdea.status !== 'draft') {
              setIdeas(prev => [newIdea, ...prev]);
              toast({
                title: 'فكرة جديدة',
                description: `تم إضافة فكرة جديدة: ${newIdea.title_ar}`
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedIdea = payload.new as Idea;
            setIdeas(prev => prev.map(idea => 
              idea.id === updatedIdea.id ? updatedIdea : idea
            ));
          } else if (payload.eventType === 'DELETE') {
            setIdeas(prev => prev.filter(idea => idea.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return {
    ideas,
    loading,
    error,
    refreshIdeas
  };
}