# Storage System Guide

## Overview

The storage system provides comprehensive file upload, management, monitoring, and optimization capabilities with built-in security, analytics, and advanced administrative tools.

## Components

### 1. Enhanced File Uploader (`EnhancedFileUploader`)

The main file upload component with advanced features:

```tsx
import { EnhancedFileUploader } from '@/components/ui/enhanced-file-uploader'
import { UPLOAD_CONFIGS, createUploadConfig } from '@/utils/uploadConfigs'

const MyComponent = () => {
  const config = createUploadConfig(
    UPLOAD_CONFIGS.OPPORTUNITY_IMAGES,
    'entity-id',
    'table_name',
    'column_name'
  )

  return (
    <EnhancedFileUploader
      config={config}
      onUploadComplete={(files) => console.log('Uploaded:', files)}
      showPreview={true}
      showMetadata={true}
      label="Upload Images"
      description="Maximum 3 files, 5MB each"
      required={true}
    />
  )
}
```

**Features:**
- Drag & drop support
- File type validation
- Size validation
- Progress tracking
- Preview functionality
- Temporary uploads with commit/rollback
- Custom validation hooks
- Accessibility support

### 2. Upload Configurations (`uploadConfigs.ts`)

Pre-defined configurations for different upload types:

```tsx
// Available configurations
UPLOAD_CONFIGS.OPPORTUNITY_IMAGES    // Max 3 images, 5MB each
UPLOAD_CONFIGS.OPPORTUNITY_DOCUMENTS // Max 10 docs, 25MB each
UPLOAD_CONFIGS.CHALLENGE_IMAGES      // Max 2 images, 8MB each
UPLOAD_CONFIGS.IDEAS_IMAGES          // Max 5 images, 10MB each
UPLOAD_CONFIGS.USER_AVATARS         // 1 avatar, 3MB max
UPLOAD_CONFIGS.EVENT_RESOURCES      // Max 25 files, 100MB each

// Helper functions
createUploadConfig(baseConfig, entityId, tableName, columnName)
createWizardUploadConfig(baseConfig, tableName, columnName)
createTemporaryUploadConfig(baseConfig, tempSessionId)
```

### 3. File Upload Hook (`useFileUploader`)

Core upload functionality:

```tsx
import { useFileUploader } from '@/hooks/useFileUploader'

const { 
  uploadFiles,           // Upload files to temporary storage
  commitTemporaryFiles,  // Move temp files to final location
  cleanupTemporaryFiles, // Remove temporary files
  getFileUrl,           // Get public URL for file
  isUploading           // Upload status
} = useFileUploader()
```

### 4. Storage Analytics Hook (`useStorageAnalytics`)

Comprehensive storage management and analytics:

```tsx
import { useStorageAnalytics } from '@/hooks/useStorageAnalytics'

const {
  getBucketStats,           // Get detailed bucket statistics
  getAllBucketAnalytics,    // Get analytics for all buckets
  performAdminCleanup,      // Admin-level cleanup operations
  cleanupOldTempFiles,      // Remove old temporary files
  getAdvancedAnalytics,     // Get analytics with trends
  archiveOldFiles,          // Archive files by age
  bulkCleanupFiles,         // Bulk file removal
  exportStorageMetadata,    // Export metadata to JSON
  migrateBetweenBuckets,    // Migrate files between buckets
  createBucketBackup,       // Create bucket backups
  restoreFromArchive,       // Restore from backup
  findDuplicateFiles,       // Find and analyze duplicates
  manageStorageQuotas       // Manage bucket quotas
} = useStorageAnalytics()
```

### 5. Storage Management Components

#### Storage Analytics Tab (`StorageAnalyticsTab`)
- Real-time storage analytics dashboard
- Bucket health monitoring (healthy/warning/critical)
- Admin cleanup functionality
- Storage usage overview with metrics
- File count and size tracking per bucket

**Features:**
- Health status indicators with visual icons
- Admin controls for refresh and cleanup
- Detailed bucket analytics table
- Total storage metrics summary

#### Comprehensive Storage Management (`ComprehensiveStorageManagement`)
Advanced storage operations with tabbed interface:

**Export & Migration Tab:**
- Export storage metadata to JSON
- Cross-bucket file migration
- Preserve file paths and metadata
- Bulk migration operations

**Backup & Recovery Tab:**
- Create comprehensive bucket backups
- Restore files from archives
- Selective file restoration
- Metadata preservation options

**Optimization Tab:**
- Duplicate file detection and analysis
- Storage space optimization recommendations
- Potential savings calculations
- File deduplication tools

**Quotas & Monitoring Tab:**
- Set and manage bucket storage quotas
- Monitor quota usage with progress bars
- Quota compliance checking
- Usage alerts and warnings

**Advanced Tools Tab:**
- Archive old files by age criteria
- Bulk file cleanup with pattern matching
- Dry-run capabilities for safe testing
- Batch processing operations

#### Advanced Storage Management (`AdvancedStorageManagement`)
Enterprise-level storage analytics and operations:

**Analytics Overview:**
- Total storage usage across all buckets
- File count metrics and trends
- Growth rate analysis
- Storage efficiency metrics

**File Archiving:**
- Automated archiving based on file age
- Custom archive bucket selection
- Bulk archiving operations
- Archive policy management

**Bulk Operations:**
- Pattern-based file cleanup
- Age-based file removal
- Dry-run testing before execution
- Batch processing with progress tracking

### 6. Storage Management Pages

#### Storage Management (`StorageManagementPage`)
- Comprehensive analytics dashboard
- Real-time bucket monitoring
- Administrative cleanup tools
- Security status overview

#### Storage Policies (`StoragePoliciesPage`)
- Row Level Security policy review
- Access control monitoring
- Security compliance checking
- Policy recommendation engine

## Security Features

### Row Level Security (RLS)
All private buckets have RLS policies enforcing user-specific access:

```sql
-- Example: Users can only access their own files
CREATE POLICY "Users can access own files" ON storage.objects
FOR ALL USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### Bucket Types
- **Public buckets**: Accessible to everyone (images, logos)
- **Private buckets**: User-specific access (documents, attachments)
- **Temporary buckets**: Short-lived uploads with automatic cleanup

### File Validation
- MIME type checking
- File size limits
- Custom validation hooks
- Malware scanning (future enhancement)

## Upload Workflow

### 1. Temporary Upload
```tsx
// Files are first uploaded to temporary storage
const result = await uploadFiles(files, {
  ...config,
  isTemporary: true,
  tempSessionId: 'unique-session-id'
})
```

### 2. Validation & Processing
- Client-side validation (size, type)
- Server-side validation (edge function)
- Virus scanning (if enabled)
- Metadata extraction

### 3. Commit or Cleanup
```tsx
// Success: Move to final location
const finalFiles = await commitTemporaryFiles(tempFiles, finalConfig)

// Failure: Cleanup temporary files
await cleanupTemporaryFiles(sessionId)
```

## Edge Functions

### `secure-upload`
Handles file uploads with security checks:
- Authentication verification
- File type validation
- Size limit enforcement
- Metadata extraction
- Database updates

### `cleanup-temp-files`
Automated cleanup of temporary files:
- Removes files older than 7 days
- Batch processing across buckets
- Admin-only access
- Comprehensive logging

## Advanced Management Features

### 1. Storage Analytics & Monitoring

**Real-time Analytics:**
```tsx
const { getAdvancedAnalytics } = useStorageAnalytics()

const analytics = await getAdvancedAnalytics()
// Returns: total storage, bucket counts, growth trends
```

**Bucket Health Monitoring:**
- Health status indicators (healthy/warning/critical)
- File count and size tracking
- Usage percentage monitoring
- Oldest/newest file tracking

### 2. File Migration & Backup

**Cross-Bucket Migration:**
```tsx
const { migrateBetweenBuckets } = useStorageAnalytics()

await migrateBetweenBuckets(
  'source-bucket',
  'target-bucket', 
  '*.jpg',        // file pattern
  true,           // preserve paths
  false           // not a dry run
)
```

**Backup Operations:**
```tsx
const { createBucketBackup, restoreFromArchive } = useStorageAnalytics()

// Create backup
await createBucketBackup('main-bucket', 'backup-2024', true)

// Restore from backup
await restoreFromArchive('backup-bucket', 'main-bucket', '*.pdf')
```

### 3. Storage Optimization

**Duplicate File Detection:**
```tsx
const { findDuplicateFiles } = useStorageAnalytics()

const duplicates = await findDuplicateFiles('images-bucket', 1024)
// Find duplicates over 1KB in size
```

**Bulk Cleanup Operations:**
```tsx
const { bulkCleanupFiles, archiveOldFiles } = useStorageAnalytics()

// Archive files older than 30 days
await archiveOldFiles('main-bucket', 30, 'archive-bucket')

// Bulk cleanup with pattern
await bulkCleanupFiles('temp-bucket', 'temp-*', 7, false)
```

### 4. Quota Management

**Storage Quotas:**
```tsx
const { manageStorageQuotas } = useStorageAnalytics()

// Set quota (100MB limit)
await manageStorageQuotas('user-uploads', 104857600, 'set')

// Check quota status
const quota = await manageStorageQuotas('user-uploads', null, 'check')
```

### 5. Metadata Export & Import

**Export Storage Metadata:**
```tsx
const { exportStorageMetadata } = useStorageAnalytics()

const metadata = await exportStorageMetadata('images-*', true)
// Export with file URLs included
```

## Best Practices

### 1. Use Appropriate Bucket Types
- **Public buckets**: Images, logos, public assets
- **Private buckets**: User documents, sensitive files  
- **Temporary buckets**: Multi-step upload processes
- **Archive buckets**: Long-term storage for old files

### 2. Implement Storage Quotas
```tsx
// Set reasonable quotas for different bucket types
await manageStorageQuotas('user-uploads', 50 * 1024 * 1024, 'set') // 50MB
await manageStorageQuotas('team-docs', 500 * 1024 * 1024, 'set')   // 500MB
```

### 3. Regular Maintenance
```tsx
// Weekly cleanup routine
const performWeeklyMaintenance = async () => {
  // Clean up old temporary files
  await cleanupOldTempFiles()
  
  // Archive files older than 90 days
  await archiveOldFiles('main-storage', 90, 'archive-storage')
  
  // Find and report duplicates
  const duplicates = await findDuplicateFiles()
  console.log('Potential savings:', duplicates.totalSavings)
}
```

### 2. Implement Proper Validation
```tsx
const customValidation = (file: File) => {
  if (file.name.includes('confidential')) {
    return { valid: false, error: 'Confidential files not allowed' }
  }
  return { valid: true }
}

<EnhancedFileUploader
  config={config}
  customValidation={customValidation}
  onFileValidationError={(file, error) => console.error(error)}
/>
```

### 3. Handle Errors Gracefully
```tsx
const handleUploadComplete = (files: UploadedFile[]) => {
  if (files.length === 0) {
    toast({
      title: 'Upload failed',
      description: 'No files were uploaded successfully',
      variant: 'destructive'
    })
    return
  }
  
  // Process successful uploads
  updateDatabase(files)
}
```

### 4. Monitor Storage Usage
- Regular cleanup of temporary files
- Monitor bucket sizes and file counts
- Review security policies periodically
- Set up alerts for unusual activity

## Troubleshooting

### Common Issues

1. **Upload fails silently**
   - Check authentication status
   - Verify bucket policies
   - Check file size limits

2. **Files not visible after upload**
   - Verify RLS policies
   - Check bucket public/private settings
   - Confirm file paths are correct

3. **Slow upload performance**
   - Optimize file sizes
   - Use temporary uploads for large files
   - Consider batch processing

### Debug Tools
```tsx
// Enable debug logging
const { uploadFiles } = useFileUploader()

const debugUpload = async (files: File[]) => {
  console.log('Starting upload:', { files, config })
  
  try {
    const result = await uploadFiles(files, config)
    console.log('Upload result:', result)
  } catch (error) {
    console.error('Upload error:', error)
  }
}
```

## Future Enhancements

1. **Image Processing**
   - Automatic resizing/optimization
   - Thumbnail generation
   - Format conversion

2. **Advanced Security**
   - Virus scanning integration
   - Content-based file validation
   - Audit trail for all file operations

3. **Performance Optimizations**
   - CDN integration
   - Chunked uploads for large files
   - Background processing queues

4. **Analytics**
   - Upload success rates
   - Performance metrics
   - Storage usage trends

## API Reference

See individual component documentation for detailed API information:
- [EnhancedFileUploader API](./ENHANCED_FILE_UPLOADER_API.md)
- [useFileUploader Hook API](./USE_FILE_UPLOADER_API.md)
- [Upload Configurations API](./UPLOAD_CONFIGS_API.md)