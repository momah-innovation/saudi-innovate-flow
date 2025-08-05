import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { useAIFeatures } from '@/hooks/useAIFeatures';
import { supabase } from '@/integrations/supabase/client';
import { useRTLAware } from '@/hooks/useRTLAware';
import { useTranslation } from '@/hooks/useAppTranslation';

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
  const { me } = useRTLAware();
  const { t } = useTranslation();

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
          title: t('new_smart_cities_challenge'),
          description: t('perfect_challenge_tech_expertise'),
          confidence_score: 0.89,
          reason: t('matches_ai_iot_skills'),
          action_url: '/challenges/smart-cities',
        },
        {
          id: '2',
          type: 'partner' as const,
          title: t('partnership_kaust'),
          description: t('research_development_collaboration'),
          confidence_score: 0.84,
          reason: t('academic_background_matches'),
          action_url: '/partners/kaust',
        },
        {
          id: '3',
          type: 'opportunity' as const,
          title: t('gov_app_development_project'),
          description: t('opportunity_innovative_digital_solutions'),
          confidence_score: 0.78,
          reason: t('app_development_expertise_ideal'),
          action_url: '/opportunities/gov-app',
        },
        {
          id: '4',
          type: 'idea' as const,
          title: t('similar_idea_emergency_system'),
          description: t('benefit_studying_similar_idea'),
          confidence_score: 0.72,
          reason: t('shares_technical_concepts'),
          action_url: '/ideas/emergency-management',
        },
        {
          id: '5',
          type: 'challenge' as const,
          title: t('environmental_sustainability_challenge'),
          description: t('new_green_technology_challenge'),
          confidence_score: 0.67,
          reason: t('sustainable_tech_interest_clear'),
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
      case 'challenge': return 'badge-info';
      case 'opportunity': return 'badge-success';
      case 'partner': return 'badge-partner';
      case 'idea': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'challenge': return t('challenge');
      case 'opportunity': return t('opportunity');
      case 'partner': return t('partner');
      case 'idea': return t('idea');
      default: return t('recommendation');
    }
  };

  if (!isFeatureEnabled('smart_partner_matching')) {
    return (
      <Card>
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          {t('smart_recommendations') || 'التوصيات الذكية'}
        </CardTitle>
        <CardDescription>
          {t('smart_recommendations_unavailable') || 'ميزة التوصيات الذكية غير متاحة حالياً'}
        </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {t('enable_smart_recommendations') || 'يرجى تفعيل ميزة التوصيات الذكية من إعداداتك'}
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
          {t('smart_recommendations') || 'التوصيات الذكية'}
        </CardTitle>
        <CardDescription>
          {t('discover_opportunities') || 'اكتشف الفرص والتحديات المناسبة لك بناءً على نشاطك واهتماماتك'}
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
              {t('no_recommendations') || 'لا توجد توصيات متاحة حالياً'}
            </p>
            <Button variant="outline" className="mt-4" onClick={loadRecommendations}>
              {t('retry') || 'إعادة المحاولة'}
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
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(recommendation.confidence_score * 100)}% {t('match')}
                            </span>
                          </div>
                        </div>
                        <h4 className="text-sm font-medium mb-1">
                          {recommendation.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {recommendation.description}
                        </p>
                        <div className="text-xs text-info bg-info/10 rounded px-2 py-1">
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
                <Sparkles className={`h-4 w-4 ${me('2')}`} />
                {t('update_recommendations')}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};