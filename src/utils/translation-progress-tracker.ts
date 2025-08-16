/**
 * TRANSLATION SYSTEM PROGRESS TRACKER
 * ===================================
 * 
 * Comprehensive tracking system for Arabic hardcoded string replacements
 */

export interface TranslationFix {
  id: string;
  component: string;
  file: string;
  category: 'admin' | 'wizard' | 'management' | 'form' | 'ui' | 'dialog';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed' | 'verified';
  estimatedStrings: number;
  fixedStrings: number;
  addedTranslationKeys: number;
  description: string;
}

export class TranslationProgressTracker {
  private fixes: TranslationFix[] = [];
  private completedFixes: Set<string> = new Set();

  constructor() {
    this.initializeTranslationFixes();
  }

  private initializeTranslationFixes() {
    // ✅ COMPLETED FIXES
    this.addFix({
      id: 'database-tables',
      component: 'Database Tables',
      file: 'supabase/migrations/*',
      category: 'admin',
      priority: 'critical',
      status: 'completed',
      estimatedStrings: 50,
      fixedStrings: 50,
      addedTranslationKeys: 150,
      description: 'Fixed all Arabic values in database tables (challenges, events, ideas, campaigns, partners)'
    });

    this.addFix({
      id: 'admin-challenge-management',
      component: 'AdminChallengeManagement',
      file: 'src/components/admin/AdminChallengeManagement.tsx',
      category: 'admin',
      priority: 'critical',
      status: 'completed',
      estimatedStrings: 15,
      fixedStrings: 15,
      addedTranslationKeys: 25,
      description: 'Replaced all hardcoded Arabic strings with translation keys'
    });

    this.addFix({
      id: 'admin-focus-question-wizard',
      component: 'AdminFocusQuestionWizard',
      file: 'src/components/admin/AdminFocusQuestionWizard.tsx',
      category: 'wizard',
      priority: 'critical',
      status: 'completed',
      estimatedStrings: 20,
      fixedStrings: 20,
      addedTranslationKeys: 30,
      description: 'Fixed validation messages, form labels, and wizard steps'
    });

    this.addFix({
      id: 'campaign-wizard-partial',
      component: 'CampaignWizard',
      file: 'src/components/admin/CampaignWizard.tsx',
      category: 'wizard',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 80,
      fixedStrings: 80,
      addedTranslationKeys: 75,
      description: 'Completed all CampaignWizard sections - organizational structure, partnerships, forms, navigation'
    });

    this.addFix({
      id: 'campaigns-management',
      component: 'CampaignsManagement',
      file: 'src/components/admin/CampaignsManagement.tsx',
      category: 'management',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 12,
      fixedStrings: 12,
      addedTranslationKeys: 15,
      description: 'Fixed status labels and action buttons'
    });

    this.addFix({
      id: 'focus-questions-management',
      component: 'FocusQuestionManagement',
      file: 'src/components/admin/FocusQuestionManagement.tsx',
      category: 'management',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 18,
      fixedStrings: 18,
      addedTranslationKeys: 22,
      description: 'Fixed type badges, question types, and management interface'
    });

    // 🔄 PENDING CRITICAL FIXES
    this.addFix({
      id: 'bulk-avatar-uploader',
      component: 'BulkAvatarUploader',
      file: 'src/components/admin/BulkAvatarUploader.tsx',
      category: 'admin',
      priority: 'medium',
      status: 'completed',
      estimatedStrings: 15,
      fixedStrings: 15,
      addedTranslationKeys: 10,
      description: 'Avatar upload component with translation keys added for UI elements'
    });

    this.addFix({
      id: 'campaign-wizard-complete',
      component: 'CampaignWizard',
      file: 'src/components/admin/CampaignWizard.tsx',
      category: 'wizard',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 25,
      fixedStrings: 25,
      addedTranslationKeys: 35,
      description: 'Completed all CampaignWizard sections including navigation and forms'
    });

    this.addFix({
      id: 'challenge-wizard',
      component: 'ChallengeWizard',
      file: 'src/components/admin/ChallengeWizard.tsx',
      category: 'wizard',
      priority: 'critical',
      status: 'completed',
      estimatedStrings: 100,
      fixedStrings: 100,
      addedTranslationKeys: 35,
      description: 'Complete challenge creation wizard with all form fields and validation'
    });

    this.addFix({
      id: 'idea-wizard',
      component: 'IdeaWizard',
      file: 'src/components/admin/IdeaWizard.tsx',
      category: 'wizard',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 80,
      fixedStrings: 80,
      addedTranslationKeys: 40,
      description: 'Complete idea creation wizard with validation and multi-step forms'
    });

    this.addFix({
      id: 'admin-idea-management',
      component: 'AdminIdeaManagement',
      file: 'src/components/admin/AdminIdeaManagement.tsx',
      category: 'management',
      priority: 'high',
      status: 'pending',
      estimatedStrings: 40,
      fixedStrings: 0,
      addedTranslationKeys: 0,
      description: 'Idea management interface with status filters and actions'
    });

    this.addFix({
      id: 'admin-event-management',
      component: 'EventsManagement',
      file: 'src/components/admin/EventsManagement.tsx',
      category: 'management',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 35,
      fixedStrings: 35,
      addedTranslationKeys: 15,
      description: 'Event management interface with calendar and registration features'
    });

    this.addFix({
      id: 'admin-user-management',
      component: 'AdminUserManagement',
      file: 'src/pages/admin/UserManagement.tsx',
      category: 'management',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 30,
      fixedStrings: 30,
      addedTranslationKeys: 15,
      description: 'User management interface with stats, filters, and mock data translated'
    });

    this.addFix({
      id: 'dashboard-components',
      component: 'Dashboard Components',
      file: 'src/components/dashboard/*',
      category: 'ui',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 40,
      fixedStrings: 40,
      addedTranslationKeys: 50,
      description: 'Fixed AdminDashboard with all cards, categories, and navigation'
    });

    this.addFix({
      id: 'focus-questions-management-legacy',
      component: 'FocusQuestionsManagement',
      file: 'src/components/admin/FocusQuestionsManagement.tsx',
      category: 'management',
      priority: 'high',
      status: 'completed',
      estimatedStrings: 20,
      fixedStrings: 20,
      addedTranslationKeys: 20,
      description: 'Focus questions management interface with filters and actions'
    });

    this.addFix({
      id: 'shared-components',
      component: 'Shared Components',
      file: 'src/components/shared/*',
      category: 'ui',
      priority: 'medium',
      status: 'completed',
      estimatedStrings: 20,
      fixedStrings: 20,
      addedTranslationKeys: 10,
      description: 'DataTable component and shared UI components with translation keys'
    });

    this.addFix({
      id: 'challenge-management-legacy',
      component: 'ChallengeManagement',
      file: 'src/components/admin/ChallengeManagement.tsx',
      category: 'management',
      priority: 'medium',
      status: 'completed',
      estimatedStrings: 20,
      fixedStrings: 20,
      addedTranslationKeys: 6,
      description: 'Challenge management interface with tabs and basic error handling'
    });

    this.addFix({
      id: 'form-components',
      component: 'Form Components',
      file: 'src/components/forms/*',
      category: 'form',
      priority: 'medium',
      status: 'completed',
      estimatedStrings: 25,
      fixedStrings: 25,
      addedTranslationKeys: 15,
      description: 'Form validation messages, labels, and placeholders with translation keys'
    });

    this.addFix({
      id: 'dialog-components',
      component: 'Dialog Components',
      file: 'src/components/dialogs/*',
      category: 'dialog',
      priority: 'medium',
      status: 'completed',
      estimatedStrings: 30,
      fixedStrings: 30,
      addedTranslationKeys: 20,
      description: 'Modal dialogs, confirmations, and popup interfaces with comprehensive translation keys'
    });
  }

  addFix(fix: Omit<TranslationFix, 'id'> & { id: string }) {
    this.fixes.push(fix);
  }

  markCompleted(fixId: string, fixedStrings?: number, addedKeys?: number) {
    this.completedFixes.add(fixId);
    const fix = this.fixes.find(f => f.id === fixId);
    if (fix) {
      fix.status = 'completed';
      if (fixedStrings !== undefined) fix.fixedStrings = fixedStrings;
      if (addedKeys !== undefined) fix.addedTranslationKeys = addedKeys;
    }
  }

  markInProgress(fixId: string) {
    const fix = this.fixes.find(f => f.id === fixId);
    if (fix) {
      fix.status = 'in-progress';
    }
  }

  updateProgress(fixId: string, fixedStrings: number, addedKeys: number) {
    const fix = this.fixes.find(f => f.id === fixId);
    if (fix) {
      fix.fixedStrings = fixedStrings;
      fix.addedTranslationKeys = addedKeys;
    }
  }

  getProgress() {
    const total = this.fixes.length;
    const completed = this.fixes.filter(f => f.status === 'completed').length;
    const inProgress = this.fixes.filter(f => f.status === 'in-progress').length;
    const pending = this.fixes.filter(f => f.status === 'pending').length;
    
    const totalStrings = this.fixes.reduce((sum, fix) => sum + fix.estimatedStrings, 0);
    const fixedStrings = this.fixes.reduce((sum, fix) => sum + fix.fixedStrings, 0);
    const totalKeys = this.fixes.reduce((sum, fix) => sum + fix.addedTranslationKeys, 0);

    return {
      components: { total, completed, inProgress, pending },
      strings: { total: totalStrings, fixed: fixedStrings },
      translationKeys: totalKeys,
      percentage: Math.round((completed / total) * 100),
      stringPercentage: Math.round((fixedStrings / totalStrings) * 100)
    };
  }

  getFixesByPriority(priority: TranslationFix['priority']) {
    return this.fixes.filter(f => f.priority === priority);
  }

  getFixesByStatus(status: TranslationFix['status']) {
    return this.fixes.filter(f => f.status === status);
  }

  getPendingCriticalFixes() {
    return this.fixes.filter(f => f.status === 'pending' && f.priority === 'critical');
  }

  getNextPriorityFixes(count: number = 5) {
    return this.fixes
      .filter(f => f.status === 'pending')
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, count);
  }

  generateProgressReport() {
    const progress = this.getProgress();
    const critical = this.getPendingCriticalFixes();
    const nextTasks = this.getNextPriorityFixes(3);

    return {
      timestamp: new Date().toISOString(),
      overall: progress,
      critical: {
        pending: critical.length,
        components: critical.map(f => f.component)
      },
      categories: {
        admin: this.fixes.filter(f => f.category === 'admin'),
        wizard: this.fixes.filter(f => f.category === 'wizard'),
        management: this.fixes.filter(f => f.category === 'management'),
        ui: this.fixes.filter(f => f.category === 'ui'),
        form: this.fixes.filter(f => f.category === 'form'),
        dialog: this.fixes.filter(f => f.category === 'dialog')
      },
      nextTasks: nextTasks.map(f => ({
        component: f.component,
        priority: f.priority,
        estimatedStrings: f.estimatedStrings,
        description: f.description
      }))
    };
  }

  logDetailedProgress() {
    const report = this.generateProgressReport();
    
    // ✅ FIXED: Use structured logging instead of console.info
    if (typeof window !== 'undefined' && (window as any).debugLog) {
      (window as any).debugLog.log('Translation Progress Tracker', {
        component: 'TranslationProgressTracker',
        data: report
      });
    }
  }
}

export const translationProgressTracker = new TranslationProgressTracker();

// ✅ FIXED: Use structured logging instead of console.info
if (typeof window !== 'undefined' && (window as any).debugLog) {
  (window as any).debugLog.log('Translation Migration Progress Update', {
    component: 'TranslationProgressTracker',
    data: 'PHASE 1 & 2 completed'
  });
}

translationProgressTracker.logDetailedProgress();