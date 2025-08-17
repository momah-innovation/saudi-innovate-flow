# Dashboard Documentation

Comprehensive documentation for dashboard components, RBAC implementation, and role-specific interfaces in the Enterprise Management System.

## 📊 Dashboard Architecture

### 🏗️ Dashboard Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Main Dashboard Layout                    │
├─────────────────────────────────────────────────────────────┤
│ Header: User Info, Notifications, Quick Actions           │
├─────────────────────────────────────────────────────────────┤
│ Role-Based Content Area                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   User Stats    │  │   Quick Actions │  │  Recent      │ │
│  │   & Metrics     │  │   & Shortcuts   │  │  Activity    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Role-Specific Content                     │ │
│  │  • Admin: System Management & Analytics               │ │
│  │  • Innovator: Challenges & Idea Submission            │ │
│  │  • Expert: Evaluation & Review Dashboard              │ │
│  │  • Partner: Collaboration & Opportunity View          │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Footer: Help, Support, System Status                      │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 Core Dashboard Components

#### Main Dashboard Router
**Location**: `src/components/dashboard/UserDashboard.tsx`

```typescript
import { UserDashboard } from '@/components/dashboard/UserDashboard';

// Main dashboard component with role-based routing
const DashboardRouter = () => {
  const { user, profile } = useAuth();
  const { primaryRole } = useRolePermissions();

  if (!user || !profile) {
    return <DashboardSkeleton />;
  }

  // Route to appropriate dashboard based on primary role
  switch (primaryRole) {
    case 'admin':
    case 'super_admin':
      return <AdminDashboard userProfile={profile} />;
    
    case 'innovator':
      return <InnovatorDashboard userProfile={profile} />;
    
    case 'expert':
    case 'evaluator':
      return <ExpertDashboard userProfile={profile} />;
    
    case 'partner':
    case 'stakeholder':
      return <PartnerDashboard userProfile={profile} />;
    
    default:
      return <UserDashboard userProfile={profile} />;
  }
};
```

## 👑 Role-Based Dashboard Interfaces

### 🔧 Admin Dashboard

**Location**: `src/components/dashboard/AdminDashboard.tsx`

#### System Management Interface
```typescript
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

const AdminDashboard = ({ userProfile }: { userProfile: UserProfile }) => {
  const {
    systemMetrics,
    userStatistics,
    challengeOverview,
    securityAlerts,
    recentActivity
  } = useAdminDashboard();

  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <SystemHealthCards metrics={systemMetrics} />
      
      {/* User & Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={userStatistics.totalUsers}
          change={userStatistics.userGrowth}
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Challenges"
          value={challengeOverview.activeChallenges}
          change={challengeOverview.challengeGrowth}
          icon={<Trophy className="h-4 w-4" />}
        />
        <MetricCard
          title="Security Score"
          value={`${systemMetrics.securityScore}/100`}
          change={systemMetrics.securityTrend}
          icon={<Shield className="h-4 w-4" />}
        />
        <MetricCard
          title="System Uptime"
          value={`${systemMetrics.uptime}%`}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      {/* Admin-specific Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminQuickActions />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <SecurityAlertsList alerts={securityAlerts} />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <AdminAnalyticsGrid />
    </div>
  );
};
```

#### Admin Quick Actions
```typescript
const AdminQuickActions = () => {
  const { hasPermission } = useRolePermissions();

  const adminActions = [
    {
      title: "User Management",
      description: "Manage user accounts and roles",
      href: "/admin/users",
      icon: <UserCog className="h-5 w-5" />,
      permission: "manage_users"
    },
    {
      title: "System Settings",
      description: "Configure platform settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      permission: "system_admin"
    },
    {
      title: "Security Audit",
      description: "Review security logs and alerts",
      href: "/admin/security",
      icon: <Shield className="h-5 w-5" />,
      permission: "security_admin"
    },
    {
      title: "Analytics Dashboard",
      description: "View detailed platform analytics",
      href: "/admin/analytics",
      icon: <BarChart className="h-5 w-5" />,
      permission: "view_analytics"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {adminActions
        .filter(action => hasPermission([action.permission]))
        .map(action => (
          <Button
            key={action.href}
            variant="outline"
            className="h-auto p-3 justify-start"
            asChild
          >
            <Link to={action.href}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{action.icon}</div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
    </div>
  );
};
```

### 💡 Innovator Dashboard

**Location**: `src/components/dashboard/InnovatorDashboard.tsx`

#### Innovation-Focused Interface
```typescript
import { useInnovatorDashboard } from '@/hooks/useInnovatorDashboard';

const InnovatorDashboard = ({ userProfile }: { userProfile: UserProfile }) => {
  const {
    mySubmissions,
    activeChallenges,
    recommendedChallenges,
    innovationScore,
    achievements,
    collaborationOpportunities
  } = useInnovatorDashboard(userProfile.id);

  return (
    <div className="space-y-6">
      {/* Personal Innovation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Innovation Score"
          value={innovationScore.current}
          change={innovationScore.trend}
          icon={<Lightbulb className="h-4 w-4" />}
        />
        <MetricCard
          title="Active Submissions"
          value={mySubmissions.active}
          icon={<Send className="h-4 w-4" />}
        />
        <MetricCard
          title="Achievements"
          value={achievements.total}
          icon={<Award className="h-4 w-4" />}
        />
      </div>

      {/* Challenge Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recommended Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecommendedChallengesList 
              challenges={recommendedChallenges} 
              userExpertise={userProfile.expertise_areas}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaboration Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CollaborationOpportunitiesList 
              opportunities={collaborationOpportunities}
            />
          </CardContent>
        </Card>
      </div>

      {/* My Innovation Journey */}
      <InnovationJourneyTimeline submissions={mySubmissions.all} />
    </div>
  );
};
```

### 🎓 Expert Dashboard

**Location**: `src/components/dashboard/ExpertDashboard.tsx`

#### Evaluation & Review Interface
```typescript
import { useExpertDashboard } from '@/hooks/useExpertDashboard';

const ExpertDashboard = ({ userProfile }: { userProfile: UserProfile }) => {
  const {
    pendingEvaluations,
    completedEvaluations,
    expertiseAreas,
    evaluationMetrics,
    mentorshipOpportunities
  } = useExpertDashboard(userProfile.id);

  return (
    <div className="space-y-6">
      {/* Expert Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Pending Reviews"
          value={pendingEvaluations.length}
          urgent={pendingEvaluations.length > 10}
          icon={<Clock className="h-4 w-4" />}
        />
        <MetricCard
          title="Completed This Month"
          value={completedEvaluations.thisMonth}
          icon={<CheckCircle className="h-4 w-4" />}
        />
        <MetricCard
          title="Expert Rating"
          value={evaluationMetrics.averageRating}
          icon={<Star className="h-4 w-4" />}
        />
        <MetricCard
          title="Mentees"
          value={mentorshipOpportunities.activeMentees}
          icon={<Users className="h-4 w-4" />}
        />
      </div>

      {/* Expert Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Evaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PendingEvaluationsList 
              evaluations={pendingEvaluations}
              expertiseAreas={expertiseAreas}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Evaluation Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EvaluationInsightsDashboard metrics={evaluationMetrics} />
          </CardContent>
        </Card>
      </div>

      {/* Mentorship & Knowledge Sharing */}
      <MentorshipDashboard 
        opportunities={mentorshipOpportunities}
        expertProfile={userProfile}
      />
    </div>
  );
};
```

### 🤝 Partner Dashboard

**Location**: `src/components/dashboard/PartnerDashboard.tsx`

#### Collaboration & Opportunity Interface
```typescript
import { usePartnerDashboard } from '@/hooks/usePartnerDashboard';

const PartnerDashboard = ({ userProfile }: { userProfile: UserProfile }) => {
  const {
    partnershipOpportunities,
    activeCollaborations,
    investmentOverview,
    innovationPipeline,
    partnerMetrics
  } = usePartnerDashboard(userProfile.id);

  return (
    <div className="space-y-6">
      {/* Partnership Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Partnerships"
          value={activeCollaborations.length}
          icon={<Handshake className="h-4 w-4" />}
        />
        <MetricCard
          title="Investment Pipeline"
          value={`$${investmentOverview.pipelineValue}M`}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="ROI"
          value={`${partnerMetrics.roi}%`}
          change={partnerMetrics.roiTrend}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <MetricCard
          title="Success Rate"
          value={`${partnerMetrics.successRate}%`}
          icon={<Target className="h-4 w-4" />}
        />
      </div>

      {/* Partnership Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5" />
              New Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PartnershipOpportunitiesList 
              opportunities={partnershipOpportunities}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Innovation Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InnovationPipelineView pipeline={innovationPipeline} />
          </CardContent>
        </Card>
      </div>

      {/* Collaboration Dashboard */}
      <PartnerCollaborationDashboard 
        collaborations={activeCollaborations}
        partnerProfile={userProfile}
      />
    </div>
  );
};
```

## 🎯 Shared Dashboard Components

### 📊 Metric Cards

**Location**: `src/components/dashboard/MetricCard.tsx`

```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
  urgent?: boolean;
  className?: string;
}

const MetricCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  urgent = false,
  className 
}: MetricCardProps) => (
  <Card className={cn(urgent && "border-destructive", className)}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>
          <p className={cn(
            "text-2xl font-bold",
            urgent && "text-destructive"
          )}>
            {value}
          </p>
          {change !== undefined && (
            <p className={cn(
              "text-xs",
              change > 0 ? "text-green-600" : "text-red-600"
            )}>
              {change > 0 ? "+" : ""}{change}%
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "p-2 rounded-full",
            urgent ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
          )}>
            {icon}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
```

### 🔔 Notification Center

**Location**: `src/components/dashboard/NotificationCenter.tsx`

```typescript
import { useNotifications } from '@/hooks/useNotifications';

const NotificationCenter = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={() => markAsRead(notification.id)}
              />
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

## 🔒 RBAC Implementation in Dashboards

### 🛡️ Permission-Based Content Rendering

```typescript
// Role-based content wrapper
const RoleBasedContent = ({ 
  requiredRoles = [], 
  requiredPermissions = [],
  fallback = null,
  children 
}: {
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const { hasRole, hasPermission } = useRolePermissions();
  
  const hasRequiredRole = requiredRoles.length === 0 || 
    requiredRoles.some(role => hasRole([role]));
  
  const hasRequiredPermission = requiredPermissions.length === 0 || 
    requiredPermissions.some(permission => hasPermission([permission]));
  
  if (hasRequiredRole && hasRequiredPermission) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

// Usage in dashboard components
const ConditionalAdminSection = () => (
  <RoleBasedContent 
    requiredRoles={['admin', 'super_admin']}
    fallback={<AccessDeniedMessage />}
  >
    <AdminOnlyComponent />
  </RoleBasedContent>
);
```

### 🎛️ Dynamic Dashboard Configuration

```typescript
// Dashboard configuration based on roles
const getDashboardConfig = (userRoles: UserRole[]) => {
  const config = {
    widgets: [],
    quickActions: [],
    navigationItems: []
  };

  // Admin widgets
  if (userRoles.includes('admin')) {
    config.widgets.push(
      'system-health',
      'user-analytics',
      'security-dashboard',
      'performance-metrics'
    );
    config.quickActions.push(
      'manage-users',
      'system-settings',
      'backup-data'
    );
  }

  // Innovator widgets
  if (userRoles.includes('innovator')) {
    config.widgets.push(
      'innovation-score',
      'recommended-challenges',
      'submission-status',
      'achievement-progress'
    );
    config.quickActions.push(
      'submit-idea',
      'join-challenge',
      'view-submissions'
    );
  }

  // Expert widgets
  if (userRoles.includes('expert')) {
    config.widgets.push(
      'pending-evaluations',
      'evaluation-metrics',
      'expertise-matches',
      'mentorship-opportunities'
    );
    config.quickActions.push(
      'evaluate-submission',
      'mentor-innovator',
      'share-expertise'
    );
  }

  return config;
};
```

## 📱 Responsive Dashboard Design

### 📊 Mobile-First Dashboard Layout

```typescript
const ResponsiveDashboard = ({ userProfile }: { userProfile: UserProfile }) => {
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  
  return (
    <div className="container mx-auto p-4">
      {/* Mobile: Stacked layout */}
      {isMobile ? (
        <div className="space-y-4">
          <MobileMetricsCarousel />
          <MobileQuickActions />
          <MobileContentTabs />
        </div>
      ) : (
        /* Desktop: Grid layout */
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <MetricsGrid />
            <MainContent />
          </div>
          <div className="col-span-4">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      )}
    </div>
  );
};
```

---

*Dashboard Components: 25+ documented | Role Types: 8 supported | RBAC: ✅ Fully Integrated | Mobile: ✅ Responsive*