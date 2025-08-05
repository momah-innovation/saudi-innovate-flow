import { SubscriptionManager } from '@/components/subscription/SubscriptionManager';
import { useDirection } from '@/components/ui/direction-provider';
import { ResponsiveAppShell } from '@/components/layout/ResponsiveAppShell';
import { Crown, Star, Zap } from 'lucide-react';

export const SubscriptionPage = () => {
  const { isRTL } = useDirection();

  return (
    <ResponsiveAppShell>
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
                {isRTL ? 'خطط الاشتراك المميزة' : 'Premium Subscription Plans'}
              </h1>
              
              <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto leading-relaxed">
                {isRTL 
                  ? 'انضم إلى المبتكرين الرائدين واحصل على إمكانيات متقدمة لتطوير أفكارك وتحقيق أهدافك في الابتكار'
                  : 'Join leading innovators and get advanced capabilities to develop your ideas and achieve your innovation goals'
                }
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-6 text-center">
                  <Star className="w-8 h-8 text-warning mx-auto mb-3" />
                  <h3 className="font-semibold text-primary-foreground mb-2">
                    {isRTL ? 'أفكار غير محدودة' : 'Unlimited Ideas'}
                  </h3>
                  <p className="text-sm text-primary-foreground/70">
                    {isRTL ? 'شارك أفكارك بلا حدود' : 'Share your ideas without limits'}
                  </p>
                </div>

                <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-6 text-center">
                  <Zap className="w-8 h-8 text-warning mx-auto mb-3" />
                  <h3 className="font-semibold text-primary-foreground mb-2">
                    {isRTL ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
                  </h3>
                  <p className="text-sm text-primary-foreground/70">
                    {isRTL ? 'احصل على مساعدة ذكية' : 'Get intelligent assistance'}
                  </p>
                </div>

                <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-6 text-center">
                  <Crown className="w-8 h-8 text-warning mx-auto mb-3" />
                  <h3 className="font-semibold text-primary-foreground mb-2">
                    {isRTL ? 'الوصول المبكر' : 'Early Access'}
                  </h3>
                  <p className="text-sm text-primary-foreground/70">
                    {isRTL ? 'كن أول من يجرب الميزات الجديدة' : 'Be first to try new features'}
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
                {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-muted-foreground">
                {isRTL ? 'إجابات على أهم الأسئلة حول الاشتراكات' : 'Answers to common questions about subscriptions'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-4">
                <h3 className="font-semibold">
                  {isRTL ? 'هل يمكنني إلغاء الاشتراك في أي وقت؟' : 'Can I cancel my subscription anytime?'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'نعم، يمكنك إلغاء اشتراكك في أي وقت من خلال لوحة التحكم. ستحتفظ بالوصول حتى نهاية فترة الاشتراك المدفوعة.'
                    : 'Yes, you can cancel your subscription anytime from your dashboard. You\'ll retain access until the end of your paid period.'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">
                  {isRTL ? 'هل يوجد خصم للاشتراك السنوي؟' : 'Is there a discount for annual subscriptions?'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'نعم، نقدم خصماً يصل إلى 20% عند الاشتراك السنوي مقارنة بالدفع الشهري.'
                    : 'Yes, we offer up to 20% discount on annual subscriptions compared to monthly billing.'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">
                  {isRTL ? 'هل يمكنني ترقية خطتي لاحقاً؟' : 'Can I upgrade my plan later?'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'بالطبع! يمكنك ترقية خطتك في أي وقت وستحصل على الميزات الإضافية فوراً.'
                    : 'Absolutely! You can upgrade your plan anytime and get additional features immediately.'
                  }
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">
                  {isRTL ? 'هل البيانات آمنة ومحمية؟' : 'Is my data secure and protected?'}
                </h3>
                <p className="text-muted-foreground">
                  {isRTL 
                    ? 'نعم، نستخدم أعلى معايير الأمان وتشفير البيانات لحماية معلوماتك وضمان خصوصيتها.'
                    : 'Yes, we use the highest security standards and data encryption to protect your information and ensure privacy.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveAppShell>
  );
};