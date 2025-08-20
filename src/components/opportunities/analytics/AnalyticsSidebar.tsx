import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  BarChart3, 
  Users, 
  Globe, 
  TrendingUp, 
  Target,
  Activity,
  Settings,
  FileText
} from 'lucide-react';

interface AnalyticsSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

export const AnalyticsSidebar = ({ 
  activeSection, 
  onSectionChange, 
  className = '' 
}: AnalyticsSidebarProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  const sidebarSections = [
    {
      id: 'overview',
      icon: BarChart3,
      label: t('opportunities:analytics_sidebar.section_labels.overview'),
      description: t('opportunities:analytics_sidebar.section_descriptions.overview')
    },
    {
      id: 'engagement',
      icon: Activity,
      label: t('opportunities:analytics_sidebar.section_labels.engagement'),
      description: t('opportunities:analytics_sidebar.section_descriptions.engagement')
    },
    {
      id: 'applications',
      icon: Users,
      label: t('opportunities:analytics_sidebar.section_labels.applications'),
      description: t('opportunities:analytics_sidebar.section_descriptions.applications'),
      badge: t('opportunities:analytics_sidebar.badge_hot')
    },
    {
      id: 'geographic',
      icon: Globe,
      label: t('opportunities:analytics_sidebar.section_labels.geographic'),
      description: t('opportunities:analytics_sidebar.section_descriptions.geographic')
    },
    {
      id: 'performance',
      icon: TrendingUp,
      label: t('opportunities:analytics_sidebar.section_labels.performance'),
      description: t('opportunities:analytics_sidebar.section_descriptions.performance')
    },
    {
      id: 'advanced',
      icon: Target,
      label: t('opportunities:analytics_sidebar.section_labels.advanced'),
      description: t('opportunities:analytics_sidebar.section_descriptions.advanced')
    }
  ];

  return (
    <div className={cn('w-64 bg-muted/30 border-r p-4 space-y-2', className)}>
      <div className="mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          {t('opportunities:analytics_sidebar.sections')}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t('opportunities:analytics_sidebar.select_section')}
        </p>
      </div>

      <nav className="space-y-1">
        {sidebarSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <Button
              key={section.id}
              variant={isActive ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-auto py-3 px-3 text-left',
                isActive && 'bg-primary text-primary-foreground shadow-sm',
                !isActive && 'hover:bg-muted'
              )}
              onClick={() => onSectionChange(section.id)}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">
                    {section.label}
                  </span>
                  {section.badge && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {section.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs opacity-70 mt-0.5 truncate">
                  {section.description}
                </p>
              </div>
            </Button>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 pt-4 border-t border-border/50">
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">
          {t('opportunities:analytics_sidebar.quick_stats')}
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>{t('opportunities:analytics_sidebar.last_updated')}</span>
            <span className="text-muted-foreground">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t('opportunities:analytics_sidebar.time_period')}</span>
            <span className="text-muted-foreground">30d</span>
          </div>
        </div>
      </div>
    </div>
  );
};
