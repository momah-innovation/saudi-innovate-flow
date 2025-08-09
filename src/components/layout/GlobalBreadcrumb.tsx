import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface BreadcrumbConfig {
  key: string;
  labelKey: string;
  icon?: React.ComponentType<{ className?: string }>;
  path?: string;
  dynamic?: boolean;
}

const routeConfig: Record<string, BreadcrumbConfig[]> = {
  '/': [
    { key: 'home', labelKey: 'home', icon: Home, path: '/' }
  ],
  '/challenges': [
    { key: 'home', labelKey: 'home', icon: Home, path: '/' },
    { key: 'challenges', labelKey: 'challenges', path: '/challenges' }
  ],
  '/ideas': [
    { key: 'home', labelKey: 'home', icon: Home, path: '/' },
    { key: 'ideas', labelKey: 'ideas', path: '/ideas' }
  ],
  '/events': [
    { key: 'home', labelKey: 'home', icon: Home, path: '/' },
    { key: 'events', labelKey: 'events', path: '/events' }
  ],
  '/opportunities': [
    { key: 'home', labelKey: 'home', icon: Home, path: '/' },
    { key: 'opportunities', labelKey: 'opportunities', path: '/opportunities' }
  ],
  '/workspace': [
    { key: 'home', labelKey: 'home', icon: Home, path: '/' },
    { key: 'workspace', labelKey: 'workspace', path: '/workspace' }
  ],
  '/admin': [
    { key: 'home', labelKey: 'home', icon: Home, path: '/' },
    { key: 'admin', labelKey: 'admin_dashboard', path: '/admin' }
  ],
  '/profile': [
    { key: 'home', labelKey: 'home', icon: Home, path: '/' },
    { key: 'profile', labelKey: 'profile', path: '/profile' }
  ]
};

const dynamicRoutePatterns = [
  {
    pattern: /^\/challenges\/([^\/]+)$/,
    config: [
      { key: 'home', labelKey: 'home', icon: Home, path: '/' },
      { key: 'challenges', labelKey: 'challenges', path: '/challenges' },
      { key: 'challenge_details', labelKey: 'challenge_details', dynamic: true }
    ]
  },
  {
    pattern: /^\/ideas\/([^\/]+)$/,
    config: [
      { key: 'home', labelKey: 'home', icon: Home, path: '/' },
      { key: 'ideas', labelKey: 'ideas', path: '/ideas' },
      { key: 'idea_details', labelKey: 'idea_details', dynamic: true }
    ]
  },
  {
    pattern: /^\/events\/([^\/]+)$/,
    config: [
      { key: 'home', labelKey: 'home', icon: Home, path: '/' },
      { key: 'events', labelKey: 'events', path: '/events' },
      { key: 'event_details', labelKey: 'event_details', dynamic: true }
    ]
  },
  {
    pattern: /^\/workspace\/([^\/]+)$/,
    config: [
      { key: 'home', labelKey: 'home', icon: Home, path: '/' },
      { key: 'workspace', labelKey: 'workspace', path: '/workspace' },
      { key: 'workspace_details', labelKey: 'workspace_details', dynamic: true }
    ]
  }
];

interface GlobalBreadcrumbProps {
  className?: string;
  showHome?: boolean;
  maxItems?: number;
  customItems?: Array<{
    label: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
}

export function GlobalBreadcrumb({ 
  className, 
  showHome = true, 
  maxItems = 4,
  customItems 
}: GlobalBreadcrumbProps) {
  const location = useLocation();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();

  // If custom items provided, use them instead
  if (customItems) {
    return (
      <Breadcrumb className={cn("mb-4", className)}>
        <BreadcrumbList className={cn(isRTL && "flex-row-reverse")}>
          {customItems.map((item, index) => {
            const isLast = index === customItems.length - 1;
            const Icon = item.icon;

            return (
              <React.Fragment key={index}>
                {index > 0 && (
                  <BreadcrumbSeparator 
                    className={cn(isRTL && "rotate-180")}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </BreadcrumbSeparator>
                )}
                
                <BreadcrumbItem>
                  {item.href && !isLast ? (
                    <BreadcrumbLink 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-1 hover:text-foreground transition-colors",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className={cn(
                      "flex items-center gap-1 font-medium text-foreground",
                      isRTL && "flex-row-reverse"
                    )}>
                      {Icon && <Icon className="w-4 h-4" />}
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Get breadcrumb config for current route
  const getBreadcrumbConfig = (): BreadcrumbConfig[] => {
    const path = location.pathname;
    
    // Check exact matches first
    if (routeConfig[path]) {
      return routeConfig[path];
    }
    
    // Check dynamic route patterns
    for (const { pattern, config } of dynamicRoutePatterns) {
      if (pattern.test(path)) {
        return config;
      }
    }
    
    // Fallback to home
    return routeConfig['/'] || [];
  };

  const breadcrumbConfig = getBreadcrumbConfig();
  
  // Filter based on showHome setting
  const filteredConfig = showHome ? breadcrumbConfig : breadcrumbConfig.filter(item => item.key !== 'home');
  
  // Limit items if specified
  const displayConfig = maxItems && filteredConfig.length > maxItems 
    ? [
        ...filteredConfig.slice(0, 1),
        { key: 'ellipsis', labelKey: 'more', dynamic: true },
        ...filteredConfig.slice(-2)
      ]
    : filteredConfig;

  return (
    <Breadcrumb className={cn("mb-4", className)}>
      <BreadcrumbList className={cn(isRTL && "flex-row-reverse")}>
        {displayConfig.map((item, index) => {
          const isLast = index === displayConfig.length - 1;
          const Icon = item.icon;
          const label = item.key === 'ellipsis' ? '...' : t(item.labelKey);

          return (
            <React.Fragment key={item.key}>
              {index > 0 && (
                <BreadcrumbSeparator 
                  className={cn(isRTL && "rotate-180")}
                >
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
              )}
              
              <BreadcrumbItem>
                {item.path && !isLast && item.key !== 'ellipsis' ? (
                  <Link to={item.path}>
                    <BreadcrumbLink 
                      className={cn(
                        "flex items-center gap-1 hover:text-foreground transition-colors",
                        isRTL && "flex-row-reverse"
                      )}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      {label}
                    </BreadcrumbLink>
                  </Link>
                ) : (
                  <BreadcrumbPage className={cn(
                    "flex items-center gap-1",
                    isLast ? "font-medium text-foreground" : "text-muted-foreground",
                    isRTL && "flex-row-reverse"
                  )}>
                    {Icon && <Icon className="w-4 h-4" />}
                    {label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default GlobalBreadcrumb;