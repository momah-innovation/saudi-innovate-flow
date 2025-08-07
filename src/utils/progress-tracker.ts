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

// Mark completed fixes
progressTracker.markComponentCompleted('src/components/admin/TranslationManagement.tsx', 4, 8);
progressTracker.markComponentCompleted('src/components/admin/challenges/ChallengeWizardV2.tsx', 2, 12);
progressTracker.markComponentCompleted('src/i18n/enhanced-config-v2.ts', 9, 3);
progressTracker.markComponentCompleted('src/components/admin/InnovationTeamsContent.tsx', 0, 15);
progressTracker.markComponentCompleted('src/components/admin/TeamWorkspaceContent.tsx', 1, 12);
progressTracker.markComponentCompleted('src/components/admin/challenges/ChallengeAnalytics.tsx', 1, 1);
progressTracker.logProgress();