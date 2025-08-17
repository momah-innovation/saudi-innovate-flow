# 📁 File Upload & Storage API

## Overview

Supabase Storage API for file uploads, downloads, and management with multiple bucket configurations.

## Base URL
```
https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1
```

## Authentication
```http
Authorization: Bearer <jwt_token>
apikey: <anon_key>
```

## Storage Buckets

### Available Buckets

#### Public Buckets
- `challenges-images-public` - Challenge images
- `campaigns-images-public` - Campaign images
- `events-images-public` - Event images
- `departments-logos-public` - Department logos
- `deputies-images-public` - Deputy images

#### Private Buckets  
- `challenges-documents-private` - Challenge documents
- `campaigns-documents-private` - Campaign documents
- `challenges-attachments-private` - Challenge attachments
- `evaluation-documents-private` - Evaluation documents
- `feedback-attachments-private` - Feedback files

### Bucket Configuration
Get upload configurations:

```http
GET /rest/v1/uploader_settings?setting_type=eq.upload_config&is_active=eq.true
```

**Response:**
```json
[
  {
    "setting_key": "challenges-documents-private",
    "setting_value": {
      "bucket": "challenges-documents-private",
      "enabled": true,
      "maxFiles": 5,
      "allowedTypes": ["application/pdf", "image/jpeg"],
      "maxSizeBytes": 10485760,
      "autoCleanup": false,
      "cleanupDays": 0
    }
  }
]
```

## File Upload

### Upload File
```http
POST /object/{bucket_name}/{file_path}
Authorization: Bearer <jwt_token>
Content-Type: {file_mime_type}

{binary_file_data}
```

### Upload with JavaScript
```javascript
// Upload to public bucket
const { data, error } = await supabase.storage
  .from('challenges-images-public')
  .upload(`images/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false
  });

// Upload to private bucket
const { data, error } = await supabase.storage
  .from('challenges-documents-private')
  .upload(`documents/${userId}/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false,
    metadata: {
      user_id: userId,
      challenge_id: challengeId
    }
  });
```

### Upload Response
```json
{
  "path": "documents/user123/document.pdf",
  "id": "uuid",
  "fullPath": "challenges-documents-private/documents/user123/document.pdf"
}
```

### Chunked Upload (Large Files)
```javascript
const uploadLargeFile = async (file, bucket, path) => {
  const chunkSize = 1024 * 1024; // 1MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(`${path}_chunk_${i}`, chunk);
      
    if (error) throw error;
  }
  
  // Combine chunks server-side
  const { data, error } = await supabase.functions.invoke('combine-chunks', {
    body: { bucket, path, totalChunks }
  });
  
  return { data, error };
};
```

## File Download

### Get Public URL
```javascript
const { data } = supabase.storage
  .from('challenges-images-public')
  .getPublicUrl('images/challenge-banner.jpg');

console.log(data.publicUrl);
// https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public/challenges-images-public/images/challenge-banner.jpg
```

### Download Private File
```javascript
const { data, error } = await supabase.storage
  .from('challenges-documents-private')
  .download('documents/user123/document.pdf');

if (data) {
  // Create download link
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.pdf';
  a.click();
  URL.revokeObjectURL(url);
}
```

### Signed URL (Temporary Access)
```javascript
const { data, error } = await supabase.storage
  .from('challenges-documents-private')
  .createSignedUrl('documents/user123/document.pdf', 3600); // 1 hour

console.log(data.signedUrl);
```

## File Management

### List Files
```javascript
// List files in bucket
const { data, error } = await supabase.storage
  .from('challenges-documents-private')
  .list('documents/user123/', {
    limit: 100,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' }
  });
```

**Response:**
```json
[
  {
    "name": "document.pdf",
    "id": "uuid",
    "updated_at": "2025-01-17T18:45:49Z",
    "created_at": "2025-01-17T18:45:49Z",
    "last_accessed_at": "2025-01-17T18:45:49Z",
    "metadata": {
      "size": 1048576,
      "mimetype": "application/pdf",
      "user_id": "user123"
    }
  }
]
```

### Get File Info
```javascript
const { data, error } = await supabase.storage
  .from('challenges-documents-private')
  .list('documents/user123/document.pdf', {
    limit: 1
  });
```

### Delete File
```javascript
const { data, error } = await supabase.storage
  .from('challenges-documents-private')
  .remove(['documents/user123/document.pdf']);
```

### Move/Rename File
```javascript
const { data, error } = await supabase.storage
  .from('challenges-documents-private')
  .move('documents/user123/old-name.pdf', 'documents/user123/new-name.pdf');
```

### Copy File
```javascript
const { data, error } = await supabase.storage
  .from('challenges-documents-private')
  .copy('documents/user123/original.pdf', 'documents/user123/copy.pdf');
```

## File Validation

### Client-side Validation
```javascript
const validateFile = (file, config) => {
  const errors = [];
  
  // Check file size
  if (file.size > config.maxSizeBytes) {
    errors.push(`File size exceeds ${config.maxSizeBytes / 1024 / 1024}MB limit`);
  }
  
  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed`);
  }
  
  // Check file name
  if (!/^[a-zA-Z0-9\-_.]+$/.test(file.name)) {
    errors.push('File name contains invalid characters');
  }
  
  return errors;
};

// Usage
const uploadConfig = {
  maxSizeBytes: 10485760, // 10MB
  allowedTypes: ['application/pdf', 'image/jpeg', 'image/png']
};

const errors = validateFile(selectedFile, uploadConfig);
if (errors.length > 0) {
  console.error('Validation errors:', errors);
  return;
}
```

## Advanced Upload Component

### React Upload Component
```javascript
const FileUploader = ({ 
  bucket, 
  path, 
  accept, 
  maxSize, 
  maxFiles = 1,
  onUploadComplete 
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (files) => {
    setUploading(true);
    const uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${path}/${fileName}`;

      try {
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            onUploadProgress: (progressEvent) => {
              const percent = (progressEvent.loaded / progressEvent.total) * 100;
              setProgress(percent);
            }
          });

        if (error) throw error;

        uploadedFiles.push({
          path: data.path,
          url: await getFileUrl(bucket, data.path),
          name: file.name,
          size: file.size,
          type: file.type
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
    setProgress(0);
    onUploadComplete(uploadedFiles);
  };

  return (
    <div className="upload-component">
      <Dropzone
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        onDrop={handleUpload}
        disabled={uploading}
      >
        {uploading ? (
          <div>
            <ProgressBar value={progress} />
            <p>Uploading... {Math.round(progress)}%</p>
          </div>
        ) : (
          <p>Drag files here or click to select</p>
        )}
      </Dropzone>
    </div>
  );
};
```

## Security & Access Control

### Row Level Security (RLS) Policies

#### Public Bucket Policy
```sql
-- Allow authenticated users to upload to public buckets
CREATE POLICY "Allow authenticated uploads to public buckets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('challenges-images-public', 'events-images-public'));

-- Allow public read access
CREATE POLICY "Allow public read access to public buckets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('challenges-images-public', 'events-images-public'));
```

#### Private Bucket Policy
```sql
-- Users can only access their own files
CREATE POLICY "Users can access own files in private buckets"
ON storage.objects FOR ALL
TO authenticated
USING (
  bucket_id IN ('challenges-documents-private', 'evaluation-documents-private')
  AND (auth.uid()::text = (storage.foldername(name))[1])
);
```

### File Access Validation
```javascript
const checkFileAccess = async (bucket, filePath, userId) => {
  // For private buckets, check if user owns the file
  if (bucket.includes('private')) {
    const pathParts = filePath.split('/');
    const fileOwnerId = pathParts[1]; // Assuming structure: /documents/{userId}/file.ext
    
    if (fileOwnerId !== userId) {
      throw new Error('Access denied: File does not belong to user');
    }
  }
  
  return true;
};
```

## Error Handling

### Common Error Codes
| Code | Description |
|------|-------------|
| 400 | Invalid file or path |
| 401 | Authentication required |
| 403 | Access denied |
| 404 | File not found |
| 409 | File already exists |
| 413 | File too large |
| 415 | Unsupported file type |
| 422 | Invalid file data |

### Error Response Format
```json
{
  "error": "File too large",
  "message": "The file size exceeds the maximum allowed size of 10MB",
  "statusCode": 413
}
```

## Best Practices

1. **Always validate files** on both client and server
2. **Use meaningful file paths** with user/context organization
3. **Implement progress indicators** for large uploads
4. **Handle upload failures** gracefully with retry logic
5. **Clean up temporary files** and failed uploads
6. **Use signed URLs** for private file sharing
7. **Implement file versioning** when needed
8. **Monitor storage usage** and implement quotas

### File Organization Strategy
```
bucket/
├── documents/
│   ├── {user_id}/
│   │   ├── challenges/
│   │   ├── evaluations/
│   │   └── feedback/
├── images/
│   ├── challenges/
│   ├── events/
│   └── profiles/
└── temp/
    └── {session_id}/
```