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

// Admin route configurations with RTL/LTR labels
const adminRouteConfig: Record<string, BreadcrumbConfig> = {
  '/admin': {
    label: 'Admin Dashboard',
    labelAr: 'لوحة التحكم الإدارية',
    path: '/admin/dashboard',
    icon: Home
  },
  '/admin/organizational-structure': {
    label: 'Organizational Structure',
    labelAr: 'الهيكل التنظيمي',
    icon: Building
  },
  '/admin/evaluation-management': {
    label: 'Evaluation Management',
    labelAr: 'إدارة التقييم',
    icon: Target
  },
  '/admin/relationships': {
    label: 'Relationship Overview',
    labelAr: 'نظرة عامة على العلاقات',
    icon: Users
  },
  '/admin/dashboard': {
    label: 'Dashboard',
    labelAr: 'لوحة التحكم',
    icon: BarChart3
  },
  '/admin/challenges': {
    label: 'Challenges Management',
    labelAr: 'إدارة التحديات',
    icon: Target
  },
  '/admin/users': {
    label: 'Users Management',
    labelAr: 'إدارة المستخدمين',
    icon: Users
  },
  '/admin/events': {
    label: 'Events Management',
    labelAr: 'إدارة الفعاليات',
    icon: Calendar
  },
  '/admin/ideas': {
    label: 'Ideas Management',
    labelAr: 'إدارة الأفكار',
    icon: Lightbulb
  },
  '/admin/campaigns': {
    label: 'Campaigns Management',
    labelAr: 'إدارة الحملات',
    icon: Briefcase
  },
  '/admin/core-team': {
    label: 'Core Team Management',
    labelAr: 'إدارة الفريق الأساسي',
    icon: UserCheck
  },
  '/admin/teams': {
    label: 'Teams Management',
    labelAr: 'إدارة الفرق',
    icon: Users
  },
  '/admin/sectors': {
    label: 'Sectors Management',
    labelAr: 'إدارة القطاعات',
    icon: Building
  },
  '/admin/stakeholders': {
    label: 'Stakeholders Management',
    labelAr: 'إدارة أصحاب المصلحة',
    icon: Users
  },
  '/admin/evaluations': {
    label: 'Evaluations Management',
    labelAr: 'إدارة التقييمات',
    icon: Target
  },
  '/admin/partners': {
    label: 'Partners Management',
    labelAr: 'إدارة الشركاء',
    icon: Building
  },
  '/admin/expert-assignments': {
    label: 'Expert Assignments',
    labelAr: 'تعيينات الخبراء',
    icon: UserCheck
  },
  '/admin/system-settings': {
    label: 'System Settings',
    labelAr: 'إعدادات النظام',
    icon: Settings
  },
  '/admin/access-control': {
    label: 'Access Control',
    labelAr: 'التحكم في الوصول',
    icon: Shield
  }
};

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

  const generateBreadcrumbs = (): BreadcrumbConfig[] => {
    const path = location.pathname;
    console.log('🔍 AdminBreadcrumb Debug:', { path, segments: path.split('/').filter(Boolean) });
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbConfig[] = [];

    // Always start with Admin Dashboard
    breadcrumbs.push({
      label: 'Admin Dashboard',
      labelAr: 'لوحة التحكم الإدارية',
      path: '/admin/dashboard',
      icon: Home
    });

    // Check for exact route match first
    if (adminRouteConfig[path] && path !== '/admin/dashboard') {
      breadcrumbs.push(adminRouteConfig[path]);
      return breadcrumbs;
    }

    // Check dynamic patterns
    for (const { pattern, getConfig } of dynamicRoutePatterns) {
      const match = path.match(pattern);
      if (match) {
        // Add the parent route if it exists
        const parentPath = '/' + segments.slice(0, -1).join('/');
        if (adminRouteConfig[parentPath]) {
          breadcrumbs.push(adminRouteConfig[parentPath]);
        }
        
        // Add the dynamic route
        breadcrumbs.push(getConfig(match));
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
        breadcrumbs.push(config);
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