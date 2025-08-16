import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home, Settings, Users, Target, Calendar, BarChart3, Building, UserCheck, Lightbulb, Briefcase, Shield } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { cn } from '@/lib/utils';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

interface BreadcrumbConfig {
  label: string;
  labelAr: string;
  path?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Removed static configuration - now defined inside component

// Dynamic route patterns for challenge details, etc.
const dynamicRoutePatterns = [
  {
    pattern: /^\/admin\/challenges\/([^\/]+)$/,
    getConfig: (match: RegExpMatchArray) => ({
      label: `Challenge Details`,
      labelAr: `تفاصيل التحدي`,
      icon: Target
    })
  }
];

interface AdminBreadcrumbProps {
  className?: string;
  maxItems?: number;
}

export function AdminBreadcrumb({ className, maxItems = 4 }: AdminBreadcrumbProps) {
  const location = useLocation();
  const { isRTL, language } = useDirection();
  const { t } = useUnifiedTranslation();

  // Move route config inside component to access t function
  const getAdminRouteConfig = (): Record<string, BreadcrumbConfig> => ({
    '/admin': {
      label: 'Admin Dashboard',
      labelAr: 'لوحة التحكم الإدارية',
      path: '/admin/dashboard',
      icon: Home
    },
    '/admin/organizational-structure': {
      label: t('navigation.breadcrumbs.organizational_structure'),
      labelAr: t('navigation.breadcrumbs.organizational_structure'),
      icon: Building
    },
    '/admin/evaluation-management': {
      label: t('navigation.breadcrumbs.evaluation_management'),
      labelAr: t('navigation.breadcrumbs.evaluation_management'),
      icon: Target
    },
    '/admin/relationships': {
      label: t('navigation.breadcrumbs.relationship_overview'),
      labelAr: t('navigation.breadcrumbs.relationship_overview'),
      icon: Users
    },
    '/admin/dashboard': {
      label: t('navigation.breadcrumbs.admin_dashboard'),
      labelAr: t('navigation.breadcrumbs.admin_dashboard'),
      icon: BarChart3
    },
    '/admin/challenges': {
      label: t('navigation.breadcrumbs.challenges_management'),
      labelAr: t('navigation.breadcrumbs.challenges_management'),
      icon: Target
    },
    '/admin/users': {
      label: t('navigation.breadcrumbs.users_management'),
      labelAr: t('navigation.breadcrumbs.users_management'),
      icon: Users
    },
    '/admin/events': {
      label: t('navigation.breadcrumbs.events_management'),
      labelAr: t('navigation.breadcrumbs.events_management'),
      icon: Calendar
    },
    '/admin/ideas': {
      label: t('navigation.breadcrumbs.ideas_management'),
      labelAr: t('navigation.breadcrumbs.ideas_management'),
      icon: Lightbulb
    },
    '/admin/campaigns': {
      label: t('navigation.breadcrumbs.campaigns_management'),
      labelAr: t('navigation.breadcrumbs.campaigns_management'),
      icon: Briefcase
    },
    '/admin/core-team': {
      label: t('navigation.breadcrumbs.core_team_management'),
      labelAr: t('navigation.breadcrumbs.core_team_management'),
      icon: UserCheck
    },
    '/admin/teams': {
      label: t('navigation.breadcrumbs.teams_management'),
      labelAr: t('navigation.breadcrumbs.teams_management'),
      icon: Users
    },
    '/admin/sectors': {
      label: t('navigation.breadcrumbs.sectors_management'),
      labelAr: t('navigation.breadcrumbs.sectors_management'),
      icon: Building
    },
    '/admin/stakeholders': {
      label: t('navigation.breadcrumbs.stakeholders_management'),
      labelAr: t('navigation.breadcrumbs.stakeholders_management'),
      icon: Users
    },
    '/admin/evaluations': {
      label: t('navigation.breadcrumbs.evaluations_management'),
      labelAr: t('navigation.breadcrumbs.evaluations_management'),
      icon: Target
    },
    '/admin/partners': {
      label: t('navigation.breadcrumbs.partners_management'),
      labelAr: t('navigation.breadcrumbs.partners_management'),
      icon: Building
    },
    '/admin/expert-assignments': {
      label: t('navigation.breadcrumbs.expert_assignments'),
      labelAr: t('navigation.breadcrumbs.expert_assignments'),
      icon: UserCheck
    },
    '/admin/system-settings': {
      label: t('navigation.breadcrumbs.system_settings'),
      labelAr: t('navigation.breadcrumbs.system_settings'),
      icon: Settings
    },
    '/admin/access-control': {
      label: t('navigation.breadcrumbs.access_control'),
      labelAr: t('navigation.breadcrumbs.access_control'),
      icon: Shield
    },
    '/admin/security-advanced': {
      label: t('navigation.breadcrumbs.security_advanced'),
      labelAr: t('navigation.breadcrumbs.security_advanced'),
      icon: Shield
    },
    '/admin/access-control-advanced': {
      label: t('navigation.breadcrumbs.access_control_advanced'),
      labelAr: t('navigation.breadcrumbs.access_control_advanced'),
      icon: Shield
    },
    '/admin/elevation-monitor': {
      label: t('navigation.breadcrumbs.elevation_monitor'),
      labelAr: t('navigation.breadcrumbs.elevation_monitor'),
      icon: Shield
    },
    '/admin/analytics-advanced': {
      label: t('navigation.breadcrumbs.analytics_advanced'),
      labelAr: t('navigation.breadcrumbs.analytics_advanced'),
      icon: BarChart3
    },
    '/admin/ai-management': {
      label: t('navigation.breadcrumbs.ai_management'),
      labelAr: t('navigation.breadcrumbs.ai_management'),
      icon: Settings
    },
    '/admin/file-management-advanced': {
      label: t('navigation.breadcrumbs.file_management_advanced'),
      labelAr: t('navigation.breadcrumbs.file_management_advanced'),
      icon: Settings
    },
    '/admin/challenges-analytics-advanced': {
      label: t('navigation.breadcrumbs.challenges_analytics_advanced'),
      labelAr: t('navigation.breadcrumbs.challenges_analytics_advanced'),
      icon: Target
    }
  });

  const adminRouteConfig = getAdminRouteConfig();

  const generateBreadcrumbs = (): BreadcrumbConfig[] => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    let breadcrumbs: BreadcrumbConfig[] = [];

    // Always start with Admin Dashboard
    breadcrumbs = [...breadcrumbs, {
      label: 'Admin Dashboard',
      labelAr: 'لوحة التحكم الإدارية',
      path: '/admin/dashboard',
      icon: Home
    }];

    // Check for exact route match first
    if (adminRouteConfig[path] && path !== '/admin/dashboard') {
      breadcrumbs = [...breadcrumbs, adminRouteConfig[path]];
      return breadcrumbs;
    }

    // Check dynamic patterns
    for (const { pattern, getConfig } of dynamicRoutePatterns) {
      const match = path.match(pattern);
      if (match) {
        // Add the parent route if it exists
        const parentPath = '/' + segments.slice(0, -1).join('/');
        if (adminRouteConfig[parentPath]) {
          breadcrumbs = [...breadcrumbs, adminRouteConfig[parentPath]];
        }
        
        // Add the dynamic route
        breadcrumbs = [...breadcrumbs, getConfig(match)];
        return breadcrumbs;
      }
    }

    // Build breadcrumbs from segments
    let currentPath = '';
    for (let i = 0; i < segments.length; i++) {
      currentPath += '/' + segments[i];
      
      // Skip the first 'admin' segment as we already added dashboard
      if (i === 0 && segments[i] === 'admin') continue;
      
      const config = adminRouteConfig[currentPath];
      if (config && currentPath !== '/admin/dashboard') {
        breadcrumbs = [...breadcrumbs, config];
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Limit breadcrumbs if maxItems is specified
  const displayBreadcrumbs = breadcrumbs.length > maxItems 
    ? [breadcrumbs[0], ...breadcrumbs.slice(-maxItems + 1)]
    : breadcrumbs;

  const showEllipsis = breadcrumbs.length > maxItems;

  const getLabel = (config: BreadcrumbConfig) => {
    return language === 'ar' ? config.labelAr : config.label;
  };

  return (
    <Breadcrumb className={cn("mb-6", className)}>
      <BreadcrumbList className={cn(isRTL && "flex-row-reverse")}>
        {showEllipsis && displayBreadcrumbs.length > 1 && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link 
                  to={displayBreadcrumbs[0].path || '#'}
                  className="flex items-center gap-2"
                >
                  {displayBreadcrumbs[0].icon && (
                    React.createElement(displayBreadcrumbs[0].icon, { className: "w-4 h-4" })
                  )}
                  {getLabel(displayBreadcrumbs[0])}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <span className="text-muted-foreground">...</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
            </BreadcrumbSeparator>
          </>
        )}

        {displayBreadcrumbs.map((config, index) => {
          const isLast = index === displayBreadcrumbs.length - 1;
          const isFirst = index === 0;
          
          // Skip first item if we're showing ellipsis
          if (showEllipsis && isFirst) return null;

          return (
            <div key={`breadcrumb-${index}`} className="contents">
              {index > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                </BreadcrumbSeparator>
              )}
              
              <BreadcrumbItem>
                {!isLast && config.path ? (
                  <BreadcrumbLink asChild>
                    <Link 
                      to={config.path}
                      className="flex items-center gap-2 hover:text-foreground transition-colors"
                    >
                      {config.icon && (
                        React.createElement(config.icon, { className: "w-4 h-4" })
                      )}
                      {getLabel(config)}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="flex items-center gap-2 font-medium">
                    {config.icon && (
                      React.createElement(config.icon, { className: "w-4 h-4" })
                    )}
                    {getLabel(config)}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}