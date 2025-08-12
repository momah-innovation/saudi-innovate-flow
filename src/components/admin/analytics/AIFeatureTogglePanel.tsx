import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Bot, 
  Zap, 
  DollarSign, 
  TrendingUp,
  Settings,
  BarChart3,
  Users
} from 'lucide-react';

interface AIFeatureTogglePanelProps {
  className?: string;
}

const AIFeatureTogglePanel: React.FC<AIFeatureTogglePanelProps> = ({ className }) => {
  const [features, setFeatures] = useState([
    {
      id: 'challenge_assist',
      name: 'مساعد التحديات',
      nameEn: 'Challenge Assistant',
      description: 'مساعدة ذكية في إنشاء وتحسين التحديات',
      enabled: true,
      usageCount: 1547,
      costThisMonth: 234.50,
      tier: 'premium'
    },
    {
      id: 'idea_evaluation',
      name: 'تقييم الأفكار',
      nameEn: 'Idea Evaluation',
      description: 'تحليل وتقييم الأفكار المقترحة تلقائياً',
      enabled: true,
      usageCount: 892,
      costThisMonth: 145.30,
      tier: 'basic'
    },
    {
      id: 'smart_matching',
      name: 'المطابقة الذكية',
      nameEn: 'Smart Matching',
      description: 'ربط المستخدمين بالفرص المناسبة',
      enabled: false,
      usageCount: 0,
      costThisMonth: 0,
      tier: 'premium'
    },
    {
      id: 'content_generation',
      name: 'توليد المحتوى',
      nameEn: 'Content Generation',
      description: 'إنشاء محتوى تلقائي للحملات والتحديات',
      enabled: true,
      usageCount: 2156,
      costThisMonth: 478.90,
      tier: 'enterprise'
    }
  ]);

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const handleFeatureToggle = (featureId: string, enabled: boolean) => {
    setFeatures(prev => prev.map(feature =>
      feature.id === featureId ? { ...feature, enabled } : feature
    ));
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'destructive';
      case 'premium': return 'default';
      case 'basic': return 'outline';
      default: return 'secondary';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'مؤسسية';
      case 'premium': return 'مميزة';
      case 'basic': return 'أساسية';
      default: return tier;
    }
  };

  const totalCost = features.reduce((sum, feature) => sum + feature.costThisMonth, 0);
  const activeFeatures = features.filter(f => f.enabled).length;
  const totalUsage = features.reduce((sum, feature) => sum + feature.usageCount, 0);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            لوحة تحكم خدمات الذكاء الاصطناعي
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">آخر 7 أيام</SelectItem>
                <SelectItem value="30d">آخر 30 يوم</SelectItem>
                <SelectItem value="90d">آخر 90 يوم</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">{activeFeatures}</div>
            <p className="text-sm text-muted-foreground">خدمات نشطة</p>
          </div>
          <div className="bg-success/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success">{totalUsage.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">إجمالي الاستخدام</p>
          </div>
          <div className="bg-warning/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-warning">${totalCost.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">التكلفة الشهرية</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">94.2%</div>
            <p className="text-sm text-muted-foreground">معدل النجاح</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الخدمة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>الاستخدام</TableHead>
                <TableHead>التكلفة</TableHead>
                <TableHead>المستوى</TableHead>
                <TableHead>الإعدادات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{feature.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {feature.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={feature.enabled}
                        onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked)}
                      />
                      <Badge variant={feature.enabled ? 'default' : 'outline'}>
                        {feature.enabled ? 'نشط' : 'متوقف'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {feature.usageCount.toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="font-semibold">
                        ${feature.costThisMonth.toFixed(2)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTierBadgeVariant(feature.tier)}>
                      {getTierLabel(feature.tier)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* AI Performance Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              اتجاهات الاستخدام
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>هذا الشهر</span>
                <span className="text-success font-semibold">+23%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>الشهر الماضي</span>
                <span className="text-muted-foreground">4,892 استخدام</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              رضا المستخدمين
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>التقييم العام</span>
                <span className="text-success font-semibold">4.7/5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>معدل الاستخدام المتكرر</span>
                <span className="text-muted-foreground">78%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            تحسين الأداء
          </Button>
          <Button variant="outline" size="sm">
            <DollarSign className="w-4 h-4 mr-2" />
            إدارة الميزانية
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            تقرير مفصل
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIFeatureTogglePanel;