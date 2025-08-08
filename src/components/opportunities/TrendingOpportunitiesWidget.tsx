import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

import { TrendingOpportunitiesWidgetProps } from '@/types/opportunities';

export const TrendingOpportunitiesWidget = ({ opportunities }: TrendingOpportunitiesWidgetProps) => {
  const { isRTL } = useDirection();

  if (!opportunities?.length) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <TrendingUp className="w-5 h-5 text-orange-500" />
          {isRTL ? 'الفرص الرائجة' : 'Trending Opportunities'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities.map((opportunity, index) => (
          <div key={opportunity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-shrink-0">
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium text-sm line-clamp-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                {opportunity.title_ar}
              </h4>
              <div className={`flex items-center gap-2 mt-1 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Users className="w-3 h-3" />
                <span>{Number(opportunity.applications_count) || 0}</span>
                <DollarSign className="w-3 h-3 ml-2" />
                <span>{(opportunity.budget_max as number) ? `${(opportunity.budget_max as number).toLocaleString()}` : 'TBD'}</span>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full">
          <ArrowRight className="w-4 h-4 mr-2" />
          {isRTL ? 'عرض المزيد' : 'View More'}
        </Button>
      </CardContent>
    </Card>
  );
};