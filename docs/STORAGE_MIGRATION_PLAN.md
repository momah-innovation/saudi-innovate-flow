# Storage System Migration & Compliance Plan

## 🎯 **COMPLETED FIXES**

### ✅ Edge Function Configurations
- Fixed all `FALLBACK_UPLOAD_CONFIGS` to match actual bucket names
- Aligned upload types with comprehensive policies
- Added missing configurations for all bucket types

### ✅ Frontend Upload Configs
- Updated `PARTNER_LOGOS` to use `partners-logos-public`
- Updated `EVENT_RESOURCES` to use `events-resources-public`
- Added missing `EVENT_IMAGES` and `TEMP_UPLOADS` configurations

## 📋 **BUCKETS REQUIRING MIGRATION**

### **HIGH PRIORITY** (Contains Files - Need Migration)

| Legacy Bucket | Files | Target Bucket | Migration Action |
|---------------|-------|---------------|------------------|
| `challenge-attachments` | 13 files (1.1MB) | `challenges-attachments-private` | **MIGRATE** |
| `event-resources` | 15 files (4.4MB) | `events-resources-public` | **MIGRATE** |
| `idea-images` | 2 files (3.2MB) | `ideas-images-public` | **MIGRATE** |
| `partner-images` | 7 files (8.6MB) | `partners-logos-public` | **MIGRATE** |
| `partner-logos` | 5 files (433KB) | `partners-logos-public` | **MIGRATE** |
| `team-logos` | 5 files (452KB) | `partners-logos-public` | **MIGRATE** |
| `saved-images` | 7 files (664KB) | `ideas-images-public` | **MIGRATE** |
| `dashboard-images` | 4 files (305KB) | `system-assets-public` | **MIGRATE** |
| `sector-images` | 3 files (327KB) | `sectors-images-public` | **MIGRATE** |
| `opportunity-attachments` | 1 file (711KB) | `opportunities-attachments-private` | **MIGRATE** |

### **EMPTY BUCKETS** (Can be safely removed)
- `demo-private`, `demo-public` - Demo buckets

## 🔧 **MISSING COMPREHENSIVE POLICIES**

Need to add these buckets to comprehensive policies:

### **Public Buckets** (Add to `comprehensive_public_buckets_select`)
```sql
-- Add these to the existing ARRAY:
'campaigns-images-public'
'campaigns-materials-public'  
'events-images-public'
'events-resources-public'
```

### **Team Upload to Public** (Add to `comprehensive_team_public_buckets_insert`)
```sql
-- Add these to the existing ARRAY:
'campaigns-images-public'
'campaigns-materials-public'
'events-images-public'
'events-resources-public'
```

### **Team Private Documents** (Add to existing comprehensive policies)
```sql
-- Add these to comprehensive_team_private_* policies:
'campaigns-documents-private'
'opportunities-attachments-private'
'opportunities-documents-private'
'partners-documents-private'
'evaluation-documents-private'
'evaluation-templates-private'
```

## 🗺️ **PAGE-SPECIFIC UPLOAD MAPPING**

### **Opportunities Page** ✅ COMPLIANT
- Images: `opportunities-images-public` → **WORKING**
- Documents: `opportunities-documents-private` → **READY**
- Attachments: `opportunities-attachments-private` → **READY**

### **Challenges Page** ⚠️ NEEDS MIGRATION
- Current: `challenge-attachments` → Target: `challenges-attachments-private`
- Images: `challenges-images-public` → **WORKING**
- Documents: `challenges-documents-private` → **READY**

### **Ideas Page** ⚠️ NEEDS MIGRATION  
- Current: `idea-images` → Target: `ideas-images-public`
- Documents: `ideas-documents-private` → **READY**
- Attachments: `ideas-attachments-private` → **READY**

### **Events Page** ⚠️ NEEDS MIGRATION
- Current: `event-resources` → Target: `events-resources-public`
- Images: `events-images-public` → **READY**
- Recordings: `events-recordings-private` → **READY**

### **Partners Page** ⚠️ NEEDS MIGRATION
- Current: `partner-images`, `partner-logos` → Target: `partners-logos-public`
- Documents: `partners-documents-private` → **READY**

### **User Profiles** ✅ READY
- Avatars: `user-avatars-public` → **READY**
- Documents: `user-documents-private` → **READY**

### **Campaigns** 🆕 NEW SYSTEM
- Images: `campaigns-images-public` → **READY**
- Materials: `campaigns-materials-public` → **READY**
- Documents: `campaigns-documents-private` → **READY**

## 🚀 **NEXT STEPS**

1. **Update Missing Policies** - Add missing buckets to comprehensive policies
2. **Create Migration Script** - Move files from legacy to new buckets
3. **Update Database References** - Update any stored file paths
4. **Remove Legacy Buckets** - Clean up after successful migration
5. **Test Upload System** - Verify all pages work with new bucket structure

## 📊 **COMPLIANCE STATUS**

- **Edge Functions**: ✅ **FULLY COMPLIANT**
- **Frontend Configs**: ✅ **FULLY COMPLIANT** 
- **Storage Policies**: ⚠️ **NEEDS POLICY UPDATES**
- **File Migration**: ❌ **NEEDS MIGRATION** (62 files, ~19MB total)

The foundation is solid - just need to complete the policy updates and file migration!