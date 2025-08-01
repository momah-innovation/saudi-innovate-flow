# 🚀 **COMPREHENSIVE STORAGE MIGRATION GUIDE**

## 📋 **Migration Overview**

This guide provides step-by-step instructions for migrating from legacy storage buckets to the new comprehensive policy system, updating database references, and implementing proper RLS security.

## 🎯 **Migration Objectives**

1. **File Migration**: Move files from 10 legacy buckets to standardized buckets
2. **Database Updates**: Update all file path references in database tables
3. **Bucket Cleanup**: Remove empty legacy buckets safely
4. **RLS Verification**: Ensure comprehensive Row Level Security coverage

## 📊 **Migration Scope**

### **Legacy Buckets → New Buckets**
| Legacy Bucket | Files | Target Bucket | Database Tables Affected |
|---------------|-------|---------------|--------------------------|
| `challenge-attachments` | 13 | `challenges-attachments-private` | `challenges`, `challenge_submissions` |
| `event-resources` | 15 | `events-resources-public` | `event_resources`, `events` |
| `idea-images` | 2 | `ideas-images-public` | `ideas` |
| `partner-images` | 7 | `partners-logos-public` | `partners` |
| `partner-logos` | 5 | `partners-logos-public` | `partners` |
| `team-logos` | 5 | `partners-logos-public` | `innovation_teams` |
| `saved-images` | 7 | `ideas-images-public` | `ideas` |
| `dashboard-images` | 4 | `system-assets-public` | `innovation_success_stories` |
| `sector-images` | 3 | `sectors-images-public` | `sectors` |
| `opportunity-attachments` | 1 | `opportunities-attachments-private` | `opportunity_applications` |

**Total**: 62 files across 10 legacy buckets → 6 standardized buckets

## 🔧 **Migration Tools**

### **1. Comprehensive Storage Migration Function**
- **Function**: `comprehensive-storage-migration`
- **Purpose**: Migrate files and update database paths
- **Access**: Admin-only
- **Location**: `supabase/functions/comprehensive-storage-migration/`

### **2. Database Path Update Function**
- **Function**: `update_file_paths_for_migration()`
- **Purpose**: Update all database file path references
- **Security**: SECURITY DEFINER with audit logging

### **3. Bucket Cleanup Function**
- **Function**: `cleanup_legacy_buckets()`
- **Purpose**: Remove empty legacy buckets safely
- **Security**: Admin-only with safety checks

### **4. RLS Verification Function**
- **Function**: `verify_storage_rls_coverage()`
- **Purpose**: Verify comprehensive policy coverage
- **Output**: Coverage percentage and uncovered buckets

## 🚀 **Migration Steps**

### **Phase 1: Pre-Migration Verification**
```sql
-- 1. Verify current file counts
SELECT bucket_id, COUNT(*) as files
FROM storage.objects 
WHERE bucket_id IN (
  'challenge-attachments', 'event-resources', 'idea-images',
  'partner-images', 'partner-logos', 'team-logos', 
  'saved-images', 'dashboard-images', 'sector-images',
  'opportunity-attachments'
)
GROUP BY bucket_id;

-- 2. Check database references before migration
SELECT 'challenges' as table_name, COUNT(*) as records_with_legacy_paths
FROM challenges 
WHERE image_url LIKE '%challenge-attachments%'
UNION ALL
SELECT 'event_resources', COUNT(*)
FROM event_resources 
WHERE file_url LIKE '%event-resources%'
-- ... repeat for other tables
```

### **Phase 2: Execute Migration**
1. **Run File Migration**:
   - Call the `comprehensive-storage-migration` edge function as admin
   - Monitor progress through function logs
   - Verify files are copied to new buckets

2. **Update Database References**:
   ```sql
   -- Execute the database update function
   SELECT update_file_paths_for_migration();
   ```

3. **Verify Migration Success**:
   ```sql
   -- Check that files exist in new buckets
   SELECT bucket_id, COUNT(*) as files
   FROM storage.objects 
   WHERE bucket_id IN (
     'challenges-attachments-private', 'events-resources-public',
     'ideas-images-public', 'partners-logos-public',
     'system-assets-public', 'sectors-images-public',
     'opportunities-attachments-private'
   )
   GROUP BY bucket_id;
   
   -- Verify database paths are updated
   SELECT COUNT(*) as legacy_references_remaining
   FROM challenges 
   WHERE image_url LIKE '%challenge-attachments%';
   ```

### **Phase 3: Cleanup Legacy Resources**
1. **Remove Empty Legacy Buckets**:
   ```sql
   SELECT cleanup_legacy_buckets();
   ```

2. **Clean Up Legacy Policies**:
   ```sql
   -- Remove individual legacy policies (keep comprehensive ones)
   DROP POLICY IF EXISTS "Team members can manage challenge attachments" ON storage.objects;
   DROP POLICY IF EXISTS "Public can view challenge attachments" ON storage.objects;
   -- ... repeat for other legacy policies
   ```

### **Phase 4: RLS Verification**
```sql
-- Verify RLS coverage
SELECT verify_storage_rls_coverage();

-- Expected result should show:
-- - coverage_percentage: 100%
-- - uncovered_buckets: []
-- - comprehensive_policies_active: true
```

## 🔐 **RLS Implementation Status**

### **✅ Comprehensive Policies Active**
1. **Public Bucket Access** - 12 buckets covered
2. **Team Public Uploads** - 7 buckets covered  
3. **Admin Public Uploads** - 4 buckets covered
4. **Team Private Documents** - 10 buckets covered
5. **Ideas System** - Special handling for public/private
6. **Event Recordings** - Participant-based access
7. **Admin Private** - 4 admin-only buckets

### **🛡️ Security Features**
- **Row Level Security** enabled on all storage.objects
- **Role-based access control** using `has_role()` function
- **Team membership validation** via `innovation_team_members`
- **File ownership verification** using folder structure
- **Audit logging** for all security operations

## 📈 **Success Metrics**

### **Migration Success Indicators**
- ✅ All 62 files migrated to new buckets
- ✅ Zero legacy file path references in database
- ✅ All legacy buckets removed (if empty)
- ✅ 100% RLS policy coverage
- ✅ No broken file links in application

### **Performance Benchmarks**
- File migration: ~6 minutes (62 files with 100ms delay)
- Database updates: <1 second (batch operations)
- Policy verification: <1 second
- Legacy cleanup: <30 seconds

## 🚨 **Rollback Plan**

If migration fails, use this rollback procedure:

1. **Restore Database Paths**:
   ```sql
   -- Reverse the path updates (example)
   UPDATE challenges 
   SET image_url = replace(image_url, '/challenges-attachments-private/attachments/', '/challenge-attachments/')
   WHERE image_url LIKE '%/challenges-attachments-private/attachments/%';
   ```

2. **Keep Files in Both Locations**:
   - Don't delete files from new buckets
   - Legacy buckets should still have original files
   - Test application functionality

3. **Investigate Issues**:
   - Check edge function logs
   - Verify policy permissions
   - Test file accessibility

## 📊 **Monitoring & Verification**

### **Post-Migration Checks**
```sql
-- 1. Verify no broken file paths
SELECT table_name, column_name, COUNT(*) as broken_links
FROM (
  SELECT 'challenges' as table_name, 'image_url' as column_name, image_url
  FROM challenges WHERE image_url LIKE '%/challenge-attachments/%'
  UNION ALL
  -- ... add other tables
) broken;

-- 2. Check storage policy coverage
SELECT verify_storage_rls_coverage();

-- 3. Test file access as different user roles
-- (Test in application with different user types)
```

## 🎉 **Migration Complete!**

After successful migration:
- ✅ **62 files** migrated to standardized buckets
- ✅ **All database references** updated
- ✅ **Legacy buckets** cleaned up
- ✅ **Comprehensive RLS** policies active
- ✅ **100% security coverage** achieved

Your storage system is now fully compliant with the comprehensive policy architecture!

---

**Last Updated**: January 2025  
**Migration Version**: 1.0  
**Files Affected**: 62 files, 10+ database tables  
**Security Level**: Enterprise-Grade with Full RLS Coverage