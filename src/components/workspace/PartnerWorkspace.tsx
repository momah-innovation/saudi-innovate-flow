import React, { useState } from 'react';
import { WorkspaceLayout } from './WorkspaceLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkspaceCollaboration } from '@/components/collaboration/WorkspaceCollaboration';
import { useWorkspaceTranslations } from '@/hooks/useWorkspaceTranslations';
import { 
  HandHeart, 
  Building, 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare,
  TrendingUp,
  DollarSign,
  Target,
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react';

interface PartnerWorkspaceProps {
  partnerId?: string;
}

export const PartnerWorkspace: React.FC<PartnerWorkspaceProps> = ({
  partnerId = 'partner-1'
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { tw } = useWorkspaceTranslations({
    workspaceType: 'partner',
    dynamicContent: true,
    fallbackStrategy: 'english'
  });

  // Mock partner data
  const partnerData = {
    name: 'شركة التقنية المتقدمة',
    type: 'شركة تقنية',
    industry: 'التكنولوجيا المالية',
    partnershipStart: '2023-01-15',
    totalProjects: 8,
    activeProjects: 3,
    totalInvestment: 5200000,
    partnershipLevel: 'استراتيجي'
  };

  const quickActions = [
    { icon: Plus, label: 'مشروع جديد', variant: 'default' as const, onClick: () => {} },
    { icon: MessageSquare, label: 'تواصل مباشر', variant: 'outline' as const, onClick: () => {} },
    { icon: FileText, label: 'عقد جديد', variant: 'outline' as const, onClick: () => {} },
    { icon: Settings, label: 'إعدادات الشراكة', variant: 'outline' as const, onClick: () => {} }
  ];

  const stats = [
    { label: 'مدة الشراكة', value: '18 شهراً', icon: HandHeart, trend: 'neutral' as const },
    { label: 'المشاريع النشطة', value: '3', icon: Target, trend: 'up' as const },
    { label: 'إجمالي الاستثمار', value: '5.2M ريال', icon: DollarSign, trend: 'up' as const },
    { label: 'معدل النجاح', value: '87%', icon: TrendingUp, trend: 'up' as const }
  ];

  const projects = [
    { 
      id: '1', 
      name: 'منصة المدفوعات الذكية', 
      status: 'قيد التطوير', 
      progress: 75, 
      budget: '2.1M', 
      deadline: '2024-03-15',
      team: ['أحمد', 'فاطمة', 'محمد']
    },
    { 
      id: '2', 
      name: 'نظام إدارة الهوية الرقمية', 
      status: 'اختبار', 
      progress: 90, 
      budget: '1.8M', 
      deadline: '2024-02-28',
      team: ['سارة', 'علي', 'مريم']
    },
    { 
      id: '3', 
      name: 'تطبيق الخدمات المصرفية', 
      status: 'تخطيط', 
      progress: 25, 
      budget: '3.2M', 
      deadline: '2024-06-30',
      team: ['خالد', 'نورا']
    }
  ];

  const communications = [
    { id: '1', type: 'اجتماع', title: 'مراجعة المشروع الأول', date: '2024-01-15 10:00', status: 'مقرر' },
    { id: '2', type: 'بريد', title: 'تحديث حالة التطوير', date: '2024-01-14 14:30', status: 'مرسل' },
    { id: '3', type: 'مكالمة', title: 'مناقشة الميزانية', date: '2024-01-13 16:00', status: 'مكتمل' },
    { id: '4', type: 'تقرير', title: 'تقرير الأداء الشهري', date: '2024-01-12 09:00', status: 'مراجعة' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'قيد التطوير': return 'bg-yellow-500';
      case 'اختبار': return 'bg-blue-500';
      case 'تخطيط': return 'bg-gray-500';
      case 'مكتمل': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <WorkspaceLayout
      title="مساحة عمل الشريك"
      description={`شراكة استراتيجية مع ${partnerData.name}`}
      userRole="مدير الشراكات"
      stats={stats}
      quickActions={quickActions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{tw('tabs.overview')}</TabsTrigger>
              <TabsTrigger value="projects">{tw('tabs.projects')}</TabsTrigger>
              <TabsTrigger value="communication">{tw('tabs.communication')}</TabsTrigger>
              <TabsTrigger value="contracts">{tw('tabs.contracts')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {tw('partner_info.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">اسم الشريك</div>
                      <div className="font-medium">{partnerData.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">نوع الشراكة</div>
                      <Badge variant="outline">{partnerData.partnershipLevel}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">القطاع</div>
                      <div className="font-medium">{partnerData.industry}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">بداية الشراكة</div>
                      <div className="font-medium">{new Date(partnerData.partnershipStart).toLocaleDateString('ar-SA')}</div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">تقييم الشراكة</span>
                      <span className="text-sm font-medium">ممتاز (87%)</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>المشاريع الحالية</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.slice(0, 2).map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{project.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {project.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">التقدم</span>
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2 mb-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>الميزانية: {project.budget}</span>
                          <span>الموعد النهائي: {new Date(project.deadline).toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    جميع المشاريع
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      مشروع جديد
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <Card key={project.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{project.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                              <span className="text-sm">{project.status}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-xs text-muted-foreground">الميزانية</div>
                              <div className="font-medium">{project.budget}</div>
                            </div>
                            <div>
                              <div className="text-xs text-muted-foreground">الموعد النهائي</div>
                              <div className="font-medium">{new Date(project.deadline).toLocaleDateString('ar-SA')}</div>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">التقدم</span>
                              <span className="text-xs font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, index) => (
                                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                  <AvatarFallback className="text-xs">{member.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ))}
                              {project.team.length > 3 && (
                                <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                  <span className="text-xs">+{project.team.length - 3}</span>
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              عرض
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communication" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    سجل التواصل
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communications.map((comm) => (
                      <div key={comm.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-lg">
                            <MessageSquare className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{comm.title}</div>
                            <div className="text-sm text-muted-foreground">{comm.date}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{comm.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>العقود والاتفاقيات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>سيتم عرض العقود والاتفاقيات هنا</p>
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
                الأحداث القادمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium text-sm">اجتماع مراجعة المشروع</div>
                  <div className="text-xs text-muted-foreground">غداً، 10:00 ص</div>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <div className="font-medium text-sm">عرض تقديمي للعميل</div>
                  <div className="text-xs text-muted-foreground">الخميس، 2:00 م</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <WorkspaceCollaboration
            workspaceType="partner"
            entityId={partnerId}
            showWidget={true}
            showPresence={true}
            showActivity={true}
          />
        </div>
      </div>
    </WorkspaceLayout>
  );
};