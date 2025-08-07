import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Brain, FileText, Clock, Award } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useNavigate } from 'react-router-dom';

interface ExpertDashboardProps {
  userProfile: any;
  canEvaluateIdeas: boolean;
  canAccessExpertTools: boolean;
}

export function ExpertDashboard({ userProfile, canEvaluateIdeas, canAccessExpertTools }: ExpertDashboardProps) {
  const { t, language } = useUnifiedTranslation();
  const navigate = useNavigate();

  const expertStats = [
    {
      title: language === 'ar' ? 'الأفكار المراجعة' : 'Ideas Reviewed',
      value: '24',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: language === 'ar' ? 'قيد المراجعة' : 'Pending Review',
      value: '5',
      icon: Clock,
      color: 'text-orange-600'
    },
    {
      title: language === 'ar' ? 'التقييم المتوسط' : 'Average Rating',
      value: '4.6',
      icon: Star,
      color: 'text-yellow-600'
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {expertStats.map((stat, index) => (
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
        {expertActions.filter(action => action.show).map((action, index) => (
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