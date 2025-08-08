/**
 * Storage System Types - Type definitions for storage management functionality
 */

// Base storage interfaces
export interface StorageBucket {
  id: string;
  name: string;
  public: boolean;
  created_at: string;
  updated_at?: string;
  owner?: string;
  file_size_limit?: number;
  allowed_mime_types?: string[];
  
  // Allow additional database fields
  [key: string]: unknown;
}

export interface StorageFile {
  id?: string;
  name: string;
  bucket_id?: string;
  size?: number;
  last_accessed_at?: string;
  created_at?: string;
  updated_at?: string;
  metadata?: unknown; // Made flexible for different metadata structures
  
  // File-specific properties
  type?: string;
  extension?: string;
  path?: string;
  is_public?: boolean;
  full_path?: string;
  owner?: string;
  
  // Allow additional database fields
  [key: string]: unknown;
}

// Upload configuration
export interface UploaderConfig {
  id: string;
  bucket: string;
  bucket_exists?: boolean;
  max_file_size: number;
  allowed_types: string[];
  auto_cleanup_days: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  
  // Allow additional fields
  [key: string]: unknown;
}

export interface GlobalSettings {
  autoCleanupEnabled: boolean;
  defaultCleanupDays: number;
  maxUploadSize: number;
  allowedFileTypes: string[];
  compressionEnabled: boolean;
  
  // Allow additional settings
  [key: string]: unknown;
}

// Filter and sort options
export interface FilterOptions {
  fileType: string;
  bucket: string;
  visibility: string;
  sizeRange: string;
  dateRange: string;
}

export interface SortOptions {
  field: 'name' | 'size' | 'type' | 'date';
  direction: 'asc' | 'desc';
}

// Team member for assignments
export interface TeamMember {
  id: string;
  name: string;
  name_ar?: string;
  email: string;
  role: string;
  department?: string;
  avatar_url?: string;
}

// Bulk actions
export interface BulkFileActionsProps {
  selectedFiles: StorageFile[];
  onSelectionChange: (files: StorageFile[]) => void;
  onFilesUpdated: () => void;
  buckets: StorageBucket[];
  allFiles: StorageFile[];
}

// Storage statistics
export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  recentUploads: number;
  buckets: number;
}

export interface StorageStatsCardsProps {
  stats: StorageStats;
  files: StorageFile[];
}

// Storage filters props
export interface StorageFiltersProps {
  buckets: StorageBucket[];
  filters: FilterOptions;
  sortBy: SortOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
}

// Upload tab props
export interface FixedStorageUploadTabProps {
  onFilesUploaded?: (files?: StorageFile[]) => void;
}

// Policy management
export interface StoragePolicy {
  id: string;
  bucket_id: string;
  role?: string;
  command: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE';
  definition: string;
  check?: string;
  
  // Allow additional fields
  [key: string]: unknown;
}

// Hook return types
export interface UseStorageReturn {
  buckets: StorageBucket[];
  files: StorageFile[];
  loading: boolean;
  error: string | null;
  uploadFile: (file: File, bucket: string) => Promise<StorageFile>;
  deleteFile: (fileName: string, bucket: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export interface UseStoragePoliciesReturn {
  policies: StoragePolicy[];
  buckets: StorageBucket[];
  loading: boolean;
  error: string | null;
  createPolicy: (policy: Partial<StoragePolicy>) => Promise<void>;
  updatePolicy: (id: string, updates: Partial<StoragePolicy>) => Promise<void>;
  deletePolicy: (id: string) => Promise<void>;
  refreshPolicies: () => Promise<void>;
}