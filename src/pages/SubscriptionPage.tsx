import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Crown, Star, Zap } from 'lucide-react';

export const SubscriptionPage = () => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-primary py-16">
        <div className="absolute inset-0 bg-[url('/dashboard-images/subscription-hero.jpg')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 overlay-primary" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-primary/10 backdrop-blur-sm rounded-xl border border-primary/20">
                <Crown className="w-8 h-8 text-warning" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
              {t('subscription:hero.title')}
            </h1>
            
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
              {t('subscription:hero.description')}
            </p>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-6 text-center">
                <Star className="w-8 h-8 text-warning mx-auto mb-3" />
                <h3 className="font-semibold text-primary-foreground mb-2">
                  {t('subscription:features.unlimited_ideas')}
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  {t('subscription:features.unlimited_ideas_desc')}
                </p>
              </div>

              <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-6 text-center">
                <Zap className="w-8 h-8 text-warning mx-auto mb-3" />
                <h3 className="font-semibold text-primary-foreground mb-2">
                  {t('subscription:features.ai_assistant')}
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  {t('subscription:features.ai_assistant_desc')}
                </p>
              </div>

              <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-6 text-center">
                <Crown className="w-8 h-8 text-warning mx-auto mb-3" />
                <h3 className="font-semibold text-primary-foreground mb-2">
                  {t('subscription:features.early_access')}
                </h3>
                <p className="text-sm text-primary-foreground/70">
                  {t('subscription:features.early_access_desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Manager */}
      <div className="container mx-auto px-4 py-16">
        <SubscriptionManager />
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('subscription:faq.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('subscription:faq.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="font-semibold">
                {t('subscription:faq.cancel_anytime.question')}
              </h3>
              <p className="text-muted-foreground">
                {t('subscription:faq.cancel_anytime.answer')}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">
                {t('subscription:faq.annual_discount.question')}
              </h3>
              <p className="text-muted-foreground">
                {t('subscription:faq.annual_discount.answer')}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">
                {t('subscription:faq.upgrade_plan.question')}
              </h3>
              <p className="text-muted-foreground">
                {t('subscription:faq.upgrade_plan.answer')}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">
                {t('subscription:faq.data_security.question')}
              </h3>
              <p className="text-muted-foreground">
                {t('subscription:faq.data_security.answer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
