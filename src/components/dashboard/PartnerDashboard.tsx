
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

export const PartnerDashboard = React.memo(function PartnerDashboard({ userProfile, canManageOpportunities, canViewPartnerDashboard }: PartnerDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();
  
  // Initialize navigation handler
  React.useEffect(() => {
    navigationHandler.setNavigate(navigate);
  }, [navigate]);
  
  // FIX: also get isLoading from the hook result
  const { data: unifiedData, isLoading } = useUnifiedDashboardData('partner');

  // Safe access to partner stats with correct keys and fallbacks
  const partnerStats = React.useMemo(() => {
    const stats = unifiedData?.partnerStats || {
      activePartnerships: 0,
      partnershipOpportunities: 0,
      collaborationScore: 0,
      totalInvestment: 0
    };

    return [
      {
        // Previously "Active Opportunities" mapped to a non-existent field; align to active partnerships
        title: language === 'ar' ? 'الشراكات النشطة' : 'Active Partnerships',
        value: String(stats.activePartnerships ?? 0),
        icon: Handshake,
        color: 'text-success'
      },
      {
        // Use partnershipOpportunities from hook
        title: language === 'ar' ? 'فرص الشراكة' : 'Partnership Opportunities',
        value: String(stats.partnershipOpportunities ?? 0),
        icon: Target,
        color: 'text-info'
      },
      {
        // Use collaborationScore from hook
        title: language === 'ar' ? 'درجة التعاون' : 'Collaboration Score',
        value: `${stats.collaborationScore ?? 0}%`,
        icon: TrendingUp,
        color: 'text-primary'
      }
    ];
  }, [unifiedData?.partnerStats, language]);

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

  // FIX: use isLoading instead of unifiedData?.isLoading
  if (isLoading) {
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
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

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
            ? `أهلاً بك ${userProfile?.display_name || 'الشريك'} - إدارة الشراكات والفرص`
            : `Welcome ${userProfile?.display_name || 'Partner'} - Managing partnerships and opportunities`}
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
});
