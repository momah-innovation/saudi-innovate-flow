import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';
import { CreditCard, Check, Star, Crown, ArrowRight } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';

const PaddleSubscriptionPage = () => {
  const { user } = useAuth();
  const { t } = useUnifiedTranslation();
  const { subscriptionStatus, createCheckoutSession, loading } = useSubscription();

  const plans = [
    {
      id: 'basic',
      name: 'الباقة الأساسية',
      nameEn: 'Basic Plan',
      price: 49,
      currency: 'SAR',
      period: 'monthly',
      features: [
        'تقديم 10 أفكار شهرياً',
        'الوصول للتحديات العامة',
        'دعم المجتمع',
        'التحليلات الأساسية'
      ],
      icon: <Check className="h-5 w-5" />,
      popular: false
    },
    {
      id: 'professional',
      name: 'الباقة المحترفة',
      nameEn: 'Professional Plan',
      price: 199,
      currency: 'SAR',
      period: 'monthly',
      features: [
        'أفكار غير محدودة',
        'تحديات حصرية',
        'مساعدة الذكاء الاصطناعي',
        'تحليلات متقدمة',
        'دعم أولوية',
        'أدوات التعاون'
      ],
      icon: <Star className="h-5 w-5" />,
      popular: true
    },
    {
      id: 'enterprise',
      name: 'باقة المؤسسة',
      nameEn: 'Enterprise Plan',
      price: 999,
      currency: 'SAR',
      period: 'monthly',
      features: [
        'حلول مخصصة',
        'علامة تجارية مخصصة',
        'أمان متقدم',
        'دعم مخصص',
        'تكامل API',
        'تدريب الفريق',
        'إدارة متقدمة'
      ],
      icon: <Crown className="h-5 w-5" />,
      popular: false
    }
  ];

  const handleSubscribe = async (planId: string) => {
    try {
      await createCheckoutSession(planId);
      logger.info('Checkout session created', { component: 'PaddleSubscriptionPage', action: 'handleSubscribe', data: { planId } });
    } catch (error) {
      logger.error('Failed to create checkout session', { component: 'PaddleSubscriptionPage', action: 'handleSubscribe', data: { planId } }, error as Error);
    }
  };

  const handleManageSubscription = () => {
    // Implement customer portal functionality
    window.open('/customer-portal', '_blank');
    logger.info('Customer portal accessed', { component: 'PaddleSubscriptionPage', action: 'handleManageSubscription' });
  };

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">إدارة الاشتراك</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اختر الخطة المناسبة لاحتياجاتك الابتكارية واحصل على أقصى استفادة من منصة رواد
          </p>
        </div>

        {/* Current Subscription Status */}
        {user && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                حالة الاشتراك الحالي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={subscriptionStatus?.hasSubscription ? "default" : "secondary"}>
                      {subscriptionStatus?.hasSubscription ? 'مشترك' : 'غير مشترك'}
                    </Badge>
                    {subscriptionStatus?.planNameAr && (
                      <Badge variant="outline">
                        {subscriptionStatus.planNameAr}
                      </Badge>
                    )}
                  </div>
                  {subscriptionStatus?.currentPeriodEnd && (
                    <p className="text-sm text-muted-foreground">
                      ينتهي في: {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('ar-SA')}
                    </p>
                  )}
                </div>
                {subscriptionStatus?.hasSubscription && (
                  <Button
                    onClick={handleManageSubscription}
                    disabled={loading}
                    variant="outline"
                  >
                    إدارة الاشتراك
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                plan.popular
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    الأكثر شعبية
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center space-y-4">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center ${
                  plan.popular ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.nameEn}</p>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    {plan.price} <span className="text-base font-normal">{plan.currency}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">/ شهرياً</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-primary hover:bg-primary/90'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {loading ? 'جاري المعالجة...' : (
                    <div className="flex items-center gap-2">
                      <span>اشترك الآن</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>مقارنة المميزات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4">المميزة</th>
                    <th className="text-center py-3 px-4">الأساسية</th>
                    <th className="text-center py-3 px-4">المحترفة</th>
                    <th className="text-center py-3 px-4">المؤسسة</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">عدد الأفكار الشهرية</td>
                    <td className="text-center py-3 px-4">10</td>
                    <td className="text-center py-3 px-4">غير محدود</td>
                    <td className="text-center py-3 px-4">غير محدود</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">مساعدة الذكاء الاصطناعي</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">التحليلات المتقدمة</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">الدعم المخصص</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">العلامة التجارية المخصصة</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">❌</td>
                    <td className="text-center py-3 px-4">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default PaddleSubscriptionPage;