# File Uploader Developer Guide

## Quick Start

### 1. Installation & Setup

The file uploader system is already integrated into your project. No additional installation required.

```typescript
// Import the components you need
import { FileUploadField } from '@/components/ui/file-upload-field'
import { WizardFileUploader } from '@/components/ui/wizard-file-uploader'
import { EnhancedFileUploader } from '@/components/ui/enhanced-file-uploader'
import { UPLOAD_CONFIGS } from '@/utils/fileUploadConfigs'
```

### 2. Basic Usage (90% of use cases)

```tsx
import { FileUploadField } from '@/components/ui/file-upload-field'
import { UPLOAD_CONFIGS } from '@/utils/fileUploadConfigs'

function MyComponent() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  return (
    <FileUploadField
      config={UPLOAD_CONFIGS.USER_AVATARS}
      label="Profile Picture"
      description="Upload your profile picture (JPG, PNG, WebP - max 2MB)"
      required={true}
      onValueChange={setUploadedFiles}
      showPreview={true}
    />
  )
}
```

### 3. Form Integration with React Hook Form

```tsx
import { useForm } from 'react-hook-form'
import { FileUploadField } from '@/components/ui/file-upload-field'

interface FormData {
  title: string
  image: UploadedFile[]
}

function MyForm() {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>()
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Title" />
      
      <FileUploadField
        config={UPLOAD_CONFIGS.OPPORTUNITY_IMAGES}
        label="Opportunity Image"
        onValueChange={(files) => setValue('image', files)}
        error={errors.image?.message}
      />
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Configuration Guide

### Available Upload Types

| Type | Purpose | Files | Size | Count |
|------|---------|-------|------|-------|
| `USER_AVATARS` | Profile pictures | Images | 2MB | 1 |
| `USER_DOCUMENTS` | Personal docs | PDF, DOC | 10MB | 5 |
| `IDEA_IMAGES` | Idea showcase | Images | 5MB | 3 |
| `IDEA_DOCUMENTS` | Business plans | PDF, DOC, TXT | 20MB | 10 |
| `CHALLENGE_IMAGES` | Challenge banners | Images | 5MB | 1 |
| `CHALLENGE_DOCUMENTS` | Challenge briefs | PDF, DOC, TXT | 20MB | 10 |
| `OPPORTUNITY_IMAGES` | Opportunity images | Images | 5MB | 1 |
| `OPPORTUNITY_ATTACHMENTS` | Application materials | PDF, DOC | 20MB | 5 |
| `CAMPAIGN_IMAGES` | Campaign materials | Images, SVG | 10MB | 3 |
| `CAMPAIGN_MATERIALS` | Campaign resources | PDF, Images, Videos | 100MB | 20 |
| `EVENT_IMAGES` | Event photos | Images | 10MB | 5 |
| `EVENT_RESOURCES` | Event materials | PDF, Images, Videos, PPT | 200MB | 20 |
| `PARTNER_LOGOS` | Partner branding | Images, SVG | 3MB | 1 |
| `DEPARTMENT_LOGOS` | Department logos | Images, SVG | 3MB | 1 |
| `EVALUATION_DOCUMENTS` | Evaluation reports | PDF, DOC, XLS | 50MB | 10 |
| `FEEDBACK_ATTACHMENTS` | Feedback materials | PDF, Images, Videos | 25MB | 5 |
| `TEMP_UPLOADS` | Temporary files | All types | 200MB | 50 |

### Creating Custom Configurations

```typescript
// Custom configuration for specific needs
const CUSTOM_CONFIG = {
  uploadType: 'custom-documents',
  maxFiles: 3,
  maxSizeBytes: 15 * 1024 * 1024, // 15MB
  allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  acceptString: '.pdf,.jpg,.jpeg,.png'
}

// Usage with entity binding
const entityConfig = createUploadConfig(
  CUSTOM_CONFIG,
  'entity-123',
  'my_table',
  'documents_column'
)
```

## Component Selection Guide

### When to Use Each Component

#### FileUploadField ✅ (Recommended for most cases)
- ✅ Standard form fields
- ✅ Simple upload requirements
- ✅ Form validation integration
- ✅ Single-step forms

```tsx
<FileUploadField
  config={UPLOAD_CONFIGS.USER_AVATARS}
  label="Profile Picture"
  required={true}
/>
```

#### WizardFileUploader ✅ (For multi-step forms)
- ✅ Multi-step wizards
- ✅ Temporary upload needs
- ✅ Form data not yet saved
- ✅ Need to commit files later

```tsx
const uploaderRef = useRef<WizardFileUploaderRef>(null)

<WizardFileUploader
  ref={uploaderRef}
  config={createWizardUploadConfig(UPLOAD_CONFIGS.IDEA_DOCUMENTS)}
  label="Supporting Documents"
/>

// Later, on form submit:
const files = await uploaderRef.current?.commitFiles(entityId)
```

#### EnhancedFileUploader ⚡ (Advanced features)
- ⚡ Custom validation needed
- ⚡ Progress tracking required
- ⚡ Advanced UI features
- ⚡ File reordering/metadata

```tsx
<EnhancedFileUploader
  config={UPLOAD_CONFIGS.EVENT_RESOURCES}
  showMetadata={true}
  onUploadProgress={(progress) => setProgress(progress)}
  customValidation={(file) => ({
    valid: file.name.includes('event'),
    error: 'File name must contain "event"'
  })}
/>
```

#### FileUploader 🔧 (Basic/Legacy)
- 🔧 Basic needs only
- 🔧 Custom form integration
- 🔧 Minimal UI requirements
- 🔧 Building custom wrappers

## Implementation Patterns

### Pattern 1: Simple Upload

```tsx
function SimpleUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])

  return (
    <FileUploadField
      config={UPLOAD_CONFIGS.USER_AVATARS}
      label="Profile Picture"
      onValueChange={setFiles}
    />
  )
}
```

### Pattern 2: Form Integration

```tsx
function FormIntegration() {
  const form = useForm<{
    title: string
    documents: UploadedFile[]
  }>()

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="documents"
        render={({ field }) => (
          <FileUploadField
            config={UPLOAD_CONFIGS.IDEA_DOCUMENTS}
            label="Supporting Documents"
            value={field.value}
            onValueChange={field.onChange}
            error={form.formState.errors.documents?.message}
          />
        )}
      />
    </Form>
  )
}
```

### Pattern 3: Wizard with Temporary Upload

```tsx
function WizardPattern() {
  const [step, setStep] = useState(1)
  const uploaderRef = useRef<WizardFileUploaderRef>(null)

  const handleSubmit = async (formData: any) => {
    // Create entity first
    const { data: entity } = await supabase
      .from('ideas')
      .insert(formData)
      .select()
      .single()

    // Commit temporary files
    const files = await uploaderRef.current?.commitFiles({
      ...UPLOAD_CONFIGS.IDEA_DOCUMENTS,
      entityId: entity.id,
      tableName: 'ideas',
      columnName: 'document_urls'
    })

    console.log('Final files:', files)
  }

  return (
    <div>
      {step === 1 && (
        <div>
          <h2>Step 1: Basic Info</h2>
          {/* Basic form fields */}
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h2>Step 2: Documents</h2>
          <WizardFileUploader
            ref={uploaderRef}
            config={createWizardUploadConfig(
              UPLOAD_CONFIGS.IDEA_DOCUMENTS,
              'ideas',
              'document_urls'
            )}
            label="Supporting Documents"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      )}
    </div>
  )
}
```

### Pattern 4: Custom Validation

```tsx
function CustomValidationPattern() {
  const imageValidation = (file: File) => {
    return new Promise<{valid: boolean, error?: string}>((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve({ valid: false, error: 'Must be an image' })
        return
      }

      const img = new Image()
      img.onload = () => {
        const valid = img.width >= 1200 && img.height >= 600
        resolve({
          valid,
          error: valid ? undefined : 'Image must be at least 1200x600px'
        })
      }
      img.onerror = () => resolve({ valid: false, error: 'Invalid image' })
      img.src = URL.createObjectURL(file)
    })
  }

  return (
    <EnhancedFileUploader
      config={UPLOAD_CONFIGS.CAMPAIGN_IMAGES}
      label="Campaign Banner"
      customValidation={imageValidation}
      onFileValidationError={(file, error) => {
        toast({
          title: 'Validation Error',
          description: `${file.name}: ${error}`,
          variant: 'destructive'
        })
      }}
    />
  )
}
```

### Pattern 5: Programmatic Upload

```tsx
function ProgrammaticUpload() {
  const { uploadFiles } = useFileUploader()
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelection = async (files: File[]) => {
    setIsUploading(true)
    
    try {
      const result = await uploadFiles(files, {
        ...UPLOAD_CONFIGS.USER_DOCUMENTS,
        entityId: 'user-123',
        tableName: 'profiles',
        columnName: 'document_urls'
      })
      
      if (result.success) {
        console.log('Uploaded:', result.files)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files || [])
          handleFileSelection(files)
        }}
      />
      {isUploading && <p>Uploading...</p>}
    </div>
  )
}
```

## Security Considerations

### Access Control

The system automatically handles access control based on:

1. **User Authentication**: All uploads require authentication
2. **Role-Based Access**: Different roles have different permissions
3. **Entity Ownership**: Users can only access their own files (where applicable)
4. **Bucket Policies**: Each bucket has specific access rules

### File Validation

Always implement both client and server-side validation:

```tsx
// Client-side validation
const clientValidation = (file: File) => ({
  valid: file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/'),
  error: 'Must be an image under 5MB'
})

// The edge function also validates server-side
<EnhancedFileUploader
  config={UPLOAD_CONFIGS.USER_AVATARS}
  customValidation={clientValidation}
/>
```

### Temporary File Cleanup

Temporary files are automatically cleaned up after 7 days, but you can also clean them manually:

```tsx
import { useFileUploader } from '@/hooks/useFileUploader'

function CleanupExample() {
  const { cleanupTemporaryFiles } = useFileUploader()

  const handleCleanup = async () => {
    await cleanupTemporaryFiles('session-id')
  }

  // Auto-cleanup on component unmount
  useEffect(() => {
    return () => {
      cleanupTemporaryFiles('session-id')
    }
  }, [])
}
```

## Performance Optimization

### 1. File Compression

For image uploads, consider client-side compression:

```tsx
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      canvas.width = Math.min(img.width, 1920)
      canvas.height = Math.min(img.height, 1080)
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        resolve(new File([blob!], file.name, { type: 'image/jpeg' }))
      }, 'image/jpeg', 0.8)
    }
    
    img.src = URL.createObjectURL(file)
  })
}
```

### 2. Chunked Uploads (For Large Files)

```tsx
// For files larger than 100MB, consider chunked uploads
const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB chunks

const uploadLargeFile = async (file: File) => {
  if (file.size <= CHUNK_SIZE) {
    // Normal upload
    return uploadFiles([file], config)
  }
  
  // Chunked upload implementation
  // (This would require additional edge function support)
}
```

### 3. Lazy Loading

```tsx
// Lazy load heavy components
const EnhancedFileUploader = lazy(() => 
  import('@/components/ui/enhanced-file-uploader').then(m => ({
    default: m.EnhancedFileUploader
  }))
)

function LazyUploader() {
  return (
    <Suspense fallback={<div>Loading uploader...</div>}>
      <EnhancedFileUploader config={config} />
    </Suspense>
  )
}
```

## Error Handling

### Common Error Patterns

```tsx
function ErrorHandlingExample() {
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleUploadError = (error: any) => {
    if (error.message?.includes('size')) {
      setUploadError('File is too large. Please choose a smaller file.')
    } else if (error.message?.includes('type')) {
      setUploadError('File type not supported. Please choose a different file.')
    } else if (error.message?.includes('network')) {
      setUploadError('Network error. Please check your connection and try again.')
    } else {
      setUploadError('Upload failed. Please try again.')
    }
  }

  return (
    <div>
      <FileUploadField
        config={UPLOAD_CONFIGS.USER_AVATARS}
        label="Profile Picture"
        error={uploadError}
        onUploadComplete={() => setUploadError(null)}
      />
      
      {uploadError && (
        <div className="text-red-500 text-sm mt-2">
          {uploadError}
        </div>
      )}
    </div>
  )
}
```

### Retry Logic

```tsx
const uploadWithRetry = async (files: File[], config: FileUploadConfig, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await uploadFiles(files, config)
    } catch (error) {
      if (attempt === maxRetries) throw error
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
}
```

## Testing

### Unit Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { FileUploadField } from '@/components/ui/file-upload-field'

describe('FileUploadField', () => {
  it('should render upload area', () => {
    render(
      <FileUploadField
        config={UPLOAD_CONFIGS.USER_AVATARS}
        label="Test Upload"
      />
    )
    
    expect(screen.getByText('Test Upload')).toBeInTheDocument()
    expect(screen.getByText(/click to upload/i)).toBeInTheDocument()
  })
  
  it('should validate file types', async () => {
    const onError = jest.fn()
    render(
      <FileUploadField
        config={UPLOAD_CONFIGS.USER_AVATARS}
        onFileValidationError={onError}
      />
    )
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = screen.getByLabelText(/upload/i)
    
    fireEvent.change(input, { target: { files: [file] } })
    
    expect(onError).toHaveBeenCalledWith(file, expect.stringContaining('not allowed'))
  })
})
```

### Integration Tests

```tsx
import { createMockSupabaseClient } from '@/test/mocks'

describe('File Upload Integration', () => {
  it('should upload file and update database', async () => {
    const mockSupabase = createMockSupabaseClient()
    
    const { uploadFiles } = useFileUploader()
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    const result = await uploadFiles([file], {
      ...UPLOAD_CONFIGS.USER_AVATARS,
      entityId: 'user-123',
      tableName: 'profiles',
      columnName: 'avatar_url'
    })
    
    expect(result.success).toBe(true)
    expect(mockSupabase.storage.from).toHaveBeenCalledWith('user-avatars-public')
    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
  })
})
```

## Migration Guide

### From Legacy Upload Systems

If you're migrating from an existing upload system:

1. **Replace old components**:
   ```tsx
   // Old
   <OldFileUpload onChange={handleChange} />
   
   // New
   <FileUploadField
     config={UPLOAD_CONFIGS.USER_AVATARS}
     onValueChange={handleChange}
   />
   ```

2. **Update database schema**:
   ```sql
   -- Add new columns for file paths
   ALTER TABLE profiles ADD COLUMN avatar_url TEXT;
   
   -- Migrate existing file URLs if needed
   UPDATE profiles SET avatar_url = legacy_avatar_column WHERE legacy_avatar_column IS NOT NULL;
   ```

3. **Update file URL generation**:
   ```tsx
   // Old
   const fileUrl = `${CDN_URL}/${filePath}`
   
   // New
   const { getFileUrl } = useFileUploader()
   const fileUrl = getFileUrl(filePath)
   ```

### Breaking Changes

- File URLs now use Supabase storage URLs
- Upload configurations must be predefined
- Temporary uploads require explicit commit step
- Different bucket structure affects file paths

## FAQ

### Q: How do I handle very large files?
A: Use chunked uploads or compress files before upload. Consider implementing resumable uploads for files over 100MB.

### Q: Can I customize the upload UI?
A: Yes, you can create custom components using the `useFileUploader` hook as the base.

### Q: How do I implement progress tracking?
A: Use `EnhancedFileUploader` with `onUploadProgress` callback, or implement custom progress tracking with the hook.

### Q: What happens to temporary files?
A: They're automatically cleaned up after 7 days, or you can clean them manually using `cleanupTemporaryFiles`.

### Q: How do I add new upload types?
A: Add new configurations to `UPLOAD_CONFIGS` and update the edge function bucket mappings.

### Q: Can I upload to custom S3 buckets?
A: The system uses Supabase storage. For S3, you'd need to modify the edge function.

### Q: How do I handle upload errors?
A: Use error callbacks and implement retry logic. Check network connectivity and file validation.

### Q: Can I preview files before upload?
A: Yes, use `showPreview={true}` or implement custom preview using `FileReader` API.

### Q: How do I restrict uploads by user role?
A: Bucket policies automatically handle this. You can also add client-side checks for UX.

### Q: What about mobile uploads?
A: The components work on mobile. Consider using `accept="image/*"` for camera capture on mobile devices.

---

This guide covers the most common use cases and patterns. For advanced scenarios or custom requirements, refer to the full API documentation or contact the development team.