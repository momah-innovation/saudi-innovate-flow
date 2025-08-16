# 🎯 COMPREHENSIVE PLAN: Moving All SQL Queries to Hooks

## 📋 EXECUTIVE SUMMARY

**Objective**: Refactor 177+ scattered SQL queries from 32 files into organized, reusable hooks
**Timeline**: 4 phases over 2-3 weeks
**Expected Outcome**: Clean architecture with 15 centralized hook files

---

## 🚨 CURRENT STATE ANALYSIS

### Critical Issues Identified:
- **177 `supabase.from()` calls** scattered across 32 files
- **48 `supabase.functions.invoke()` calls** across 29 files
- **47 `supabase.storage` calls** across 20 files
- **Major violations** in wizard components with 15+ queries each

---

## 🎯 PHASE 1: HIGH PRIORITY REFACTORING (Week 1)

### 1.1 Campaign Management Hook
**Target Files**: `CampaignWizard.tsx` (17+ queries)
**New Hook**: `src/hooks/useCampaignManagement.ts`

```typescript
// Hook Structure:
export const useCampaignManagement = () => {
  const createCampaign = async (campaignData) => { /* */ };
  const updateCampaign = async (id, updates) => { /* */ };
  const deleteCampaign = async (id) => { /* */ };
  const loadCampaignOptions = async () => { /* sectors, deputies, etc */ };
  const manageCampaignLinks = async (campaignId, links) => { /* */ };
  
  return {
    createCampaign,
    updateCampaign, 
    deleteCampaign,
    loadCampaignOptions,
    manageCampaignLinks,
    loading,
    error
  };
};
```

**Queries to Move**:
- Campaign CRUD operations
- Sector/deputy/department link management
- Partner/stakeholder associations
- Options loading (sectors, deputies, departments, etc.)

---

### 1.2 Challenge Management Hook
**Target Files**: `ChallengeWizard.tsx`, `ChallengeWizardV2.tsx` (27+ queries combined)
**New Hook**: `src/hooks/useChallengeManagement.ts`

```typescript
// Hook Structure:
export const useChallengeManagement = () => {
  const createChallenge = async (challengeData) => { /* */ };
  const updateChallenge = async (id, updates) => { /* */ };
  const deleteChallenge = async (id) => { /* */ };
  const loadChallengeOptions = async () => { /* departments, experts, etc */ };
  const manageExpertAssignment = async (challengeId, expertIds) => { /* */ };
  const managePartnerAssignment = async (challengeId, partnerIds) => { /* */ };
  
  return {
    createChallenge,
    updateChallenge,
    deleteChallenge,
    loadChallengeOptions,
    manageExpertAssignment,
    managePartnerAssignment,
    loading,
    error
  };
};
```

**Queries to Move**:
- Challenge CRUD operations
- Expert assignment operations
- Partner assignment operations
- Options loading (departments, deputies, sectors, domains, etc.)

---

### 1.3 Event Bulk Operations Hook
**Target Files**: `EventBulkActions.tsx` (20+ queries)
**New Hook**: `src/hooks/useEventBulkOperations.ts`

```typescript
// Hook Structure:
export const useEventBulkOperations = () => {
  const bulkDeleteEvents = async (eventIds) => { /* */ };
  const bulkUpdateEvents = async (eventIds, updates) => { /* */ };
  const bulkDuplicateEvents = async (eventIds) => { /* */ };
  const loadEventConnections = async (eventId) => { /* */ };
  
  return {
    bulkDeleteEvents,
    bulkUpdateEvents,
    bulkDuplicateEvents,
    loadEventConnections,
    loading,
    error
  };
};
```

**Queries to Move**:
- Cascade delete operations
- Bulk update operations
- Event duplication logic
- Connection loading (partners, stakeholders, etc.)

---

## 🔧 PHASE 2: STORAGE & FILE MANAGEMENT (Week 2)

### 2.1 Storage Operations Hook
**Target Files**: `StorageManagementPage.tsx`, `BulkFileActions.tsx`, `FileActionsDropdown.tsx`
**New Hook**: `src/hooks/useStorageOperations.ts`

```typescript
// Hook Structure:
export const useStorageOperations = () => {
  const listBuckets = async () => { /* */ };
  const listFiles = async (bucketId, options) => { /* */ };
  const uploadFile = async (bucketId, file, path) => { /* */ };
  const downloadFile = async (bucketId, fileName) => { /* */ };
  const deleteFile = async (bucketId, fileName) => { /* */ };
  const getPublicUrl = (bucketId, fileName) => { /* */ };
  const bulkFileOperations = async (operation, files) => { /* */ };
  
  return {
    listBuckets,
    listFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    getPublicUrl,
    bulkFileOperations,
    loading,
    error
  };
};
```

### 2.2 File Upload Management Hook
**Target Files**: `FileUploadField.tsx`, `avatar-upload.tsx`, `versioned-file-uploader.tsx`
**New Hook**: `src/hooks/useFileUploadManagement.ts`

```typescript
// Hook Structure:
export const useFileUploadManagement = () => {
  const uploadAvatar = async (file, userId) => { /* */ };
  const uploadDocument = async (file, metadata) => { /* */ };
  const uploadVersionedFile = async (file, fileRecordId) => { /* */ };
  const generateSecureUploadUrl = async (fileName) => { /* */ };
  
  return {
    uploadAvatar,
    uploadDocument,
    uploadVersionedFile,
    generateSecureUploadUrl,
    uploadProgress,
    loading,
    error
  };
};
```

---

## ⚡ PHASE 3: OPPORTUNITY & ANALYTICS HOOKS (Week 2-3)

### 3.1 Opportunity Operations Hook
**Target Files**: `EditOpportunityDialog.tsx`, `OpportunityApplicationDialog.tsx`, `OpportunityDetailsDialog.tsx`
**New Hook**: `src/hooks/useOpportunityOperations.ts`

### 3.2 Analytics Operations Hook  
**Target Files**: `AnalyticsDashboard.tsx`, various tracking components
**New Hook**: `src/hooks/useAnalyticsOperations.ts`

### 3.3 Enhanced Interactions Hook
**Target Files**: `BookmarkOpportunityButton.tsx`, `LikeOpportunityButton.tsx`, `ShareOpportunityButton.tsx`
**New Hook**: `src/hooks/useInteractionOperations.ts`

---

## 🔬 PHASE 4: SPECIALIZED HOOKS (Week 3)

### 4.1 Authentication Operations Hook
**Target Files**: Auth components, contexts
**New Hook**: `src/hooks/useAuthOperations.ts`

### 4.2 Profile Management Hook
**Target Files**: `ProfileManager.tsx`, profile components
**New Hook**: `src/hooks/useProfileOperations.ts`

### 4.3 Search & Discovery Hook
**Target Files**: `AdvancedSearch.tsx`, search components
**New Hook**: `src/hooks/useSearchOperations.ts`

---

## 📐 IMPLEMENTATION STRATEGY

### Step-by-Step Process for Each Hook:

#### 1. **Analysis Phase** (1 day per hook)
- Identify all SQL queries in target components
- Map data flow and dependencies
- Define hook interface and return types
- Document edge cases and error scenarios

#### 2. **Hook Creation Phase** (2-3 days per hook)
- Create new hook file with TypeScript interfaces
- Implement query functions with proper error handling
- Add loading states and caching where appropriate
- Include query batching and optimization

#### 3. **Component Refactoring Phase** (1-2 days per hook)
- Update components to use new hook
- Remove direct supabase calls
- Update error handling and loading states
- Ensure UI behavior remains unchanged

#### 4. **Testing Phase** (1 day per hook)
- Create unit tests for hook functions
- Test error scenarios and edge cases
- Verify component integration
- Performance testing

---

## 🧪 TESTING STRATEGY

### Hook Testing:
```typescript
// Example test structure
describe('useCampaignManagement', () => {
  it('should create campaign successfully', async () => {
    // Test implementation
  });
  
  it('should handle errors gracefully', async () => {
    // Error testing
  });
  
  it('should batch related queries', async () => {
    // Performance testing
  });
});
```

### Integration Testing:
- Verify components work with new hooks
- Test loading and error states
- Ensure data consistency
- Performance regression testing

---

## 📊 SUCCESS METRICS

### Code Quality:
- ✅ 0 direct `supabase.from()` calls in components
- ✅ 15 centralized hook files
- ✅ 100% TypeScript coverage for hooks
- ✅ 90%+ test coverage for new hooks

### Performance:
- ✅ 50% reduction in duplicate queries
- ✅ Improved query batching and caching
- ✅ Faster component render times
- ✅ Better error handling consistency

### Maintainability:
- ✅ Clear separation of concerns
- ✅ Reusable business logic
- ✅ Consistent error patterns
- ✅ Easy to add new features

---

## ⚠️ RISK MITIGATION

### Potential Risks:
1. **Breaking existing functionality**
   - **Mitigation**: Thorough testing and gradual rollout

2. **Performance regressions**
   - **Mitigation**: Performance monitoring and optimization

3. **Complex state management**
   - **Mitigation**: Use React Query for caching and state management

4. **Timeline overruns**
   - **Mitigation**: Start with highest impact hooks first

---

## 📅 DETAILED TIMELINE

### Week 1: Foundation (Phase 1)
- **Day 1-2**: Campaign Management Hook
- **Day 3-4**: Challenge Management Hook  
- **Day 5**: Event Bulk Operations Hook

### Week 2: Storage & Core Features (Phase 2-3a)
- **Day 1-2**: Storage Operations Hook
- **Day 3**: File Upload Management Hook
- **Day 4-5**: Opportunity Operations Hook

### Week 3: Completion (Phase 3b-4)
- **Day 1**: Analytics Operations Hook
- **Day 2**: Interaction Operations Hook
- **Day 3**: Authentication Operations Hook
- **Day 4**: Profile Management Hook
- **Day 5**: Final testing and documentation

---

## 🎯 IMMEDIATE NEXT STEPS

1. **Start with Campaign Management Hook** (highest impact)
2. **Create hook file structure and interfaces**
3. **Begin moving queries from CampaignWizard.tsx**
4. **Test thoroughly before proceeding to next hook**
5. **Document patterns for team consistency**

---

**Ready to begin? Let's start with the Campaign Management Hook as it has the highest impact and will set the pattern for all subsequent refactoring.**