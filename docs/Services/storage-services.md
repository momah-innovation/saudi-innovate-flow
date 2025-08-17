# Storage Services Documentation

File storage, upload, and management services in the Enterprise Management System.

## 📂 File Storage Architecture

### 🗄️ Supabase Storage Integration

**Core Storage Services**
- **Bucket Management**: Organized file storage by category
- **Upload Processing**: Secure file upload with validation
- **Access Control**: Role-based file access permissions
- **Version Control**: File versioning and history tracking

#### Storage Bucket Configuration
```typescript
// Storage bucket structure
const storageBuckets = {
  'profile-images': {
    public: true,
    allowedMimeTypes: ['image/*'],
    fileSizeLimit: 5 * 1024 * 1024, // 5MB
  },
  'challenge-attachments': {
    public: false,
    allowedMimeTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
    fileSizeLimit: 50 * 1024 * 1024, // 50MB
  },
  'system-backups': {
    public: false,
    allowedMimeTypes: ['application/json', 'application/zip'],
    adminOnly: true
  }
};
```

### 📤 File Upload Services

#### Secure Upload Processing
```typescript
// Multi-part upload for large files
const uploadLargeFile = async (file: File, bucketName: string) => {
  const chunkSize = 1024 * 1024; // 1MB chunks
  const totalChunks = Math.ceil(file.size / chunkSize);
  
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    await uploadChunk(chunk, chunkIndex, totalChunks);
  }
};
```

#### File Validation & Processing
```typescript
// File type and security validation
const validateFile = (file: File) => {
  const validations = {
    size: file.size <= MAX_FILE_SIZE,
    type: ALLOWED_TYPES.includes(file.type),
    name: /^[a-zA-Z0-9._-]+$/.test(file.name),
    content: !containsMaliciousContent(file)
  };
  
  return Object.values(validations).every(Boolean);
};
```

## 🔒 Access Control & Security

### 🛡️ Permission-Based Access
- **Public Buckets**: Publicly accessible files (profile images)
- **Private Buckets**: User-specific or role-restricted access
- **Admin Buckets**: System administration files only
- **Temporary Storage**: Auto-expiring file storage

#### Row Level Security Policies
```sql
-- Profile image access
CREATE POLICY "Users can upload their own profile images" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Challenge attachment access
CREATE POLICY "Challenge participants can access attachments" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'challenge-attachments' 
  AND user_has_challenge_access((storage.foldername(name))[1]::uuid)
);
```

### 🔐 File Encryption & Privacy
- **At-Rest Encryption**: All files encrypted in storage
- **In-Transit Security**: HTTPS/TLS for all transfers
- **Access Logging**: Comprehensive file access tracking
- **Data Retention**: Configurable retention policies

## 📊 Storage Analytics & Monitoring

### 📈 Usage Analytics
- **Storage Utilization**: Per-user and system-wide usage tracking
- **Upload Performance**: Transfer speed and success rate monitoring
- **Access Patterns**: File access frequency and timing analysis
- **Cost Optimization**: Storage cost tracking and optimization

#### Storage Metrics Dashboard
```typescript
// Real-time storage analytics
const storageMetrics = {
  totalUsage: calculateTotalUsage(),
  userUsage: getUserStorageUsage(),
  bucketDistribution: getBucketUsageDistribution(),
  uploadTrends: getUploadTrends(),
  accessPatterns: getFileAccessPatterns()
};
```

---

*Storage Services: 10+ documented | Security: ✅ Enterprise Grade | Performance: ✅ Optimized*