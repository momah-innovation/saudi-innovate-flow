import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MessageSquare, Bell, Activity, Video, FileText, Calendar, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CollaborationProvider } from '@/components/collaboration';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';

export const CollaborationLandingPage: React.FC = () => {
  const collaborationFeatures = [
    {
      icon: Users,
      title: 'حضور المستخدمين',
      description: 'شاهد من متصل ويعمل في الوقت الفعلي',
      color: 'bg-blue-500/10 text-blue-600',
      link: '#presence'
    },
    {
      icon: MessageSquare,
      title: 'المراسلة المباشرة',
      description: 'تواصل مع الفرق والخبراء فوراً',
      color: 'bg-green-500/10 text-green-600',
      link: '#messaging'
    },
    {
      icon: Bell,
      title: 'الإشعارات الذكية',
      description: 'تنبيهات مخصصة للأنشطة المهمة',
      color: 'bg-orange-500/10 text-orange-600',
      link: '#notifications'
    },
    {
      icon: Activity,
      title: 'تتبع الأنشطة',
      description: 'مراقبة التقدم والتفاعلات',
      color: 'bg-purple-500/10 text-purple-600',
      link: '#activity'
    },
    {
      icon: FileText,
      title: 'التحرير التشاركي',
      description: 'تعديل المستندات والأفكار معاً',
      color: 'bg-indigo-500/10 text-indigo-600',
      link: '#documents'
    },
    {
      icon: Calendar,
      title: 'تنسيق الفعاليات',
      description: 'تخطيط وإدارة الفعاليات التشاركية',
      color: 'bg-pink-500/10 text-pink-600',
      link: '#events'
    }
  ];

  const useCaseScenarios = [
    {
      title: 'ورش الابتكار',
      description: 'جلسات عصف ذهني تفاعلية مع فرق متعددة',
      participants: '50+ مشارك',
      features: ['تتبع الحضور المباشر', 'مراسلة جماعية', 'تشارك المستندات']
    },
    {
      title: 'مراجعة الخبراء',
      description: 'تقييم الأفكار من قبل لجان الخبراء',
      participants: '3-5 خبراء',
      features: ['قنوات خاصة للخبراء', 'تنسيق التقييم', 'إشعارات المراجعة']
    },
    {
      title: 'التخطيط عبر الإدارات',
      description: 'تنسيق المشاريع بين الإدارات المختلفة',
      participants: 'فرق متعددة',
      features: ['قنوات خاصة بالإدارات', 'تخطيط المشاريع', 'تتبع المعالم']
    },
    {
      title: 'تعاون الشركاء',
      description: 'العمل مع الشركاء الخارجيين',
      participants: 'فرق داخلية وخارجية',
      features: ['إدارة المستخدمين الخارجيين', 'مساحات آمنة', 'سير عمل الشراكات']
    }
  ];

  return (
    <CollaborationProvider>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">منصة التعاون المباشر</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            تواصل وتعاون مع الفرق والخبراء في الوقت الفعلي لتطوير الأفكار والمشاريع الابتكارية
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">تواصل فوري</Badge>
            <Badge variant="secondary">تتبع الحضور</Badge>
            <Badge variant="secondary">تحرير مشترك</Badge>
            <Badge variant="secondary">إشعارات ذكية</Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collaborationFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 rounded-lg ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={feature.link}>استكشف الميزة</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Use Case Scenarios */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">سيناريوهات الاستخدام</h2>
            <p className="text-muted-foreground">اكتشف كيف يمكن للتعاون المباشر تحسين سير العمل في مؤسستك</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCaseScenarios.map((scenario, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{scenario.title}</CardTitle>
                    <Badge variant="outline">{scenario.participants}</Badge>
                  </div>
                  <CardDescription className="text-base">{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-muted-foreground">الميزات المتاحة:</h4>
                    <ul className="space-y-1">
                      {scenario.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <Globe className="w-4 h-4 text-primary ml-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Collaboration Demo */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">تجربة التعاون المباشر</h2>
            <p className="text-muted-foreground">جرب ميزات التعاون في الوقت الفعلي الآن</p>
          </div>
          
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-6 h-6 text-primary" />
                مساحة التعاون التفاعلية
              </CardTitle>
              <CardDescription>
                تفاعل مع المستخدمين الآخرين في الوقت الفعلي واختبر جميع ميزات التعاون
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WorkspaceCollaboration
                workspaceType="user"
                entityId="collaboration-demo"
                showWidget={true}
                showPresence={true}
                showActivity={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="bg-muted/30 rounded-lg p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">ابدأ التعاون الآن</h3>
          <p className="text-muted-foreground">انضم إلى مساحات التعاون أو أنشئ مساحة جديدة لفريقك</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/dashboard">الذهاب إلى لوحة التحكم</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/help">دليل الاستخدام</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/workspace/user">مساحة العمل الشخصية</Link>
            </Button>
          </div>
        </div>
      </div>
    </CollaborationProvider>
  );
};

export default CollaborationLandingPage;