import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { ChevronRight, Home, Users, Target, Building, Shield, UserCheck, Briefcase } from 'lucide-react';
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

interface WorkspaceBreadcrumbProps {
  className?: string;
  maxItems?: number;
}

export function WorkspaceBreadcrumb({ className, maxItems = 4 }: WorkspaceBreadcrumbProps) {
  const location = useLocation();
  const { type } = useParams<{ type: string }>();
  const { isRTL, language } = useDirection();
  const { t } = useUnifiedTranslation();

  // Workspace type configurations
  const getWorkspaceTypeConfig = (): Record<string, BreadcrumbConfig> => ({
    'user': {
      label: 'User Workspace',
      labelAr: 'مساحة العمل الشخصية',
      icon: Users
    },
    'expert': {
      label: 'Expert Workspace',
      labelAr: 'مساحة الخبراء',
      icon: UserCheck
    },
    'admin': {
      label: 'Admin Workspace',
      labelAr: 'مساحة إدارة النظام',
      icon: Shield
    },
    'team': {
      label: 'Team Workspace',
      labelAr: 'مساحة الفريق',
      icon: Users
    },
    'organization': {
      label: 'Organization Workspace',
      labelAr: 'مساحة المؤسسة',
      icon: Building
    },
    'partner': {
      label: 'Partner Workspace',
      labelAr: 'مساحة الشركاء',
      icon: Briefcase
    }
  });

  // Workspace sub-routes
  const getWorkspaceRouteConfig = (): Record<string, BreadcrumbConfig> => ({
    '/workspace': {
      label: t('navigation.breadcrumbs.workspaces'),
      labelAr: 'مساحات العمل',
      path: '/workspace',
      icon: Home
    },
    'ideas': {
      label: t('navigation.breadcrumbs.ideas'),
      labelAr: 'الأفكار',
      icon: Target
    },
    'challenges': {
      label: t('navigation.breadcrumbs.challenges'),
      labelAr: 'التحديات',
      icon: Target
    },
    'evaluations': {
      label: t('navigation.breadcrumbs.evaluations'),
      labelAr: 'التقييمات',
      icon: UserCheck
    },
    'bookmarks': {
      label: t('navigation.breadcrumbs.bookmarks'),
      labelAr: 'المفضلة',
      icon: Target
    },
    'projects': {
      label: t('navigation.breadcrumbs.projects'),
      labelAr: 'المشاريع',
      icon: Briefcase
    },
    'collaboration': {
      label: t('navigation.breadcrumbs.collaboration'),
      labelAr: 'التعاون',
      icon: Users
    },
    'analytics': {
      label: t('navigation.breadcrumbs.analytics'),
      labelAr: 'التحليلات',
      icon: Target
    }
  });

  const workspaceTypeConfig = getWorkspaceTypeConfig();
  const workspaceRouteConfig = getWorkspaceRouteConfig();

  const generateBreadcrumbs = (): BreadcrumbConfig[] => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    let breadcrumbs: BreadcrumbConfig[] = [];

    // Always start with Workspaces
    breadcrumbs.push(workspaceRouteConfig['/workspace']);

    // If we're on workspace root page without type
    if (segments.length === 1 && segments[0] === 'workspace') {
      return breadcrumbs;
    }

    // Add workspace type if it exists
    if (type && workspaceTypeConfig[type]) {
      breadcrumbs.push({
        ...workspaceTypeConfig[type],
        path: `/workspace/${type}`
      });
    }

    // Add sub-routes
    if (segments.length > 2) {
      for (let i = 2; i < segments.length; i++) {
        const segment = segments[i];
        const config = workspaceRouteConfig[segment];
        
        if (config) {
          const subPath = '/' + segments.slice(0, i + 1).join('/');
          breadcrumbs.push({
            ...config,
            path: subPath
          });
        }
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