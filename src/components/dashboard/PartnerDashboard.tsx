import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Handshake, Briefcase, TrendingUp, Target } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useAppTranslation';
import { useNavigate } from 'react-router-dom';

interface PartnerDashboardProps {
  userProfile: any;
  canManageOpportunities: boolean;
  canViewPartnerDashboard: boolean;
}

export function PartnerDashboard({ userProfile, canManageOpportunities, canViewPartnerDashboard }: PartnerDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();

  const partnerStats = [
    {
      title: language === 'ar' ? 'الفرص النشطة' : 'Active Opportunities',
      value: '8',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: language === 'ar' ? 'الشراكات' : 'Partnerships',
      value: '3',
      icon: Handshake,
      color: 'text-blue-600'
    },
    {
      title: language === 'ar' ? 'معدل النجاح' : 'Success Rate',
      value: '85%',
      icon: TrendingUp,
      color: 'text-purple-600'
    }
  ];

  const partnerActions = [
    {
      title: language === 'ar' ? 'إدارة الفرص' : 'Manage Opportunities',
      description: language === 'ar' ? 'إنشاء وإدارة فرص الاستثمار' : 'Create and manage investment opportunities',
      action: () => navigate('/partner/opportunities'),
      show: canManageOpportunities
    },
    {
      title: language === 'ar' ? 'لوحة الشريك' : 'Partner Dashboard',
      description: language === 'ar' ? 'عرض إحصائيات الشراكة المفصلة' : 'View detailed partnership statistics',
      action: () => navigate('/partner/dashboard'),
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {partnerStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partnerActions.filter(action => action.show).map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
            <CardHeader>
              <CardTitle className="text-base">{action.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
              <Button variant="outline" size="sm">
                {language === 'ar' ? 'انتقال' : 'Access'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}