/**
 * Storage Utilities
 * 
 * Centralized utilities for handling Supabase storage URLs
 * and file operations without hardcoded URLs.
 */

// Lovable: avoid VITE_* envs; use bundled project URL
const SUPABASE_URL = 'https://jxpbiljkoibvqxzdkgod.supabase.co';

/**
 * Generate public storage URL for a file
 */
export const getPublicStorageUrl = (bucketId: string, filePath: string): string => {
  // Remove leading slash if present
  const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucketId}/${cleanPath}`;
};

/**
 * Generate full storage URL from relative path
 */
export const getStorageUrl = (relativePath: string): string => {
  if (relativePath.startsWith('http')) {
    return relativePath; // Already a full URL
  }
  
  // Handle paths that start with /storage/v1/object/public
  if (relativePath.startsWith('/storage/v1/object/public')) {
    return `${SUPABASE_URL}${relativePath}`;
  }
  
  // Handle relative paths
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${SUPABASE_URL}/storage/v1/object/public/${cleanPath}`;
};

/**
 * Generate avatar URL
 */
export const getAvatarUrl = (fileName: string): string => {
  return getPublicStorageUrl('avatars', fileName);
};

/**
 * Generate opportunity image URL
 */
export const getOpportunityImageUrl = (imagePath: string): string => {
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  return getStorageUrl(imagePath);
};

/**
 * Check if URL is already a full URL
 */
export const isFullUrl = (url: string): boolean => {
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Get bucket public URL template for documentation
 */
export const getBucketUrlTemplate = (bucketId: string): string => {
  return `${SUPABASE_URL}/storage/v1/object/public/${bucketId}/[filename]`;
};