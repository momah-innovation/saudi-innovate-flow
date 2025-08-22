# Saudi Innovation Spark Platform - Comprehensive File Structure

## Overview
This document outlines the complete file structure for the Saudi Innovation Spark Platform, designed to handle enterprise-level innovation management with multi-level hierarchies, role-based access control, and comprehensive marketplace functionality.

## Core Architecture Principles
- **Feature-First Organization**: Each major feature has its own directory
- **Hierarchical Structure Support**: Organizations → Sectors → Departments → Teams
- **Role-Based Access Control**: Super Admin → Admin → Manager → User levels
- **Multi-Language Support**: Arabic (RTL) and English
- **Security-First Design**: RLS policies and permission systems
- **Scalable Component Architecture**: Reusable UI components and business logic

---

## 📁 Root Directory Structure

```
saudi-innovation-spark-platform/
├── 📁 public/
│   ├── 📁 assets/
│   │   ├── 📁 images/
│   │   │   ├── 📁 logos/
│   │   │   ├── 📁 banners/
│   │   │   ├── 📁 icons/
│   │   │   ├── 📁 avatars/
│   │   │   └── 📁 placeholders/
│   │   ├── 📁 documents/
│   │   └── 📁 media/
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── 📁 src/
├── 📁 supabase/
├── 📁 docs/
├── 📁 tests/
└── 📁 scripts/
```

---

## 📁 src/ Directory - Complete Structure

### Core Application Files
```
src/
├── App.tsx                              # Main application component
├── main.tsx                             # Application entry point
├── vite-env.d.ts                        # Vite type definitions
└── index.css                            # Global styles and design tokens
```

### 📁 components/ - UI Component Library
```
components/
├── 📁 ui/                               # shadcn/ui base components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── badge.tsx
│   ├── avatar.tsx
│   ├── select.tsx
│   ├── textarea.tsx
│   ├── calendar.tsx
│   ├── popover.tsx
│   ├── toast.tsx
│   ├── alert.tsx
│   ├── progress.tsx
│   ├── skeleton.tsx
│   ├── sidebar.tsx
│   ├── navigation-menu.tsx
│   └── accordion.tsx
├── 📁 layout/                           # Layout components
│   ├── header/
│   │   ├── Header.tsx
│   │   ├── Navigation.tsx
│   │   ├── UserMenu.tsx
│   │   ├── NotificationCenter.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── SearchGlobal.tsx
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   ├── SidebarMenu.tsx
│   │   ├── SidebarItem.tsx
│   │   └── CollapsibleMenu.tsx
│   ├── footer/
│   │   ├── Footer.tsx
│   │   ├── FooterLinks.tsx
│   │   └── SocialLinks.tsx
│   └── PageLayout.tsx
├── 📁 common/                           # Reusable common components
│   ├── LoadingSpinner.tsx
│   ├── ErrorBoundary.tsx
│   ├── ConfirmDialog.tsx
│   ├── ImageUpload.tsx
│   ├── FileUpload.tsx
│   ├── DataTable.tsx
│   ├── SearchBox.tsx
│   ├── FilterBar.tsx
│   ├── SortOptions.tsx
│   ├── Pagination.tsx
│   ├── EmptyState.tsx
│   ├── StatusBadge.tsx
│   ├── PriorityIndicator.tsx
│   ├── DatePicker.tsx
│   ├── RichTextEditor.tsx
│   ├── CodeEditor.tsx
│   ├── ColorPicker.tsx
│   ├── TagInput.tsx
│   ├── MultiSelect.tsx
│   └── ProgressTracker.tsx
├── 📁 forms/                            # Form-specific components
│   ├── FormField.tsx
│   ├── FormSection.tsx
│   ├── FormWizard.tsx
│   ├── ValidationMessage.tsx
│   ├── FieldArray.tsx
│   └── DynamicForm.tsx
└── 📁 charts/                           # Data visualization components
    ├── LineChart.tsx
    ├── BarChart.tsx
    ├── PieChart.tsx
    ├── AreaChart.tsx
    ├── DonutChart.tsx
    ├── RadarChart.tsx
    ├── TreeMap.tsx
    ├── Heatmap.tsx
    ├── Gauge.tsx
    └── MetricCard.tsx
```

### 📁 features/ - Feature-Based Modules

#### 🔐 Authentication & User Management
```
features/
├── 📁 auth/
│   ├── 📁 components/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   ├── TwoFactorAuth.tsx
│   │   ├── SocialLogin.tsx
│   │   └── AuthGuard.tsx
│   ├── 📁 hooks/
│   │   ├── useAuth.ts
│   │   ├── useLogin.ts
│   │   ├── useSignup.ts
│   │   ├── useForgotPassword.ts
│   │   └── useAuthRedirect.ts
│   ├── 📁 services/
│   │   ├── authService.ts
│   │   ├── sessionService.ts
│   │   └── tokenService.ts
│   ├── 📁 types/
│   │   └── auth.types.ts
│   └── 📁 utils/
│       ├── authValidation.ts
│       └── authHelpers.ts
```

#### 👤 User Profiles & Management
```
├── 📁 profiles/
│   ├── 📁 components/
│   │   ├── ProfileCard.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── AvatarUpload.tsx
│   │   ├── SkillsEditor.tsx
│   │   ├── ExperienceEditor.tsx
│   │   ├── PreferencesSettings.tsx
│   │   ├── PrivacySettings.tsx
│   │   ├── NotificationSettings.tsx
│   │   └── AccountSecurity.tsx
│   ├── 📁 hooks/
│   │   ├── useProfile.ts
│   │   ├── useProfileUpdate.ts
│   │   ├── useUserSearch.ts
│   │   └── useUserAnalytics.ts
│   ├── 📁 services/
│   │   ├── profileService.ts
│   │   └── userService.ts
│   └── 📁 types/
│       └── profile.types.ts
```

#### 🏢 Organizations & Hierarchy Management
```
├── 📁 organizations/
│   ├── 📁 components/
│   │   ├── OrganizationCard.tsx
│   │   ├── OrganizationForm.tsx
│   │   ├── OrganizationTree.tsx
│   │   ├── OrganizationChart.tsx
│   │   ├── OrganizationMembers.tsx
│   │   ├── OrganizationSettings.tsx
│   │   ├── OrganizationAnalytics.tsx
│   │   └── OrganizationInvite.tsx
│   ├── 📁 sectors/
│   │   ├── 📁 components/
│   │   │   ├── SectorCard.tsx
│   │   │   ├── SectorForm.tsx
│   │   │   ├── SectorManagement.tsx
│   │   │   ├── SectorAnalytics.tsx
│   │   │   └── SectorHierarchy.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useSectors.ts
│   │   │   ├── useSectorManagement.ts
│   │   │   └── useSectorAnalytics.ts
│   │   └── 📁 types/
│   │       └── sector.types.ts
│   ├── 📁 departments/
│   │   ├── 📁 components/
│   │   │   ├── DepartmentCard.tsx
│   │   │   ├── DepartmentForm.tsx
│   │   │   ├── DepartmentManagement.tsx
│   │   │   ├── DepartmentMembers.tsx
│   │   │   ├── DepartmentAnalytics.tsx
│   │   │   └── DepartmentHierarchy.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useDepartments.ts
│   │   │   ├── useDepartmentManagement.ts
│   │   │   └── useDepartmentAnalytics.ts
│   │   └── 📁 types/
│   │       └── department.types.ts
│   ├── 📁 hooks/
│   │   ├── useOrganizations.ts
│   │   ├── useOrganizationManagement.ts
│   │   ├── useOrganizationMembers.ts
│   │   ├── useOrganizationAnalytics.ts
│   │   └── useHierarchyNavigation.ts
│   ├── 📁 services/
│   │   ├── organizationService.ts
│   │   ├── sectorService.ts
│   │   ├── departmentService.ts
│   │   └── hierarchyService.ts
│   └── 📁 types/
│       ├── organization.types.ts
│       └── hierarchy.types.ts
```

#### 👥 Teams Management
```
├── 📁 teams/
│   ├── 📁 components/
│   │   ├── TeamCard.tsx
│   │   ├── TeamForm.tsx
│   │   ├── TeamDashboard.tsx
│   │   ├── TeamMembers.tsx
│   │   ├── TeamInvite.tsx
│   │   ├── TeamSettings.tsx
│   │   ├── TeamAnalytics.tsx
│   │   ├── TeamCollaboration.tsx
│   │   ├── TeamProjects.tsx
│   │   ├── TeamCalendar.tsx
│   │   ├── TeamChat.tsx
│   │   ├── TeamFiles.tsx
│   │   ├── TeamTasks.tsx
│   │   └── TeamPerformance.tsx
│   ├── 📁 individual-teams/
│   │   ├── 📁 components/
│   │   │   ├── IndividualTeamCard.tsx
│   │   │   ├── IndividualTeamForm.tsx
│   │   │   ├── TeamCreationWizard.tsx
│   │   │   └── TeamJoinRequest.tsx
│   │   └── 📁 hooks/
│   │       ├── useIndividualTeams.ts
│   │       └── useTeamCreation.ts
│   ├── 📁 organization-teams/
│   │   ├── 📁 components/
│   │   │   ├── OrgTeamCard.tsx
│   │   │   ├── OrgTeamForm.tsx
│   │   │   ├── OrgTeamManagement.tsx
│   │   │   └── OrgTeamAssignment.tsx
│   │   └── 📁 hooks/
│   │       ├── useOrgTeams.ts
│   │       └── useTeamAssignment.ts
│   ├── 📁 hooks/
│   │   ├── useTeams.ts
│   │   ├── useTeamManagement.ts
│   │   ├── useTeamMembers.ts
│   │   ├── useTeamCollaboration.ts
│   │   ├── useTeamAnalytics.ts
│   │   └── useTeamInvites.ts
│   ├── 📁 services/
│   │   ├── teamService.ts
│   │   ├── teamMemberService.ts
│   │   ├── teamCollaborationService.ts
│   │   └── teamAnalyticsService.ts
│   └── 📁 types/
│       └── team.types.ts
```

#### 🎯 Challenges & Innovation
```
├── 📁 challenges/
│   ├── 📁 components/
│   │   ├── ChallengeCard.tsx
│   │   ├── ChallengeForm.tsx
│   │   ├── ChallengeDetails.tsx
│   │   ├── ChallengeList.tsx
│   │   ├── ChallengeFilters.tsx
│   │   ├── ChallengeSubmission.tsx
│   │   ├── ChallengeEvaluation.tsx
│   │   ├── ChallengeAnalytics.tsx
│   │   ├── ChallengeTimeline.tsx
│   │   ├── ChallengeParticipants.tsx
│   │   ├── ChallengeComments.tsx
│   │   ├── ChallengeVoting.tsx
│   │   ├── ChallengeRewards.tsx
│   │   ├── ChallengeTemplates.tsx
│   │   └── ChallengeWizard.tsx
│   ├── 📁 submissions/
│   │   ├── 📁 components/
│   │   │   ├── SubmissionCard.tsx
│   │   │   ├── SubmissionForm.tsx
│   │   │   ├── SubmissionDetails.tsx
│   │   │   ├── SubmissionEvaluation.tsx
│   │   │   ├── SubmissionComments.tsx
│   │   │   ├── SubmissionVersions.tsx
│   │   │   ├── SubmissionCompare.tsx
│   │   │   ├── SubmissionScoring.tsx
│   │   │   └── SubmissionAnalytics.tsx
│   │   └── 📁 hooks/
│   │       ├── useSubmissions.ts
│   │       ├── useSubmissionManagement.ts
│   │       ├── useSubmissionEvaluation.ts
│   │       └── useSubmissionCompare.ts
│   ├── 📁 hooks/
│   │   ├── useChallenges.ts
│   │   ├── useChallengeManagement.ts
│   │   ├── useChallengeParticipation.ts
│   │   ├── useChallengeEvaluation.ts
│   │   ├── useChallengeAnalytics.ts
│   │   ├── useChallengeTemplates.ts
│   │   └── useChallengeFilters.ts
│   ├── 📁 services/
│   │   ├── challengeService.ts
│   │   ├── submissionService.ts
│   │   ├── evaluationService.ts
│   │   ├── templateService.ts
│   │   └── participationService.ts
│   └── 📁 types/
│       ├── challenge.types.ts
│       ├── submission.types.ts
│       └── template.types.ts
```

#### 📋 Templates & Forms System
```
├── 📁 templates/
│   ├── 📁 components/
│   │   ├── TemplateCard.tsx
│   │   ├── TemplateForm.tsx
│   │   ├── TemplateEditor.tsx
│   │   ├── TemplatePreview.tsx
│   │   ├── TemplateLibrary.tsx
│   │   ├── TemplateBuilder.tsx
│   │   ├── TemplateImporter.tsx
│   │   ├── TemplateExporter.tsx
│   │   ├── TemplateVersions.tsx
│   │   ├── TemplateSharing.tsx
│   │   ├── TemplateCategories.tsx
│   │   ├── TemplateSearch.tsx
│   │   ├── DynamicFormRenderer.tsx
│   │   ├── FormFieldBuilder.tsx
│   │   └── TemplateAnalytics.tsx
│   ├── 📁 challenge-templates/
│   │   ├── 📁 components/
│   │   │   ├── ChallengeTemplateCard.tsx
│   │   │   ├── ChallengeTemplateForm.tsx
│   │   │   ├── ChallengeTemplateBuilder.tsx
│   │   │   ├── ChallengeTemplatePreview.tsx
│   │   │   └── ChallengeTemplateWizard.tsx
│   │   └── 📁 hooks/
│   │       ├── useChallengeTemplates.ts
│   │       └── useChallengeTemplateBuilder.ts
│   ├── 📁 campaign-templates/
│   │   ├── 📁 components/
│   │   │   ├── CampaignTemplateCard.tsx
│   │   │   ├── CampaignTemplateForm.tsx
│   │   │   ├── CampaignTemplateBuilder.tsx
│   │   │   └── CampaignTemplatePreview.tsx
│   │   └── 📁 hooks/
│   │       ├── useCampaignTemplates.ts
│   │       └── useCampaignTemplateBuilder.ts
│   ├── 📁 event-templates/
│   │   ├── 📁 components/
│   │   │   ├── EventTemplateCard.tsx
│   │   │   ├── EventTemplateForm.tsx
│   │   │   ├── EventTemplateBuilder.tsx
│   │   │   └── EventTemplatePreview.tsx
│   │   └── 📁 hooks/
│   │       ├── useEventTemplates.ts
│   │       └── useEventTemplateBuilder.ts
│   ├── 📁 evaluation-templates/
│   │   ├── 📁 components/
│   │   │   ├── EvaluationTemplateCard.tsx
│   │   │   ├── EvaluationTemplateForm.tsx
│   │   │   ├── EvaluationTemplateBuilder.tsx
│   │   │   ├── ScoringTemplateBuilder.tsx
│   │   │   ├── CriteriaTemplateBuilder.tsx
│   │   │   └── EvaluationTemplatePreview.tsx
│   │   └── 📁 hooks/
│   │       ├── useEvaluationTemplates.ts
│   │       ├── useScoringTemplates.ts
│   │       └── useCriteriaTemplates.ts
│   ├── 📁 document-templates/
│   │   ├── 📁 components/
│   │   │   ├── DocumentTemplateCard.tsx
│   │   │   ├── DocumentTemplateForm.tsx
│   │   │   ├── DocumentTemplateEditor.tsx
│   │   │   ├── ReportTemplateBuilder.tsx
│   │   │   ├── CertificateTemplateBuilder.tsx
│   │   │   └── DocumentTemplatePreview.tsx
│   │   └── 📁 hooks/
│   │       ├── useDocumentTemplates.ts
│   │       ├── useReportTemplates.ts
│   │       └── useCertificateTemplates.ts
│   ├── 📁 email-templates/
│   │   ├── 📁 components/
│   │   │   ├── EmailTemplateCard.tsx
│   │   │   ├── EmailTemplateForm.tsx
│   │   │   ├── EmailTemplateEditor.tsx
│   │   │   ├── EmailTemplatePreview.tsx
│   │   │   ├── EmailVariableManager.tsx
│   │   │   └── EmailTemplateTestSender.tsx
│   │   └── 📁 hooks/
│   │       ├── useEmailTemplates.ts
│   │       ├── useEmailVariables.ts
│   │       └── useEmailTesting.ts
│   ├── 📁 hooks/
│   │   ├── useTemplates.ts
│   │   ├── useTemplateManagement.ts  
│   │   ├── useTemplateBuilder.ts
│   │   ├── useTemplateLibrary.ts
│   │   ├── useTemplateSharing.ts
│   │   ├── useTemplateVersions.ts
│   │   ├── useTemplateAnalytics.ts
│   │   ├── useDynamicForms.ts
│   │   └── useFormValidation.ts
│   ├── 📁 services/
│   │   ├── templateService.ts
│   │   ├── templateBuilderService.ts
│   │   ├── templateLibraryService.ts
│   │   ├── dynamicFormService.ts
│   │   ├── templateSharingService.ts
│   │   ├── templateVersioningService.ts
│   │   └── templateAnalyticsService.ts
│   └── 📁 types/
│       ├── template.types.ts
│       ├── form.types.ts
│       ├── builder.types.ts
│       └── validation.types.ts
```

#### 🔍 Ideas & Evaluations System
```
├── 📁 evaluations/
│   ├── 📁 components/
│   │   ├── EvaluationDashboard.tsx
│   │   ├── EvaluationCard.tsx
│   │   ├── EvaluationForm.tsx
│   │   ├── EvaluationDetails.tsx
│   │   ├── EvaluationWorkflow.tsx
│   │   ├── EvaluationCriteria.tsx
│   │   ├── EvaluationScoring.tsx
│   │   ├── EvaluationComparison.tsx
│   │   ├── EvaluationCalibration.tsx
│   │   ├── EvaluationConflictResolution.tsx
│   │   ├── EvaluationAnalytics.tsx
│   │   ├── EvaluationReports.tsx
│   │   ├── ReviewerAssignment.tsx
│   │   ├── ReviewerWorkspace.tsx
│   │   └── EvaluationTimeline.tsx
│   ├── 📁 idea-evaluation/
│   │   ├── 📁 components/
│   │   │   ├── IdeaEvaluationCard.tsx
│   │   │   ├── IdeaEvaluationForm.tsx
│   │   │   ├── IdeaScorecard.tsx
│   │   │   ├── IdeaScoringMatrix.tsx
│   │   │   ├── IdeaComparison.tsx
│   │   │   ├── IdeaRanking.tsx
│   │   │   ├── IdeaFeedback.tsx
│   │   │   ├── IdeaRecommendations.tsx
│   │   │   ├── IdeaImplementationPlan.tsx
│   │   │   └── IdeaEvaluationSummary.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useIdeaEvaluation.ts
│   │   │   ├── useIdeaScoring.ts
│   │   │   ├── useIdeaComparison.ts
│   │   │   ├── useIdeaRanking.ts
│   │   │   └── useIdeaFeedback.ts
│   │   └── 📁 types/
│   │       └── ideaEvaluation.types.ts
│   ├── 📁 peer-review/
│   │   ├── 📁 components/
│   │   │   ├── PeerReviewCard.tsx
│   │   │   ├── PeerReviewForm.tsx
│   │   │   ├── PeerReviewAssignment.tsx
│   │   │   ├── PeerReviewWorkspace.tsx
│   │   │   ├── PeerReviewCalibration.tsx
│   │   │   ├── PeerReviewConsensus.tsx
│   │   │   ├── PeerReviewConflicts.tsx
│   │   │   └── PeerReviewAnalytics.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── usePeerReview.ts
│   │   │   ├── usePeerReviewAssignment.ts
│   │   │   ├── usePeerReviewCalibration.ts
│   │   │   └── usePeerReviewConsensus.ts
│   │   └── 📁 types/
│   │       └── peerReview.types.ts
│   ├── 📁 expert-evaluation/
│   │   ├── 📁 components/
│   │   │   ├── ExpertEvaluationCard.tsx
│   │   │   ├── ExpertEvaluationForm.tsx
│   │   │   ├── ExpertAssignment.tsx
│   │   │   ├── ExpertWorkspace.tsx
│   │   │   ├── ExpertRecommendations.tsx
│   │   │   ├── ExpertConsultation.tsx
│   │   │   ├── ExpertPanel.tsx
│   │   │   └── ExpertConflictResolution.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useExpertEvaluation.ts
│   │   │   ├── useExpertAssignment.ts
│   │   │   ├── useExpertPanel.ts
│   │   │   └── useExpertConsultation.ts
│   │   └── 📁 types/
│   │       └── expertEvaluation.types.ts
│   ├── 📁 evaluation-workflows/
│   │   ├── 📁 components/
│   │   │   ├── WorkflowBuilder.tsx
│   │   │   ├── WorkflowEditor.tsx
│   │   │   ├── WorkflowSteps.tsx
│   │   │   ├── WorkflowApprovals.tsx
│   │   │   ├── WorkflowMonitoring.tsx
│   │   │   ├── WorkflowAnalytics.tsx
│   │   │   ├── MultiStageEvaluation.tsx
│   │   │   └── EvaluationPipeline.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useEvaluationWorkflows.ts
│   │   │   ├── useWorkflowBuilder.ts
│   │   │   ├── useWorkflowExecution.ts
│   │   │   └── useWorkflowMonitoring.ts
│   │   └── 📁 types/
│   │       └── evaluationWorkflow.types.ts
│   ├── 📁 scoring-systems/
│   │   ├── 📁 components/
│   │   │   ├── ScoringSystemCard.tsx
│   │   │   ├── ScoringSystemForm.tsx
│   │   │   ├── ScoringSystemBuilder.tsx
│   │   │   ├── WeightedScoring.tsx
│   │   │   ├── RankingScoring.tsx
│   │   │   ├── QualitativeScoring.tsx
│   │   │   ├── HybridScoring.tsx
│   │   │   ├── ScoringCalibration.tsx
│   │   │   └── ScoringAnalytics.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useScoringSystem.ts
│   │   │   ├── useScoringBuilder.ts
│   │   │   ├── useScoringCalibration.ts
│   │   │   └── useScoringAnalytics.ts
│   │   └── 📁 types/
│   │       └── scoringSystem.types.ts
│   ├── 📁 hooks/
│   │   ├── useEvaluations.ts
│   │   ├── useEvaluationManagement.ts
│   │   ├── useEvaluationAssignment.ts
│   │   ├── useEvaluationWorkflow.ts
│   │   ├── useEvaluationAnalytics.ts
│   │   ├── useReviewerManagement.ts
│   │   ├── useEvaluationCalibration.ts
│   │   ├── useConflictResolution.ts
│   │   └── useEvaluationReports.ts
│   ├── 📁 services/
│   │   ├── evaluationService.ts
│   │   ├── ideaEvaluationService.ts
│   │   ├── peerReviewService.ts
│   │   ├── expertEvaluationService.ts
│   │   ├── workflowService.ts
│   │   ├── scoringService.ts
│   │   ├── reviewerService.ts
│   │   ├── calibrationService.ts
│   │   ├── conflictResolutionService.ts
│   │   └── evaluationAnalyticsService.ts
│   └── 📁 types/
│       ├── evaluation.types.ts
│       ├── reviewer.types.ts
│       ├── workflow.types.ts
│       ├── scoring.types.ts
│       ├── calibration.types.ts
│       └── analytics.types.ts
```

#### 📢 Campaigns Management
```
├── 📁 campaigns/
│   ├── 📁 components/
│   │   ├── CampaignCard.tsx
│   │   ├── CampaignForm.tsx
│   │   ├── CampaignDashboard.tsx
│   │   ├── CampaignAnalytics.tsx
│   │   ├── CampaignTargeting.tsx
│   │   ├── CampaignContent.tsx
│   │   ├── CampaignSchedule.tsx
│   │   ├── CampaignBudget.tsx
│   │   ├── CampaignPerformance.tsx
│   │   ├── CampaignAudience.tsx
│   │   ├── CampaignOptimization.tsx
│   │   └── CampaignReports.tsx
│   ├── 📁 hooks/
│   │   ├── useCampaigns.ts
│   │   ├── useCampaignManagement.ts
│   │   ├── useCampaignAnalytics.ts
│   │   ├── useCampaignTargeting.ts
│   │   └── useCampaignOptimization.ts
│   ├── 📁 services/
│   │   ├── campaignService.ts
│   │   ├── targetingService.ts
│   │   ├── analyticsService.ts
│   │   └── optimizationService.ts
│   └── 📁 types/
│       └── campaign.types.ts
```

#### 📅 Events Management
```
├── 📁 events/
│   ├── 📁 components/
│   │   ├── EventCard.tsx
│   │   ├── EventForm.tsx
│   │   ├── EventDetails.tsx
│   │   ├── EventCalendar.tsx
│   │   ├── EventRegistration.tsx
│   │   ├── EventAttendees.tsx
│   │   ├── EventSchedule.tsx
│   │   ├── EventSpeakers.tsx
│   │   ├── EventTickets.tsx
│   │   ├── EventFeedback.tsx
│   │   ├── EventAnalytics.tsx
│   │   ├── EventBroadcast.tsx
│   │   ├── EventResources.tsx
│   │   └── EventNetworking.tsx
│   ├── 📁 hooks/
│   │   ├── useEvents.ts
│   │   ├── useEventManagement.ts
│   │   ├── useEventRegistration.ts
│   │   ├── useEventAttendance.ts
│   │   ├── useEventAnalytics.ts
│   │   └── useEventCalendar.ts
│   ├── 📁 services/
│   │   ├── eventService.ts
│   │   ├── registrationService.ts
│   │   ├── attendanceService.ts
│   │   └── eventAnalyticsService.ts
│   └── 📁 types/
│       └── event.types.ts
```

#### 👨‍🎓 Experts & Expertise Management
```
├── 📁 experts/
│   ├── 📁 components/
│   │   ├── ExpertCard.tsx
│   │   ├── ExpertProfile.tsx
│   │   ├── ExpertForm.tsx
│   │   ├── ExpertDirectory.tsx
│   │   ├── ExpertSearch.tsx
│   │   ├── ExpertFilters.tsx
│   │   ├── ExpertMatching.tsx
│   │   ├── ExpertBooking.tsx
│   │   ├── ExpertReviews.tsx
│   │   ├── ExpertAnalytics.tsx
│   │   ├── ExpertCertifications.tsx
│   │   ├── ExpertPortfolio.tsx
│   │   ├── ExpertSchedule.tsx
│   │   └── ExpertConsultation.tsx
│   ├── 📁 expertise-areas/
│   │   ├── 📁 components/
│   │   │   ├── ExpertiseAreaCard.tsx
│   │   │   ├── ExpertiseAreaForm.tsx
│   │   │   ├── ExpertiseHierarchy.tsx
│   │   │   └── ExpertiseMatching.tsx
│   │   └── 📁 hooks/
│   │       ├── useExpertiseAreas.ts
│   │       └── useExpertiseMatching.ts
│   ├── 📁 hooks/
│   │   ├── useExperts.ts
│   │   ├── useExpertManagement.ts
│   │   ├── useExpertSearch.ts
│   │   ├── useExpertMatching.ts
│   │   ├── useExpertBooking.ts
│   │   ├── useExpertReviews.ts
│   │   └── useExpertAnalytics.ts
│   ├── 📁 services/
│   │   ├── expertService.ts
│   │   ├── expertiseService.ts
│   │   ├── matchingService.ts
│   │   ├── bookingService.ts
│   │   └── reviewService.ts
│   └── 📁 types/
│       ├── expert.types.ts
│       └── expertise.types.ts
```

#### 🛒 Marketplace
```
├── 📁 marketplace/
│   ├── 📁 opportunities/
│   │   ├── 📁 components/
│   │   │   ├── OpportunityCard.tsx
│   │   │   ├── OpportunityForm.tsx
│   │   │   ├── OpportunityDetails.tsx
│   │   │   ├── OpportunityList.tsx
│   │   │   ├── OpportunityFilters.tsx
│   │   │   ├── OpportunityApplication.tsx
│   │   │   ├── OpportunityMatching.tsx
│   │   │   └── OpportunityAnalytics.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useOpportunities.ts
│   │   │   ├── useOpportunityManagement.ts
│   │   │   ├── useOpportunityApplication.ts
│   │   │   └── useOpportunityMatching.ts
│   │   └── 📁 types/
│   │       └── opportunity.types.ts
│   ├── 📁 services/
│   │   ├── 📁 components/
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ServiceForm.tsx
│   │   │   ├── ServiceDetails.tsx
│   │   │   ├── ServiceList.tsx
│   │   │   ├── ServiceBooking.tsx
│   │   │   ├── ServiceReviews.tsx
│   │   │   ├── ServiceProviderProfile.tsx
│   │   │   └── ServiceAnalytics.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useServices.ts
│   │   │   ├── useServiceManagement.ts
│   │   │   ├── useServiceBooking.ts
│   │   │   └── useServiceReviews.ts
│   │   └── 📁 types/
│   │       └── service.types.ts
│   ├── 📁 common/
│   │   ├── 📁 components/
│   │   │   ├── MarketplaceHeader.tsx
│   │   │   ├── MarketplaceFilters.tsx
│   │   │   ├── MarketplaceSearch.tsx
│   │   │   ├── MarketplacePagination.tsx
│   │   │   ├── MarketplaceCategories.tsx
│   │   │   ├── FeaturedItems.tsx
│   │   │   ├── RecommendedItems.tsx
│   │   │   └── MarketplaceAnalytics.tsx
│   │   └── 📁 hooks/
│   │       ├── useMarketplaceSearch.ts
│   │       ├── useMarketplaceFilters.ts
│   │       └── useMarketplaceAnalytics.ts
│   └── 📁 types/
│       └── marketplace.types.ts
```

#### 📚 Knowledge Base
```
├── 📁 knowledge-base/
│   ├── 📁 components/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleForm.tsx
│   │   ├── ArticleDetails.tsx
│   │   ├── ArticleList.tsx
│   │   ├── ArticleSearch.tsx
│   │   ├── ArticleCategories.tsx
│   │   ├── ArticleTags.tsx
│   │   ├── ArticleComments.tsx
│   │   ├── ArticleRating.tsx
│   │   ├── ArticleVersions.tsx
│   │   ├── KnowledgeTree.tsx
│   │   ├── FAQSection.tsx
│   │   ├── Glossary.tsx
│   │   ├── TutorialWizard.tsx
│   │   └── KnowledgeAnalytics.tsx
│   ├── 📁 categories/
│   │   ├── 📁 components/
│   │   │   ├── CategoryCard.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   ├── CategoryTree.tsx
│   │   │   └── CategoryManagement.tsx
│   │   └── 📁 hooks/
│   │       ├── useCategories.ts
│   │       └── useCategoryManagement.ts
│   ├── 📁 hooks/
│   │   ├── useKnowledgeBase.ts
│   │   ├── useArticles.ts
│   │   ├── useArticleManagement.ts
│   │   ├── useArticleSearch.ts
│   │   └── useKnowledgeAnalytics.ts
│   ├── 📁 services/
│   │   ├── knowledgeService.ts
│   │   ├── articleService.ts
│   │   ├── categoryService.ts
│   │   └── searchService.ts
│   └── 📁 types/
│       ├── knowledge.types.ts
│       └── article.types.ts
```

#### 🆘 Help & Support
```
├── 📁 support/
│   ├── 📁 components/
│   │   ├── SupportTicket.tsx
│   │   ├── TicketForm.tsx
│   │   ├── TicketList.tsx
│   │   ├── TicketDetails.tsx
│   │   ├── TicketChat.tsx
│   │   ├── SupportDashboard.tsx
│   │   ├── LiveChat.tsx
│   │   ├── ContactForm.tsx
│   │   ├── SupportAnalytics.tsx
│   │   ├── AgentWorkspace.tsx
│   │   ├── EscalationManager.tsx
│   │   ├── SLATracker.tsx
│   │   ├── FeedbackForm.tsx
│   │   └── SupportReports.tsx
│   ├── 📁 hooks/
│   │   ├── useSupport.ts
│   │   ├── useSupportTickets.ts
│   │   ├── useLiveChat.ts
│   │   ├── useSupportAnalytics.ts
│   │   └── useAgentWorkspace.ts
│   ├── 📁 services/
│   │   ├── supportService.ts
│   │   ├── ticketService.ts
│   │   ├── chatService.ts
│   │   └── escalationService.ts
│   └── 📁 types/
│       └── support.types.ts
```

#### 🔧 Management Features
```
├── 📁 management/
│   ├── 📁 system-management/
│   │   ├── 📁 components/
│   │   │   ├── SystemDashboard.tsx
│   │   │   ├── SystemHealth.tsx
│   │   │   ├── SystemLogs.tsx
│   │   │   ├── SystemSettings.tsx
│   │   │   ├── SystemBackup.tsx
│   │   │   ├── SystemSecurity.tsx
│   │   │   ├── SystemPerformance.tsx
│   │   │   ├── SystemMaintenance.tsx
│   │   │   └── SystemReports.tsx
│   │   └── 📁 hooks/
│   │       ├── useSystemManagement.ts
│   │       ├── useSystemHealth.ts
│   │       ├── useSystemLogs.ts
│   │       └── useSystemSecurity.ts
│   ├── 📁 user-management/
│   │   ├── 📁 components/
│   │   │   ├── UserManagementDashboard.tsx
│   │   │   ├── UserList.tsx
│   │   │   ├── UserForm.tsx
│   │   │   ├── UserDetails.tsx
│   │   │   ├── UserRoles.tsx
│   │   │   ├── UserPermissions.tsx
│   │   │   ├── UserActivation.tsx
│   │   │   ├── UserAnalytics.tsx
│   │   │   ├── BulkUserActions.tsx
│   │   │   └── UserAuditLog.tsx
│   │   └── 📁 hooks/
│   │       ├── useUserManagement.ts
│   │       ├── useUserRoles.ts
│   │       ├── useUserPermissions.ts
│   │       └── useUserAnalytics.ts
│   ├── 📁 content-management/
│   │   ├── 📁 components/
│   │   │   ├── ContentDashboard.tsx
│   │   │   ├── ContentList.tsx
│   │   │   ├── ContentForm.tsx
│   │   │   ├── ContentApproval.tsx
│   │   │   ├── ContentVersions.tsx
│   │   │   ├── ContentScheduling.tsx
│   │   │   ├── ContentAnalytics.tsx
│   │   │   ├── MediaLibrary.tsx
│   │   │   └── ContentAudit.tsx
│   │   └── 📁 hooks/
│   │       ├── useContentManagement.ts
│   │       ├── useContentApproval.ts
│   │       ├── useContentAnalytics.ts
│   │       └── useMediaLibrary.ts
│   ├── 📁 workflow-management/
│   │   ├── 📁 components/
│   │   │   ├── WorkflowBuilder.tsx
│   │   │   ├── WorkflowList.tsx
│   │   │   ├── WorkflowEditor.tsx
│   │   │   ├── WorkflowExecution.tsx
│   │   │   ├── WorkflowMonitoring.tsx
│   │   │   ├── WorkflowAnalytics.tsx
│   │   │   ├── ApprovalWorkflows.tsx
│   │   │   └── WorkflowTemplates.tsx
│   │   └── 📁 hooks/
│   │       ├── useWorkflowManagement.ts
│   │       ├── useWorkflowBuilder.ts
│   │       ├── useWorkflowExecution.ts
│   │       └── useWorkflowAnalytics.ts
│   └── 📁 configuration/
│       ├── 📁 components/
│       │   ├── ConfigurationDashboard.tsx
│       │   ├── SystemConfig.tsx
│       │   ├── FeatureFlags.tsx
│       │   ├── IntegrationConfig.tsx
│       │   ├── NotificationConfig.tsx
│       │   ├── SecurityConfig.tsx
│       │   ├── LocalizationConfig.tsx
│       │   └── APIConfig.tsx
│       └── 📁 hooks/
│           ├── useConfiguration.ts
│           ├── useFeatureFlags.ts
│           ├── useIntegrationConfig.ts
│           └── useSecurityConfig.ts
```

#### 🔐 Admin & Super Admin Features
```
├── 📁 admin/
│   ├── 📁 super-admin/
│   │   ├── 📁 components/
│   │   │   ├── SuperAdminDashboard.tsx
│   │   │   ├── PlatformOverview.tsx
│   │   │   ├── GlobalAnalytics.tsx
│   │   │   ├── SystemConfiguration.tsx
│   │   │   ├── AdminManagement.tsx
│   │   │   ├── OrganizationOverview.tsx
│   │   │   ├── SecurityCenter.tsx
│   │   │   ├── ComplianceManager.tsx
│   │   │   ├── AuditLogs.tsx
│   │   │   ├── PerformanceMonitor.tsx
│   │   │   ├── BackupManager.tsx
│   │   │   ├── LicenseManager.tsx
│   │   │   └── GlobalSettings.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useSuperAdmin.ts
│   │   │   ├── usePlatformAnalytics.ts
│   │   │   ├── useSystemHealth.ts
│   │   │   ├── useAdminManagement.ts
│   │   │   ├── useSecurityCenter.ts
│   │   │   ├── useComplianceManager.ts
│   │   │   └── useAuditLogs.ts
│   │   └── 📁 services/
│   │       ├── superAdminService.ts
│   │       ├── platformService.ts
│   │       ├── securityService.ts
│   │       └── complianceService.ts
│   ├── 📁 admin/
│   │   ├── 📁 components/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── OrganizationManagement.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   ├── ContentModeration.tsx
│   │   │   ├── ReportsCenter.tsx
│   │   │   ├── AnalyticsCenter.tsx
│   │   │   ├── ConfigurationPanel.tsx
│   │   │   ├── IntegrationsPanel.tsx
│   │   │   ├── BillingManagement.tsx
│   │   │   ├── SupportCenter.tsx
│   │   │   ├── MaintenanceMode.tsx
│   │   │   └── AdminReports.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useAdmin.ts
│   │   │   ├── useAdminAnalytics.ts
│   │   │   ├── useContentModeration.ts
│   │   │   ├── useReportsCenter.ts
│   │   │   ├── useBillingManagement.ts
│   │   │   └── useMaintenanceMode.ts
│   │   └── 📁 services/
│   │       ├── adminService.ts
│   │       ├── moderationService.ts
│   │       ├── reportsService.ts
│   │       └── billingService.ts
│   ├── 📁 roles-permissions/
│   │   ├── 📁 components/
│   │   │   ├── RoleManagement.tsx
│   │   │   ├── RoleForm.tsx
│   │   │   ├── PermissionMatrix.tsx
│   │   │   ├── RoleAssignment.tsx
│   │   │   ├── PermissionGroups.tsx
│   │   │   ├── AccessControl.tsx
│   │   │   ├── RoleHierarchy.tsx
│   │   │   └── PermissionAudit.tsx
│   │   ├── 📁 hooks/
│   │   │   ├── useRoles.ts
│   │   │   ├── usePermissions.ts
│   │   │   ├── useRoleAssignment.ts
│   │   │   ├── useAccessControl.ts
│   │   │   └── usePermissionAudit.ts
│   │   └── 📁 services/
│   │       ├── roleService.ts
│   │       ├── permissionService.ts
│   │       └── accessControlService.ts
│   └── 📁 types/
│       ├── admin.types.ts
│       ├── role.types.ts
│       └── permission.types.ts
```

### 📁 pages/ - Application Pages
```
pages/
├── 📁 public/
│   ├── LandingPage.tsx
│   ├── AboutPage.tsx
│   ├── ContactPage.tsx
│   └── PricingPage.tsx
├── 📁 auth/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ForgotPasswordPage.tsx
│   └── ResetPasswordPage.tsx
├── 📁 dashboard/
│   ├── DashboardPage.tsx
│   ├── UserDashboard.tsx
│   ├── AdminDashboard.tsx
│   ├── SuperAdminDashboard.tsx
│   ├── TeamDashboard.tsx
│   ├── OrganizationDashboard.tsx
│   └── ExpertDashboard.tsx
├── 📁 profile/
│   ├── ProfilePage.tsx
│   ├── EditProfilePage.tsx
│   ├── SettingsPage.tsx
│   └── SecurityPage.tsx
├── 📁 organizations/
│   ├── OrganizationsPage.tsx
│   ├── OrganizationDetailsPage.tsx
│   ├── CreateOrganizationPage.tsx
│   ├── EditOrganizationPage.tsx
│   ├── OrganizationMembersPage.tsx
│   └── OrganizationSettingsPage.tsx
├── 📁 teams/
│   ├── TeamsPage.tsx
│   ├── TeamDetailsPage.tsx
│   ├── CreateTeamPage.tsx
│   ├── EditTeamPage.tsx
│   ├── TeamMembersPage.tsx
│   └── TeamSettingsPage.tsx
├── 📁 challenges/
│   ├── ChallengesPage.tsx
│   ├── ChallengeDetailsPage.tsx
│   ├── CreateChallengePage.tsx
│   ├── EditChallengePage.tsx
│   ├── ChallengeSubmissionPage.tsx
│   ├── ChallengeEvaluationPage.tsx
│   └── MyChallengesPage.tsx
├── 📁 templates/
│   ├── TemplatesPage.tsx
│   ├── TemplateLibraryPage.tsx
│   ├── CreateTemplatePage.tsx
│   ├── EditTemplatePage.tsx
│   ├── TemplateBuilderPage.tsx
│   ├── TemplatePreviewPage.tsx
│   ├── ChallengeTemplatesPage.tsx
│   ├── CampaignTemplatesPage.tsx
│   ├── EventTemplatesPage.tsx
│   ├── EvaluationTemplatesPage.tsx
│   └── MyTemplatesPage.tsx
├── 📁 evaluations/
│   ├── EvaluationsPage.tsx
│   ├── EvaluationDashboardPage.tsx
│   ├── IdeaEvaluationPage.tsx
│   ├── PeerReviewPage.tsx
│   ├── ExpertEvaluationPage.tsx
│   ├── EvaluationWorkflowPage.tsx
│   ├── ReviewerWorkspacePage.tsx
│   ├── EvaluationAnalyticsPage.tsx
│   ├── ScoringSystemsPage.tsx
│   └── MyEvaluationsPage.tsx
├── 📁 campaigns/
│   ├── CampaignsPage.tsx
│   ├── CampaignDetailsPage.tsx
│   ├── CreateCampaignPage.tsx
│   ├── EditCampaignPage.tsx
│   └── CampaignAnalyticsPage.tsx
├── 📁 events/
│   ├── EventsPage.tsx
│   ├── EventDetailsPage.tsx
│   ├── CreateEventPage.tsx
│   ├── EditEventPage.tsx
│   ├── EventRegistrationPage.tsx
│   └── MyEventsPage.tsx
├── 📁 experts/
│   ├── ExpertsPage.tsx
│   ├── ExpertProfilePage.tsx
│   ├── ExpertBookingPage.tsx
│   └── MyExpertisePage.tsx
├── 📁 marketplace/
│   ├── MarketplacePage.tsx
│   ├── OpportunitiesPage.tsx
│   ├── ServicesPage.tsx
│   ├── OpportunityDetailsPage.tsx
│   ├── ServiceDetailsPage.tsx
│   └── MyListingsPage.tsx
├── 📁 knowledge-base/
│   ├── KnowledgeBasePage.tsx
│   ├── ArticleDetailsPage.tsx
│   ├── CreateArticlePage.tsx
│   ├── EditArticlePage.tsx
│   └── MyArticlesPage.tsx
├── 📁 support/
│   ├── SupportPage.tsx
│   ├── CreateTicketPage.tsx
│   ├── TicketDetailsPage.tsx
│   └── MySupportPage.tsx
├── 📁 admin/
│   ├── AdminPage.tsx
│   ├── UserManagementPage.tsx
│   ├── ContentModerationPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── ConfigurationPage.tsx
│   └── ReportsPage.tsx
├── 📁 super-admin/
│   ├── SuperAdminPage.tsx
│   ├── PlatformOverviewPage.tsx
│   ├── SystemManagementPage.tsx
│   ├── SecurityCenterPage.tsx
│   ├── CompliancePage.tsx
│   └── GlobalSettingsPage.tsx
└── NotFoundPage.tsx
```

### 📁 hooks/ - Custom React Hooks
```
hooks/
├── 📁 auth/
│   ├── useAuth.ts
│   ├── useLogin.ts
│   ├── useSignup.ts
│   ├── useLogout.ts
│   ├── usePasswordReset.ts
│   └── useAuthGuard.ts
├── 📁 api/
│   ├── useApi.ts
│   ├── useQuery.ts
│   ├── useMutation.ts
│   ├── useInfiniteQuery.ts
│   └── useOptimisticUpdate.ts
├── 📁 forms/
│   ├── useForm.ts
│   ├── useFormValidation.ts
│   ├── useFormSubmit.ts
│   ├── useFormState.ts
│   └── useFieldArray.ts
├── 📁 navigation/
│   ├── useNavigation.ts
│   ├── useRouter.ts
│   ├── useBreadcrumbs.ts
│   └── useActiveRoute.ts
├── 📁 permissions/
│   ├── usePermissions.ts
│   ├── useRoles.ts
│   ├── useAccessControl.ts
│   └── useFeatureFlags.ts
├── 📁 data/
│   ├── useLocalStorage.ts
│   ├── useSessionStorage.ts
│   ├── useCache.ts
│   ├── useDebounce.ts
│   ├── useThrottle.ts
│   └── usePagination.ts
├── 📁 ui/
│   ├── useTheme.ts
│   ├── useModal.ts
│   ├── useToast.ts
│   ├── useDrawer.ts
│   ├── useDropdown.ts
│   ├── useTooltip.ts
│   ├── useContextMenu.ts
│   └── useKeyboardShortcuts.ts
├── 📁 analytics/
│   ├── useAnalytics.ts
│   ├── useTracking.ts
│   ├── useMetrics.ts
│   └── usePerformanceMonitoring.ts
└── 📁 utilities/
    ├── useAsync.ts
    ├── useInterval.ts
    ├── useTimeout.ts
    ├── useEventListener.ts
    ├── useMediaQuery.ts
    ├── useIntersectionObserver.ts
    ├── useClipboard.ts
    ├── useGeolocation.ts
    ├── useNetworkStatus.ts
    └── useDeviceInfo.ts
```

### 📁 contexts/ - React Context Providers
```
contexts/
├── AuthContext.tsx
├── ThemeContext.tsx
├── LanguageContext.tsx
├── NotificationContext.tsx
├── ModalContext.tsx
├── ToastContext.tsx
├── PermissionContext.tsx
├── OrganizationContext.tsx
├── TeamContext.tsx
├── WorkspaceContext.tsx
├── AnalyticsContext.tsx
├── ConfigurationContext.tsx
└── FeatureFlagContext.tsx
```

### 📁 services/ - API and Business Logic Services
```
services/
├── 📁 api/
│   ├── apiClient.ts
│   ├── apiConfig.ts
│   ├── apiInterceptors.ts
│   ├── apiErrorHandler.ts
│   └── apiTypes.ts
├── 📁 auth/
│   ├── authService.ts
│   ├── tokenService.ts
│   ├── sessionService.ts
│   └── permissionService.ts
├── 📁 data/
│   ├── cacheService.ts
│   ├── storageService.ts
│   ├── syncService.ts
│   └── offlineService.ts
├── 📁 external/
│   ├── emailService.ts
│   ├── smsService.ts
│   ├── notificationService.ts
│   ├── analyticsService.ts
│   ├── fileUploadService.ts
│   └── paymentService.ts
├── 📁 business/
│   ├── organizationService.ts
│   ├── teamService.ts
│   ├── challengeService.ts
│   ├── campaignService.ts
│   ├── eventService.ts
│   ├── expertService.ts
│   ├── marketplaceService.ts
│   ├── knowledgeService.ts
│   ├── supportService.ts
│   ├── templateService.ts
│   ├── evaluationService.ts
│   ├── ideaService.ts
│   ├── workflowService.ts
│   ├── scoringService.ts
│   └── reviewService.ts
└── 📁 utilities/
    ├── validationService.ts
    ├── formatService.ts
    ├── calculationService.ts
    ├── reportingService.ts
    ├── exportService.ts
    ├── importService.ts
    └── migrationService.ts
```

### 📁 utils/ - Utility Functions
```
utils/
├── 📁 auth/
│   ├── authHelpers.ts
│   ├── roleHelpers.ts
│   ├── permissionHelpers.ts
│   └── securityHelpers.ts
├── 📁 data/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── transformers.ts
│   ├── sanitizers.ts
│   ├── parsers.ts
│   └── serializers.ts
├── 📁 ui/
│   ├── classNames.ts
│   ├── styleHelpers.ts
│   ├── animations.ts
│   └── responsiveHelpers.ts
├── 📁 date/
│   ├── dateHelpers.ts
│   ├── timeHelpers.ts
│   ├── timezoneHelpers.ts
│   └── calendarHelpers.ts
├── 📁 string/
│   ├── stringHelpers.ts
│   ├── textHelpers.ts
│   ├── translationHelpers.ts
│   └── urlHelpers.ts
├── 📁 array/
│   ├── arrayHelpers.ts
│   ├── sortHelpers.ts
│   ├── filterHelpers.ts
│   └── groupHelpers.ts
├── 📁 object/
│   ├── objectHelpers.ts
│   ├── deepClone.ts
│   ├── deepMerge.ts
│   └── pathHelpers.ts
├── 📁 file/
│   ├── fileHelpers.ts
│   ├── imageHelpers.ts
│   ├── downloadHelpers.ts
│   └── uploadHelpers.ts
├── 📁 analytics/
│   ├── trackingHelpers.ts
│   ├── metricsHelpers.ts
│   └── reportHelpers.ts
├── 📁 performance/
│   ├── performanceHelpers.ts
│   ├── debounce.ts
│   ├── throttle.ts
│   └── memoization.ts
├── 📁 security/
│   ├── encryptionHelpers.ts
│   ├── hashHelpers.ts
│   ├── sanitizationHelpers.ts
│   └── validationHelpers.ts
└── 📁 constants/
    ├── apiConstants.ts
    ├── uiConstants.ts
    ├── appConstants.ts
    ├── routeConstants.ts
    ├── permissionConstants.ts
    ├── roleConstants.ts
    └── configConstants.ts
```

### 📁 types/ - TypeScript Type Definitions
```
types/
├── 📁 api/
│   ├── api.types.ts
│   ├── response.types.ts
│   ├── request.types.ts
│   └── error.types.ts
├── 📁 auth/
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── role.types.ts
│   ├── permission.types.ts
│   └── session.types.ts
├── 📁 business/
│   ├── organization.types.ts
│   ├── team.types.ts
│   ├── challenge.types.ts
│   ├── campaign.types.ts
│   ├── event.types.ts
│   ├── expert.types.ts
│   ├── marketplace.types.ts
│   ├── knowledge.types.ts
│   ├── support.types.ts
│   ├── template.types.ts
│   ├── evaluation.types.ts
│   ├── idea.types.ts
│   ├── workflow.types.ts
│   ├── scoring.types.ts
│   └── review.types.ts
├── 📁 ui/
│   ├── component.types.ts
│   ├── theme.types.ts
│   ├── layout.types.ts
│   ├── form.types.ts
│   └── navigation.types.ts
├── 📁 data/
│   ├── database.types.ts
│   ├── analytics.types.ts
│   ├── reporting.types.ts
│   └── export.types.ts
├── 📁 external/
│   ├── integration.types.ts
│   ├── webhook.types.ts
│   └── thirdparty.types.ts
├── global.types.ts
├── common.types.ts
├── index.ts
└── environment.types.ts
```

### 📁 integrations/ - Third-party Integrations
```
integrations/
├── 📁 supabase/
│   ├── client.ts
│   ├── auth.ts
│   ├── database.ts
│   ├── storage.ts
│   ├── realtime.ts
│   ├── functions.ts
│   └── types.ts
├── 📁 payment/
│   ├── stripe.ts
│   ├── paypal.ts
│   └── local-payment.ts
├── 📁 analytics/
│   ├── google-analytics.ts
│   ├── mixpanel.ts
│   └── custom-analytics.ts
├── 📁 communication/
│   ├── sendgrid.ts
│   ├── twilio.ts
│   ├── pusher.ts
│   └── websocket.ts
├── 📁 storage/
│   ├── aws-s3.ts
│   ├── cloudinary.ts
│   └── local-storage.ts
├── 📁 ai/
│   ├── openai.ts
│   ├── anthropic.ts
│   └── custom-ai.ts
├── 📁 maps/
│   ├── google-maps.ts
│   ├── mapbox.ts
│   └── saudi-maps.ts
├── 📁 social/
│   ├── twitter.ts
│   ├── linkedin.ts
│   ├── facebook.ts
│   └── instagram.ts
└── 📁 monitoring/
    ├── sentry.ts
    ├── datadog.ts
    └── newrelic.ts
```

### 📁 assets/ - Static Assets
```
assets/
├── 📁 images/
│   ├── 📁 logos/
│   │   ├── logo-light.svg
│   │   ├── logo-dark.svg
│   │   ├── logo-icon.svg
│   │   └── saudi-vision-2030.svg
│   ├── 📁 illustrations/
│   │   ├── hero-illustration.svg
│   │   ├── empty-state.svg
│   │   ├── error-404.svg
│   │   ├── error-500.svg
│   │   └── maintenance.svg
│   ├── 📁 icons/
│   │   ├── custom-icons.svg
│   │   └── flag-icons/
│   ├── 📁 banners/
│   │   ├── hero-banner.jpg
│   │   ├── campaign-banner.jpg
│   │   └── event-banner.jpg
│   └── 📁 avatars/
│       ├── default-avatar.svg
│       ├── organization-avatar.svg
│       └── team-avatar.svg
├── 📁 fonts/
│   ├── 📁 arabic/
│   │   ├── Tajawal-Regular.ttf
│   │   ├── Tajawal-Bold.ttf
│   │   └── Cairo-Regular.ttf
│   └── 📁 english/
│       ├── Inter-Regular.ttf
│       ├── Inter-Bold.ttf
│       └── Inter-SemiBold.ttf
├── 📁 videos/
│   ├── intro-video.mp4
│   ├── tutorial-video.mp4
│   └── hero-background.mp4
├── 📁 audio/
│   ├── notification-sound.mp3
│   ├── success-sound.mp3
│   └── error-sound.mp3
└── 📁 documents/
    ├── terms-of-service.pdf
    ├── privacy-policy.pdf
    ├── user-guide.pdf
    └── api-documentation.pdf
```

### 📁 styles/ - Styling and Themes
```
styles/
├── globals.css                          # Global styles and CSS variables
├── 📁 components/
│   ├── base.css                         # Base component styles
│   ├── forms.css                        # Form-specific styles
│   ├── tables.css                       # Table-specific styles
│   ├── cards.css                        # Card component styles
│   └── navigation.css                   # Navigation styles
├── 📁 themes/
│   ├── light-theme.css
│   ├── dark-theme.css
│   ├── saudi-theme.css
│   └── high-contrast.css
├── 📁 utilities/
│   ├── spacing.css
│   ├── typography.css
│   ├── colors.css
│   ├── animations.css
│   └── responsive.css
└── 📁 vendor/
    ├── tailwind-overrides.css
    └── third-party-overrides.css
```

### 📁 lib/ - Library Configurations
```
lib/
├── react-query.ts                       # React Query configuration
├── react-router.ts                      # Router configuration
├── i18n.ts                             # Internationalization setup
├── tailwind.ts                         # Tailwind utilities
├── form-validation.ts                  # Form validation schemas
├── date-fns.ts                         # Date utility configuration
├── chart-config.ts                     # Chart library configuration
├── error-boundary.ts                   # Error boundary configuration
├── accessibility.ts                    # Accessibility utilities
└── performance.ts                      # Performance monitoring
```

### 📁 store/ - State Management
```
store/
├── index.ts                            # Store configuration
├── 📁 slices/
│   ├── authSlice.ts
│   ├── userSlice.ts
│   ├── organizationSlice.ts
│   ├── teamSlice.ts
│   ├── challengeSlice.ts
│   ├── campaignSlice.ts
│   ├── eventSlice.ts
│   ├── expertSlice.ts
│   ├── marketplaceSlice.ts
│   ├── knowledgeSlice.ts
│   ├── supportSlice.ts
│   ├── notificationSlice.ts
│   ├── themeSlice.ts
│   ├── languageSlice.ts
│   └── configSlice.ts
├── 📁 middleware/
│   ├── authMiddleware.ts
│   ├── loggingMiddleware.ts
│   ├── errorMiddleware.ts
│   └── persistenceMiddleware.ts
└── 📁 selectors/
    ├── authSelectors.ts
    ├── userSelectors.ts
    ├── organizationSelectors.ts
    ├── teamSelectors.ts
    └── commonSelectors.ts
```

### 📁 workers/ - Web Workers
```
workers/
├── analyticsWorker.ts
├── reportingWorker.ts
├── dataProcessingWorker.ts
├── fileProcessingWorker.ts
├── notificationWorker.ts
└── backgroundSyncWorker.ts
```

### 📁 i18n/ - Internationalization
```
i18n/
├── index.ts                            # i18n configuration
├── 📁 locales/
│   ├── 📁 ar/                          # Arabic translations
│   │   ├── common.json
│   │   ├── auth.json
│   │   ├── dashboard.json
│   │   ├── organizations.json
│   │   ├── teams.json
│   │   ├── challenges.json
│   │   ├── campaigns.json
│   │   ├── events.json
│   │   ├── experts.json
│   │   ├── marketplace.json
│   │   ├── knowledge.json
│   │   ├── support.json
│   │   ├── templates.json
│   │   ├── evaluations.json
│   │   ├── ideas.json
│   │   ├── workflows.json
│   │   ├── scoring.json
│   │   ├── reviews.json
│   │   ├── admin.json
│   │   ├── errors.json
│   │   ├── validation.json
│   │   └── notifications.json
│   └── 📁 en/                          # English translations
│       ├── common.json
│       ├── auth.json
│       ├── dashboard.json
│       ├── organizations.json
│       ├── teams.json
│       ├── challenges.json
│       ├── campaigns.json
│       ├── events.json
│       ├── experts.json
│       ├── marketplace.json
│       ├── knowledge.json
│       ├── support.json
│       ├── templates.json
│       ├── evaluations.json
│       ├── ideas.json
│       ├── workflows.json
│       ├── scoring.json
│       ├── reviews.json
│       ├── admin.json
│       ├── errors.json
│       ├── validation.json
│       └── notifications.json
├── 📁 plugins/
│   ├── backend.ts
│   ├── detector.ts
│   └── formatter.ts
└── 📁 utils/
    ├── translationHelpers.ts
    ├── dateTranslation.ts
    └── numberTranslation.ts
```

---

## 📁 supabase/ - Backend Configuration

```
supabase/
├── config.toml                         # Supabase configuration
├── 📁 migrations/                      # Database migrations
│   ├── 20240101_initial_schema.sql
│   ├── 20240102_auth_setup.sql
│   ├── 20240103_organizations.sql
│   ├── 20240104_teams.sql
│   ├── 20240105_challenges.sql
│   ├── 20240106_campaigns.sql
│   ├── 20240107_events.sql
│   ├── 20240108_experts.sql
│   ├── 20240109_marketplace.sql
│   ├── 20240110_knowledge_base.sql
│   ├── 20240111_support.sql
│   ├── 20240112_analytics.sql
│   ├── 20240113_notifications.sql
│   ├── 20240114_roles_permissions.sql
│   ├── 20240115_workflows.sql
│   ├── 20240116_integrations.sql
│   ├── 20240117_security.sql
│   ├── 20240118_performance.sql
│   └── 20240119_audit_logs.sql
├── 📁 functions/                       # Edge functions
│   ├── 📁 auth-handler/
│   │   └── index.ts
│   ├── 📁 notification-service/
│   │   └── index.ts
│   ├── 📁 analytics-processor/
│   │   └── index.ts
│   ├── 📁 report-generator/
│   │   └── index.ts
│   ├── 📁 email-service/
│   │   └── index.ts
│   ├── 📁 file-processor/
│   │   └── index.ts
│   ├── 📁 ai-service/
│   │   └── index.ts
│   ├── 📁 workflow-engine/
│   │   └── index.ts
│   ├── 📁 integration-handler/
│   │   └── index.ts
│   └── 📁 security-scanner/
│       └── index.ts
├── 📁 seed/                           # Database seed data
│   ├── development.sql
│   ├── staging.sql
│   └── production.sql
└── 📁 types/                          # Generated types
    └── database.types.ts
```

---

## 📁 tests/ - Testing Infrastructure

```
tests/
├── 📁 unit/                           # Unit tests
│   ├── 📁 components/
│   ├── 📁 hooks/
│   ├── 📁 services/
│   ├── 📁 utils/
│   └── 📁 types/
├── 📁 integration/                    # Integration tests
│   ├── 📁 api/
│   ├── 📁 auth/
│   ├── 📁 database/
│   └── 📁 workflows/
├── 📁 e2e/                           # End-to-end tests
│   ├── 📁 user-journeys/
│   ├── 📁 admin-workflows/
│   ├── 📁 organization-flows/
│   └── 📁 marketplace-flows/
├── 📁 performance/                    # Performance tests
│   ├── load-tests.ts
│   ├── stress-tests.ts
│   └── benchmark-tests.ts
├── 📁 accessibility/                  # Accessibility tests
│   ├── a11y-tests.ts
│   └── screen-reader-tests.ts
├── 📁 security/                       # Security tests
│   ├── auth-tests.ts
│   ├── permission-tests.ts
│   └── vulnerability-tests.ts
├── 📁 fixtures/                       # Test data
│   ├── users.json
│   ├── organizations.json
│   ├── challenges.json
│   └── campaigns.json
├── 📁 mocks/                         # Mock implementations
│   ├── api-mocks.ts
│   ├── service-mocks.ts
│   └── component-mocks.ts
├── 📁 utils/                         # Test utilities
│   ├── test-utils.tsx
│   ├── render-helpers.tsx
│   ├── mock-helpers.ts
│   └── assertion-helpers.ts
├── setup.ts                          # Test setup
├── teardown.ts                       # Test teardown
└── jest.config.ts                    # Jest configuration
```

---

## 📁 docs/ - Documentation

```
docs/
├── README.md                          # Project overview
├── SETUP.md                          # Setup instructions
├── DEPLOYMENT.md                     # Deployment guide
├── ARCHITECTURE.md                   # Architecture documentation
├── API.md                           # API documentation
├── DATABASE.md                      # Database schema
├── SECURITY.md                      # Security guidelines
├── PERFORMANCE.md                   # Performance optimization
├── ACCESSIBILITY.md                 # Accessibility compliance
├── INTERNATIONALIZATION.md          # i18n guidelines
├── TESTING.md                       # Testing strategy
├── CONTRIBUTING.md                  # Contribution guidelines
├── CHANGELOG.md                     # Version changelog
├── 📁 features/                     # Feature documentation
│   ├── authentication.md
│   ├── organizations.md
│   ├── teams.md
│   ├── challenges.md
│   ├── campaigns.md
│   ├── events.md
│   ├── experts.md
│   ├── marketplace.md
│   ├── knowledge-base.md
│   ├── support.md
│   ├── templates.md
│   ├── evaluations.md
│   ├── ideas.md
│   ├── workflows.md
│   ├── scoring-systems.md
│   ├── peer-review.md
│   └── admin.md
├── 📁 api/                         # API documentation
│   ├── authentication.md
│   ├── organizations.md
│   ├── teams.md
│   ├── challenges.md
│   └── marketplace.md
├── 📁 guides/                      # User guides
│   ├── user-guide.md
│   ├── admin-guide.md
│   ├── developer-guide.md
│   └── troubleshooting.md
└── 📁 diagrams/                    # Architecture diagrams
    ├── system-architecture.png
    ├── database-schema.png
    ├── user-flow.png
    └── deployment-diagram.png
```

---

## 📁 scripts/ - Build and Deployment Scripts

```
scripts/
├── build.sh                         # Build script
├── deploy.sh                        # Deployment script
├── setup.sh                         # Initial setup
├── migrate.sh                       # Database migration
├── seed.sh                          # Database seeding
├── backup.sh                        # Backup script
├── restore.sh                       # Restore script
├── test.sh                          # Test runner
├── lint.sh                          # Linting script
├── format.sh                        # Code formatting
├── analyze.sh                       # Bundle analysis
├── security-check.sh               # Security scanning
├── performance-test.sh              # Performance testing
└── cleanup.sh                       # Cleanup script
```

---

## Key Features Supported by This Structure

### 🏢 Organizational Hierarchy
- **Multi-level Organizations**: Government, Private, NGO, Academic
- **Sector Management**: Technology, Healthcare, Education, etc.
- **Department Structure**: Within organizations and sectors
- **Team Types**: Individual teams, organizational teams, cross-functional teams

### 👥 User Management & Roles
- **Multi-level Roles**: Super Admin → Admin → Manager → User
- **Role-based Permissions**: Granular access control
- **Organization-specific Roles**: Department heads, team leads, coordinators
- **Expert Classifications**: Domain experts, evaluators, consultants

### 🎯 Core Innovation Features
- **Challenge Management**: Creation, evaluation, submission tracking
- **Campaign System**: Multi-channel innovation campaigns
- **Event Management**: Workshops, conferences, networking events
- **Expert Marketplace**: Expert discovery, booking, consultation

### 📊 Management & Analytics
- **Comprehensive Dashboards**: Role-specific views
- **Advanced Analytics**: Performance metrics, ROI tracking
- **Report Generation**: Automated reporting across all modules
- **Audit Trails**: Complete activity logging

### 🛡️ Security & Compliance
- **Multi-factor Authentication**: Enhanced security
- **Row-level Security**: Supabase RLS policies
- **Data Privacy**: GDPR/local compliance features
- **Audit Logging**: Comprehensive security monitoring

### 🌐 Internationalization
- **RTL Support**: Full Arabic language support
- **Multi-language Content**: Dynamic language switching
- **Cultural Adaptation**: Saudi-specific features and branding

This comprehensive file structure ensures scalability, maintainability, and supports all the enterprise features required for the Saudi Innovation Spark Platform while maintaining clear separation of concerns and following modern React development best practices.

---

## 🎯 Critical Features Added: Templates & Evaluations

### 📋 Templates System
The **Templates & Forms System** is crucial for:
- **Consistency**: Standardized formats across all features
- **Efficiency**: Rapid creation of challenges, campaigns, events
- **Quality Control**: Pre-approved templates ensure quality
- **Scalability**: Template library grows with platform usage
- **Customization**: Flexible template builder for specific needs

**Key Template Types:**
- Challenge Templates (Innovation challenges, hackathons, competitions)
- Campaign Templates (Awareness campaigns, recruitment drives)
- Event Templates (Workshops, conferences, networking events)
- Evaluation Templates (Scoring matrices, criteria frameworks)
- Document Templates (Reports, certificates, proposals)
- Email Templates (Notifications, communications, marketing)

### 🔍 Ideas & Evaluations System
The **Comprehensive Evaluation System** is essential for:
- **Quality Assurance**: Multi-stage evaluation processes
- **Fairness**: Standardized scoring and peer review systems  
- **Expertise**: Expert-driven evaluation workflows
- **Transparency**: Clear evaluation criteria and feedback
- **Continuous Improvement**: Analytics and calibration systems

**Key Evaluation Features:**
- **Multi-Stage Workflows**: Initial screening → Peer review → Expert evaluation → Final selection
- **Flexible Scoring Systems**: Weighted scoring, ranking, qualitative, hybrid approaches
- **Reviewer Management**: Assignment, calibration, conflict resolution
- **Peer Review System**: Anonymous peer evaluations with consensus building
- **Expert Panels**: Domain expert evaluations and recommendations
- **Conflict Resolution**: Automated and manual conflict resolution processes
- **Analytics & Reporting**: Evaluation performance metrics and insights

### 🔄 Integration with Core Features
Both systems deeply integrate with:
- **Challenges**: Template-based challenge creation, comprehensive idea evaluation
- **Campaigns**: Campaign templates, performance evaluation frameworks  
- **Events**: Event templates, attendee feedback evaluations
- **Organizations**: Organization-specific templates and evaluation criteria
- **Teams**: Team evaluation templates, collaborative review processes
- **Experts**: Expert template creation, expert-led evaluations
- **Analytics**: Template usage analytics, evaluation effectiveness metrics

This enhanced structure ensures the Saudi Innovation Spark Platform can handle enterprise-level innovation management with the flexibility, quality control, and evaluation rigor required for government and large organization deployments.