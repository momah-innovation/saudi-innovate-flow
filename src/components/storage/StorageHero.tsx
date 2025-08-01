import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  TrendingUp, 
  Files,
  Shield,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle2,
  HardDrive,
  Upload
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface StorageHeroProps {
  totalFiles: number;
  totalSize: number;
  usedSpace: number;
  totalSpace: number;
  publicFiles: number;
  privateFiles: number;
  recentUploads: number;
  buckets: number;
}

export const StorageHero = ({
  totalFiles,
  totalSize,
  usedSpace,
  totalSpace,
  publicFiles,
  privateFiles,
  recentUploads,
  buckets
}: StorageHeroProps) => {
  const { isRTL } = useDirection();

  const usagePercentage = (usedSpace / totalSpace) * 100;

  const metrics = [
    {
      title: isRTL ? 'إجمالي الملفات' : 'Total Files',
      value: totalFiles.toLocaleString(),
      icon: Files,
      trend: isRTL ? `+${recentUploads} اليوم` : `+${recentUploads} today`,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: isRTL ? 'حجم البيانات' : 'Total Size',
      value: `${(totalSize / 1024 / 1024 / 1024).toFixed(1)} GB`,
      icon: Database,
      trend: isRTL ? '+2.1 GB هذا الأسبوع' : '+2.1 GB this week',
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: isRTL ? 'المساحة المستخدمة' : 'Used Space',
      value: `${(usedSpace / 1024 / 1024 / 1024).toFixed(1)} GB`,
      icon: HardDrive,
      trend: `${usagePercentage.toFixed(1)}% ${isRTL ? 'من المساحة' : 'of capacity'}`,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: isRTL ? 'التحميلات اليوم' : 'Uploads Today',
      value: recentUploads.toLocaleString(),
      icon: Upload,
      trend: isRTL ? '+15% من أمس' : '+15% from yesterday',
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  const quickStats = [
    {
      label: isRTL ? 'ملفات عامة' : 'Public Files',
      value: publicFiles,
      icon: Activity,
      color: 'text-blue-600'
    },
    {
      label: isRTL ? 'ملفات خاصة' : 'Private Files',
      value: privateFiles,
      icon: Shield,
      color: 'text-purple-600'
    },
    {
      label: isRTL ? 'حاويات التخزين' : 'Storage Buckets',
      value: buckets,
      icon: Database,
      color: 'text-green-600'
    },
    {
      label: isRTL ? 'حالة النظام' : 'System Status',
      value: 'Healthy',
      icon: CheckCircle2,
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-all duration-300 hover-scale">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      {metric.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {metric.trend}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${metric.textColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            {isRTL ? 'استخدام مساحة التخزين' : 'Storage Usage'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>{isRTL ? 'المساحة المستخدمة' : 'Used Space'}</span>
              <span>{(usedSpace / 1024 / 1024 / 1024).toFixed(2)} GB of {(totalSpace / 1024 / 1024 / 1024).toFixed(0)} GB</span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{usagePercentage.toFixed(1)}% {isRTL ? 'مستخدم' : 'used'}</span>
              {usagePercentage > 80 && (
                <span className="text-orange-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {isRTL ? 'مساحة منخفضة' : 'Low storage'}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {isRTL ? 'إحصائيات سريعة' : 'Quick Stats'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center p-4 bg-muted/30 rounded-lg">
                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* File Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'توزيع أنواع الملفات' : 'File Type Distribution'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
              {isRTL ? 'صور' : 'Images'} ({Math.floor(totalFiles * 0.4)})
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
              {isRTL ? 'مستندات' : 'Documents'} ({Math.floor(totalFiles * 0.3)})
            </Badge>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
              {isRTL ? 'فيديو' : 'Videos'} ({Math.floor(totalFiles * 0.2)})
            </Badge>
            <Badge variant="destructive" className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400">
              {isRTL ? 'أخرى' : 'Others'} ({Math.floor(totalFiles * 0.1)})
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};