import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDirection } from '@/components/ui/direction-provider';
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

const sidebarSections = [
  {
    id: 'overview',
    icon: BarChart3,
    labelEn: 'Overview',
    labelAr: 'نظرة عامة',
    description: 'Key metrics and trends'
  },
  {
    id: 'engagement',
    icon: Activity,
    labelEn: 'Engagement',
    labelAr: 'التفاعل',
    description: 'User interaction data'
  },
  {
    id: 'applications',
    icon: Users,
    labelEn: 'Applications',
    labelAr: 'الطلبات',
    description: 'Application analytics',
    badge: 'Hot'
  },
  {
    id: 'geographic',
    icon: Globe,
    labelEn: 'Geographic',
    labelAr: 'جغرافي',
    description: 'Location-based insights'
  },
  {
    id: 'performance',
    icon: TrendingUp,
    labelEn: 'Performance',
    labelAr: 'الأداء',
    description: 'Performance metrics'
  },
  {
    id: 'advanced',
    icon: Target,
    labelEn: 'Advanced',
    labelAr: 'متقدم',
    description: 'Deep analytics'
  }
];

export const AnalyticsSidebar = ({ 
  activeSection, 
  onSectionChange, 
  className = '' 
}: AnalyticsSidebarProps) => {
  const { isRTL } = useDirection();

  return (
    <div className={cn('w-64 bg-muted/30 border-r p-4 space-y-2', className)}>
      <div className="mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
          <FileText className="w-5 h-5 text-primary" />
          {isRTL ? 'أقسام التحليل' : 'Analytics Sections'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isRTL ? 'اختر قسم لعرض التفاصيل' : 'Select a section to view details'}
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
                    {isRTL ? section.labelAr : section.labelEn}
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
          {isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span>{isRTL ? 'آخر تحديث:' : 'Last updated:'}</span>
            <span className="text-muted-foreground">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{isRTL ? 'الفترة الزمنية:' : 'Time period:'}</span>
            <span className="text-muted-foreground">30d</span>
          </div>
        </div>
      </div>
    </div>
  );
};