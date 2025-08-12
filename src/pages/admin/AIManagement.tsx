import React from 'react';
import { AdminPageWrapper } from '@/components/admin/AdminPageWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, TrendingUp, DollarSign, Zap, Settings, Users } from 'lucide-react';
import AIFeatureTogglePanel from '@/components/admin/analytics/AIFeatureTogglePanel';

const AIManagement: React.FC = () => {
  // Mock AI service health data
  const mockAIServices = [
    { name: 'مساعد التحديات', status: 'healthy', uptime: '99.9%', responseTime: '120ms' },
    { name: 'تقييم الأفكار', status: 'healthy', uptime: '99.7%', responseTime: '85ms' },
    { name: 'المطابقة الذكية', status: 'degraded', uptime: '97.2%', responseTime: '340ms' },
    { name: 'توليد المحتوى', status: 'healthy', uptime: '99.8%', responseTime: '200ms' }
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'healthy': return 'default';
      case 'degraded': return 'destructive';
      case 'offline': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'healthy': return 'سليم';
      case 'degraded': return 'بطيء';
      case 'offline': return 'متوقف';
      default: return status;
    }
  };

  return (
    <AdminPageWrapper
      title="إدارة خدمات الذكاء الاصطناعي"
      description="مراقبة وإدارة جميع خدمات الذكاء الاصطناعي والتحكم في استهلاك الموارد"
    >
      <div className="space-y-6">
        {/* AI Service Health Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    خدمات نشطة
                  </p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Bot className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    التكلفة الشهرية
                  </p>
                  <p className="text-2xl font-bold">$1,247</p>
                </div>
                <DollarSign className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    الطلبات اليومية
                  </p>
                  <p className="text-2xl font-bold">8,543</p>
                </div>
                <Zap className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    مستخدمون نشطون
                  </p>
                  <p className="text-2xl font-bold">342</p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Service Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              حالة الخدمات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockAIServices.map((service, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{service.name}</h3>
                    <Badge variant={getStatusBadgeVariant(service.status)}>
                      {getStatusLabel(service.status)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span>وقت التشغيل: </span>
                      <span className="font-semibold">{service.uptime}</span>
                    </div>
                    <div>
                      <span>زمن الاستجابة: </span>
                      <span className="font-semibold">{service.responseTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Feature Toggle Panel */}
        <AIFeatureTogglePanel />

        {/* Cost Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              تحسين التكاليف
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <h3 className="font-medium text-success mb-2">توفير الشهر الماضي</h3>
                <p className="text-2xl font-bold text-success">$284</p>
                <p className="text-sm text-muted-foreground mt-1">
                  عبر تحسين نماذج الذكاء الاصطناعي
                </p>
              </div>
              
              <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                <h3 className="font-medium text-warning mb-2">استهلاك مرتفع</h3>
                <p className="text-2xl font-bold text-warning">توليد المحتوى</p>
                <p className="text-sm text-muted-foreground mt-1">
                  يستهلك 38% من الميزانية
                </p>
              </div>
              
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h3 className="font-medium text-primary mb-2">التوقعات المالية</h3>
                <p className="text-2xl font-bold text-primary">$1,420</p>
                <p className="text-sm text-muted-foreground mt-1">
                  التكلفة المتوقعة الشهر القادم
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageWrapper>
  );
};

export default AIManagement;