import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Clock, Target, ArrowRight } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

import { OpportunityRecommendationsProps } from '@/types/opportunities';

export const OpportunityRecommendations = ({ opportunities }: OpportunityRecommendationsProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  if (!opportunities?.length) return null;

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return t('opportunities:recommendations.expired');
    if (diffDays === 1) return t('opportunities:recommendations.tomorrow');
    if (diffDays <= 7) return t('opportunities:recommendations.days_remaining', { count: diffDays });
    return date.toLocaleDateString();
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          {t('opportunities:recommendations.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {opportunities.map((opportunity) => (
          <div key={opportunity.id} className="p-3 rounded-lg border border-muted hover:border-primary/20 transition-colors">
            <div className="space-y-2">
              <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h4 className={`font-medium text-sm line-clamp-2 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {opportunity.title_ar}
                </h4>
                <Badge variant="secondary" className="ml-2">
                  {t('opportunities:recommendations.new_badge')}
                </Badge>
              </div>
              
              <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Clock className="w-3 h-3" />
                <span>{formatDeadline(opportunity.deadline)}</span>
              </div>
              
              <div className={`flex items-center gap-2 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Target className="w-3 h-3" />
                <span className="line-clamp-1">{opportunity.opportunity_type as string}</span>
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full">
          <ArrowRight className="w-4 h-4 mr-2" />
          {t('opportunities:recommendations.view_all')}
        </Button>
      </CardContent>
    </Card>
  );
};
