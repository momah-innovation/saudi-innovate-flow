import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'page' | 'post' | 'resource';
  status: 'draft' | 'published' | 'archived';
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  views: number;
  content_length: number;
  tags: string[];
}

interface ContentCategory {
  id: string;
  name: string;
  description: string;
  item_count: number;
  parent_id?: string;
}

export const useContentData = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<ContentCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useContentData' });

  // Mock data for content items
  const mockContent: ContentItem[] = [
    {
      id: '1',
      title: 'Innovation Best Practices',
      type: 'article',
      status: 'published',
      author_id: 'admin1',
      author_name: 'Admin User',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      views: 245,
      content_length: 1500,
      tags: ['innovation', 'best-practices']
    },
    {
      id: '2',
      title: 'Getting Started Guide',
      type: 'page',
      status: 'published',
      author_id: 'admin2',
      author_name: 'Content Manager',
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      views: 520,
      content_length: 2800,
      tags: ['guide', 'onboarding']
    },
    {
      id: '3',
      title: 'Platform Update Notes',
      type: 'post',
      status: 'draft',
      author_id: 'admin1',
      author_name: 'Admin User',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      content_length: 450,
      tags: ['updates', 'changelog']
    }
  ];

  const mockCategories: ContentCategory[] = [
    {
      id: '1',
      name: 'Documentation',
      description: 'User guides and documentation',
      item_count: 15
    },
    {
      id: '2',
      name: 'Blog',
      description: 'Blog posts and articles',
      item_count: 8
    },
    {
      id: '3',
      name: 'Resources',
      description: 'Downloadable resources and templates',
      item_count: 12
    }
  ];

  const refreshContent = useCallback(async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      setContent(mockContent);
      setCategories(mockCategories);
    } catch (error) {
      errorHandler.handleError(error as Error, { operation: 'refreshContent' });
      toast({
        title: 'خطأ في جلب المحتوى',
        description: 'حدث خطأ أثناء جلب بيانات المحتوى',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const createContent = useCallback(async (contentData: Partial<ContentItem>) => {
    try {
      const newContent: ContentItem = {
        id: Date.now().toString(),
        title: contentData.title || '',
        type: contentData.type || 'article',
        status: 'draft',
        author_id: 'current_user',
        author_name: 'Current User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0,
        content_length: 0,
        tags: contentData.tags || [],
        ...contentData
      };

      setContent(prev => [newContent, ...prev]);
      toast({
        title: 'تم إنشاء المحتوى',
        description: 'تم إنشاء المحتوى الجديد بنجاح',
      });
      return newContent;
    } catch (error) {
      errorHandler.handleError(error as Error, { operation: 'createContent' });
      throw error;
    }
  }, [errorHandler, toast]);

  const updateContent = useCallback(async (id: string, updates: Partial<ContentItem>) => {
    try {
      setContent(prev => prev.map(item => 
        item.id === id ? { ...item, ...updates, updated_at: new Date().toISOString() } : item
      ));
      toast({
        title: 'تم تحديث المحتوى',
        description: 'تم تحديث المحتوى بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, { operation: 'updateContent' });
      throw error;
    }
  }, [errorHandler, toast]);

  const deleteContent = useCallback(async (id: string) => {
    try {
      setContent(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'تم حذف المحتوى',
        description: 'تم حذف المحتوى بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, { operation: 'deleteContent' });
      throw error;
    }
  }, [errorHandler, toast]);

  const publishContent = useCallback(async (id: string) => {
    try {
      await updateContent(id, { status: 'published' });
      toast({
        title: 'تم نشر المحتوى',
        description: 'تم نشر المحتوى بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, { operation: 'publishContent' });
      throw error;
    }
  }, [updateContent, errorHandler, toast]);

  return {
    content,
    categories,
    loading,
    refreshContent,
    createContent,
    updateContent,
    deleteContent,
    publishContent,
  };
};