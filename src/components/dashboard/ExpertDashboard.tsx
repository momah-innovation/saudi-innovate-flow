import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Brain, FileText, Clock, Award, ArrowRight } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useNavigate } from 'react-router-dom';
import { useUnifiedDashboardData } from '@/hooks/useUnifiedDashboardData';

interface ExpertDashboardProps {
  userProfile: any;
  canEvaluateIdeas: boolean;
  canAccessExpertTools: boolean;
}

export function ExpertDashboard({ userProfile, canEvaluateIdeas, canAccessExpertTools }: ExpertDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();
  const { data: unifiedData } = useUnifiedDashboardData('expert');

  // Use real expert stats from unified data
  const expertStats = [
    {
      title: language === 'ar' ? 'الأفكار المراجعة' : 'Ideas Reviewed',
      value: unifiedData.expertStats.completedEvaluations.toString(),
      icon: FileText,
      color: 'text-info'
    },
    {
      title: language === 'ar' ? 'قيد المراجعة' : 'Pending Review',
      value: unifiedData.expertStats.pendingEvaluations.toString(),
      icon: Clock,
      color: 'text-warning'
    },
    {
      title: language === 'ar' ? 'التقييم المتوسط' : 'Average Rating',
      value: unifiedData.expertStats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-success'
    }
  ];

  const expertActions = [
    {
      title: language === 'ar' ? 'تقييم الأفكار' : 'Evaluate Ideas',
      description: language === 'ar' ? 'مراجعة وتقييم الأفكار المرسلة' : 'Review and evaluate submitted ideas',
      action: () => navigate('/expert/evaluate'),
      show: canEvaluateIdeas
    },
    {
      title: language === 'ar' ? 'أدوات الخبير' : 'Expert Tools',
      description: language === 'ar' ? 'الوصول إلى أدوات التحليل المتقدمة' : 'Access advanced analysis tools',
      action: () => navigate('/expert/tools'),
      show: canAccessExpertTools
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-6 h-6" />
          <h2 className="text-xl font-bold">
            {language === 'ar' ? 'لوحة الخبير' : 'Expert Dashboard'}
          </h2>
        </div>
        <p className="text-white/80">
          {language === 'ar' 
            ? `مرحباً ${userProfile?.display_name} - دورك كخبير في تقييم الأفكار`
            : `Welcome ${userProfile?.display_name} - Your role as an expert in evaluating ideas`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {expertStats.map((stat, index) => {
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
                  {index === 0 ? (language === 'ar' ? '+3 هذا الأسبوع' : '+3 this week') : 
                   index === 1 ? (language === 'ar' ? 'يحتاج انتباه' : 'needs attention') :
                   (language === 'ar' ? 'متوسط ممتاز' : 'excellent average')}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {expertActions.filter(action => action.show).map((action, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale cursor-pointer group border-l-4 border-l-primary/20 hover:border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                {action.title}
              </CardTitle>
              <Brain className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
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