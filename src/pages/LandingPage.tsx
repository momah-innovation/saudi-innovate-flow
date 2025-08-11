import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate, Link } from "react-router-dom";
import { useDirection } from "@/components/ui/direction-provider";
import { useAuth } from "@/contexts/AuthContext";
import { useLandingPageData } from "@/hooks/useLandingPageData";
import { LandingNavigation } from "@/components/landing/LandingNavigation";
import { cn } from "@/lib/utils";
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
  ChevronRight,
  Calendar,
  ShoppingBag
} from "lucide-react";

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      console.log('🔄 Redirecting authenticated user from landing to dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [user, loading, navigate]);

  // Force light mode for landing page
  useEffect(() => {
    const root = document.documentElement;
    const originalClasses = root.className;
    root.classList.remove('dark');
    root.classList.add('light');
    
    return () => {
      root.className = originalClasses;
    };
  }, []);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const { language, setLanguage, isRTL } = useDirection();
  const { faqs, statistics, loading: dataLoading, getText, getProcessSteps } = useLandingPageData(language);

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
      <LandingNavigation />
      
      {/* Language Toggle */}
      <div className={cn("fixed top-20 z-50", isRTL ? 'left-4' : 'right-4')}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className={cn("bg-background/90 backdrop-blur-sm border-border/50", isRTL ? "font-arabic" : "font-english")}
        >
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Languages className="w-4 h-4" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </div>
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
                onClick={() => navigate('/signup')}
              >
                {getText("Get Started", "ابدأ الآن")}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-foreground/30 text-foreground hover:bg-foreground/10 text-lg px-8 py-4"
                asChild
              >
                <Link to="/challenges">
                  {getText("Browse Challenges", "استكشف التحديات")}
                </Link>
              </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      {!dataLoading && statistics.length > 0 && (
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
      {!dataLoading && processSteps.length > 0 && (
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
                        {step.title_ar}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.content_ar}
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
      <section id="features-section" className="py-20 px-4">
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
            {features.map((feature, index) => {
              const getFeatureLink = () => {
                switch (feature.icon) {
                  case Lightbulb: return '/challenges';
                  case Users: return '/events';
                  case Target: return '/about';
                  case TrendingUp: return '/statistics';
                  case Shield: return '/help';
                  case Globe: return '/marketplace';
                  default: return '/about';
                }
              };
              
              return (
                <Link to={getFeatureLink()} key={index}>
                  <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg h-full">
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
                      <div className={`flex items-center mt-4 text-primary font-medium ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm">
                          {getText("Learn More", "اعرف المزيد")}
                        </span>
                        <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          {/* Quick Navigation Section */}
          <div className={`mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto ${isRTL ? 'text-right' : ''}`}>
            <Link to="/challenges" className="group">
              <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <Target className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">
                    {getText("Browse Challenges", "استكشف التحديات")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getText("Discover government innovation challenges", "اكتشف تحديات الابتكار الحكومي")}
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/events" className="group">
              <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">
                    {getText("Upcoming Events", "الفعاليات القادمة")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getText("Join innovation events and workshops", "انضم للفعاليات وورش الابتكار")}
                  </p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/marketplace" className="group">
              <Card className="border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">
                    {getText("Partnership Opportunities", "فرص الشراكة")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {getText("Explore collaboration possibilities", "استكشف إمكانيات التعاون")}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {!dataLoading && faqs.length > 0 && (
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
                    {faq.question_ar}
                  </AccordionTrigger>
                  <AccordionContent className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                    {faq.answer_ar}
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

              <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4"
                  onClick={() => navigate('/signup')}
                >
                  {getText("Join Platform", "انضم للمنصة")}
                  <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                </Button>
                <Button 
                  variant="outline"
                  size="lg" 
                  className="text-lg px-8 py-4"
                  asChild
                >
                  <Link to="/events">
                    <Calendar className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {getText("View Events", "عرض الفعاليات")}
                  </Link>
                </Button>
              </div>
            </div>

            <div className={isRTL ? 'lg:col-start-1' : ''}>
              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-background to-muted border border-border shadow-lg overflow-hidden">
                  {/* Dashboard Mockup */}
                  <div className="p-6 h-full">
                    {/* Header */}
                    <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                          <div className="text-sm">🏗️</div>
                        </div>
                        <span className="font-semibold text-sm">
                          {getText("Innovation Dashboard", "لوحة الابتكار")}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      </div>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-primary/10 rounded p-2">
                        <div className="text-xs text-muted-foreground">
                          {getText("Active", "نشط")}
                        </div>
                        <div className="font-bold text-sm">24</div>
                      </div>
                      <div className="bg-accent/10 rounded p-2">
                        <div className="text-xs text-muted-foreground">
                          {getText("Ideas", "أفكار")}
                        </div>
                        <div className="font-bold text-sm">156</div>
                      </div>
                      <div className="bg-success/10 rounded p-2">
                        <div className="text-xs text-muted-foreground">
                          {getText("Complete", "مكتمل")}
                        </div>
                        <div className="font-bold text-sm">89%</div>
                      </div>
                    </div>
                    
                    {/* Chart Area */}
                    <div className="bg-muted/50 rounded-lg p-3 mb-3">
                      <div className="flex items-end justify-between h-16 gap-1">
                        {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                          <div
                            key={i}
                            className="bg-primary/60 rounded-sm flex-1"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-center">
                        {getText("Innovation Trends", "اتجاهات الابتكار")}
                      </div>
                    </div>
                    
                    {/* Recent Activity */}
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        {getText("Recent Activity", "النشاط الأخير")}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-muted-foreground">
                          {getText("New challenge submitted", "تم تقديم تحدي جديد")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-muted-foreground">
                          {getText("Expert assigned", "تم تعيين خبير")}
                        </span>
                      </div>
                    </div>
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
      <footer className="bg-muted/50 py-16 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Column */}
            <div className={`lg:col-span-2 space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                  <div className="text-xl">🏗️</div>
                </div>
                <span className="text-xl font-bold">
                  {getText("Ruwād Innovation System", "نظام رواد للابتكار")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                {getText(
                  "Government Innovation Management Platform driving digital transformation across Saudi Arabia, aligned with Vision 2030 strategic objectives.",
                  "منصة إدارة الابتكار الحكومي التي تقود التحول الرقمي عبر المملكة العربية السعودية، متماشية مع الأهداف الاستراتيجية لرؤية 2030."
                )}
              </p>
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button 
                  size="sm"
                  onClick={() => navigate('/signup')}
                >
                  {getText("Join Platform", "انضم للمنصة")}
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  {getText("Sign In", "تسجيل الدخول")}
                </Button>
              </div>
            </div>
            
            {/* Discovery Column */}
            <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <h3 className="font-semibold text-foreground">
                {getText("Discovery", "الاستكشاف")}
              </h3>
              <nav className="space-y-2">
                <Link to="/challenges" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {getText("Innovation Challenges", "تحديات الابتكار")}
                </Link>
                <Link to="/events" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {getText("Events & Workshops", "الفعاليات وورش العمل")}
                </Link>
                <Link to="/campaigns" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {getText("Active Campaigns", "الحملات النشطة")}
                </Link>
                <Link to="/marketplace" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {getText("Partnership Hub", "مركز الشراكات")}
                </Link>
                <Link to="/statistics" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {getText("Impact Statistics", "إحصائيات التأثير")}
                </Link>
              </nav>
            </div>
            
            {/* Platform Column */}
            <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <h3 className="font-semibold text-foreground">
                {getText("Platform", "المنصة")}
              </h3>
              <nav className="space-y-2">
                <Link to="/about" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {getText("About Ruwād", "حول رواد")}
                </Link>
                <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {getText("Plans & Pricing", "الخطط والأسعار")}
                </Link>
                <Link to="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {getText("Help Center", "مركز المساعدة")}
                </Link>
              </nav>
            </div>
            
            {/* Authenticated Features Preview */}
            <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <h3 className="font-semibold text-foreground">
                {getText("Features", "الميزات")}
              </h3>
              <nav className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  {getText("Idea Management", "إدارة الأفكار")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getText("Expert Collaboration", "تعاون الخبراء")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getText("Analytics & Reports", "التحليلات والتقارير")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {getText("Project Tracking", "تتبع المشاريع")}
                </div>
              </nav>
            </div>
            
            {/* Quick Links */}
            <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <h3 className="font-semibold text-foreground">
                {getText("Quick Access", "الوصول السريع")}
              </h3>
              <nav className="space-y-2">
                <Link to="/auth" className="block text-sm text-primary font-medium hover:text-primary/80 transition-colors">
                  {getText("Access Dashboard", "الوصول للوحة القيادة")}
                </Link>
                <div className="text-xs text-muted-foreground pt-2 space-y-1">
                  <div>{getText("Authenticated Features:", "الميزات المصادقة:")}</div>
                  <div>{getText("• Submit Ideas", "• تقديم الأفكار")}</div>
                  <div>{getText("• Track Progress", "• تتبع التقدم")}</div>
                  <div>{getText("• Expert Network", "• شبكة الخبراء")}</div>
                  <div>{getText("• Analytics", "• التحليلات")}</div>
                </div>
              </nav>
            </div>
          </div>
          
          {/* Bottom Bar with Additional Links */}
          <div className="mt-12 pt-8 border-t">
            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 ${isRTL ? 'text-right' : ''}`}>
              {/* Vision 2030 Alignment */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">
                  {getText("Vision 2030 Alignment", "التوافق مع رؤية 2030")}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {getText(
                    "Supporting digital government transformation and innovation ecosystem development.",
                    "دعم التحول الحكومي الرقمي وتطوير النظام البيئي للابتكار."
                  )}
                </p>
              </div>
              
              {/* Platform Status */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">
                  {getText("Platform Status", "حالة المنصة")}
                </h4>
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">
                    {getText("All systems operational", "جميع الأنظمة تعمل")}
                  </span>
                </div>
              </div>
              
              {/* Contact */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-foreground">
                  {getText("Support", "الدعم")}
                </h4>
                <Link to="/help" className="text-xs text-primary hover:text-primary/80 transition-colors">
                  {getText("Get help and documentation", "الحصول على المساعدة والوثائق")}
                </Link>
              </div>
            </div>
            
            {/* Copyright */}
            <div className={`text-center pt-4 border-t ${isRTL ? 'text-right' : ''}`}>
              <p className="text-xs text-muted-foreground">
                {getText(
                  "© 2024 Ruwād Innovation System. Empowering government innovation across Saudi Arabia in support of Vision 2030.",
                  "© ٢٠٢ل نظام رواد للابتكار. تمكين الابتكار الحكومي عبر المملكة العربية السعودية دعماً لرؤية ٢٠٣٠."
                )}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}