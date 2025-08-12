import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Bell, 
  Shield, 
  Clock,
  CheckCircle
} from 'lucide-react';

interface SecurityAlertsPanelProps {
  className?: string;
}

const SecurityAlertsPanel: React.FC<SecurityAlertsPanelProps> = ({ className }) => {
  // Mock alerts for now
  const mockAlerts = [
    {
      id: 'alert-1',
      title: 'محاولة اختراق أمني',
      message: 'تم اكتشاف محاولة وصول غير مصرح من عدة IPs',
      severity: 'critical',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: 'active'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            تنبيهات الأمان
          </div>
          <Badge variant="outline">
            {mockAlerts.length} نشط
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {mockAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <p>لا توجد تنبيهات أمنية حالياً</p>
              </div>
            ) : (
              mockAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="p-4 rounded-lg border border-destructive/20 bg-destructive/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-destructive" />
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      حرج
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      منذ 5 دقائق
                    </div>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      تحقيق
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SecurityAlertsPanel;