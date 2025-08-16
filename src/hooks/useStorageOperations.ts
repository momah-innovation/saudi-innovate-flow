import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface StorageFile {
  name: string;
  bucket_id: string;
  metadata?: any;
  created_at: string;
  updated_at?: string;
  last_accessed_at?: string;
}

export interface BucketInfo {
  id: string;
  name: string;
  public: boolean;
  created_at: string;
  updated_at: string;
}

export const useStorageOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const listBuckets = useCallback(async (): Promise<BucketInfo[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: storageError } = await supabase.storage.listBuckets();
      
      if (storageError) throw storageError;
      
      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list buckets';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const listFiles = useCallback(async (bucketId: string, options: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: string };
  } = {}): Promise<StorageFile[]> => {
    setLoading(true);
    
    try {
      const { data: files, error: filesError } = await supabase.storage
        .from(bucketId)
        .list('', {
          limit: options.limit || 100,
          offset: options.offset || 0,
          sortBy: options.sortBy || { column: 'name', order: 'asc' }
        });
      
      if (filesError) throw filesError;
      
      return files?.map(file => ({
        name: file.name,
        bucket_id: bucketId,
        metadata: file.metadata,
        created_at: file.created_at,
        updated_at: file.updated_at,
        last_accessed_at: file.last_accessed_at
      })) || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to list files';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const uploadFile = useCallback(async (
    bucketId: string, 
    file: File, 
    path: string,
    options: { upsert?: boolean; metadata?: Record<string, any> } = {}
  ): Promise<string | null> => {
    setLoading(true);
    
    try {
      const { data, error: uploadError } = await supabase.storage
        .from(bucketId)
        .upload(path, file, {
          upsert: options.upsert || false,
          metadata: options.metadata
        });
      
      if (uploadError) throw uploadError;
      
      toast({
        title: 'Success',
        description: 'File uploaded successfully'
      });
      
      return data?.path || null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const downloadFile = useCallback(async (bucketId: string, fileName: string): Promise<Blob | null> => {
    setLoading(true);
    
    try {
      const { data } = await supabase.storage.from(bucketId).download(fileName);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download file';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteFile = useCallback(async (bucketId: string, fileName: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { error: deleteError } = await supabase.storage
        .from(bucketId)
        .remove([fileName]);
      
      if (deleteError) throw deleteError;
      
      toast({
        title: 'Success',
        description: 'File deleted successfully'
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const getPublicUrl = useCallback((bucketId: string, fileName: string): string => {
    const { data } = supabase.storage.from(bucketId).getPublicUrl(fileName);
    return data.publicUrl;
  }, []);

  const bulkDeleteFiles = useCallback(async (files: Array<{ bucketId: string; fileName: string }>): Promise<void> => {
    setLoading(true);
    
    try {
      // Group by bucket for efficient deletion
      const filesByBucket = files.reduce((acc, file) => {
        if (!acc[file.bucketId]) {
          acc[file.bucketId] = [];
        }
        acc[file.bucketId].push(file.fileName);
        return acc;
      }, {} as Record<string, string[]>);

      // Delete files by bucket
      const deletePromises = Object.entries(filesByBucket).map(([bucketId, fileNames]) =>
        supabase.storage.from(bucketId).remove(fileNames)
      );

      const results = await Promise.all(deletePromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error(`Failed to delete some files: ${errors.map(e => e.error?.message).join(', ')}`);
      }

      toast({
        title: 'Success',
        description: `${files.length} files deleted successfully`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete files';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const moveFiles = useCallback(async (
    operations: Array<{ fromBucket: string; toBucket: string; fileName: string; newPath?: string }>
  ): Promise<void> => {
    setLoading(true);
    
    try {
      for (const op of operations) {
        // Download from source
        const { data: fileData } = await supabase.storage
          .from(op.fromBucket)
          .download(op.fileName);
        
        if (!fileData) continue;

        // Upload to destination
        const targetPath = op.newPath || op.fileName;
        const { error: uploadError } = await supabase.storage
          .from(op.toBucket)
          .upload(targetPath, fileData);
        
        if (uploadError) throw uploadError;

        // Delete from source
        const { error: deleteError } = await supabase.storage
          .from(op.fromBucket)
          .remove([op.fileName]);
        
        if (deleteError) throw deleteError;
      }

      toast({
        title: 'Success',
        description: `${operations.length} files moved successfully`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to move files';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    loading,
    error,
    listBuckets,
    listFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    getPublicUrl,
    bulkDeleteFiles,
    moveFiles
  };
};