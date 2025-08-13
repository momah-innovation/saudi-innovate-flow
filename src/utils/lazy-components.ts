/**
 * Phase 8: Performance Optimization - Code Splitting Implementation
 * Lazy-loaded route components for better initial bundle size
 * Updated with analytics-aware lazy loading
 */

import { lazy } from 'react';
import { withAnalytics } from '@/contexts/AnalyticsContext';

// Since most components use named exports, we need to handle them properly
// Admin Panel Components that exist and can be lazy loaded
export const ChallengeManagement = lazy(() => 
  import('@/components/admin/ChallengeManagement').then(module => ({ 
    default: module.ChallengeManagement 
  }))
);

export const IdeasManagement = lazy(() => 
  import('@/components/admin/IdeasManagement').then(module => ({ 
    default: module.IdeasManagement 
  }))
);

export const PartnersManagement = lazy(() => 
  import('@/components/admin/PartnersManagement').then(module => ({ 
    default: module.PartnersManagement 
  }))
);

export const EvaluationsManagement = lazy(() => 
  import('@/components/admin/EvaluationsManagement').then(module => ({ 
    default: module.EvaluationsManagement 
  }))
);

export const EventsManagement = lazy(() => 
  import('@/components/admin/EventsManagement').then(module => ({ 
    default: module.EventsManagement 
  }))
);

export const RelationshipOverview = lazy(() => 
  import('@/components/admin/RelationshipOverview').then(module => ({ 
    default: module.RelationshipOverview 
  }))
);

// Analytics Components
export const ChallengeAnalytics = lazy(() => 
  import('@/components/admin/challenges/ChallengeAnalytics').then(module => ({ 
    default: module.ChallengeAnalytics 
  }))
);

export const IdeaAnalytics = lazy(() => 
  import('@/components/admin/ideas/IdeaAnalytics').then(module => ({ 
    default: module.IdeaAnalytics 
  }))
);

export const EventAnalytics = lazy(() => 
  import('@/components/events/EventAnalyticsDashboard').then(module => ({ 
    default: module.EventAnalyticsDashboard 
  }))
);

export const StorageAnalytics = lazy(() => 
  import('@/components/admin/StorageAnalyticsDashboard').then(module => ({ 
    default: module.StorageAnalyticsDashboard 
  }))
);

// Wizard Components
export const ChallengeWizard = lazy(() => 
  import('@/components/admin/ChallengeWizard').then(module => ({ 
    default: module.ChallengeWizard 
  }))
);

export const ChallengeWizardV2 = lazy(() => 
  import('@/components/admin/challenges/ChallengeWizardV2').then(module => ({ 
    default: module.ChallengeWizardV2 
  }))
);

// Detail Views
export const ChallengeDetailView = lazy(() => 
  import('@/components/admin/challenges/ChallengeDetailView').then(module => ({ 
    default: module.ChallengeDetailView 
  }))
);

export const IdeaDetailView = lazy(() => 
  import('@/components/admin/ideas/IdeaDetailView').then(module => ({ 
    default: module.IdeaDetailView 
  }))
);

export const ExpertDetailView = lazy(() => 
  import('@/components/admin/experts/ExpertDetailView').then(module => ({ 
    default: module.ExpertDetailView 
  }))
);

export const PartnerDetailView = lazy(() => 
  import('@/components/admin/partners/PartnerDetailView').then(module => ({ 
    default: module.PartnerDetailView 
  }))
);

/**
 * Component preloader utility for better UX
 * Preloads components when user hovers over navigation links
 */
export const preloadComponent = (componentLoader: () => Promise<any>) => {
  componentLoader();
};

/**
 * Navigation-triggered preloading functions
 */
export const preloadRoutes = {
  challengeManagement: () => preloadComponent(() => import('@/components/admin/ChallengeManagement')),
  ideaManagement: () => preloadComponent(() => import('@/components/admin/IdeasManagement')),
  partnerManagement: () => preloadComponent(() => import('@/components/admin/PartnersManagement')),
  evaluationManagement: () => preloadComponent(() => import('@/components/admin/EvaluationsManagement')),
  eventManagement: () => preloadComponent(() => import('@/components/admin/EventsManagement')),
  relationshipOverview: () => preloadComponent(() => import('@/components/admin/RelationshipOverview')),
  
  // Analytics
  challengeAnalytics: () => preloadComponent(() => import('@/components/admin/challenges/ChallengeAnalytics')),
  ideaAnalytics: () => preloadComponent(() => import('@/components/admin/ideas/IdeaAnalytics')),
  storageAnalytics: () => preloadComponent(() => import('@/components/admin/StorageAnalyticsDashboard'))
};

// Chunk names for better debugging
export const chunkNames = {
  admin: 'admin-management',
  analytics: 'analytics-dashboard', 
  wizards: 'form-wizards',
  details: 'detail-views'
} as const;