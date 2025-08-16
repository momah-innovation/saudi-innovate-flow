# 🚨 COMPREHENSIVE REMAINING MIGRATION TASKS - UPDATED

## **CURRENT STATUS: 10/195 COMPLETE (5%) + 6 HOOKS CREATED**

### **✅ COMPLETED MIGRATIONS (10 files):**
1. **AdminChallengeManagement.tsx** → `useChallengeList` ✅
2. **CampaignWizard.tsx** → `useCampaignManagement` ✅  
3. **ChallengeWizard.tsx** → `useChallengeManagement` ✅
4. **BulkAvatarUploader.tsx** → `useStorageOperations` ✅
5. **CampaignsManagement.tsx** → `useCampaignList` ✅
6. **EventsManagement.tsx** → `useEventOperations` ✅
7. **ChallengeSettings.tsx** → `useChallengeManagement` ✅
8. **EvaluationsManagement.tsx** → `useEvaluationManagement` ✅
9. **ExpertAssignmentManagement.tsx** → `useExpertAssignment` ✅
10. **FocusQuestionManagement.tsx** → `useFocusQuestionManagement` ✅

### **⚠️ PARTIALLY MIGRATED (1 file):**
11. **IdeaWizard.tsx** - Hook imported but complex operations still use direct Supabase calls

### **✅ CREATED HOOKS (6 hooks):**
- `useChallengeList.ts` - Simple challenge list operations ✅
- `useCampaignList.ts` - Campaign list operations ✅  
- `useEventOperations.ts` - Event CRUD operations ✅
- `useEvaluationManagement.ts` - Evaluation CRUD operations ✅
- `useExpertAssignment.ts` - Expert assignment operations ✅
- `useFocusQuestionManagement.ts` - Focus questions CRUD operations ✅
- `useIdeaManagement.ts` - Ideas CRUD operations ✅
- `useExpertProfiles.ts` - Expert profiles management ✅

---

## **📋 REMAINING TASKS: 185 COMPONENTS TO MIGRATE**

### **🚨 PHASE 1: CRITICAL ADMIN COMPONENTS (24 remaining)**

#### **Immediate Priority (P0) - Admin Management**
- [ ] `src/components/admin/AdminFocusQuestionWizard.tsx` → Use `useFocusQuestionManagement`
- [ ] `src/components/admin/AssignmentDetailView.tsx` → Use `useExpertAssignment`
- [ ] `src/components/admin/ExpertProfileDialog.tsx` → Use `useExpertProfiles`
- [ ] `src/components/admin/FocusQuestionsManagement.tsx` → Use `useFocusQuestionManagement`
- [x] **IdeaWizard.tsx** → Complete migration to `useIdeaManagement` (PARTIAL)
- [ ] `src/components/admin/InnovationTeamsContent.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/OpportunityWizard.tsx` → Use `useOpportunityOperations`
- [ ] `src/components/admin/PartnersManagement.tsx` → Create `usePartnerManagement`
- [ ] `src/components/admin/RelationshipOverview.tsx` → Create `useRelationshipData`
- [ ] `src/components/admin/RoleRequestManagement.tsx` → Create `useRoleManagement`
- [ ] `src/components/admin/RoleRequestWizard.tsx` → Create `useRoleManagement`
- [ ] `src/components/admin/SectorsManagement.tsx` → Create `useSectorManagement`
- [ ] `src/components/admin/StakeholderWizard.tsx` → Create `useStakeholderManagement`
- [ ] `src/components/admin/StakeholdersManagement.tsx` → Create `useStakeholderManagement`
- [ ] `src/components/admin/TeamManagementContent.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/TeamMemberWizard.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/TeamWizard.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/TeamWorkspaceContent.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/TestPrivilegeElevation.tsx` → Create `useRoleManagement`
- [ ] `src/components/admin/TestProfileCalculation.tsx` → Create `useProfileCalculation`
- [ ] `src/components/admin/TranslationManagement.tsx` → Create `useTranslationManagement`
- [ ] `src/components/admin/TranslationManager.tsx` → Create `useTranslationManagement`
- [ ] `src/components/admin/UserInvitationWizard.tsx` → Create `useUserInvitation`

#### **Analytics Components (P0)**
- [ ] `src/components/admin/analytics/AIFeatureTogglePanel.tsx` → Use `useAIFeatures`

#### **Challenge Sub-components (P0)**
- [ ] `src/components/admin/challenges/ChallengeDetailView.tsx` → Use `useChallengeDetails`
- [ ] `src/components/admin/challenges/ChallengeListSimplified.tsx` → Use `useChallengeList`
- [ ] `src/components/admin/challenges/ChallengeManagement.tsx` → Use `useChallengeManagement`
- [ ] `src/components/admin/challenges/ChallengeManagementList.tsx` → Use `useChallengeList`
- [ ] `src/components/admin/challenges/ChallengeWizardV2.tsx` → Use `useChallengeManagement`

### **🟡 PHASE 2: ADMIN SPECIALIZED COMPONENTS (80+ files)**

#### **Event Management (P1) - 11 files**
- [ ] `src/components/admin/events/AdminEventAnalytics.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/AdminEventCard.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/AdminEventFilters.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/AdminEventForm.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/AdminEventList.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/AdminEventsHero.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/BulkEventActions.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/EventAnalyticsDashboard.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/EventAttendanceTracker.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/EventBulkActions.tsx` → Use `useEventOperations`
- [ ] `src/components/admin/events/EventParticipantManager.tsx` → Use `useEventOperations`

#### **Expert Management (P1) - 4 files**
- [ ] `src/components/admin/experts/ExpertDetailView.tsx` → Use `useExpertProfiles`
- [ ] `src/components/admin/experts/ExpertList.tsx` → Use `useExpertProfiles`
- [ ] `src/components/admin/experts/ExpertManagement.tsx` → Use `useExpertProfiles`
- [ ] `src/components/admin/experts/ExpertWizard.tsx` → Use `useExpertProfiles`

#### **Focus Questions (P1) - 3 files**
- [ ] `src/components/admin/focus-questions/FocusQuestionAnalytics.tsx` → Use `useFocusQuestionManagement`
- [ ] `src/components/admin/focus-questions/FocusQuestionForm.tsx` → Use `useFocusQuestionManagement`
- [ ] `src/components/admin/focus-questions/FocusQuestionList.tsx` → Use `useFocusQuestionManagement`

#### **Ideas Management (P1) - 4 files**
- [ ] `src/components/admin/ideas/IdeaAnalytics.tsx` → Use `useIdeaManagement`
- [ ] `src/components/admin/ideas/IdeaForm.tsx` → Use `useIdeaManagement`
- [ ] `src/components/admin/ideas/IdeaList.tsx` → Use `useIdeaManagement`
- [ ] `src/components/admin/ideas/IdeaManagement.tsx` → Use `useIdeaManagement`

#### **Innovation Teams (P1) - 3 files**
- [ ] `src/components/admin/innovation-teams/InnovationTeamAnalytics.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/innovation-teams/InnovationTeamForm.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/innovation-teams/InnovationTeamList.tsx` → Create `useTeamManagement`

#### **Opportunities (P1) - 4 files**
- [ ] `src/components/admin/opportunities/OpportunityAnalytics.tsx` → Use `useOpportunityOperations`
- [ ] `src/components/admin/opportunities/OpportunityForm.tsx` → Use `useOpportunityOperations`
- [ ] `src/components/admin/opportunities/OpportunityList.tsx` → Use `useOpportunityOperations`
- [ ] `src/components/admin/opportunities/OpportunityManagement.tsx` → Use `useOpportunityOperations`

#### **Partners (P1) - 3 files**
- [ ] `src/components/admin/partners/PartnerAnalytics.tsx` → Create `usePartnerManagement`
- [ ] `src/components/admin/partners/PartnerForm.tsx` → Create `usePartnerManagement`
- [ ] `src/components/admin/partners/PartnerList.tsx` → Create `usePartnerManagement`

#### **Relationships (P1) - 3 files**
- [ ] `src/components/admin/relationships/RelationshipForm.tsx` → Create `useRelationshipData`
- [ ] `src/components/admin/relationships/RelationshipList.tsx` → Create `useRelationshipData`
- [ ] `src/components/admin/relationships/RelationshipVisualization.tsx` → Create `useRelationshipData`

#### **Roles Management (P1) - 3 files**
- [ ] `src/components/admin/roles/RoleForm.tsx` → Create `useRoleManagement`
- [ ] `src/components/admin/roles/RoleList.tsx` → Create `useRoleManagement`
- [ ] `src/components/admin/roles/RoleManagement.tsx` → Create `useRoleManagement`

#### **Storage Management (P1) - 4 files**
- [ ] `src/components/admin/storage/BulkFileActions.tsx` → Use `useStorageOperations`
- [ ] `src/components/admin/storage/FileManagement.tsx` → Use `useStorageOperations`
- [ ] `src/components/admin/storage/StorageAnalytics.tsx` → Use `useStorageOperations`
- [ ] `src/components/admin/storage/StorageManagementPage.tsx` → Use `useStorageOperations`

#### **System Management (P1) - 3 files**
- [ ] `src/components/admin/system/SystemHealth.tsx` → Create `useSystemManagement`
- [ ] `src/components/admin/system/SystemLogs.tsx` → Create `useSystemManagement`
- [ ] `src/components/admin/system/SystemSettings.tsx` → Create `useSystemManagement`

#### **Teams (P1) - 3 files**
- [ ] `src/components/admin/teams/TeamForm.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/teams/TeamList.tsx` → Create `useTeamManagement`
- [ ] `src/components/admin/teams/TeamManagement.tsx` → Create `useTeamManagement`

#### **Users (P1) - 4 files**
- [ ] `src/components/admin/users/UserAnalytics.tsx` → Create `useUserManagement`
- [ ] `src/components/admin/users/UserForm.tsx` → Create `useUserManagement`
- [ ] `src/components/admin/users/UserList.tsx` → Create `useUserManagement`
- [ ] `src/components/admin/users/UserManagement.tsx` → Create `useUserManagement`

### **🟢 PHASE 3: UI COMPONENTS (60+ files)**

#### **Analytics UI (P2) - 8 files**
- [ ] `src/components/analytics/AnalyticsDashboard.tsx` → Use `useAnalytics`
- [ ] `src/components/analytics/AnalyticsFilters.tsx` → Use `useAnalytics`
- [ ] `src/components/analytics/AnalyticsOverview.tsx` → Use `useAnalytics`
- [ ] `src/components/analytics/ChallengeAnalytics.tsx` → Use `useAnalytics`
- [ ] `src/components/analytics/EventAnalytics.tsx` → Use `useAnalytics`
- [ ] `src/components/analytics/IdeaAnalytics.tsx` → Use `useAnalytics`
- [ ] `src/components/analytics/OpportunityAnalytics.tsx` → Use `useAnalytics`
- [ ] `src/components/analytics/UserAnalytics.tsx` → Use `useAnalytics`

#### **Auth Components (P2) - 5 files**
- [ ] `src/components/auth/AuthCallback.tsx` → Create `useAuthOperations`
- [ ] `src/components/auth/LoginForm.tsx` → Create `useAuthOperations`
- [ ] `src/components/auth/PasswordReset.tsx` → Create `useAuthOperations`
- [ ] `src/components/auth/ProfileForm.tsx` → Create `useAuthOperations`
- [ ] `src/components/auth/SignupForm.tsx` → Create `useAuthOperations`

#### **Bookmarks (P2) - 3 files**
- [ ] `src/components/bookmarks/BookmarkButton.tsx` → Use `useBookmarks`
- [ ] `src/components/bookmarks/BookmarkList.tsx` → Use `useBookmarks`
- [ ] `src/components/bookmarks/BookmarkManager.tsx` → Use `useBookmarks`

#### **Challenge UI (P2) - 8 files**
- [ ] `src/components/challenges/ChallengeCard.tsx` → Use `useChallengeDetails`
- [ ] `src/components/challenges/ChallengeComments.tsx` → Use `useChallengeInteractions`
- [ ] `src/components/challenges/ChallengeDetails.tsx` → Use `useChallengeDetails`
- [ ] `src/components/challenges/ChallengeFilters.tsx` → Use `useChallengeDetails`
- [ ] `src/components/challenges/ChallengeForm.tsx` → Use `useChallengeManagement`
- [ ] `src/components/challenges/ChallengeList.tsx` → Use `useChallengeList`
- [ ] `src/components/challenges/ChallengeParticipants.tsx` → Use `useChallengeInteractions`
- [ ] `src/components/challenges/ChallengeSubmissions.tsx` → Use `useChallengeInteractions`

#### **Dashboard (P2) - 8 files**
- [ ] `src/components/dashboard/AdminDashboard.tsx` → Create `useDashboardData`
- [ ] `src/components/dashboard/AdminDashboardMetrics.tsx` → Create `useDashboardData`
- [ ] `src/components/dashboard/DashboardAnalytics.tsx` → Create `useDashboardData`
- [ ] `src/components/dashboard/DashboardCards.tsx` → Create `useDashboardData`
- [ ] `src/components/dashboard/DashboardFilters.tsx` → Create `useDashboardData`
- [ ] `src/components/dashboard/DashboardOverview.tsx` → Create `useDashboardData`
- [ ] `src/components/dashboard/InnovatorDashboard.tsx` → Create `useDashboardData`
- [ ] `src/components/dashboard/UserDashboard.tsx` → Create `useDashboardData`

#### **Discovery (P2) - 3 files**
- [ ] `src/components/discovery/DiscoveryFilters.tsx` → Create `useDiscoveryOperations`
- [ ] `src/components/discovery/DiscoveryResults.tsx` → Create `useDiscoveryOperations`
- [ ] `src/components/discovery/SearchInterface.tsx` → Create `useSearchOperations`

#### **Events UI (P3) - 7 files**
- [ ] `src/components/events/EventCard.tsx` → Use `useEventOperations`
- [ ] `src/components/events/EventDetails.tsx` → Use `useEventOperations`
- [ ] `src/components/events/EventFilters.tsx` → Use `useEventOperations`
- [ ] `src/components/events/EventForm.tsx` → Use `useEventOperations`
- [ ] `src/components/events/EventList.tsx` → Use `useEventOperations`
- [ ] `src/components/events/EventParticipants.tsx` → Use `useEventOperations`
- [ ] `src/components/events/EventRegistration.tsx` → Use `useEventOperations`

#### **Files (P3) - 3 files**
- [ ] `src/components/files/FileUploader.tsx` → Use `useStorageOperations`
- [ ] `src/components/files/FileManager.tsx` → Use `useStorageOperations`
- [ ] `src/components/files/FilePreview.tsx` → Use `useStorageOperations`

#### **Forms (P3) - 3 files**
- [ ] `src/components/forms/DynamicForm.tsx` → Create `useFormBuilder`
- [ ] `src/components/forms/FormBuilder.tsx` → Create `useFormBuilder`
- [ ] `src/components/forms/FormValidator.tsx` → Create `useFormBuilder`

#### **Layout (P3) - 3 files**
- [ ] `src/components/layout/Header.tsx` → Create `useLayoutData`
- [ ] `src/components/layout/Navigation.tsx` → Create `useNavigationData`
- [ ] `src/components/layout/Sidebar.tsx` → Create `useLayoutData`

#### **Navigation (P3) - 3 files**
- [ ] `src/components/navigation/Breadcrumbs.tsx` → Create `useNavigationData`
- [ ] `src/components/navigation/MainNav.tsx` → Create `useNavigationData`
- [ ] `src/components/navigation/UserNav.tsx` → Create `useNavigationData`

#### **Notifications (P3) - 3 files**
- [ ] `src/components/notifications/NotificationCenter.tsx` → Create `useNotificationManagement`
- [ ] `src/components/notifications/NotificationList.tsx` → Create `useNotificationManagement`
- [ ] `src/components/notifications/NotificationSettings.tsx` → Create `useNotificationManagement`

#### **Settings (P3) - 3 files**
- [ ] `src/components/settings/AccountSettings.tsx` → Use `useSettingsManager`
- [ ] `src/components/settings/AppSettings.tsx` → Use `useSettingsManager`
- [ ] `src/components/settings/NotificationSettings.tsx` → Create `useNotificationManagement`

### **🔥 PHASE 4: REMAINING COMPONENTS (20+ files)**

#### **Ideas (P3) - 5 files**
- [ ] `src/components/ideas/IdeaCard.tsx` → Use `useIdeaManagement`
- [ ] `src/components/ideas/IdeaDetails.tsx` → Use `useIdeaManagement`
- [ ] `src/components/ideas/IdeaFilters.tsx` → Use `useIdeaManagement`
- [ ] `src/components/ideas/IdeaForm.tsx` → Use `useIdeaManagement`
- [ ] `src/components/ideas/IdeaList.tsx` → Use `useIdeaManagement`

#### **Opportunities (P3) - 5 files**
- [ ] `src/components/opportunities/OpportunityCard.tsx` → Use `useOpportunityOperations`
- [ ] `src/components/opportunities/OpportunityDetails.tsx` → Use `useOpportunityOperations`
- [ ] `src/components/opportunities/OpportunityFilters.tsx` → Use `useOpportunityOperations`
- [ ] `src/components/opportunities/OpportunityForm.tsx` → Use `useOpportunityOperations`
- [ ] `src/components/opportunities/OpportunityList.tsx` → Use `useOpportunityOperations`

#### **Partners (P3) - 5 files**
- [ ] `src/components/partners/PartnerCard.tsx` → Create `usePartnerManagement`
- [ ] `src/components/partners/PartnerDetails.tsx` → Create `usePartnerManagement`
- [ ] `src/components/partners/PartnerFilters.tsx` → Create `usePartnerManagement`
- [ ] `src/components/partners/PartnerForm.tsx` → Create `usePartnerManagement`
- [ ] `src/components/partners/PartnerList.tsx` → Create `usePartnerManagement`

#### **Profile (P3) - 3 files**
- [ ] `src/components/profile/ProfileCard.tsx` → Create `useProfileManagement`
- [ ] `src/components/profile/ProfileDetails.tsx` → Create `useProfileManagement`
- [ ] `src/components/profile/ProfileForm.tsx` → Create `useProfileManagement`

#### **Search (P3) - 3 files**
- [ ] `src/components/search/SearchFilters.tsx` → Create `useSearchOperations`
- [ ] `src/components/search/SearchResults.tsx` → Create `useSearchOperations`
- [ ] `src/components/search/SearchInterface.tsx` → Create `useSearchOperations`

#### **Submissions (P3) - 4 files**
- [ ] `src/components/submissions/SubmissionCard.tsx` → Use `useIdeaManagement`
- [ ] `src/components/submissions/SubmissionDetails.tsx` → Use `useIdeaManagement`
- [ ] `src/components/submissions/SubmissionForm.tsx` → Use `useIdeaManagement`
- [ ] `src/components/submissions/SubmissionList.tsx` → Use `useIdeaManagement`

---

## **🔧 HOOKS TO CREATE (Priority Order)**

### **P0 - Critical (Immediate) - 14 hooks**
1. ✅ ~~`useFocusQuestionManagement`~~ - Focus question CRUD ✅
2. ✅ ~~`useExpertAssignment`~~ - Expert assignment operations ✅
3. ✅ ~~`useEvaluationManagement`~~ - Evaluation operations ✅
4. ✅ ~~`useExpertProfiles`~~ - Expert profile management ✅
5. ✅ ~~`useIdeaManagement`~~ - Idea CRUD operations ✅
6. [ ] `useTeamManagement` - Team operations **NEXT**
7. [ ] `usePartnerManagement` - Partner operations
8. [ ] `useStakeholderManagement` - Stakeholder operations
9. [ ] `useSectorManagement` - Sector operations
10. [ ] `useRoleManagement` - Role operations
11. [ ] `useUserInvitation` - User invitation operations
12. [ ] `useProfileCalculation` - Profile calculations
13. [ ] `useTranslationManagement` - Translation operations
14. [ ] `useRelationshipData` - Relationship data

### **P1 - Important - 6 hooks**
15. [ ] `useEventParticipants` - Event participant management
16. [ ] `useEventAnalytics` - Event analytics
17. [ ] `useUserManagement` - User operations
18. [ ] `useSystemManagement` - System settings
19. [ ] `useFileManagement` - Advanced file operations
20. [ ] `useSearchOperations` - Search functionality

### **P2 - Moderate - 5 hooks**
21. [ ] `useNotificationManagement` - Notification operations
22. [ ] `useAuthOperations` - Authentication operations
23. [ ] `useProfileManagement` - Profile operations
24. [ ] `useFormBuilder` - Dynamic form operations
25. [ ] `useDiscoveryOperations` - Discovery functionality

---

## **📊 MIGRATION STRATEGY - UPDATED**

### **Week 1: Critical Admin Completion (P0)**
- **Days 1-2:** Create 5 remaining critical hooks (Team, Partner, Stakeholder, Sector, Role)
- **Days 3-5:** Migrate 15 critical admin components
- **Target:** 40/195 components migrated (21%)

### **Week 2: Admin Specialized (P1)**
- **Days 1-2:** Create 6 specialized hooks (Event Participants, Analytics, User, etc.)
- **Days 3-5:** Migrate 30 admin specialized components
- **Target:** 70/195 components migrated (36%)

### **Week 3: UI Components (P2)**
- **Days 1-2:** Create 5 UI hooks (Notifications, Auth, Profile, etc.)
- **Days 3-5:** Migrate 40 UI components
- **Target:** 110/195 components migrated (56%)

### **Week 4: Remaining Components (P3)**
- **Days 1-5:** Migrate remaining 85 components using existing hooks
- **Target:** 195/195 components migrated (100%)

---

## **🚀 IMMEDIATE NEXT ACTIONS**

### **Today:**
1. ✅ **Complete IdeaWizard.tsx migration** (remove remaining direct Supabase calls)
2. **Create `useTeamManagement`** hook
3. **Migrate 3 team-related components**

### **This Week:**
1. **Create 5 critical hooks** (Team, Partner, Stakeholder, Sector, Role)
2. **Migrate 15 critical admin components**
3. **Update progress tracker daily**

### **Success Metrics - Updated:**
- **Week 1:** 40/195 components migrated (21%)
- **Week 2:** 70/195 components migrated (36%)
- **Week 3:** 110/195 components migrated (56%)
- **Week 4:** 195/195 components migrated (100%)

---

## **⚠️ CURRENT BLOCKERS**

1. **IdeaWizard.tsx partial migration** - Need to complete complex operation replacement
2. **Missing hook implementations** for specialized operations
3. **Complex component dependencies** requiring multiple hooks

**Status:** 10/195 complete, 1 partial, 184 remaining. Build errors resolved. Ready to proceed with systematic migration.

---

## **📈 NEXT BATCH PRIORITIES**

### **Batch 5 (Next 3 components):**
1. **Complete IdeaWizard.tsx** migration 
2. **AdminFocusQuestionWizard.tsx** → `useFocusQuestionManagement`
3. **AssignmentDetailView.tsx** → `useExpertAssignment`

### **Batch 6 (After Team hook creation):**
4. **InnovationTeamsContent.tsx** → `useTeamManagement`
5. **TeamManagementContent.tsx** → `useTeamManagement`
6. **TeamWizard.tsx** → `useTeamManagement`

**Ready to continue with next batch!**