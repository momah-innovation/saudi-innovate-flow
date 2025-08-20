import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Infinity,
  CreditCard,
  Calendar,
  Users,
  FileText,
  Brain,
  Upload
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { logger } from '@/utils/logger';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

export const SubscriptionManager = () => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { 
    subscriptionStatus, 
    loading, 
    subscriptionPlans, 
    createCheckoutSession, 
    cancelSubscription,
    refreshSubscription 
  } = useSubscription();
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setProcessingPlan(planId);
    try {
      const checkoutUrl = await createCheckoutSession(planId);
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      }
    } catch (error) {
      logger.error('Error creating checkout', { component: 'SubscriptionManager', action: 'createCheckout' }, error as Error);
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleCancel = async () => {
    const success = await cancelSubscription();
    if (success) {
      await refreshSubscription();
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('مميز')) {
      return Crown;
    }
    if (planName.toLowerCase().includes('enterprise') || planName.toLowerCase().includes('مؤسس')) {
      return Shield;
    }
    return Star;
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.includes('ideas') || feature.includes('أفكار')) return FileText;
    if (feature.includes('challenges') || feature.includes('تحديات')) return Zap;
    if (feature.includes('events') || feature.includes('فعاليات')) return Calendar;
    if (feature.includes('users') || feature.includes('مستخدم')) return Users;
    if (feature.includes('ai') || feature.includes('ذكي')) return Brain;
    if (feature.includes('upload') || feature.includes('رفع')) return Upload;
    return Check;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {t('subscription:loading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Subscription Status */}
      {subscriptionStatus && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Crown className="w-5 h-5 text-primary" />
              </div>
              {t('subscription:status.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {isRTL ? subscriptionStatus.planNameAr : subscriptionStatus.planNameEn}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('subscription:status.active_plan')}
                </p>
              </div>
              <Badge 
                variant={subscriptionStatus.hasSubscription ? "default" : "secondary"}
                className="text-sm"
              >
                {subscriptionStatus.hasSubscription 
                  ? t('subscription:status.active')
                  : t('subscription:status.free')
                }
              </Badge>
            </div>

            {subscriptionStatus.currentPeriodEnd && (
              <div className="text-sm text-muted-foreground">
                {t('subscription:status.expires_on')}
                {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString(
                  isRTL ? 'ar-SA' : 'en-US'
                )}
              </div>
            )}

            {/* Feature Usage */}
            {subscriptionStatus.features && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {Object.entries(subscriptionStatus.features).map(([key, value]) => {
                  const FeatureIcon = getFeatureIcon(key);
                  return (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <FeatureIcon className="w-4 h-4 text-primary" />
                      <span>{typeof value === 'number' && value === -1 ? '∞' : String(value)}</span>
                      <span className="text-muted-foreground truncate">
                        {key.replace(/_/g, ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {subscriptionStatus.hasSubscription && (
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="text-destructive hover:text-destructive"
                >
                  {t('subscription:actions.cancel')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {t('subscription:plans.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('subscription:plans.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => {
            const PlanIcon = getPlanIcon(plan.name || '');
            const isCurrentPlan = subscriptionStatus?.planNameEn === plan.name;
            const isProcessing = processingPlan === plan.id;

            return (
              <Card 
                key={plan.id}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
                  isCurrentPlan && "border-primary bg-primary/5"
                )}
              >
                {isCurrentPlan && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {t('subscription:status.current_plan')}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <PlanIcon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    {isRTL ? plan.name_ar : plan.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-primary">
                    {plan.price_monthly}
                    <span className="text-sm text-muted-foreground ml-1">
                      {plan.currency} {t('subscription:pricing.per_month')}
                    </span>
                  </div>
                  {plan.price_yearly && (
                    <div className="text-sm text-muted-foreground">
                      {t('subscription:pricing.or')} {plan.price_yearly} {plan.currency} {t('subscription:pricing.per_year')}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {isRTL ? plan.description_ar : plan.description}
                  </p>

                  {/* Features */}
                  {plan.features && (
                    <div className="space-y-2">
                      {Object.entries(plan.features).map(([feature, enabled]) => {
                        const FeatureIcon = getFeatureIcon(feature);
                        return (
                          <div key={feature} className="flex items-center gap-2">
                            {enabled ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <X className="w-4 h-4 text-muted-foreground" />
                            )}
                            <span className={cn(
                              "text-sm",
                              !enabled && "text-muted-foreground line-through"
                            )}>
                              {feature.replace(/_/g, ' ')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4">
                    {isCurrentPlan ? (
                      <Button className="w-full" disabled>
                        <Crown className="w-4 h-4 mr-2" />
                        {t('subscription:status.current_plan')}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                            {t('subscription:status.processing')}
                          </div>
                        ) : (
                          <>
                            <CreditCard className="w-4 h-4 mr-2" />
                            {t('subscription:actions.subscribe_now')}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <Button variant="outline" onClick={refreshSubscription}>
          {t('subscription:actions.refresh_status')}
        </Button>
      </div>
    </div>
  );
};
