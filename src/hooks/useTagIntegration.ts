import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from './useUnifiedTranslation';

interface Tag {
  id: string;
  name_ar: string;
  name_en: string;
  color: string;
  category: string;
  is_system: boolean;
}

export const useTagIntegration = () => {
  const { t } = useUnifiedTranslation();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available tags
  const fetchTags = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name_ar');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search tags by query
  const searchTags = async (query: string): Promise<Tag[]> => {
    if (!query.trim()) return tags;

    try {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .or(`name_ar.ilike.%${query}%,name_en.ilike.%${query}%`)
        .order('name_ar')
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to search tags:', error);
      return [];
    }
  };

  // Get suggested tags for content
  const getSuggestedTags = async (entityType: string, entityId: string): Promise<Tag[]> => {
    try {
      const { data, error } = await supabase
        .from('ai_tag_suggestions')
        .select(`
          suggested_tags,
          confidence_scores
        `)
        .eq('entity_type', entityType)
        .eq('entity_id', entityId)
        .eq('status', 'pending')
        .single();

      if (error || !data) return [];

      // Extract tag IDs from suggestions
      const tagIds = data.suggested_tags as string[];
      if (!tagIds.length) return [];

      const { data: tagData, error: tagError } = await supabase
        .from('tags')
        .select('*')
        .in('id', tagIds);

      if (tagError) throw tagError;
      return tagData || [];
    } catch (error) {
      console.error('Failed to get suggested tags:', error);
      return [];
    }
  };

  // Add tag to entity
  const addTagToEntity = async (entityType: string, entityId: string, tagId: string) => {
    try {
      const tableName = getTagTableName(entityType);
      if (!tableName) throw new Error('Invalid entity type');

      const { error } = await supabase
        .from(tableName as any)
        .insert({
          [`${entityType}_id`]: entityId,
          tag_id: tagId,
          added_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to add tag:', error);
      return false;
    }
  };

  // Remove tag from entity
  const removeTagFromEntity = async (entityType: string, entityId: string, tagId: string) => {
    try {
      const tableName = getTagTableName(entityType);
      if (!tableName) throw new Error('Invalid entity type');

      const { error } = await supabase
        .from(tableName as any)
        .delete()
        .eq(`${entityType}_id`, entityId)
        .eq('tag_id', tagId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to remove tag:', error);
      return false;
    }
  };

  // Get tags for entity
  const getEntityTags = async (entityType: string, entityId: string): Promise<Tag[]> => {
    try {
      const tableName = getTagTableName(entityType);
      if (!tableName) return [];

      const { data, error } = await supabase
        .from(tableName as any)
        .select(`
          tag_id,
          tags (*)
        `)
        .eq(`${entityType}_id`, entityId);

      if (error) throw error;
      return data?.map((item: any) => item.tags).filter(Boolean) || [];
    } catch (error) {
      console.error('Failed to get entity tags:', error);
      return [];
    }
  };

  // Helper function to get the correct tag table name
  const getTagTableName = (entityType: string): string | null => {
    const tableMap: Record<string, string> = {
      'challenge': 'challenge_tags',
      'campaign': 'campaign_tags'
    };
    return tableMap[entityType] || null;
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    searchTags,
    getSuggestedTags,
    addTagToEntity,
    removeTagFromEntity,
    getEntityTags,
    refreshTags: fetchTags
  };
};