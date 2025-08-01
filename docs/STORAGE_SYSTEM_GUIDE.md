# Storage System Guide

## Overview

The storage system provides comprehensive file upload, management, and monitoring capabilities with built-in security and analytics.

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

### 4. Storage Management Pages

#### Storage Management (`StorageManagementPage`)
- Monitor storage usage across all buckets
- View file counts and sizes
- Admin cleanup operations
- Bucket security status

#### Storage Policies (`StoragePoliciesPage`)
- Review bucket access policies
- Security recommendations
- Policy compliance monitoring

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

## Best Practices

### 1. Use Appropriate Bucket Types
- Public: Images, logos, public assets
- Private: User documents, sensitive files
- Temporary: Multi-step upload processes

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