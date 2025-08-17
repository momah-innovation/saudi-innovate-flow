import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { WorkspaceType } from '@/types/workspace';

interface FileUploadProgress {
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface WorkspaceFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  mimeType: string;
  workspaceType: WorkspaceType;
  workspaceId: string;
  uploadedBy: string;
  uploadedAt: string;
  filePath: string;
  publicUrl?: string;
  version: number;
  isCurrentVersion: boolean;
  permissions: {
    canView: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canShare: boolean;
  };
}

interface UseWorkspaceStorageOptions {
  workspaceType: WorkspaceType;
  workspaceId: string;
  maxFileSize?: number; // in bytes
  allowedTypes?: string[];
  enableVersioning?: boolean;
}

interface UseWorkspaceStorageReturn {
  files: WorkspaceFile[];
  uploadProgress: Record<string, FileUploadProgress>;
  isLoading: boolean;
  error: string | null;
  
  // File operations
  uploadFile: (file: File, options?: { folder?: string; replace?: boolean }) => Promise<WorkspaceFile>;
  downloadFile: (fileId: string) => Promise<Blob>;
  deleteFile: (fileId: string) => Promise<void>;
  shareFile: (fileId: string, permissions: string[]) => Promise<string>;
  
  // Version management
  getFileVersions: (fileId: string) => Promise<WorkspaceFile[]>;
  restoreVersion: (fileId: string, version: number) => Promise<WorkspaceFile>;
  
  // Folder operations
  createFolder: (folderName: string, parentPath?: string) => Promise<void>;
  deleteFolder: (folderPath: string) => Promise<void>;
  
  // Search and filtering
  searchFiles: (query: string, filters?: { type?: string; dateRange?: [Date, Date] }) => WorkspaceFile[];
  
  // Refresh data
  refreshFiles: () => Promise<void>;
}

export function useWorkspaceStorage(options: UseWorkspaceStorageOptions): UseWorkspaceStorageReturn {
  const { user } = useAuth();
  const {
    workspaceType,
    workspaceId,
    maxFileSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['*/*'],
    enableVersioning = true
  } = options;

  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, FileUploadProgress>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get workspace-specific bucket name
  const getBucketName = useCallback(() => {
    return `workspace-${workspaceType}-files`;
  }, [workspaceType]);

  // Get file path within bucket
  const getFilePath = useCallback((fileName: string, folder?: string) => {
    const basePath = `${workspaceId}/${user?.id}`;
    return folder ? `${basePath}/${folder}/${fileName}` : `${basePath}/${fileName}`;
  }, [workspaceId, user?.id]);

  // Load files for the workspace
  const loadFiles = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: queryError } = await supabase
        .from('workspace_files')
        .select(`
          *,
          profiles:uploaded_by(display_name)
        `)
        .eq('workspace_id', workspaceId)
        .eq('workspace_type', workspaceType)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (queryError) throw queryError;

      const filesWithPermissions: WorkspaceFile[] = data?.map(file => ({
        id: file.id,
        name: file.filename,
        originalName: file.original_filename,
        size: file.file_size,
        mimeType: file.mime_type,
        workspaceType: file.workspace_type as WorkspaceType,
        workspaceId: file.workspace_id,
        uploadedBy: file.uploaded_by,
        uploadedAt: file.created_at,
        filePath: file.file_path,
        version: file.version_number,
        isCurrentVersion: file.is_current_version,
        permissions: {
          canView: true, // Will be determined by RLS
          canEdit: file.uploaded_by === user.id,
          canDelete: file.uploaded_by === user.id,
          canShare: true
        }
      })) || [];

      setFiles(filesWithPermissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setIsLoading(false);
    }
  }, [user, workspaceId, workspaceType]);

  // Upload file with progress tracking
  const uploadFile = useCallback(async (
    file: File, 
    options: { folder?: string; replace?: boolean } = {}
  ): Promise<WorkspaceFile> => {
    if (!user) throw new Error('User not authenticated');

    // Validate file
    if (file.size > maxFileSize) {
      throw new Error(`File size exceeds limit of ${maxFileSize / 1024 / 1024}MB`);
    }

    if (allowedTypes[0] !== '*/*' && !allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`);
    }

    const uploadId = `${Date.now()}-${file.name}`;
    const fileName = options.replace ? file.name : `${Date.now()}-${file.name}`;
    const filePath = getFilePath(fileName, options.folder);

    // Initialize upload progress
    setUploadProgress(prev => ({
      ...prev,
      [uploadId]: { progress: 0, status: 'uploading' }
    }));

    try {
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(getBucketName())
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: options.replace
        });

      if (uploadError) throw uploadError;

      // Update progress
      setUploadProgress(prev => ({
        ...prev,
        [uploadId]: { progress: 80, status: 'processing' }
      }));

      // Record file in database
      const { data: fileRecord, error: dbError } = await supabase
        .from('workspace_files')
        .insert({
          workspace_id: workspaceId,
          workspace_type: workspaceType,
          filename: fileName,
          original_filename: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
          folder_path: options.folder || '',
          access_level: 'workspace',
          version_number: 1,
          is_current_version: true,
          status: 'active'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Complete upload
      setUploadProgress(prev => ({
        ...prev,
        [uploadId]: { progress: 100, status: 'completed' }
      }));

      // Clean up progress after delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const { [uploadId]: _, ...rest } = prev;
          return rest;
        });
      }, 2000);

      // Refresh files list
      await loadFiles();

      return {
        id: fileRecord.id,
        name: fileRecord.filename,
        originalName: fileRecord.original_filename,
        size: fileRecord.file_size,
        mimeType: fileRecord.mime_type,
        workspaceType: fileRecord.workspace_type as WorkspaceType,
        workspaceId: fileRecord.workspace_id,
        uploadedBy: fileRecord.uploaded_by,
        uploadedAt: fileRecord.created_at,
        filePath: fileRecord.file_path,
        version: fileRecord.version_number,
        isCurrentVersion: fileRecord.is_current_version,
        permissions: {
          canView: true,
          canEdit: true,
          canDelete: true,
          canShare: true
        }
      };

    } catch (err) {
      setUploadProgress(prev => ({
        ...prev,
        [uploadId]: { 
          progress: 0, 
          status: 'error', 
          error: err instanceof Error ? err.message : 'Upload failed' 
        }
      }));
      throw err;
    }
  }, [user, workspaceId, workspaceType, maxFileSize, allowedTypes, getBucketName, getFilePath, loadFiles]);

  // Download file
  const downloadFile = useCallback(async (fileId: string): Promise<Blob> => {
    const file = files.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');

    const { data, error } = await supabase.storage
      .from(getBucketName())
      .download(file.filePath);

    if (error) throw error;
    return data;
  }, [files, getBucketName]);

  // Delete file
  const deleteFile = useCallback(async (fileId: string): Promise<void> => {
    const file = files.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');

    // Soft delete in database
    const { error: dbError } = await supabase
      .from('workspace_files')
      .update({ 
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        deleted_by: user?.id
      })
      .eq('id', fileId);

    if (dbError) throw dbError;

    // Remove from storage (optional, could be done in background)
    await supabase.storage
      .from(getBucketName())
      .remove([file.filePath]);

    // Refresh files list
    await loadFiles();
  }, [files, getBucketName, user?.id, loadFiles]);

  // Share file
  const shareFile = useCallback(async (fileId: string, permissions: string[]): Promise<string> => {
    const file = files.find(f => f.id === fileId);
    if (!file) throw new Error('File not found');

    // Create public URL (simplified implementation)
    const { data } = await supabase.storage
      .from(getBucketName())
      .createSignedUrl(file.filePath, 3600); // 1 hour expiry

    return data?.signedUrl || '';
  }, [files, getBucketName]);

  // Get file versions
  const getFileVersions = useCallback(async (fileId: string): Promise<WorkspaceFile[]> => {
    // Implementation for version history
    return [];
  }, []);

  // Restore version
  const restoreVersion = useCallback(async (fileId: string, version: number): Promise<WorkspaceFile> => {
    // Implementation for version restoration
    throw new Error('Version restoration not implemented');
  }, []);

  // Create folder
  const createFolder = useCallback(async (folderName: string, parentPath?: string): Promise<void> => {
    // Implementation for folder creation
  }, []);

  // Delete folder
  const deleteFolder = useCallback(async (folderPath: string): Promise<void> => {
    // Implementation for folder deletion
  }, []);

  // Search files
  const searchFiles = useCallback((
    query: string, 
    filters?: { type?: string; dateRange?: [Date, Date] }
  ): WorkspaceFile[] => {
    return files.filter(file => {
      const matchesQuery = file.name.toLowerCase().includes(query.toLowerCase()) ||
                          file.originalName.toLowerCase().includes(query.toLowerCase());
      
      if (!matchesQuery) return false;
      
      if (filters?.type && !file.mimeType.includes(filters.type)) return false;
      
      if (filters?.dateRange) {
        const fileDate = new Date(file.uploadedAt);
        const [start, end] = filters.dateRange;
        if (fileDate < start || fileDate > end) return false;
      }
      
      return true;
    });
  }, [files]);

  // Refresh files
  const refreshFiles = useCallback(async () => {
    await loadFiles();
  }, [loadFiles]);

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return {
    files,
    uploadProgress,
    isLoading,
    error,
    uploadFile,
    downloadFile,
    deleteFile,
    shareFile,
    getFileVersions,
    restoreVersion,
    createFolder,
    deleteFolder,
    searchFiles,
    refreshFiles
  };
}