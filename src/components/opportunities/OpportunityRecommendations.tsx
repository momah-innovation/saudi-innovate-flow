import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Clock, Target, ArrowRight } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useRTLAware } from '@/hooks/useRTLAware';

interface OpportunityRecommendationsProps {
  opportunities: any[];
}

export const OpportunityRecommendations = ({ opportunities }: OpportunityRecommendationsProps) => {
  const { isRTL } = useDirection();
  const { me } = useRTLAware();

  if (!opportunities?.length) return null;

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return isRTL ? 'منتهي' : 'Expired';
    if (diffDays === 1) return isRTL ? 'غداً' : 'Tomorrow';
    if (diffDays <= 7) return `${diffDays} ${isRTL ? 'أيام' : 'days'}`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          {isRTL ? 'موصى لك' : 'Recommended for You'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
            <div className="space-y-2">
              <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <h4 className={`font-medium text-sm line-clamp-2 flex-1 ${isRTL ? 'text-end' : 'text-start'}`}>
                   {opportunity.title_ar}
                 </h4>
                 <Badge variant="secondary" className={me('2')}>
                   {isRTL ? 'جديد' : 'New'}
                 </Badge>
              </div>
              
              <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-3 h-3" />
                <span>{formatDeadline(opportunity.deadline)}</span>
              </div>
              
              <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Target className="w-3 h-3" />
                <span className="line-clamp-1">{opportunity.opportunity_type}</span>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full">
          <ArrowRight className="w-4 h-4 mr-2" />
          {isRTL ? 'عرض التوصيات' : 'View All Recommendations'}
        </Button>
      </CardContent>
    </Card>
  );
};