import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  Crown, 
  Shield, 
  Users, 
  Star, 
  Target,
  Lightbulb,
  Briefcase,
  Building,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkspaceHeroProps {
  userRole: string;
  userProfile?: any;
  stats: Array<{
    label: string;
    value: number | string;
    icon?: React.ComponentType<{ className?: string }>;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }>;
  quickActions?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: 'default' | 'secondary' | 'outline';
  }>;
  title: string;
  description: string;
}

export const EnhancedWorkspaceHero: React.FC<WorkspaceHeroProps> = ({
  userRole,
  userProfile,
  stats,
  quickActions = [],
  title,
  description
}) => {
  const { t, getDynamicText } = useUnifiedTranslation();

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          icon: Shield,
          gradient: 'from-red-500 via-pink-500 to-red-600',
          bgPattern: 'bg-gradient-to-br from-red-50 via-pink-50 to-red-100 dark:from-red-950/20 dark:via-pink-950/20 dark:to-red-900/20',
          iconBg: 'bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30',
          textColor: 'text-red-700 dark:text-red-300'
        };
      case 'expert':
        return {
          icon: Star,
          gradient: 'from-emerald-500 via-teal-500 to-emerald-600',
          bgPattern: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-emerald-900/20',
          iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30',
          textColor: 'text-emerald-700 dark:text-emerald-300'
        };
      case 'organization':
        return {
          icon: Building,
          gradient: 'from-blue-500 via-indigo-500 to-blue-600',
          bgPattern: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-blue-900/20',
          iconBg: 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30',
          textColor: 'text-blue-700 dark:text-blue-300'
        };
      case 'partner':
        return {
          icon: Briefcase,
          gradient: 'from-purple-500 via-violet-500 to-purple-600',
          bgPattern: 'bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 dark:from-purple-950/20 dark:via-violet-950/20 dark:to-purple-900/20',
          iconBg: 'bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30',
          textColor: 'text-purple-700 dark:text-purple-300'
        };
      case 'user':
      default:
        return {
          icon: Users,
          gradient: 'from-orange-500 via-amber-500 to-orange-600',
          bgPattern: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-orange-950/20 dark:via-amber-950/20 dark:to-orange-900/20',
          iconBg: 'bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30',
          textColor: 'text-orange-700 dark:text-orange-300'
        };
    }
  };

  const config = getRoleConfig(userRole);
  const RoleIcon = config.icon;
  const displayName = userProfile?.display_name || userProfile?.email?.split('@')[0] || 'User';

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border shadow-2xl",
      config.bgPattern
    )}>
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={cn(
          "absolute -top-4 -right-4 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br",
          config.gradient
        )} />
        <div className={cn(
          "absolute top-1/2 -left-8 w-24 h-24 rounded-full opacity-15 blur-xl bg-gradient-to-br",
          config.gradient
        )} />
        <div className={cn(
          "absolute bottom-4 right-1/3 w-16 h-16 rounded-full opacity-10 blur-lg bg-gradient-to-br",
          config.gradient
        )} />
      </div>

      <div className="relative z-10 p-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-4 rounded-2xl shadow-lg transition-transform hover:scale-105",
                config.iconBg
              )}>
                <RoleIcon className={cn("h-8 w-8", config.textColor)} />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent from-foreground to-muted-foreground">
                  {title}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-sm font-medium gradient-border hover-scale",
                      config.textColor
                    )}
                  >
                    {getDynamicText(userRole, userRole).toUpperCase()}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {t('workspace.welcome', { name: displayName })}
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              {description}
            </p>
          </div>

          {quickActions.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Button
                    key={index}
                    variant={action.variant || 'default'}
                    onClick={action.onClick}
                    className="flex items-center gap-2 hover-scale gradient-border group"
                  >
                    {IconComponent && (
                      <IconComponent className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    )}
                    {action.label}
                  </Button>
                );
              })}
            </div>
          )}
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon || TrendingUp;
            return (
              <Card 
                key={index} 
                className="gradient-border hover-scale group bg-background/50 backdrop-blur-sm border-0 shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent from-foreground to-primary group-hover:from-primary group-hover:to-primary/80 transition-all">
                        {stat.value}
                      </p>
                    </div>
                    <div className={cn(
                      "p-3 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-lg",
                      config.iconBg
                    )}>
                      <IconComponent className={cn("h-5 w-5", config.textColor)} />
                    </div>
                  </div>
                  
                  {stat.trend && (
                    <div className="flex items-center gap-2 mt-3">
                      <TrendingUp className={cn(
                        "h-3 w-3",
                        stat.trend === 'up' ? 'text-green-500' : 
                        stat.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                      )} />
                      <span className="text-xs text-muted-foreground">
                        {t('workspace.trend_' + stat.trend)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};