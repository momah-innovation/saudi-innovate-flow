# Storage Policies Documentation

## 📋 **Overview**

This document provides comprehensive documentation for the storage bucket policies in the innovation platform. The storage system uses a hierarchical approach with **comprehensive policies** that group similar buckets together for efficient management.

## 🏗️ **Policy Architecture**

### **Design Principles**
- **Comprehensive Policies**: Group similar buckets to reduce policy complexity
- **Security-First**: All private data requires team membership or admin access
- **Public Assets**: Images and resources are publicly viewable but upload-restricted
- **User-Specific Access**: Private documents are accessible only to owners + team/admin

### **Access Levels Hierarchy**
1. **Public** - Anyone can view/download
2. **Authenticated** - Logged-in users can upload their own content
3. **Team Members** - Active innovation team members can manage content
4. **Admins** - Full access to all content and system buckets

## 🔐 **Comprehensive Storage Policies**

### **1. Public Buckets Access**

#### **Policy: `comprehensive_public_buckets_select`**
- **Command**: SELECT (View/Download)
- **Access**: Public (No authentication required)
- **Buckets Covered**:
  ```
  challenges-images-public
  opportunities-images-public  
  campaigns-images-public
  campaigns-materials-public
  events-images-public
  events-resources-public
  departments-logos-public
  sectors-images-public
  deputies-images-public
  partners-logos-public
  system-assets-public
  ideas-images-public
  ```

#### **Usage**: 
- Website visitors can view all public images and resources
- No authentication required for downloads
- Perfect for public-facing content like logos, event materials, and idea images

---

### **2. Team Upload to Public Buckets**

#### **Policy: `comprehensive_team_public_buckets_insert`**
- **Command**: INSERT (Upload)
- **Access**: Team Members + Admins only
- **Buckets Covered**:
  ```
  challenges-images-public
  opportunities-images-public
  campaigns-images-public
  campaigns-materials-public
  events-images-public
  events-resources-public
  partners-logos-public
  ```

#### **Authentication Required**:
```sql
EXISTS (
  SELECT 1 FROM innovation_team_members 
  WHERE user_id = auth.uid() AND status = 'active'
) 
OR has_role(auth.uid(), 'admin'::app_role)
```

#### **Usage**:
- Team members can upload public-facing content
- Admins have full upload access
- Regular users cannot upload to public buckets

---

### **3. Admin-Only Public Uploads**

#### **Policy: `comprehensive_admin_public_buckets_insert`**
- **Command**: INSERT (Upload)
- **Access**: Admins only
- **Buckets Covered**:
  ```
  departments-logos-public
  sectors-images-public
  deputies-images-public
  system-assets-public
  ```

#### **Usage**:
- System-level assets require admin privileges
- Organizational logos and branding materials
- Critical infrastructure images

---

### **4. Team Private Documents**

#### **Policies**: 
- `comprehensive_team_private_insert` (Upload)
- `comprehensive_team_private_select` (View)
- `comprehensive_team_private_update` (Modify) 
- `comprehensive_team_private_delete` (Remove)

#### **Access**: User-specific + Team Members + Admins
- **Own Files**: Users can access files they uploaded
- **Team Access**: Team members can access all files
- **Admin Access**: Admins can access all files

#### **Buckets Covered**:
```
challenges-documents-private
challenges-attachments-private
opportunities-attachments-private
opportunities-documents-private
campaigns-documents-private
partners-documents-private
evaluation-documents-private
evaluation-templates-private
ideas-documents-private
ideas-attachments-private
```

#### **Authentication Logic**:
```sql
(auth.uid()::text = (storage.foldername(name))[1])  -- Own files
OR EXISTS (
  SELECT 1 FROM innovation_team_members 
  WHERE user_id = auth.uid() AND status = 'active'
)  -- Team access
OR has_role(auth.uid(), 'admin'::app_role)  -- Admin access
```

---

### **5. Ideas System (Special Handling)**

#### **Public Ideas Images**
- **Policies**: `comprehensive_ideas_images_*` (SELECT, INSERT, UPDATE, DELETE)
- **Bucket**: `ideas-images-public`
- **Access**: 
  - **View**: Public (anyone)
  - **Upload**: Authenticated users
  - **Modify/Delete**: Own files only

#### **Private Ideas Documents**
- **Policies**: `comprehensive_ideas_private_*` (INSERT, SELECT)
- **Buckets**: `ideas-documents-private`, `ideas-attachments-private`
- **Access**: User-specific + Team/Admin

---

### **6. Event Recordings (Participant Access)**

#### **Policy: `comprehensive_event_recordings_select`**
- **Command**: SELECT (View)
- **Access**: Event participants + Team Members + Admins
- **Bucket**: `events-recordings-private`

#### **Special Authentication**:
```sql
-- Event participants can access recordings of events they attended
EXISTS (
  SELECT 1 FROM event_participants ep 
  WHERE ep.user_id = auth.uid() 
  AND ep.event_id::text = (storage.foldername(objects.name))[2]
)
-- Plus team and admin access
```

---

### **7. Feedback & Submissions**

#### **Policies**: `comprehensive_feedback_submissions_*`
- **Buckets**: `feedback-attachments-private`, `submissions-files-private`
- **Access**: User-specific + Team/Admin
- **Usage**: User feedback files and competition submissions

---

### **8. Admin-Only Private**

#### **Policy: `comprehensive_admin_private_all`**
- **Command**: ALL (Full access)
- **Access**: Admins only
- **Buckets**: 
  ```
  departments-documents-private
  sectors-documents-private
  partners-contracts-private
  notifications-attachments-private
  ```

---

## 📂 **Bucket Categories & Usage**

### **Public Image Buckets** 🖼️
| Bucket | Purpose | Upload Access | View Access |
|--------|---------|---------------|-------------|
| `challenges-images-public` | Challenge hero images | Team/Admin | Public |
| `opportunities-images-public` | Opportunity thumbnails | Team/Admin | Public |
| `campaigns-images-public` | Campaign banners | Team/Admin | Public |
| `events-images-public` | Event photos | Team/Admin | Public |
| `ideas-images-public` | Idea illustrations | Authenticated | Public |
| `partners-logos-public` | Partner/team logos | Team/Admin | Public |

### **Public Resource Buckets** 📄
| Bucket | Purpose | Upload Access | View Access |
|--------|---------|---------------|-------------|
| `campaigns-materials-public` | Campaign assets | Team/Admin | Public |
| `events-resources-public` | Event downloads | Team/Admin | Public |
| `departments-logos-public` | Dept branding | Admin | Public |
| `sectors-images-public` | Sector graphics | Admin | Public |
| `system-assets-public` | System images | Admin | Public |

### **Private Document Buckets** 🔒
| Bucket | Purpose | Upload Access | View Access |
|--------|---------|---------------|-------------|
| `*-documents-private` | Internal docs | User/Team/Admin | User/Team/Admin |
| `*-attachments-private` | File attachments | User/Team/Admin | User/Team/Admin |
| `evaluation-*-private` | Assessment files | Team/Admin | Team/Admin |
| `partners-contracts-private` | Legal docs | Admin | Admin |

### **Special Access Buckets** ⭐
| Bucket | Purpose | Special Access Rules |
|--------|---------|---------------------|
| `events-recordings-private` | Event videos | Event participants + Team/Admin |
| `temp-uploads-private` | Temporary files | User uploads with auto-cleanup |
| `user-avatars-public` | Profile pictures | User manages own + public view |

---

## 🔧 **Implementation Examples**

### **Upload Configuration Mapping**

```typescript
// Frontend upload configs aligned with policies
export const UPLOAD_CONFIGS = {
  // Public buckets - Team/Admin upload, Public view
  OPPORTUNITY_IMAGES: {
    uploadType: 'opportunities-images-public',
    // Covered by: comprehensive_team_public_buckets_insert
  },
  
  // Private buckets - User/Team/Admin upload, Restricted view
  OPPORTUNITY_DOCUMENTS: {
    uploadType: 'opportunities-documents-private',
    // Covered by: comprehensive_team_private_*
  },
  
  // Ideas - Special public images, private docs
  IDEAS_IMAGES: {
    uploadType: 'ideas-images-public',
    // Covered by: comprehensive_ideas_images_*
  }
}
```

### **Edge Function Integration**

```typescript
// Edge function fallback configs match policies
const FALLBACK_UPLOAD_CONFIGS = {
  'opportunities-images-public': {
    bucket: 'opportunities-images-public',
    // Will use: comprehensive_team_public_buckets_insert
  },
  'opportunities-documents-private': {
    bucket: 'opportunities-documents-private',
    // Will use: comprehensive_team_private_*
  }
}
```

---

## 🔧 **Advanced Management Features**

### **Storage Analytics & Monitoring**
- **Real-time Analytics**: Track storage usage, file counts, and growth trends
- **Bucket Health Status**: Monitor bucket health (healthy/warning/critical)
- **Usage Metrics**: Total storage, average file sizes, oldest/newest files
- **Admin Dashboard**: Comprehensive analytics interface for administrators

### **File Migration & Backup**
- **Cross-Bucket Migration**: Move files between buckets with path preservation
- **Automated Backups**: Create full bucket backups with metadata
- **Selective Restoration**: Restore specific files or patterns from archives
- **Migration Scripts**: Edge functions for bulk file operations

### **Storage Optimization**
- **Duplicate Detection**: Find and analyze duplicate files across buckets
- **Storage Cleanup**: Automated removal of old temporary files
- **Bulk Operations**: Pattern-based file management and cleanup
- **Archive Management**: Automatic archiving of files by age criteria

### **Quota Management**
- **Bucket Quotas**: Set and monitor storage limits per bucket
- **Usage Alerts**: Automatic notifications for quota approaching limits
- **Compliance Monitoring**: Track quota adherence across all buckets
- **Dynamic Quotas**: Adjust quotas based on usage patterns

### **Security & Compliance**
- **Policy Linting**: Automated security policy validation
- **Access Auditing**: Track file access patterns and permissions
- **Compliance Reports**: Generate security and usage compliance reports
- **Security Alerts**: Monitor for unusual access patterns

---

## 🚨 **Security Considerations**

### **Row Level Security (RLS)**
- All storage.objects policies use RLS for fine-grained access control
- Policies check user authentication and role membership
- File-level access uses folder structure: `bucket/user-id/filename`
- Security definer functions prevent infinite recursion in policies

### **Role-Based Access**
- Uses `has_role()` function for admin/role checks
- Team membership verified through `innovation_team_members` table
- Active status required for team member access
- Hierarchical permissions: Public < Authenticated < Team < Admin

### **Path-Based Security**
- Private files use folder structure: `user-id/filename`
- Event recordings use: `recordings/event-id/filename`
- Policies extract user/event ID from file path for access control
- Path validation prevents unauthorized access across user directories

### **Public vs Private**
- **Public buckets**: Viewable by anyone, upload restricted to authorized users
- **Private buckets**: Both view and upload access controlled by ownership/roles
- **Admin buckets**: Full admin-only access with audit logging
- **Temporary buckets**: Short-lived uploads with automatic cleanup policies

---

## 🔄 **Migration Status**

### **Completed Migrations** ✅
- All policies updated to comprehensive system
- Frontend configs aligned with policies
- Edge function configs standardized

### **Pending File Migrations** ⚠️
Legacy buckets with files need migration:

| Legacy Bucket | → | New Bucket | Files |
|---------------|---|------------|-------|
| `challenge-attachments` | → | `challenges-attachments-private` | 13 |
| `event-resources` | → | `events-resources-public` | 15 |
| `idea-images` | → | `ideas-images-public` | 2 |
| `partner-*` buckets | → | `partners-logos-public` | 12 |
| Others | → | Various | 20 |

**Total**: 62 files (~19MB) to migrate

---

## 📊 **Policy Coverage Summary**

### **Comprehensive Policies Active** ✅
- ✅ Public bucket access (12 buckets)
- ✅ Team public uploads (7 buckets)  
- ✅ Admin public uploads (4 buckets)
- ✅ Team private documents (10 buckets)
- ✅ Ideas system (3 buckets)
- ✅ Event recordings (1 bucket)
- ✅ Admin private (4 buckets)

### **Legacy Policies** 📄
- Individual bucket policies still exist
- Will be cleaned up after migration
- No conflicts with comprehensive policies

### **Total Coverage**: **41 buckets** with comprehensive policies

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Upload Failures**
1. Check user authentication status
2. Verify team membership for team-restricted buckets
3. Confirm bucket name matches upload config
4. Check file size and type restrictions

#### **Access Denied Errors**
1. Verify user has required role/team membership
2. Check if accessing own files vs team files
3. Confirm bucket privacy level matches access attempt

#### **Policy Conflicts**
1. Comprehensive policies take precedence
2. Legacy policies may create conflicts during transition
3. Check policy order and permissions

### **Testing Access**

```sql
-- Test user's team membership
SELECT * FROM innovation_team_members 
WHERE user_id = auth.uid() AND status = 'active';

-- Test user roles
SELECT * FROM user_roles 
WHERE user_id = auth.uid() AND is_active = true;

-- Test file access
SELECT bucket_id, name FROM storage.objects 
WHERE bucket_id = 'your-bucket-name';
```

---

## 🔧 **Advanced Management API**

### **Storage Analytics Functions**

```typescript
// Get detailed bucket statistics
const stats = await getBucketStats('bucket-name')
// Returns: { total_files, total_size, avg_file_size, oldest_file, newest_file }

// Get all bucket analytics with health status
const analytics = await getAllBucketAnalytics()
// Returns array with health indicators (healthy/warning/critical)

// Get advanced analytics with trends
const advanced = await getAdvancedAnalytics()
// Returns: storage trends, growth metrics, usage patterns
```

### **Migration & Backup Operations**

```typescript
// Migrate files between buckets
await migrateBetweenBuckets(
  'source-bucket',
  'target-bucket',
  '*.jpg',        // file pattern (optional)
  true,           // preserve paths
  false           // dry run (false = execute)
)

// Create bucket backup
await createBucketBackup(
  'source-bucket',
  'backup-name',  // optional custom name
  true            // include metadata
)

// Restore from archive
await restoreFromArchive(
  'archive-bucket',
  'target-bucket',
  '*.pdf',        // file pattern (optional)
  true,           // restore original paths
  false           // dry run
)
```

### **Optimization & Cleanup**

```typescript
// Find duplicate files
const duplicates = await findDuplicateFiles(
  'bucket-filter',  // optional bucket pattern
  1024             // min file size in bytes
)
// Returns: { duplicates: [], totalSavings: number }

// Archive old files
await archiveOldFiles(
  'source-bucket',
  30,              // days old
  'archive-bucket' // optional archive destination
)

// Bulk cleanup with pattern
await bulkCleanupFiles(
  'bucket-name',
  'temp-*',        // file pattern
  7,               // older than days
  true             // dry run first
)
```

### **Quota Management**

```typescript
// Set bucket quota (100MB)
await manageStorageQuotas('bucket-name', 104857600, 'set')

// Check quota usage
const quota = await manageStorageQuotas('bucket-name', null, 'check')
// Returns: { usage, quota, percentage, status }

// Remove quota
await manageStorageQuotas('bucket-name', null, 'remove')
```

### **Export & Metadata**

```typescript
// Export storage metadata
const metadata = await exportStorageMetadata(
  'images-*',      // bucket filter (optional)
  true             // include file URLs
)
// Returns downloadable JSON with comprehensive metadata
```

---

## 📚 **Additional Resources**

- [Storage System Guide](./STORAGE_SYSTEM_GUIDE.md)
- [Migration Plan](./STORAGE_MIGRATION_PLAN.md)
- [Migration Execution Guide](./STORAGE_MIGRATION_EXECUTION_GUIDE.md)
- [Upload Configuration Reference](../src/utils/uploadConfigs.ts)
- [Edge Function Documentation](../supabase/functions/secure-upload/)
- [Advanced Analytics Hook](../src/hooks/useStorageAnalytics.ts)

---

**Last Updated**: January 2025  
**Policy Version**: 2.0 (Comprehensive System)  
**Total Buckets Covered**: 41  
**Security Level**: Enterprise-Grade RLS