import React, { useState } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  Calendar, 
  MessageSquare,
  Settings,
  BarChart3,
  FileText,
  UserPlus
} from 'lucide-react';

interface OrganizationWorkspaceProps {
  organizationId?: string;
}

export const OrganizationWorkspace: React.FC<OrganizationWorkspaceProps> = ({
  organizationId = 'org-1'
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock organization data
  const organizationData = {
    name: 'الهيئة العامة للابتكار',
    description: 'قيادة التحول الرقمي والابتكار في المملكة العربية السعودية',
    memberCount: 156,
    departmentCount: 12,
    activeProjects: 24,
    totalBudget: 15500000
  };

  const quickActions = [
    { icon: UserPlus, label: 'إضافة عضو', variant: 'default' as const, onClick: () => {} },
    { icon: MessageSquare, label: 'إرسال إعلان', variant: 'outline' as const, onClick: () => {} },
    { icon: FileText, label: 'تقرير جديد', variant: 'outline' as const, onClick: () => {} },
    { icon: Settings, label: 'إعدادات المؤسسة', variant: 'outline' as const, onClick: () => {} }
  ];

  const stats = [
    { label: 'إجمالي الأعضاء', value: '156', icon: Users, trend: 'up' as const },
    { label: 'الأقسام', value: '12', icon: Building2, trend: 'neutral' as const },
    { label: 'المشاريع النشطة', value: '24', icon: Target, trend: 'up' as const },
    { label: 'الميزانية المخصصة', value: '15.5M ريال', icon: TrendingUp, trend: 'up' as const }
  ];

  const departments = [
    { id: '1', name: 'قسم التكنولوجيا المالية', head: 'أحمد السعيد', members: 23, budget: '3.2M' },
    { id: '2', name: 'قسم الذكاء الاصطناعي', head: 'فاطمة الأحمد', members: 18, budget: '4.1M' },
    { id: '3', name: 'قسم البيانات والتحليلات', head: 'محمد العلي', members: 15, budget: '2.8M' },
    { id: '4', name: 'قسم أمن المعلومات', head: 'سارة المحمد', members: 12, budget: '2.3M' }
  ];

  const recentActivities = [
    { id: '1', user: 'أحمد السعيد', action: 'أضاف مشروع جديد', target: 'منصة المدفوعات الرقمية', time: 'منذ 30 دقيقة' },
    { id: '2', user: 'فاطمة الأحمد', action: 'نشرت تقريراً', target: 'تقرير الذكاء الاصطناعي Q1', time: 'منذ ساعة' },
    { id: '3', user: 'محمد العلي', action: 'عدّل ميزانية', target: 'قسم البيانات', time: 'منذ ساعتين' },
    { id: '4', user: 'سارة المحمد', action: 'أكملت مراجعة', target: 'بروتوكول الأمان الجديد', time: 'منذ 3 ساعات' }
  ];

  return (
    <WorkspaceLayout
      title="مساحة عمل المؤسسة"
      description={organizationData.description}
      userRole="مدير المؤسسة"
      stats={stats}
      quickActions={quickActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="departments">الأقسام</TabsTrigger>
              <TabsTrigger value="projects">المشاريع</TabsTrigger>
              <TabsTrigger value="analytics">التحليلات</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    معلومات المؤسسة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">اسم المؤسسة</div>
                      <div className="font-medium">{organizationData.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">عدد الأعضاء</div>
                      <div className="font-medium">{organizationData.memberCount} عضو</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">عدد الأقسام</div>
                      <div className="font-medium">{organizationData.departmentCount} قسم</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">المشاريع النشطة</div>
                      <div className="font-medium">{organizationData.activeProjects} مشروع</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    أداء الأقسام
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{dept.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{dept.name}</div>
                            <div className="text-sm text-muted-foreground">رئيس القسم: {dept.head}</div>
                          </div>
                        </div>
                        <div className="text-left">
                          <Badge variant="secondary">{dept.members} عضو</Badge>
                          <div className="text-sm text-muted-foreground mt-1">{dept.budget}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="departments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إدارة الأقسام</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <Card key={dept.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{dept.name}</h3>
                              <p className="text-sm text-muted-foreground">رئيس القسم: {dept.head}</p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{dept.members} عضو</Badge>
                                <Badge variant="secondary">الميزانية: {dept.budget}</Badge>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              إدارة القسم
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>المشاريع النشطة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>سيتم عرض المشاريع النشطة هنا</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>تحليلات الأداء</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>سيتم عرض التحليلات والإحصائيات هنا</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                النشاطات الأخيرة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p>
                          <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                          <span className="text-primary">{activity.target}</span>
                        </p>
                        <p className="text-muted-foreground text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <WorkspaceCollaboration
            workspaceType="organization"
            entityId={organizationId}
            showWidget={true}
            showPresence={true}
            showActivity={true}
          />
        </div>
      </div>
    </WorkspaceLayout>
  );
};