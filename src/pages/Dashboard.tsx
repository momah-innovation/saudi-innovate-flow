import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useTranslation } from '@/hooks/useAppTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Lightbulb, 
  Calendar, 
  Users, 
  TrendingUp, 
  Award,
  Plus,
  ArrowRight,
  Zap,
  Globe,
  Brain
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRTLAware } from '@/hooks/useRTLAware';

export default function Dashboard() {
  const { t, language, isRTL } = useTranslation();
  const rtl = useRTLAware();

  const stats = [
    {
      title: 'Active Challenges',
      titleAr: 'التحديات النشطة',
      value: '24',
      change: '+12%',
      changeType: 'increase' as const,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'Submitted Ideas',
      titleAr: 'الأفكار المقدمة',
      value: '156',
      change: '+8%',
      changeType: 'increase' as const,
      icon: Lightbulb,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20'
    },
    {
      title: 'Upcoming Events',
      titleAr: 'الفعاليات القادمة',
      value: '12',
      change: '+3',
      changeType: 'increase' as const,
      icon: Calendar,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20'
    },
    {
      title: 'Active Innovators',
      titleAr: 'المبتكرون النشطون',
      value: '1,247',
      change: '+15%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      borderColor: 'border-accent/20'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'challenge',
      title: 'Smart Traffic Management System',
      titleAr: 'نظام إدارة المرور الذكي',
      status: 'new_submission',
      statusAr: 'مقترح جديد',
      time: '2 hours ago',
      timeAr: 'منذ ساعتين'
    },
    {
      id: 2,
      type: 'idea',
      title: 'Digital Healthcare Platform',
      titleAr: 'منصة الرعاية الصحية الرقمية',
      status: 'approved',
      statusAr: 'معتمد',
      time: '4 hours ago',
      timeAr: 'منذ 4 ساعات'
    },
    {
      id: 3,
      type: 'event',
      title: 'Innovation Hackathon 2024',
      titleAr: 'هاكاثون الابتكار 2024',
      status: 'registration_open',
      statusAr: 'التسجيل مفتوح',
      time: '1 day ago',
      timeAr: 'منذ يوم واحد'
    }
  ];

  const quickActions = [
    {
      title: 'Create Challenge',
      titleAr: 'إنشاء تحدي',
      description: 'Launch a new innovation challenge',
      descriptionAr: 'إطلاق تحدي ابتكار جديد',
      icon: Target,
      href: '/challenges/create',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Submit Idea',
      titleAr: 'تقديم فكرة',
      description: 'Share your innovative solution',
      descriptionAr: 'شارك حلك المبتكر',
      icon: Lightbulb,
      href: '/ideas/submit',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    },
    {
      title: 'Browse Events',
      titleAr: 'تصفح الفعاليات',
      description: 'Discover upcoming events',
      descriptionAr: 'اكتشف الفعاليات القادمة',
      icon: Calendar,
      href: '/events',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Join Community',
      titleAr: 'انضم للمجتمع',
      description: 'Connect with innovators',
      descriptionAr: 'تواصل مع المبتكرين',
      icon: Users,
      href: '/community',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ];

  return (
    <AppShell>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="p-3 rounded-full bg-primary/10 backdrop-blur-sm">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <Badge variant="secondary" className="text-sm font-medium">
                  {language === 'ar' ? 'منصة رواد للابتكار الحكومي' : 'Ruwad Government Innovation Platform'}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                {language === 'ar' ? 'مرحباً بك في رواد' : 'Welcome to Ruwad'}
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                {language === 'ar' 
                  ? 'منصة الابتكار الحكومي الرائدة في المملكة العربية السعودية. ابتكر، شارك، وطور حلولاً مبتكرة لتحديات المستقبل'
                  : 'The leading government innovation platform in Saudi Arabia. Innovate, collaborate, and develop cutting-edge solutions for future challenges'
                }
              </p>

              <div className="flex items-center justify-center gap-4 mb-12">
                <Button size="lg" className="px-8">
                  <Brain className={cn("h-5 w-5", rtl.mr("2"))} />
                  {language === 'ar' ? 'ابدأ الابتكار' : 'Start Innovating'}
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  <TrendingUp className={cn("h-5 w-5", rtl.mr("2"))} />
                  {language === 'ar' ? 'استكشف التحديات' : 'Explore Challenges'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className={cn(
                "relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg hover:scale-105",
                stat.borderColor
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                      "p-3 rounded-full",
                      stat.bgColor
                    )}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                    <Badge variant={stat.changeType === 'increase' ? 'default' : 'secondary'} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? stat.titleAr : stat.title}
                    </p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions'}
              </h2>
              <Button variant="ghost" size="sm">
                {language === 'ar' ? 'عرض الكل' : 'View All'}
                <ArrowRight className={cn("h-4 w-4", rtl.ml("2"))} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className={cn(
                      "inline-flex p-4 rounded-full text-white mb-4 transition-transform group-hover:scale-110",
                      action.color
                    )}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">
                      {language === 'ar' ? action.titleAr : action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {language === 'ar' ? action.descriptionAr : action.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Activities */}
          <section className="mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    {language === 'ar' ? 'النشاطات الأخيرة' : 'Recent Activities'}
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    {language === 'ar' ? 'عرض الكل' : 'View All'}
                    <ArrowRight className={cn("h-4 w-4", rtl.ml("2"))} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                      <div className="p-2 rounded-full bg-primary/10">
                        {activity.type === 'challenge' && <Target className="h-4 w-4 text-primary" />}
                        {activity.type === 'idea' && <Lightbulb className="h-4 w-4 text-primary" />}
                        {activity.type === 'event' && <Calendar className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          {language === 'ar' ? activity.titleAr : activity.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? activity.statusAr : activity.status}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {language === 'ar' ? activity.timeAr : activity.time}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Vision 2030 Section */}
          <section>
            <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Award className="h-8 w-8 text-primary" />
                  <h2 className="text-2xl font-bold">
                    {language === 'ar' ? 'رؤية المملكة 2030' : 'Saudi Vision 2030'}
                  </h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                  {language === 'ar'
                    ? 'نساهم في تحقيق رؤية المملكة 2030 من خلال تعزيز الابتكار والتحول الرقمي في القطاع الحكومي'
                    : 'Contributing to Saudi Vision 2030 by fostering innovation and digital transformation in the government sector'
                  }
                </p>
                <Button variant="outline" size="lg">
                  {language === 'ar' ? 'تعرف على المزيد' : 'Learn More'}
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </AppShell>
  );
}