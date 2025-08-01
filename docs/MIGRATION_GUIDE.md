# File Upload System Migration Guide

## Overview

The file upload system has been completely refactored to provide better security, performance, and maintainability. This guide helps you migrate from the old system to the new Enhanced File Upload System.

## What Changed

### Removed Components
- `FileUploader` (old basic uploader)
- `FileUploadField` (form wrapper)
- `WizardFileUploader` (wizard-specific uploader)

### New Components  
- `EnhancedFileUploader` (unified, feature-rich uploader)
- `StorageManagementPage` (admin storage monitoring)
- `StoragePoliciesPage` (security policy management)

### Updated Files
- `useFileUploader` hook (enhanced with better error handling)
- `uploadConfigs.ts` (expanded configuration options)

## Migration Steps

### 1. Update Imports

**Before:**
```tsx
import { FileUploader } from '@/components/ui/file-uploader'
import { FileUploadField } from '@/components/ui/file-upload-field'
import { WizardFileUploader } from '@/components/ui/wizard-file-uploader'
import { UPLOAD_CONFIGS } from '@/utils/fileUploadConfigs'
```

**After:**
```tsx
import { EnhancedFileUploader } from '@/components/ui/enhanced-file-uploader'
import { UPLOAD_CONFIGS } from '@/utils/uploadConfigs'
```

### 2. Update Component Usage

#### Basic File Upload
**Before:**
```tsx
<FileUploader
  config={config}
  onUploadComplete={handleComplete}
  multiple={true}
  showPreview={true}
  disabled={loading}
/>
```

**After:**
```tsx
<EnhancedFileUploader
  config={config}
  onUploadComplete={handleComplete}
  showPreview={true}
  disabled={loading}
/>
```

#### Form Integration
**Before:**
```tsx
<FileUploadField
  config={config}
  label="Upload Files"
  description="Select files to upload"
  required={true}
  onValueChange={setValue}
/>
```

**After:**
```tsx
<EnhancedFileUploader
  config={config}
  label="Upload Files"
  description="Select files to upload"
  required={true}
  onValueChange={setValue}
/>
```

#### Wizard/Multi-step Uploads
**Before:**
```tsx
const wizardRef = useRef<WizardFileUploaderRef>(null)

<WizardFileUploader
  ref={wizardRef}
  config={config}
  onFilesChange={setFiles}
/>

// Later in wizard...
const files = await wizardRef.current?.commitFiles(entityId)
```

**After:**
```tsx
const uploaderRef = useRef<EnhancedFileUploaderRef>(null)

<EnhancedFileUploader
  ref={uploaderRef}
  config={config}
  onValueChange={setFiles}
/>

// Later in wizard...
const files = await uploaderRef.current?.commitFiles(finalConfig)
```

### 3. Update Configuration

**Before:**
```tsx
import { UPLOAD_CONFIGS, createUploadConfig } from '@/utils/fileUploadConfigs'

const config = createUploadConfig(
  UPLOAD_CONFIGS.OPPORTUNITY_IMAGES,
  opportunityId,
  'opportunities',
  'image_url'
)
```

**After:**
```tsx
import { UPLOAD_CONFIGS, createUploadConfig } from '@/utils/uploadConfigs'

const config = createUploadConfig(
  UPLOAD_CONFIGS.OPPORTUNITY_IMAGES,
  opportunityId,
  'opportunities', 
  'image_url'
)
```

### 4. New Features Available

#### Enhanced Validation
```tsx
const customValidation = (file: File) => {
  if (file.name.includes('temp')) {
    return { valid: false, error: 'Temporary files not allowed' }
  }
  return { valid: true }
}

<EnhancedFileUploader
  config={config}
  customValidation={customValidation}
  onFileValidationError={(file, error) => {
    console.error(`Validation failed for ${file.name}: ${error}`)
  }}
/>
```

#### Progress Tracking
```tsx
<EnhancedFileUploader
  config={config}
  onUploadProgress={(progress) => {
    console.log(`Upload progress: ${progress}%`)
  }}
/>
```

#### Advanced Preview Options
```tsx
<EnhancedFileUploader
  config={config}
  showPreview={true}
  showMetadata={true}
  allowReorder={true}
/>
```

## New Admin Features

### Storage Management
Add to your admin routes:
```tsx
import { StorageManagementPage } from '@/components/storage/StorageManagementPage'
import { StoragePoliciesPage } from '@/components/storage/StoragePoliciesPage'

// In your routing
<Route path="/admin/storage" element={<StorageManagementPage />} />
<Route path="/admin/storage/policies" element={<StoragePoliciesPage />} />
```

### Cleanup Operations
The new system includes automatic cleanup of temporary files:
```tsx
import { useFileUploader } from '@/hooks/useFileUploader'

const { cleanupTemporaryFiles } = useFileUploader()

// Cleanup old temporary files
await cleanupTemporaryFiles(sessionId)
```

## Breaking Changes

### 1. Prop Changes
- `multiple` prop removed (automatically determined by `maxFiles`)
- `acceptString` now part of upload config, not separate prop
- `onUploadError` replaced with better error handling in `onUploadComplete`

### 2. Ref Interface Changes
**Before:**
```tsx
interface FileUploadFieldRef {
  commitFiles: (finalConfig) => Promise<UploadedFile[]>
  clearFiles: () => void
  getFiles: () => UploadedFile[]
}
```

**After:**
```tsx
interface EnhancedFileUploaderRef {
  commitFiles: (finalConfig) => Promise<UploadedFile[]>
  clearFiles: () => void
  getFiles: () => UploadedFile[]
  uploadFiles: (files: File[]) => Promise<void>
  removeFile: (fileIndex: number) => void
  validateFiles: (files: File[]) => { valid: boolean; errors: string[] }
}
```

### 3. Configuration Changes
All upload configurations now include `acceptString` field:
```tsx
// Old config
{
  uploadType: 'opportunity-images',
  maxFiles: 1,
  maxSizeBytes: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png']
}

// New config  
{
  uploadType: 'opportunities-images-public',
  maxFiles: 3,
  maxSizeBytes: 5 * 1024 * 1024,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  acceptString: 'image/jpeg,image/png,image/webp'
}
```

## Testing Your Migration

### 1. Component Rendering
```tsx
import { render, screen } from '@testing-library/react'
import { EnhancedFileUploader } from '@/components/ui/enhanced-file-uploader'

test('renders upload area', () => {
  render(<EnhancedFileUploader config={testConfig} />)
  expect(screen.getByText(/click to upload/i)).toBeInTheDocument()
})
```

### 2. File Upload Flow
```tsx
test('handles file upload', async () => {
  const mockUpload = jest.fn()
  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
  
  render(
    <EnhancedFileUploader 
      config={testConfig} 
      onUploadComplete={mockUpload}
    />
  )
  
  // Test file selection and upload...
})
```

### 3. Validation Testing
```tsx
test('validates file types', () => {
  const invalidFile = new File(['test'], 'test.txt', { type: 'text/plain' })
  // Test validation logic...
})
```

## Performance Improvements

The new system provides several performance benefits:

1. **Lazy Loading**: Components only load when needed
2. **Optimized Validation**: Client-side validation before upload
3. **Temporary Storage**: Reduces failed upload cleanup
4. **Batch Operations**: Multiple files processed efficiently
5. **Memory Management**: Better cleanup of temporary resources

## Support

If you encounter issues during migration:

1. Check the console for specific error messages
2. Review the component props and configuration
3. Test with a simple upload first
4. Refer to the detailed API documentation
5. Use the storage management tools to debug upload issues

For additional help, consult:
- [Storage System Guide](./STORAGE_SYSTEM_GUIDE.md)
- [Enhanced File Uploader API](./ENHANCED_FILE_UPLOADER_API.md)
- [Upload Configurations](./UPLOAD_CONFIGS_API.md)