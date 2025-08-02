// Storage Type Definitions
export interface StorageBucket {
  id: string;
  name: string;
  public: boolean;
  created_at: string;
  updated_at?: string;
  owner?: string;
  file_size_limit?: number;
  allowed_mime_types?: string[];
}

export interface StorageFile {
  id: string;
  name: string;
  bucket_id: string;
  owner: string;
  created_at: string;
  updated_at: string;
  last_accessed_at?: string;
  is_public?: boolean;
  full_path?: string;
  signedUrl?: string;
  publicUrl?: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
}

export interface BucketStats {
  bucket_name: string;
  file_count: number;
  total_size: number;
  created_at: string;
  public_access: boolean;
}

export interface UploadConfig {
  bucket: string;
  maxSizeMB: number;
  maxFiles: number;
  allowedTypes: string[];
  compressionEnabled: boolean;
  thumbnailGeneration: boolean;
  autoCleanupEnabled: boolean;
  cleanupDays: number;
}

export interface GlobalSettings {
  autoCleanupEnabled: boolean;
  defaultCleanupDays: number;
  maxConcurrentUploads: number;
  chunkSizeMB: number;
  retryAttempts: number;
  compressionEnabled: boolean;
  thumbnailGeneration: boolean;
}

export interface FileUploadResult {
  success: boolean;
  files?: StorageFile[];
  errors?: string[];
  uploadedCount?: number;
  failedCount?: number;
}

export interface StoragePolicy {
  id: string;
  name: string;
  bucket_id: string;
  operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  condition: string;
  check?: string;
  with_check?: boolean;
  roles: string[];
  created_at: string;
}

export interface BucketInfo extends StorageBucket {
  policies: StoragePolicy[];
  file_count?: number;
  total_size?: number;
  security_level?: 'public' | 'private' | 'restricted';
}

export interface FilterOptions {
  fileType?: string;
  bucket?: string;
  visibility?: string;
  sizeRange?: string;
  dateRange?: string;
}

export interface SortOptions {
  field?: string;
  direction?: 'asc' | 'desc';
}

export type LayoutType = 'cards' | 'list' | 'grid' | 'table';

// Error Types
export interface StorageError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// API Response Types
export interface StorageApiResponse<T = any> {
  data?: T;
  error?: StorageError;
  success: boolean;
}