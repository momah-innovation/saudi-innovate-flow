import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Activity } from 'lucide-react';

interface RateLimitMonitorProps {
  className?: string;
}

const RateLimitMonitor: React.FC<RateLimitMonitorProps> = ({ className }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          مراقب حدود المعدل
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
          </div>
          <div className="bg-destructive/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-sm text-muted-foreground">تجاوزات الحد</p>
          </div>
          <div className="bg-warning/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-warning">12</div>
            <p className="text-sm text-muted-foreground">مستخدمين نشطين</p>
          </div>
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-primary">5</div>
            <p className="text-sm text-muted-foreground">أنواع الإجراءات</p>
          </div>
        </div>
        
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-2" />
          <p>لا توجد تجاوزات حديثة</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RateLimitMonitor;