# 🚨 COMPREHENSIVE REMAINING MIGRATION TASKS

## **CURRENT STATUS: 6/195 COMPLETE (3%)**

### **✅ COMPLETED MIGRATIONS (6 files):**
1. **AdminChallengeManagement.tsx** → `useChallengeList` ✅
2. **CampaignWizard.tsx** → `useCampaignManagement` ✅  
3. **ChallengeWizard.tsx** → `useChallengeManagement` ✅
4. **BulkAvatarUploader.tsx** → `useStorageOperations` ✅
5. **CampaignsManagement.tsx** → `useCampaignList` ✅
6. **EventsManagement.tsx** → `useEventOperations` ⚠️ (partial)

---

## **📋 REMAINING TASKS: 189 COMPONENTS TO MIGRATE**

### **🚨 PHASE 1: CRITICAL ADMIN COMPONENTS (29 remaining)**

#### **Immediate Priority (P0) - Admin Management**
- [ ] `src/components/admin/AdminFocusQuestionWizard.tsx` → Create `useFocusQuestionManagement`
- [ ] `src/components/admin/AssignmentDetailView.tsx` → Create `useExpertAssignment`
- [ ] `src/components/admin/ChallengeSettings.tsx` → Use `useChallengeManagement`
- [ ] `src/components/admin/EvaluationsManagement.tsx` → Create `useEvaluationManagement`
- [ ] `src/components/admin/ExpertAssignmentManagement.tsx` → Create `useExpertAssignment`
- [ ] `src/components/admin/ExpertProfileDialog.tsx` → Create `useExpertProfiles`
- [ ] `src/components/admin/FocusQuestionManagement.tsx` → Create `useFocusQuestionManagement`
- [ ] `src/components/admin/FocusQuestionsManagement.tsx` → Create `useFocusQuestionManagement`
- [ ] `src/components/admin/IdeaWizard.tsx` → Create `useIdeaManagement`
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

### **🟡 PHASE 2: ADMIN SPECIALIZED COMPONENTS (40+ files)**

#### **Event Management (P1)**
- [ ] `src/components/admin/events/AdminEventAnalytics.tsx`
- [ ] `src/components/admin/events/AdminEventCard.tsx`
- [ ] `src/components/admin/events/AdminEventFilters.tsx`
- [ ] `src/components/admin/events/AdminEventForm.tsx`
- [ ] `src/components/admin/events/AdminEventList.tsx`
- [ ] `src/components/admin/events/AdminEventsHero.tsx`
- [ ] `src/components/admin/events/BulkEventActions.tsx`
- [ ] `src/components/admin/events/EventAnalyticsDashboard.tsx`
- [ ] `src/components/admin/events/EventAttendanceTracker.tsx`
- [ ] `src/components/admin/events/EventBulkActions.tsx`
- [ ] `src/components/admin/events/EventParticipantManager.tsx`

#### **Expert Management (P1)**
- [ ] `src/components/admin/experts/ExpertDetailView.tsx`
- [ ] `src/components/admin/experts/ExpertList.tsx`
- [ ] `src/components/admin/experts/ExpertManagement.tsx`
- [ ] `src/components/admin/experts/ExpertWizard.tsx`

#### **Focus Questions (P1)**
- [ ] `src/components/admin/focus-questions/FocusQuestionAnalytics.tsx`
- [ ] `src/components/admin/focus-questions/FocusQuestionForm.tsx`
- [ ] `src/components/admin/focus-questions/FocusQuestionList.tsx`

#### **Ideas Management (P1)**
- [ ] `src/components/admin/ideas/IdeaAnalytics.tsx`
- [ ] `src/components/admin/ideas/IdeaForm.tsx`
- [ ] `src/components/admin/ideas/IdeaList.tsx`
- [ ] `src/components/admin/ideas/IdeaManagement.tsx`

#### **Innovation Teams (P1)**
- [ ] `src/components/admin/innovation-teams/InnovationTeamAnalytics.tsx`
- [ ] `src/components/admin/innovation-teams/InnovationTeamForm.tsx`
- [ ] `src/components/admin/innovation-teams/InnovationTeamList.tsx`

#### **Opportunities (P1)**
- [ ] `src/components/admin/opportunities/OpportunityAnalytics.tsx`
- [ ] `src/components/admin/opportunities/OpportunityForm.tsx`
- [ ] `src/components/admin/opportunities/OpportunityList.tsx`
- [ ] `src/components/admin/opportunities/OpportunityManagement.tsx`

#### **Partners (P1)**
- [ ] `src/components/admin/partners/PartnerAnalytics.tsx`
- [ ] `src/components/admin/partners/PartnerForm.tsx`
- [ ] `src/components/admin/partners/PartnerList.tsx`

#### **Relationships (P1)**
- [ ] `src/components/admin/relationships/RelationshipForm.tsx`
- [ ] `src/components/admin/relationships/RelationshipList.tsx`
- [ ] `src/components/admin/relationships/RelationshipVisualization.tsx`

#### **Roles Management (P1)**
- [ ] `src/components/admin/roles/RoleForm.tsx`
- [ ] `src/components/admin/roles/RoleList.tsx`
- [ ] `src/components/admin/roles/RoleManagement.tsx`

#### **Storage Management (P1)**
- [ ] `src/components/admin/storage/BulkFileActions.tsx`
- [ ] `src/components/admin/storage/FileManagement.tsx`
- [ ] `src/components/admin/storage/StorageAnalytics.tsx`
- [ ] `src/components/admin/storage/StorageManagementPage.tsx`

#### **System Management (P1)**
- [ ] `src/components/admin/system/SystemHealth.tsx`
- [ ] `src/components/admin/system/SystemLogs.tsx`
- [ ] `src/components/admin/system/SystemSettings.tsx`

#### **Teams (P1)**
- [ ] `src/components/admin/teams/TeamForm.tsx`
- [ ] `src/components/admin/teams/TeamList.tsx`
- [ ] `src/components/admin/teams/TeamManagement.tsx`

#### **Users (P1)**
- [ ] `src/components/admin/users/UserAnalytics.tsx`
- [ ] `src/components/admin/users/UserForm.tsx`
- [ ] `src/components/admin/users/UserList.tsx`
- [ ] `src/components/admin/users/UserManagement.tsx`

### **🟢 PHASE 3: UI COMPONENTS (60+ files)**

#### **Analytics UI (P2)**
- [ ] `src/components/analytics/AnalyticsDashboard.tsx`
- [ ] `src/components/analytics/AnalyticsFilters.tsx`
- [ ] `src/components/analytics/AnalyticsOverview.tsx`
- [ ] `src/components/analytics/ChallengeAnalytics.tsx`
- [ ] `src/components/analytics/EventAnalytics.tsx`
- [ ] `src/components/analytics/IdeaAnalytics.tsx`
- [ ] `src/components/analytics/OpportunityAnalytics.tsx`
- [ ] `src/components/analytics/UserAnalytics.tsx`

#### **Auth Components (P2)**
- [ ] `src/components/auth/AuthCallback.tsx`
- [ ] `src/components/auth/LoginForm.tsx`
- [ ] `src/components/auth/PasswordReset.tsx`
- [ ] `src/components/auth/ProfileForm.tsx`
- [ ] `src/components/auth/SignupForm.tsx`

#### **Bookmarks (P2)**
- [ ] `src/components/bookmarks/BookmarkButton.tsx`
- [ ] `src/components/bookmarks/BookmarkList.tsx`
- [ ] `src/components/bookmarks/BookmarkManager.tsx`

#### **Challenge UI (P2)**
- [ ] `src/components/challenges/ChallengeCard.tsx`
- [ ] `src/components/challenges/ChallengeComments.tsx`
- [ ] `src/components/challenges/ChallengeDetails.tsx`
- [ ] `src/components/challenges/ChallengeFilters.tsx`
- [ ] `src/components/challenges/ChallengeForm.tsx`
- [ ] `src/components/challenges/ChallengeList.tsx`
- [ ] `src/components/challenges/ChallengeParticipants.tsx`
- [ ] `src/components/challenges/ChallengeSubmissions.tsx`

#### **Dashboard (P2)**
- [ ] `src/components/dashboard/AdminDashboard.tsx`
- [ ] `src/components/dashboard/AdminDashboardMetrics.tsx`
- [ ] `src/components/dashboard/DashboardAnalytics.tsx`
- [ ] `src/components/dashboard/DashboardCards.tsx`
- [ ] `src/components/dashboard/DashboardFilters.tsx`
- [ ] `src/components/dashboard/DashboardOverview.tsx`
- [ ] `src/components/dashboard/InnovatorDashboard.tsx`
- [ ] `src/components/dashboard/UserDashboard.tsx`

#### **Discovery (P2)**
- [ ] `src/components/discovery/DiscoveryFilters.tsx`
- [ ] `src/components/discovery/DiscoveryResults.tsx`
- [ ] `src/components/discovery/SearchInterface.tsx`

#### **Events UI (P3)**
- [ ] `src/components/events/EventCard.tsx`
- [ ] `src/components/events/EventDetails.tsx`
- [ ] `src/components/events/EventFilters.tsx`
- [ ] `src/components/events/EventForm.tsx`
- [ ] `src/components/events/EventList.tsx`
- [ ] `src/components/events/EventParticipants.tsx`
- [ ] `src/components/events/EventRegistration.tsx`

#### **Files (P3)**
- [ ] `src/components/files/FileUploader.tsx`
- [ ] `src/components/files/FileManager.tsx`
- [ ] `src/components/files/FilePreview.tsx`

#### **Forms (P3)**
- [ ] `src/components/forms/DynamicForm.tsx`
- [ ] `src/components/forms/FormBuilder.tsx`
- [ ] `src/components/forms/FormValidator.tsx`

#### **Layout (P3)**
- [ ] `src/components/layout/Header.tsx`
- [ ] `src/components/layout/Navigation.tsx`
- [ ] `src/components/layout/Sidebar.tsx`

#### **Navigation (P3)**
- [ ] `src/components/navigation/Breadcrumbs.tsx`
- [ ] `src/components/navigation/MainNav.tsx`
- [ ] `src/components/navigation/UserNav.tsx`

#### **Notifications (P3)**
- [ ] `src/components/notifications/NotificationCenter.tsx`
- [ ] `src/components/notifications/NotificationList.tsx`
- [ ] `src/components/notifications/NotificationSettings.tsx`

#### **Settings (P3)**
- [ ] `src/components/settings/AccountSettings.tsx`
- [ ] `src/components/settings/AppSettings.tsx`
- [ ] `src/components/settings/NotificationSettings.tsx`

### **🔥 PHASE 4: REMAINING COMPONENTS (60+ files)**

#### **Ideas (P3)**
- [ ] `src/components/ideas/IdeaCard.tsx`
- [ ] `src/components/ideas/IdeaDetails.tsx`
- [ ] `src/components/ideas/IdeaFilters.tsx`
- [ ] `src/components/ideas/IdeaForm.tsx`
- [ ] `src/components/ideas/IdeaList.tsx`

#### **Opportunities (P3)**
- [ ] `src/components/opportunities/OpportunityCard.tsx`
- [ ] `src/components/opportunities/OpportunityDetails.tsx`
- [ ] `src/components/opportunities/OpportunityFilters.tsx`
- [ ] `src/components/opportunities/OpportunityForm.tsx`
- [ ] `src/components/opportunities/OpportunityList.tsx`

#### **Partners (P3)**
- [ ] `src/components/partners/PartnerCard.tsx`
- [ ] `src/components/partners/PartnerDetails.tsx`
- [ ] `src/components/partners/PartnerFilters.tsx`
- [ ] `src/components/partners/PartnerForm.tsx`
- [ ] `src/components/partners/PartnerList.tsx`

#### **Profile (P3)**
- [ ] `src/components/profile/ProfileCard.tsx`
- [ ] `src/components/profile/ProfileDetails.tsx`
- [ ] `src/components/profile/ProfileForm.tsx`

#### **Search (P3)**
- [ ] `src/components/search/SearchFilters.tsx`
- [ ] `src/components/search/SearchResults.tsx`
- [ ] `src/components/search/SearchInterface.tsx`

#### **Submissions (P3)**
- [ ] `src/components/submissions/SubmissionCard.tsx`
- [ ] `src/components/submissions/SubmissionDetails.tsx`
- [ ] `src/components/submissions/SubmissionForm.tsx`
- [ ] `src/components/submissions/SubmissionList.tsx`

---

## **🔧 HOOKS TO CREATE (Priority Order)**

### **P0 - Critical (Immediate)**
1. `useFocusQuestionManagement` - Focus question CRUD
2. `useExpertAssignment` - Expert assignment operations
3. `useEvaluationManagement` - Evaluation operations
4. `useExpertProfiles` - Expert profile management
5. `useIdeaManagement` - Idea CRUD operations
6. `useTeamManagement` - Team operations
7. `usePartnerManagement` - Partner operations
8. `useStakeholderManagement` - Stakeholder operations
9. `useSectorManagement` - Sector operations
10. `useRoleManagement` - Role operations
11. `useUserInvitation` - User invitation operations
12. `useProfileCalculation` - Profile calculations
13. `useTranslationManagement` - Translation operations
14. `useRelationshipData` - Relationship data

### **P1 - Important**
15. `useEventParticipants` - Event participant management
16. `useEventAnalytics` - Event analytics
17. `useUserManagement` - User operations
18. `useSystemManagement` - System settings
19. `useFileManagement` - Advanced file operations
20. `useSearchOperations` - Search functionality

### **P2 - Moderate**
21. `useNotificationManagement` - Notification operations
22. `useAuthOperations` - Authentication operations
23. `useProfileManagement` - Profile operations
24. `useFormBuilder` - Dynamic form operations
25. `useDiscoveryOperations` - Discovery functionality

---

## **📊 MIGRATION STRATEGY**

### **Week 1: Critical Admin (P0)**
- **Days 1-2:** Create 7 critical hooks (Focus Questions, Expert Assignment, Evaluation, etc.)
- **Days 3-5:** Migrate 15 critical admin components

### **Week 2: Admin Specialized (P1)**
- **Days 1-3:** Create 6 specialized hooks (Event Participants, Analytics, etc.)
- **Days 4-5:** Migrate 20 admin specialized components

### **Week 3: UI Components (P2)**
- **Days 1-3:** Create 5 UI hooks (Notifications, Auth, Profile, etc.)
- **Days 4-5:** Migrate 30 UI components

### **Week 4: Remaining Components (P3)**
- **Days 1-5:** Migrate remaining 60+ components using existing hooks

---

## **🚀 IMMEDIATE NEXT ACTIONS**

### **Today:**
1. ✅ **Fix build errors** (in progress)
2. **Create `useFocusQuestionManagement`** hook
3. **Migrate 3 focus question components**

### **This Week:**
1. **Create 7 critical hooks** (P0 list)
2. **Migrate 15 critical admin components**
3. **Update progress tracker daily**

### **Success Metrics:**
- **Week 1:** 50/195 components migrated (26%)
- **Week 2:** 100/195 components migrated (51%)
- **Week 3:** 150/195 components migrated (77%)
- **Week 4:** 195/195 components migrated (100%)

---

## **⚠️ CURRENT BLOCKERS**

1. **Type mismatches** in query hooks (being fixed)
2. **Missing hook implementations** for specialized operations
3. **Complex component dependencies** requiring multiple hooks

**Status:** 6/195 complete, 189 remaining. Ready to proceed with systematic migration.