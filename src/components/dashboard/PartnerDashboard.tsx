import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake, Briefcase, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useNavigate } from 'react-router-dom';
import { navigationHandler } from '@/utils/unified-navigation';
import { useUnifiedDashboardData } from '@/hooks/useUnifiedDashboardData';

interface PartnerDashboardProps {
  userProfile: any;
  canManageOpportunities: boolean;
  canViewPartnerDashboard: boolean;
}

export function PartnerDashboard({ userProfile, canManageOpportunities, canViewPartnerDashboard }: PartnerDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);
  
  const { data: unifiedData } = useUnifiedDashboardData('partner');

  // Use real partner stats from unified data
  const partnerStats = [
    {
      title: language === 'ar' ? 'الفرص النشطة' : 'Active Opportunities',
      value: unifiedData.partnerStats.activePartnerships.toString(),
      icon: Target,
      color: 'text-success'
    },
    {
      title: language === 'ar' ? 'الشراكات' : 'Partnerships',
      value: unifiedData.partnerStats.supportedProjects.toString(),
      icon: Handshake,
      color: 'text-info'
    },
    {
      title: language === 'ar' ? 'معدل النجاح' : 'Success Rate',
      value: `${unifiedData.partnerStats.partnershipScore}%`,
      icon: TrendingUp,
      color: 'text-primary'
    }
  ];

  const partnerActions = [
    {
      title: language === 'ar' ? 'إدارة الفرص' : 'Manage Opportunities',
      description: language === 'ar' ? 'إنشاء وإدارة فرص الاستثمار' : 'Create and manage investment opportunities',
      action: () => navigationHandler.navigateTo('/partner/opportunities'),
      show: canManageOpportunities
    },
    {
      title: language === 'ar' ? 'لوحة الشريك' : 'Partner Dashboard',
      description: language === 'ar' ? 'عرض إحصائيات الشراكة المفصلة' : 'View detailed partnership statistics',
      action: () => navigationHandler.navigateTo('/partner/dashboard'),
      show: canViewPartnerDashboard
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Handshake className="w-6 h-6" />
          <h2 className="text-xl font-bold">
            {language === 'ar' ? 'لوحة الشريك' : 'Partner Dashboard'}
          </h2>
        </div>
        <p className="text-white/80">
          {language === 'ar' 
            ? `أهلاً بك ${userProfile?.display_name} - إدارة الشراكات والفرص`
            : `Welcome ${userProfile?.display_name} - Managing partnerships and opportunities`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {partnerStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 transition-colors ${stat.color || 'text-muted-foreground group-hover:text-primary'}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color || 'text-foreground'}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {index === 0 ? (language === 'ar' ? '+2 جديدة' : '+2 new') : 
                   index === 1 ? (language === 'ar' ? 'نشطة' : 'active') :
                   (language === 'ar' ? 'معدل ممتاز' : 'excellent rate')}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {partnerActions.filter(action => action.show).map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                {action.title}
              </CardTitle>
              <Handshake className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2">
                {action.description}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3 w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                onClick={action.action}
              >
                <ArrowRight className="w-3 h-3 mr-2" />
                {language === 'ar' ? 'الوصول للواجهة' : 'Access Interface'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}