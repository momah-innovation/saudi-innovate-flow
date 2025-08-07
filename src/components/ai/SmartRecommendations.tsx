import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { useAIFeatures } from '@/hooks/useAIFeatures';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { supabase } from '@/integrations/supabase/client';

interface Recommendation {
  id: string;
  type: 'challenge' | 'opportunity' | 'partner' | 'idea';
  title: string;
  description: string;
  confidence_score: number;
  reason: string;
  action_url?: string;
  metadata?: Record<string, any>;
}

interface SmartRecommendationsProps {
  userId?: string;
  context?: 'dashboard' | 'profile' | 'challenge' | 'idea';
  limit?: number;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  userId,
  context = 'dashboard',
  limit = 5,
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFeatureEnabled } = useAIFeatures();
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    if (isFeatureEnabled('smart_partner_matching')) {
      loadRecommendations();
    } else {
      setLoading(false);
    }
  }, [userId, context]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      
      // In real implementation, this would call an AI service
      // For now, we'll generate mock recommendations based on user context
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'challenge' as const,
          title: 'تحدي المدن الذكية الجديد',
          description: 'تحدي مثالي يتماشى مع خبرتك في التكنولوجيا',
          confidence_score: 0.89,
          reason: 'يتطابق مع مهاراتك في الذكاء الاصطناعي وإنترنت الأشياء',
          action_url: '/challenges/smart-cities',
        },
        {
          id: '2',
          type: 'partner' as const,
          title: 'شراكة مع جامعة الملك عبدالله',
          description: 'فرصة تعاون في مجال البحث والتطوير',
          confidence_score: 0.84,
          reason: 'خلفيتك الأكاديمية تتماشى مع أهداف الجامعة',
          action_url: '/partners/kaust',
        },
        {
          id: '3',
          type: 'opportunity' as const,
          title: 'مشروع تطوير تطبيق الخدمات الحكومية',
          description: 'فرصة لتطوير حلول مبتكرة للخدمات الرقمية',
          confidence_score: 0.78,
          reason: 'خبرتك في تطوير التطبيقات تجعلك مرشحاً مثالياً',
          action_url: '/opportunities/gov-app',
        },
        {
          id: '4',
          type: 'idea' as const,
          title: 'فكرة مشابهة: نظام إدارة الطوارئ',
          description: 'قد تستفيد من دراسة هذه الفكرة المشابهة',
          confidence_score: 0.72,
          reason: 'تتشارك نفس المفاهيم التقنية مع فكرتك الحالية',
          action_url: '/ideas/emergency-management',
        },
        {
          id: '5',
          type: 'challenge' as const,
          title: 'تحدي الاستدامة البيئية',
          description: 'تحدي جديد في مجال التكنولوجيا الخضراء',
          confidence_score: 0.67,
          reason: 'اهتمامك بالتكنولوجيا المستدامة واضح من نشاطك',
          action_url: '/challenges/sustainability',
        },
      ].slice(0, limit);

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'challenge': return Lightbulb;
      case 'opportunity': return TrendingUp;
      case 'partner': return Users;
      case 'idea': return Sparkles;
      default: return Sparkles;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'challenge': return 'bg-blue-100 text-blue-800';
      case 'opportunity': return 'bg-green-100 text-green-800';
      case 'partner': return 'bg-purple-100 text-purple-800';
      case 'idea': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'challenge': return t('smart_recommendations.type_challenge');
      case 'opportunity': return t('smart_recommendations.type_opportunity');
      case 'partner': return t('smart_recommendations.type_partner');
      case 'idea': return t('smart_recommendations.type_idea');
      default: return t('smart_recommendations.type_idea');
    }
  };

  if (!isFeatureEnabled('smart_partner_matching')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {t('smart_recommendations.title')}
          </CardTitle>
          <CardDescription>
            {t('smart_recommendations.feature_disabled')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('smart_recommendations.enable_feature')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {t('smart_recommendations.title')}
        </CardTitle>
        <CardDescription>
          {t('smart_recommendations.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('smart_recommendations.no_recommendations')}
            </p>
            <Button variant="outline" className="mt-4" onClick={loadRecommendations}>
              {t('smart_recommendations.retry')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((recommendation) => {
              const IconComponent = getTypeIcon(recommendation.type);
              
              return (
                <div key={recommendation.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className={getTypeColor(recommendation.type)}>
                            {getTypeName(recommendation.type)}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(recommendation.confidence_score * 100)}% {t('smart_recommendations.match_percentage')}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium mb-1">
                          {recommendation.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {recommendation.description}
                        </p>
                        <div className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-1">
                          💡 {recommendation.reason}
                        </div>
                      </div>
                    </div>
                    {recommendation.action_url && (
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full" onClick={loadRecommendations}>
                <Sparkles className="h-4 w-4 mr-2" />
                {t('smart_recommendations.refresh_recommendations')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};