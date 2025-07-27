import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { useDirection } from "@/components/ui/direction-provider";
import { useLandingPageData } from "@/hooks/useLandingPageData";
import { 
  Lightbulb, 
  Users, 
  Target, 
  TrendingUp, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle,
  Sparkles,
  BarChart3,
  HelpCircle,
  Languages,
  ChevronRight
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { language, setLanguage, isRTL } = useDirection();
  const { faqs, statistics, loading, getText, getProcessSteps } = useLandingPageData(language);

  const features = [
    {
      icon: Lightbulb,
      title: getText("Innovation Challenges", "تحديات الابتكار"),
      description: getText(
        "Create and manage government innovation challenges aligned with Vision 2030 goals",
        "إنشاء وإدارة تحديات الابتكار الحكومي المتماشية مع أهداف رؤية 2030"
      )
    },
    {
      icon: Users,
      title: getText("Expert Network", "شبكة الخبراء"),
      description: getText(
        "Connect with domain experts and innovation specialists across government sectors",
        "التواصل مع خبراء المجال ومتخصصي الابتكار عبر القطاعات الحكومية"
      )
    },
    {
      icon: Target,
      title: getText("Strategic Alignment", "التوافق الاستراتيجي"),
      description: getText(
        "Ensure all initiatives align with Saudi Vision 2030 strategic objectives",
        "ضمان توافق جميع المبادرات مع الأهداف الاستراتيجية لرؤية السعودية 2030"
      )
    },
    {
      icon: TrendingUp,
      title: getText("Impact Analytics", "تحليلات التأثير"),
      description: getText(
        "Track and measure innovation impact with comprehensive analytics and reporting",
        "تتبع وقياس تأثير الابتكار من خلال التحليلات والتقارير الشاملة"
      )
    },
    {
      icon: Shield,
      title: getText("Secure Platform", "منصة آمنة"),
      description: getText(
        "Enterprise-grade security designed for government innovation management",
        "أمان على مستوى المؤسسة مصمم لإدارة الابتكار الحكومي"
      )
    },
    {
      icon: Globe,
      title: getText("Stakeholder Management", "إدارة أصحاب المصلحة"),
      description: getText(
        "Coordinate with partners, organizations, and stakeholders across the ecosystem",
        "التنسيق مع الشركاء والمنظمات وأصحاب المصلحة عبر النظام البيئي"
      )
    }
  ];

  const benefits = [
    getText("Accelerate government digital transformation", "تسريع التحول الرقمي الحكومي"),
    getText("Foster cross-sector collaboration", "تعزيز التعاون بين القطاعات"),
    getText("Streamline innovation processes", "تبسيط عمليات الابتكار"),
    getText("Align with Vision 2030 objectives", "التوافق مع أهداف رؤية 2030"),
    getText("Track measurable outcomes", "تتبع النتائج القابلة للقياس"),
    getText("Build sustainable innovation culture", "بناء ثقافة ابتكار مستدامة")
  ];

  const getIconComponent = (iconName: string | null) => {
    const iconMap: { [key: string]: any } = {
      'lightbulb': Lightbulb,
      'target': Target,
      'users': Users,
      'trending-up': TrendingUp,
      'bar-chart-3': BarChart3
    };
    
    const IconComponent = iconName ? iconMap[iconName] : BarChart3;
    return IconComponent || BarChart3;
  };

  const processSteps = getProcessSteps();

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      {/* Language Toggle */}
      <div className={`fixed top-4 ${isRTL ? 'left-4' : 'right-4'} z-50`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="bg-background/90 backdrop-blur-sm border-border/50"
        >
          <Languages className="w-4 h-4 mr-2" />
          {language === 'en' ? 'العربية' : 'English'}
        </Button>
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-light to-accent py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className={`relative container mx-auto text-center ${isRTL ? 'text-right' : ''}`}>
          <div className={`mb-6 flex items-center justify-center ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`h-16 w-16 rounded-xl bg-background/20 flex items-center justify-center ${isRTL ? 'ml-4' : 'mr-4'}`}>
              <div className="text-3xl">🏗️</div>
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-4xl lg:text-6xl font-bold text-primary-foreground mb-2">
                {getText("Ruwād Innovation System", "نظام رواد للابتكار")}
              </h1>
              <p className="text-xl text-primary-foreground/90">
                {getText("Government Innovation Management Platform", "منصة إدارة الابتكار الحكومي")}
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-background/30 text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {getText("Aligned with Saudi Vision 2030", "متماشٍ مع رؤية السعودية 2030")}
            </Badge>
          </div>
          
          <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            {getText(
              "Driving Innovation Across Government Sectors", 
              "قيادة الابتكار عبر القطاعات الحكومية"
            )}
          </p>
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-4"
              onClick={() => navigate('/auth')}
            >
              {getText("Access Platform", "الوصول إلى المنصة")}
              <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-background/30 text-primary-foreground hover:bg-background/10 text-lg px-8 py-4"
            >
              {getText("Learn More", "اعرف المزيد")}
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {!loading && statistics.length > 0 && (
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                {getText("Platform Impact", "تأثير المنصة")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {getText("Measurable results driving government innovation", "نتائج قابلة للقياس تقود الابتكار الحكومي")}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {statistics.map((stat) => {
                const IconComponent = getIconComponent(stat.icon_name);
                return (
                  <Card key={stat.id} className="text-center">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-2">
                        {stat.metric_value.toLocaleString()}
                        {stat.metric_name === 'success_rate' && '%'}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getText(stat.metric_description_en || '', stat.metric_description_ar || '')}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      {!loading && processSteps.length > 0 && (
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                {getText("How It Works", "كيف يعمل")}
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {getText(
                  "A streamlined process for government innovation from challenge identification to implementation",
                  "عملية مبسطة للابتكار الحكومي من تحديد التحدي إلى التنفيذ"
                )}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className={`space-y-8 ${isRTL ? 'space-y-reverse' : ''}`}>
                {processSteps.map((step, index) => (
                  <div key={step.id} className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                    </div>
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <h3 className="text-xl font-semibold mb-2">
                        {getText(step.title_en, step.title_ar)}
                      </h3>
                      <p className="text-muted-foreground">
                        {getText(step.content_en, step.content_ar)}
                      </p>
                    </div>
                    {index < processSteps.length - 1 && (
                      <div className={`flex-shrink-0 ${isRTL ? 'mr-6' : 'ml-6'}`}>
                        <ChevronRight className={`h-6 w-6 text-muted-foreground ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {getText("Empowering Government Innovation", "تمكين الابتكار الحكومي")}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {getText(
                "A comprehensive platform designed to accelerate innovation across government sectors, fostering collaboration and driving measurable outcomes aligned with Vision 2030.",
                "منصة شاملة مصممة لتسريع الابتكار عبر القطاعات الحكومية، وتعزيز التعاون وتحقيق نتائج قابلة للقياس تتماشى مع رؤية 2030."
              )}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {!loading && faqs.length > 0 && (
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                <HelpCircle className={`inline-block w-8 h-8 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                {getText("Frequently Asked Questions", "الأسئلة الشائعة")}
              </h2>
              <p className="text-xl text-muted-foreground">
                {getText("Everything you need to know about the platform", "كل ما تحتاج لمعرفته عن المنصة")}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={faq.id} value={`item-${index}`}>
                  <AccordionTrigger className={`text-left ${isRTL ? 'text-right' : ''}`}>
                    {getText(faq.question_en, faq.question_ar)}
                  </AccordionTrigger>
                  <AccordionContent className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                    {getText(faq.answer_en, faq.answer_ar)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}>
            <div className={isRTL ? 'lg:col-start-2' : ''}>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                {getText("Transforming Government Innovation", "تحويل الابتكار الحكومي")}
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {getText(
                  "Join the digital transformation journey and be part of building a more innovative, efficient, and citizen-centric government ecosystem.",
                  "انضم إلى رحلة التحول الرقمي وكن جزءًا من بناء نظام حكومي أكثر ابتكارًا وكفاءة ومحورية للمواطن."
                )}
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/auth')}
              >
                {getText("Get Started Today", "ابدأ اليوم")}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </div>

            <div className={isRTL ? 'lg:col-start-1' : ''}>
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-border/50">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg text-muted-foreground">
                      {getText("Innovation Dashboard Preview", "معاينة لوحة معلومات الابتكار")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {getText("Ready to Drive Innovation?", "مستعد لقيادة الابتكار؟")}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {getText(
                "Join government innovators across Saudi Arabia in building the future. Access the platform and start your innovation journey today.",
                "انضم إلى المبتكرين الحكوميين عبر المملكة العربية السعودية في بناء المستقبل. ادخل إلى المنصة وابدأ رحلة الابتكار اليوم."
              )}
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/auth')}
              >
                {getText("Access Platform", "الوصول إلى المنصة")}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <div className={`flex items-center justify-center mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
              <div className="text-lg">🏗️</div>
            </div>
            <span className="text-lg font-semibold">
              {getText("Ruwād Innovation System", "نظام رواد للابتكار")}
            </span>
          </div>
          <p className="text-muted-foreground">
            {getText(
              "Government Innovation Management Platform • Aligned with Saudi Vision 2030",
              "منصة إدارة الابتكار الحكومي • متماشية مع رؤية السعودية 2030"
            )}
          </p>
        </div>
      </footer>
    </div>
  );
}