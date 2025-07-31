import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface OpportunityAnalyticsDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunities: any[];
}

export const OpportunityAnalyticsDashboard = ({ 
  open, 
  onOpenChange, 
  opportunities 
}: OpportunityAnalyticsDashboardProps) => {
  const { isRTL } = useDirection();

  const stats = {
    totalOpportunities: opportunities.length,
    activeOpportunities: opportunities.filter(o => o.status === 'open').length,
    totalApplications: opportunities.reduce((sum, o) => sum + (o.applications_count || 0), 0),
    averageBudget: opportunities.length > 0 
      ? opportunities.reduce((sum, o) => sum + (o.budget_max || o.budget_min || 0), 0) / opportunities.length 
      : 0
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[80vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <BarChart3 className="w-5 h-5" />
            {isRTL ? 'تحليلات الفرص' : 'Opportunities Analytics'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Target className="w-4 h-4 text-blue-500" />
                  {isRTL ? 'إجمالي الفرص' : 'Total Opportunities'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOpportunities}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  {isRTL ? 'الفرص النشطة' : 'Active Opportunities'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.activeOpportunities}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Users className="w-4 h-4 text-purple-500" />
                  {isRTL ? 'إجمالي الطلبات' : 'Total Applications'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.totalApplications}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <DollarSign className="w-4 h-4 text-yellow-500" />
                  {isRTL ? 'متوسط الميزانية' : 'Average Budget'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.averageBudget.toLocaleString()} {isRTL ? 'ر.س' : 'SAR'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'أفضل الفرص أداءً' : 'Top Performing Opportunities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {opportunities
                  .sort((a, b) => (b.applications_count || 0) - (a.applications_count || 0))
                  .slice(0, 5)
                  .map((opportunity, index) => (
                    <div key={opportunity.id} className={`flex items-center justify-between p-3 rounded-lg border ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <div className="font-medium">{opportunity.title_ar}</div>
                          <div className="text-sm text-muted-foreground">
                            {opportunity.applications_count || 0} {isRTL ? 'طلب' : 'applications'}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {opportunity.status === 'open' ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'مغلق' : 'Closed')}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};