import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { useTranslation } from '@/hooks/useAppTranslation';

type Tag = Database['public']['Tables']['tags']['Row'];
type TagInsert = Database['public']['Tables']['tags']['Insert'];

export interface TagWithRelations extends Tag {
  _count?: {
    challenge_tags: number;
    event_tags: number;
    campaign_tags: number;
    partner_tags: number;
    stakeholder_tags: number;
    user_tags: number;
  };
}

interface UseTagsResult {
  tags: TagWithRelations[];
  loading: boolean;
  error: string | null;
  createTag: (tag: Omit<TagInsert, 'id' | 'created_at' | 'updated_at'>) => Promise<Tag | null>;
  updateTag: (id: string, updates: Partial<TagInsert>) => Promise<Tag | null>;
  deleteTag: (id: string) => Promise<boolean>;
  getTagsByCategory: (category: string) => TagWithRelations[];
  getPopularTags: (limit?: number) => TagWithRelations[];
  searchTags: (query: string) => TagWithRelations[];
  refreshTags: () => Promise<void>;
}

export const useTags = (): UseTagsResult => {
  const [tags, setTags] = useState<TagWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useTranslation();

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('tags')
        .select(`
          *,
          challenge_tags(count),
          event_tags(count),
          campaign_tags(count),
          partner_tags(count),
          stakeholder_tags(count),
          user_tags(count)
        `)
        .order('usage_count', { ascending: false });

      if (error) throw error;

      const tagsWithCounts = data?.map(tag => ({
        ...tag,
        _count: {
          challenge_tags: tag.challenge_tags?.length || 0,
          event_tags: tag.event_tags?.length || 0,
          campaign_tags: tag.campaign_tags?.length || 0,
          partner_tags: tag.partner_tags?.length || 0,
          stakeholder_tags: tag.stakeholder_tags?.length || 0,
          user_tags: tag.user_tags?.length || 0,
        }
      })) || [];

      setTags(tagsWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (tagData: Omit<TagInsert, 'id' | 'created_at' | 'updated_at'>): Promise<Tag | null> => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([{
          ...tagData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single();

      if (error) throw error;

      await refreshTags();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tag');
      return null;
    }
  };

  const updateTag = async (id: string, updates: Partial<TagInsert>): Promise<Tag | null> => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await refreshTags();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tag');
      return null;
    }
  };

  const deleteTag = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await refreshTags();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tag');
      return false;
    }
  };

  const getTagsByCategory = (category: string): TagWithRelations[] => {
    return tags.filter(tag => tag.category === category);
  };

  const getPopularTags = (limit: number = 10): TagWithRelations[] => {
    return tags
      .sort((a, b) => (b.usage_count || 0) - (a.usage_count || 0))
      .slice(0, limit);
  };

  const searchTags = (query: string): TagWithRelations[] => {
    const lowercaseQuery = query.toLowerCase();
    return tags.filter(tag => 
      (language === 'ar' ? tag.name_ar : tag.name_en).toLowerCase().includes(lowercaseQuery) ||
      (language === 'ar' ? tag.description_ar : tag.description_en)?.toLowerCase().includes(lowercaseQuery) ||
      tag.slug.toLowerCase().includes(lowercaseQuery)
    );
  };

  const refreshTags = async () => {
    await fetchTags();
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    getTagsByCategory,
    getPopularTags,
    searchTags,
    refreshTags
  };
};