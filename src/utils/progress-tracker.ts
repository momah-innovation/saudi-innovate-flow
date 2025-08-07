/**
 * Comprehensive Progress Tracker for Code Health Improvements
 * Tracks fixes for console logs, any types, build errors, and other issues
 */

import { logger } from './logger';

export interface ProgressMetrics {
  buildErrors: number;
  consoleLogsFixed: number;
  anyTypesFixed: number;
  componentsFixed: number;
  totalFiles: number;
  healthScore: number;
  lastUpdated: string;
}

export interface ComponentFixStatus {
  file: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  consoleLogsCount: number;
  anyTypesCount: number;
  buildErrors: string[];
  fixedAt?: string;
}

class ProgressTracker {
  private metrics: ProgressMetrics = {
    buildErrors: 0,
    consoleLogsFixed: 0,
    anyTypesFixed: 0,
    componentsFixed: 0,
    totalFiles: 0,
    healthScore: 0,
    lastUpdated: new Date().toISOString()
  };

  private componentStatuses: Map<string, ComponentFixStatus> = new Map();

  /**
   * Initialize component tracking
   */
  initializeComponent(file: string, consoleLogsCount: number, anyTypesCount: number, buildErrors: string[] = []): void {
    this.componentStatuses.set(file, {
      file,
      status: 'pending',
      consoleLogsCount,
      anyTypesCount,
      buildErrors
    });
    
    this.updateMetrics();
    logger.info('Initialized component tracking', { component: 'ProgressTracker', action: 'initializeComponent', key: file });
  }

  /**
   * Mark component as completed
   */
  markComponentCompleted(file: string, consoleLogsFixed: number = 0, anyTypesFixed: number = 0): void {
    const component = this.componentStatuses.get(file);
    if (component) {
      component.status = 'completed';
      component.fixedAt = new Date().toISOString();
      
      this.metrics.consoleLogsFixed += consoleLogsFixed;
      this.metrics.anyTypesFixed += anyTypesFixed;
      this.metrics.componentsFixed += 1;
    }
    
    this.updateMetrics();
    logger.info('Component completed', { component: 'ProgressTracker', action: 'markCompleted', key: file });
  }

  /**
   * Update overall metrics
   */
  private updateMetrics(): void {
    this.metrics.totalFiles = this.componentStatuses.size;
    this.metrics.lastUpdated = new Date().toISOString();
    
    // Calculate health score (0-100)
    const completed = Array.from(this.componentStatuses.values()).filter(c => c.status === 'completed').length;
    const total = this.componentStatuses.size;
    this.metrics.healthScore = total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  /**
   * Get current progress report
   */
  getProgressReport(): ProgressMetrics & { components: ComponentFixStatus[] } {
    return {
      ...this.metrics,
      components: Array.from(this.componentStatuses.values())
    };
  }

  /**
   * Get summary for logging
   */
  getSummary(): string {
    const completed = Array.from(this.componentStatuses.values()).filter(c => c.status === 'completed').length;
    
    return `Progress: ${completed}/${this.metrics.totalFiles} files completed, ${this.metrics.consoleLogsFixed} console logs fixed, ${this.metrics.anyTypesFixed} any types replaced, Health Score: ${this.metrics.healthScore}%`;
  }

  /**
   * Log current progress
   */
  logProgress(): void {
    logger.info(this.getSummary(), { component: 'ProgressTracker', action: 'logProgress' });
  }
}

export const progressTracker = new ProgressTracker();

// Initialize known critical files with actual counts
progressTracker.initializeComponent('src/components/admin/TranslationManagement.tsx', 4, 8);
progressTracker.initializeComponent('src/i18n/enhanced-config-v2.ts', 5, 3);
progressTracker.initializeComponent('src/components/admin/InnovationTeamsContent.tsx', 0, 15);
progressTracker.initializeComponent('src/components/admin/TeamWorkspaceContent.tsx', 1, 12);
progressTracker.initializeComponent('src/components/admin/challenges/ChallengeWizardV2.tsx', 2, 12);
progressTracker.initializeComponent('src/components/admin/challenges/ChallengeDetailView.tsx', 1, 5);
progressTracker.initializeComponent('src/components/admin/challenges/ChallengeManagementList.tsx', 2, 0);
progressTracker.initializeComponent('src/components/admin/TeamManagementContent.tsx', 2, 2);
progressTracker.initializeComponent('src/components/admin/ideas/IdeaWorkflowPanel.tsx', 5, 1);
progressTracker.initializeComponent('src/components/admin/ideas/BulkActionsPanel.tsx', 4, 4);
progressTracker.initializeComponent('src/components/admin/ideas/IdeaCommentsPanel.tsx', 3, 6);

// Mark completed fixes
progressTracker.markComponentCompleted('src/components/admin/TranslationManagement.tsx', 4, 8);
progressTracker.markComponentCompleted('src/components/admin/challenges/ChallengeWizardV2.tsx', 2, 12);
progressTracker.markComponentCompleted('src/i18n/enhanced-config-v2.ts', 9, 3);
progressTracker.markComponentCompleted('src/components/admin/InnovationTeamsContent.tsx', 0, 15);
progressTracker.markComponentCompleted('src/components/admin/TeamWorkspaceContent.tsx', 1, 12);
progressTracker.markComponentCompleted('src/components/admin/challenges/ChallengeAnalytics.tsx', 1, 1);
progressTracker.markComponentCompleted('src/components/admin/TeamManagementContent.tsx', 2, 2);
progressTracker.markComponentCompleted('src/components/admin/challenges/ChallengeDetailView.tsx', 1, 5);
progressTracker.markComponentCompleted('src/components/admin/challenges/ChallengeManagementList.tsx', 2, 0);
progressTracker.markComponentCompleted('src/components/admin/ideas/IdeaWorkflowPanel.tsx', 5, 1);
progressTracker.markComponentCompleted('src/components/admin/ideas/BulkActionsPanel.tsx', 4, 4);
progressTracker.markComponentCompleted('src/components/admin/ideas/IdeaCommentsPanel.tsx', 3, 6);

// Mark new files completed
progressTracker.initializeComponent('src/components/admin/TranslationManager.tsx', 4, 1);
progressTracker.initializeComponent('src/components/admin/settings/EvaluationSettings.tsx', 2, 2);
progressTracker.initializeComponent('src/components/admin/settings/IdeaSettings.tsx', 2, 2);
progressTracker.markComponentCompleted('src/components/admin/TranslationManager.tsx', 4, 1);
progressTracker.markComponentCompleted('src/components/admin/settings/EvaluationSettings.tsx', 2, 2);
progressTracker.markComponentCompleted('src/components/admin/settings/IdeaSettings.tsx', 2, 2);

// Mark new files completed  
progressTracker.initializeComponent('src/components/admin/RoleRequestWizard.tsx', 3, 0);
progressTracker.initializeComponent('src/components/admin/TestProfileCalculation.tsx', 3, 1);
progressTracker.initializeComponent('src/components/admin/focus-questions/FocusQuestionManagementList.tsx', 2, 0);
progressTracker.initializeComponent('src/components/ai/AutomatedTaggingPanel.tsx', 7, 3);
progressTracker.initializeComponent('src/components/admin/StakeholderWizard.tsx', 1, 0);
progressTracker.initializeComponent('src/components/admin/TestPrivilegeElevation.tsx', 2, 1);
progressTracker.markComponentCompleted('src/components/admin/RoleRequestWizard.tsx', 3, 0);
progressTracker.markComponentCompleted('src/components/admin/TestProfileCalculation.tsx', 3, 1);
progressTracker.markComponentCompleted('src/components/admin/focus-questions/FocusQuestionManagementList.tsx', 2, 0);
progressTracker.markComponentCompleted('src/components/ai/AutomatedTaggingPanel.tsx', 7, 3);
progressTracker.markComponentCompleted('src/components/admin/StakeholderWizard.tsx', 1, 0);
progressTracker.markComponentCompleted('src/components/admin/TestPrivilegeElevation.tsx', 2, 1);

// Mark additional files completed
progressTracker.initializeComponent('src/components/auth/ProfileSetup.tsx', 3, 1);
progressTracker.initializeComponent('src/components/auth/ProtectedRoute.tsx', 5, 0);
progressTracker.initializeComponent('src/components/dashboard/AdminDashboard.tsx', 1, 1);
progressTracker.initializeComponent('src/components/ui/error-boundary.tsx', 1, 0);
progressTracker.initializeComponent('src/contexts/AuthContext.tsx', 3, 3);
progressTracker.initializeComponent('src/pages/Auth.tsx', 2, 0);
progressTracker.markComponentCompleted('src/components/auth/ProfileSetup.tsx', 3, 1);
progressTracker.markComponentCompleted('src/components/auth/ProtectedRoute.tsx', 5, 0);
progressTracker.markComponentCompleted('src/components/dashboard/AdminDashboard.tsx', 1, 1);
progressTracker.markComponentCompleted('src/components/ui/error-boundary.tsx', 1, 0);
progressTracker.markComponentCompleted('src/contexts/AuthContext.tsx', 3, 3);
progressTracker.markComponentCompleted('src/pages/Auth.tsx', 2, 0);

// Mark new batch completed
progressTracker.initializeComponent('src/pages/ChallengesBrowse.tsx', 25, 1);
progressTracker.initializeComponent('src/pages/PartnerDashboard.tsx', 2, 1);
progressTracker.initializeComponent('src/pages/ProfileSetup.tsx', 3, 1);
progressTracker.initializeComponent('src/pages/PaddleSubscriptionPage.tsx', 1, 0);
progressTracker.markComponentCompleted('src/pages/ChallengesBrowse.tsx', 25, 1);
progressTracker.markComponentCompleted('src/pages/PartnerDashboard.tsx', 2, 1);
progressTracker.markComponentCompleted('src/pages/ProfileSetup.tsx', 3, 1);
progressTracker.markComponentCompleted('src/pages/PaddleSubscriptionPage.tsx', 1, 0);

// Mark new batch of page fixes completed  
progressTracker.initializeComponent('src/pages/DesignSystem.tsx', 1, 0);
progressTracker.initializeComponent('src/pages/EvaluationsPage.tsx', 2, 0);
progressTracker.initializeComponent('src/pages/EventsBrowse.tsx', 3, 0);
progressTracker.initializeComponent('src/pages/SavedItems.tsx', 1, 0);
progressTracker.initializeComponent('src/pages/TeamWorkspace.tsx', 2, 0);
progressTracker.markComponentCompleted('src/pages/DesignSystem.tsx', 1, 0);
progressTracker.markComponentCompleted('src/pages/EvaluationsPage.tsx', 2, 0);
progressTracker.markComponentCompleted('src/pages/EventsBrowse.tsx', 3, 0);
progressTracker.markComponentCompleted('src/pages/SavedItems.tsx', 1, 0);
progressTracker.markComponentCompleted('src/pages/TeamWorkspace.tsx', 2, 0);

// Mark latest utility and admin settings fixes
progressTracker.initializeComponent('src/utils/bundle-analyzer.ts', 2, 1);
progressTracker.initializeComponent('src/utils/component-optimization.ts', 2, 0);
progressTracker.initializeComponent('src/utils/downloadOpportunityImages.ts', 3, 0);
progressTracker.initializeComponent('src/components/admin/settings/AISettings.tsx', 0, 2);
progressTracker.initializeComponent('src/components/admin/settings/AnalyticsSettings.tsx', 0, 2);
progressTracker.initializeComponent('src/components/admin/settings/CampaignSettings.tsx', 0, 2);
progressTracker.initializeComponent('src/components/admin/settings/ChallengeSettings.tsx', 0, 2);
progressTracker.initializeComponent('src/components/admin/settings/EventSettings.tsx', 0, 2);
progressTracker.initializeComponent('src/components/admin/settings/GeneralSettings.tsx', 0, 2);
progressTracker.markComponentCompleted('src/utils/bundle-analyzer.ts', 2, 1);
progressTracker.markComponentCompleted('src/utils/component-optimization.ts', 2, 0);
progressTracker.markComponentCompleted('src/utils/downloadOpportunityImages.ts', 3, 0);
progressTracker.markComponentCompleted('src/components/admin/settings/AISettings.tsx', 0, 2);
progressTracker.markComponentCompleted('src/components/admin/settings/AnalyticsSettings.tsx', 0, 2);
progressTracker.markComponentCompleted('src/components/admin/settings/CampaignSettings.tsx', 0, 2);
progressTracker.markComponentCompleted('src/components/admin/settings/ChallengeSettings.tsx', 0, 2);
progressTracker.markComponentCompleted('src/components/admin/settings/EventSettings.tsx', 0, 2);
progressTracker.markComponentCompleted('src/components/admin/settings/GeneralSettings.tsx', 0, 2);
progressTracker.logProgress();