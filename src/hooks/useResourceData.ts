import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { createErrorHandler } from '@/utils/errorHandler';

interface Resource {
  id: string;
  name: string;
  type: string;
  size: number;
  status: string;
  description?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  file_path?: string;
  category: string;
}

export const useResourceData = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const errorHandler = createErrorHandler({ component: 'useResourceData' });

  // Mock data for resources
  const mockResources: Resource[] = [
    {
      id: '1',
      name: 'Policy Document.pdf',
      type: 'pdf',
      size: 2048000,
      status: 'active',
      description: 'Company policy document',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'admin',
      file_path: '/documents/policy.pdf',
      category: 'documents'
    },
    {
      id: '2', 
      name: 'Training Video.mp4',
      type: 'video',
      size: 104857600,
      status: 'active',
      description: 'Employee training video',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'admin',
      file_path: '/videos/training.mp4',
      category: 'videos'
    }
  ];

  const refreshResources = useCallback(async () => {
    setLoading(true);
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      setResources(mockResources);
    } catch (error) {
      errorHandler.handleError(error as Error, 'refreshResources');
      toast({
        title: 'خطأ في جلب الموارد',
        description: 'حدث خطأ أثناء جلب بيانات الموارد',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [errorHandler, toast]);

  const createResource = useCallback(async (resourceData: any) => {
    try {
      // Mock implementation
      const newResource = {
        ...resourceData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setResources(prev => [newResource, ...prev]);
      toast({
        title: 'تم إنشاء المورد',
        description: 'تم إنشاء المورد بنجاح',
      });
      return newResource;
    } catch (error) {
      errorHandler.handleError(error as Error, 'createResource');
      throw error;
    }
  }, [errorHandler, toast]);

  const updateResource = useCallback(async (id: string, updates: any) => {
    try {
      setResources(prev => prev.map(resource => 
        resource.id === id ? { ...resource, ...updates } : resource
      ));
      toast({
        title: 'تم تحديث المورد',
        description: 'تم تحديث المورد بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'updateResource');
      throw error;
    }
  }, [errorHandler, toast]);

  const deleteResource = useCallback(async (id: string) => {
    try {
      setResources(prev => prev.filter(resource => resource.id !== id));
      toast({
        title: 'تم حذف المورد',
        description: 'تم حذف المورد بنجاح',
      });
    } catch (error) {
      errorHandler.handleError(error as Error, 'deleteResource');
      throw error;
    }
  }, [errorHandler, toast]);

  return {
    resources,
    loading,
    refreshResources,
    createResource,
    updateResource,
    deleteResource,
  };
};