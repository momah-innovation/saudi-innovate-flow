import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseRuntimeTranslationsResult {
  updateTranslation: (key: string, value: string, language: 'en' | 'ar') => Promise<boolean>;
  uploadAllTranslations: (language: 'en' | 'ar', translations: Record<string, any>) => Promise<boolean>;
  isUpdating: boolean;
}

export const useRuntimeTranslations = (): UseRuntimeTranslationsResult => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const updateTranslation = async (key: string, value: string, language: 'en' | 'ar'): Promise<boolean> => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-translations', {
        body: {
          action: 'update',
          key,
          value,
          language
        }
      });

      if (error) {
        console.error('Error updating translation:', error);
        toast({
          title: "Translation Update Failed",
          description: `Failed to update translation: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      if (data?.success) {
        toast({
          title: "Translation Updated",
          description: `Successfully updated translation key: ${key}`,
          variant: "default"
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in updateTranslation:', error);
      toast({
        title: "Update Error",
        description: "An unexpected error occurred while updating the translation",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const uploadAllTranslations = async (language: 'en' | 'ar', translations: Record<string, any>): Promise<boolean> => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-translations', {
        body: {
          action: 'upload_all',
          language,
          translations
        }
      });

      if (error) {
        console.error('Error uploading translations:', error);
        toast({
          title: "Upload Failed",
          description: `Failed to upload translations: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      if (data?.success) {
        toast({
          title: "Translations Uploaded",
          description: `Successfully uploaded ${data.count} translations for ${language}`,
          variant: "default"
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in uploadAllTranslations:', error);
      toast({
        title: "Upload Error", 
        description: "An unexpected error occurred while uploading translations",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateTranslation,
    uploadAllTranslations,
    isUpdating
  };
};