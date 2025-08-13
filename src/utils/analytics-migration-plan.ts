/**
 * ANALYTICS MIGRATION PLAN & PROGRESS TRACKER
 * Comprehensive plan to migrate all metrics to centralized analytics system
 */

export interface MigrationTask {
  id: string;
  phase: 'discovery' | 'planning' | 'implementation' | 'testing' | 'deployment' | 'cleanup';
  component: string;
  filePath: string;
  description: string;
  currentPattern: string;
  targetPattern: string;
  rbacRequirement: 'basic' | 'advanced' | 'security' | 'admin';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedHours: number;
  dependencies: string[];
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  assignedTo?: string;
  completedAt?: Date;
  notes?: string;
}

export interface MigrationPhase {
  name: string;
  description: string;
  tasks: MigrationTask[];
  startDate?: Date;
  endDate?: Date;
  status: 'not-started' | 'in-progress' | 'completed';
  blockers?: string[];
}

/**
 * COMPLETE MIGRATION PLAN
 */
export const ANALYTICS_MIGRATION_PLAN: MigrationPhase[] = [
  {
    name: "Phase 1: Discovery & Assessment",
    description: "Identify all current metrics usage and data sources",
    status: 'completed',
    tasks: [
      {
        id: "DISC-001",
        phase: 'discovery',
        component: "AdminAnalytics",
        filePath: "src/components/admin/analytics/AdminAnalytics.tsx",
        description: "Analyze admin dashboard metrics patterns",
        currentPattern: "Direct supabase queries with useState",
        targetPattern: "useAdminAnalytics() hook with RBAC",
        rbacRequirement: 'admin',
        priority: 'critical',
        estimatedHours: 2,
        dependencies: [],
        status: 'completed'
      },
      {
        id: "DISC-002", 
        phase: 'discovery',
        component: "AnalyticsDashboard",
        filePath: "src/components/analytics/AnalyticsDashboard.tsx",
        description: "Review main dashboard component",
        currentPattern: "Mixed useQuery and mock data",
        targetPattern: "useAppAnalytics() with role-based data",
        rbacRequirement: 'basic',
        priority: 'critical',
        estimatedHours: 3,
        dependencies: [],
        status: 'completed'
      },
      {
        id: "DISC-003",
        phase: 'discovery', 
        component: "StorageAnalytics",
        filePath: "src/components/admin/StorageAnalyticsDashboard.tsx",
        description: "Storage metrics analysis",
        currentPattern: "Database functions with manual queries",
        targetPattern: "Centralized storage analytics service",
        rbacRequirement: 'admin',
        priority: 'high',
        estimatedHours: 4,
        dependencies: [],
        status: 'completed'
      }
    ]
  },
  
  {
    name: "Phase 2: Core Infrastructure",
    description: "Establish centralized analytics infrastructure",
    status: 'completed',
    tasks: [
      {
        id: "INFRA-001",
        phase: 'implementation',
        component: "AnalyticsService",
        filePath: "src/services/analytics/AnalyticsService.ts", 
        description: "Create centralized analytics service with RBAC",
        currentPattern: "Scattered service calls",
        targetPattern: "Single AnalyticsService with caching & permissions",
        rbacRequirement: 'basic',
        priority: 'critical',
        estimatedHours: 8,
        dependencies: [],
        status: 'completed'
      },
      {
        id: "INFRA-002",
        phase: 'implementation',
        component: "useAnalytics Hook",
        filePath: "src/hooks/useAnalytics.ts",
        description: "Create unified analytics hook",
        currentPattern: "Multiple individual hooks",
        targetPattern: "Single hook with role-based data fetching",
        rbacRequirement: 'basic',
        priority: 'critical', 
        estimatedHours: 6,
        dependencies: ["INFRA-001"],
        status: 'completed'
      },
      {
        id: "INFRA-003",
        phase: 'implementation',
        component: "AnalyticsContext",
        filePath: "src/contexts/AnalyticsContext.tsx",
        description: "Global analytics context provider",
        currentPattern: "No global analytics state",
        targetPattern: "App-wide analytics context with tracking",
        rbacRequirement: 'basic',
        priority: 'critical',
        estimatedHours: 4,
        dependencies: ["INFRA-002"],
        status: 'completed'
      },
      {
        id: "INFRA-004",
        phase: 'implementation',
        component: "ProtectedAnalyticsWrapper",
        filePath: "src/components/analytics/ProtectedAnalyticsWrapper.tsx",
        description: "RBAC wrapper components",
        currentPattern: "Manual permission checks",
        targetPattern: "Declarative RBAC wrappers",
        rbacRequirement: 'basic',
        priority: 'critical',
        estimatedHours: 3,
        dependencies: ["INFRA-003"],
        status: 'completed'
      }
    ]
  },

  {
    name: "Phase 3: Database Functions Migration",
    description: "Update database functions to work with centralized service",
    status: 'completed',
    tasks: [
      {
        id: "DB-001",
        phase: 'implementation',
        component: "Analytics Database Functions",
        filePath: "Database Functions",
        description: "Create role-aware analytics functions",
        currentPattern: "get_admin_metrics_data() without RBAC",
        targetPattern: "get_analytics_data(user_id, role, filters) with RBAC",
        rbacRequirement: 'admin',
        priority: 'high',
        estimatedHours: 6,
        dependencies: ["INFRA-001"],
        status: 'completed'
      },
      {
        id: "DB-002",
        phase: 'implementation',
        component: "Security Metrics Functions",
        filePath: "Database Functions",
        description: "Security-specific analytics functions",
        currentPattern: "Scattered security queries",
        targetPattern: "get_security_metrics(user_id) with admin-only access",
        rbacRequirement: 'security',
        priority: 'high',
        estimatedHours: 4,
        dependencies: ["DB-001"],
        status: 'completed'
      }
    ]
  },

  {
    name: "Phase 4: Component Migration - Critical Path",
    description: "Migrate high-priority dashboard components",
    status: 'in-progress',
    tasks: [
      {
        id: "COMP-001",
        phase: 'implementation',
        component: "AdminDashboard",
        filePath: "src/pages/AdminDashboard.tsx",
        description: "Main admin dashboard migration",
        currentPattern: "Mixed data fetching patterns",
        targetPattern: "useAdminAnalytics() with AdminAnalyticsWrapper",
        rbacRequirement: 'admin',
        priority: 'critical',
        estimatedHours: 4,
        dependencies: ["INFRA-004", "DB-001"],
        status: 'completed'
      },
      {
        id: "COMP-002",
        phase: 'implementation',
        component: "Dashboard",
        filePath: "src/pages/Dashboard.tsx",
        description: "Main user dashboard migration",
        currentPattern: "Individual component data fetching",
        targetPattern: "useDashboardAnalytics() with BasicAnalyticsWrapper", 
        rbacRequirement: 'basic',
        priority: 'critical',
        estimatedHours: 5,
        dependencies: ["INFRA-004"],
        status: 'completed'
      },
      {
        id: "COMP-003",
        phase: 'implementation',
        component: "ChallengeAnalytics",
        filePath: "src/components/admin/challenges/ChallengeAnalytics.tsx",
        description: "Challenge-specific analytics migration",
        currentPattern: "Direct database queries",
        targetPattern: "useAnalytics() with challenge-specific filters",
        rbacRequirement: 'advanced',
        priority: 'high',
        estimatedHours: 6,
        dependencies: ["COMP-001"],
        status: 'pending'
      }
    ]
  },

  {
    name: "Phase 5: Component Migration - Secondary",
    description: "Migrate remaining analytics components",
    status: 'not-started',
    tasks: [
      {
        id: "COMP-004",
        phase: 'implementation',
        component: "IdeaAnalytics", 
        filePath: "src/components/admin/ideas/IdeaAnalytics.tsx",
        description: "Idea analytics component migration",
        currentPattern: "Component-specific queries",
        targetPattern: "useAnalytics() with idea filters",
        rbacRequirement: 'advanced',
        priority: 'medium',
        estimatedHours: 4,
        dependencies: ["COMP-003"],
        status: 'pending'
      },
      {
        id: "COMP-005",
        phase: 'implementation',
        component: "EventAnalytics",
        filePath: "src/components/events/EventAnalyticsDashboard.tsx", 
        description: "Event analytics migration",
        currentPattern: "Event-specific data fetching",
        targetPattern: "useAnalytics() with event context",
        rbacRequirement: 'advanced',
        priority: 'medium',
        estimatedHours: 5,
        dependencies: ["COMP-004"],
        status: 'pending'
      },
      {
        id: "COMP-006",
        phase: 'implementation',
        component: "RelationshipOverview",
        filePath: "src/components/admin/RelationshipOverview.tsx",
        description: "Partnership analytics migration", 
        currentPattern: "Manual relationship queries",
        targetPattern: "useAnalytics() with partnership context",
        rbacRequirement: 'admin',
        priority: 'medium',
        estimatedHours: 4,
        dependencies: ["COMP-002"],
        status: 'pending'
      }
    ]
  },

  {
    name: "Phase 6: Real-time & Advanced Features",
    description: "Implement real-time analytics and advanced features",
    status: 'not-started',
    tasks: [
      {
        id: "RT-001",
        phase: 'implementation',
        component: "LiveEngagementMonitor",
        filePath: "src/components/admin/analytics/LiveEngagementMonitor.tsx",
        description: "Real-time engagement tracking",
        currentPattern: "Polling with useState",
        targetPattern: "useAnalytics() with auto-refresh",
        rbacRequirement: 'advanced',
        priority: 'medium',
        estimatedHours: 6,
        dependencies: ["COMP-006"],
        status: 'pending'
      },
      {
        id: "RT-002",
        phase: 'implementation',
        component: "ParticipationTrendAnalyzer",
        filePath: "src/components/admin/analytics/ParticipationTrendAnalyzer.tsx",
        description: "Trend analysis with caching",
        currentPattern: "Manual trend calculations",
        targetPattern: "Cached trend data from analytics service",
        rbacRequirement: 'advanced',
        priority: 'low',
        estimatedHours: 4,
        dependencies: ["RT-001"],
        status: 'pending'
      }
    ]
  },

  {
    name: "Phase 7: Testing & Validation",
    description: "Comprehensive testing of migrated analytics",
    status: 'not-started',
    tasks: [
      {
        id: "TEST-001",
        phase: 'testing',
        component: "RBAC Testing",
        filePath: "tests/analytics-rbac.test.ts",
        description: "Test role-based access controls",
        currentPattern: "No systematic RBAC testing",
        targetPattern: "Comprehensive permission testing",
        rbacRequirement: 'admin',
        priority: 'critical',
        estimatedHours: 8,
        dependencies: ["RT-002"],
        status: 'pending'
      },
      {
        id: "TEST-002",
        phase: 'testing',
        component: "Performance Testing",
        filePath: "tests/analytics-performance.test.ts",
        description: "Test caching and performance",
        currentPattern: "No performance testing",
        targetPattern: "Load testing with cache validation",
        rbacRequirement: 'admin',
        priority: 'high',
        estimatedHours: 6,
        dependencies: ["TEST-001"],
        status: 'pending'
      }
    ]
  },

  {
    name: "Phase 8: Cleanup & Documentation",
    description: "Remove old patterns and document new system",
    status: 'not-started',
    tasks: [
      {
        id: "CLEAN-001",
        phase: 'cleanup',
        component: "Legacy Hook Removal",
        filePath: "src/hooks/",
        description: "Remove old analytics hooks",
        currentPattern: "Multiple scattered hooks",
        targetPattern: "Single centralized analytics system",
        rbacRequirement: 'admin',
        priority: 'medium',
        estimatedHours: 4,
        dependencies: ["TEST-002"],
        status: 'pending'
      },
      {
        id: "CLEAN-002",
        phase: 'cleanup',
        component: "Documentation",
        filePath: "docs/analytics-migration.md",
        description: "Document new analytics architecture",
        currentPattern: "Undocumented system",
        targetPattern: "Comprehensive analytics documentation",
        rbacRequirement: 'admin',
        priority: 'low',
        estimatedHours: 3,
        dependencies: ["CLEAN-001"],
        status: 'pending'
      }
    ]
  }
];

/**
 * MIGRATION PROGRESS CALCULATOR
 */
export function calculateMigrationProgress(): {
  overall: number;
  byPhase: Record<string, number>;
  completedTasks: number;
  totalTasks: number;
  estimatedRemainingHours: number;
} {
  let completedTasks = 0;
  let totalTasks = 0;
  let remainingHours = 0;
  const byPhase: Record<string, number> = {};

  ANALYTICS_MIGRATION_PLAN.forEach(phase => {
    let phaseCompleted = 0;
    let phaseTotal = phase.tasks.length;
    
    phase.tasks.forEach(task => {
      totalTasks++;
      if (task.status === 'completed') {
        completedTasks++;
        phaseCompleted++;
      } else {
        remainingHours += task.estimatedHours;
      }
    });
    
    byPhase[phase.name] = phaseTotal > 0 ? (phaseCompleted / phaseTotal) * 100 : 0;
  });

  return {
    overall: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    byPhase,
    completedTasks,
    totalTasks,
    estimatedRemainingHours: remainingHours
  };
}

/**
 * CRITICAL PATH ANALYSIS
 */
export function getCriticalPath(): MigrationTask[] {
  const allTasks = ANALYTICS_MIGRATION_PLAN.flatMap(phase => phase.tasks);
  
  return allTasks
    .filter(task => task.priority === 'critical' && task.status !== 'completed')
    .sort((a, b) => {
      // Sort by dependencies and priority
      if (a.dependencies.length !== b.dependencies.length) {
        return a.dependencies.length - b.dependencies.length;
      }
      return a.estimatedHours - b.estimatedHours;
    });
}

/**
 * NEXT ACTIONABLE TASKS
 */
export function getNextActionableTasks(): MigrationTask[] {
  const allTasks = ANALYTICS_MIGRATION_PLAN.flatMap(phase => phase.tasks);
  const completedTaskIds = allTasks
    .filter(task => task.status === 'completed')
    .map(task => task.id);
  
  return allTasks
    .filter(task => 
      task.status === 'pending' && 
      task.dependencies.every(dep => completedTaskIds.includes(dep))
    )
    .sort((a, b) => {
      const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5); // Top 5 actionable tasks
}

/**
 * CURRENT STATUS
 */
export const MIGRATION_STATUS = {
  startDate: new Date('2024-01-15'),
  currentPhase: 'Phase 4: Component Migration - Critical Path',
  blockers: [
    'Need to create new database functions with RBAC',
    'Some components have complex data dependencies'
  ],
  progress: calculateMigrationProgress(),
  criticalPath: getCriticalPath(),
  nextActions: getNextActionableTasks()
};