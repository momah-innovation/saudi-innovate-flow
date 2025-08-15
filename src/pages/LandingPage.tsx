import { useState, useEffect } from "react";
import { debugLog } from '@/utils/debugLogger';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate, Link } from "react-router-dom";
import { useDirection } from "@/components/ui/direction-provider";
import { useAuth } from "@/contexts/AuthContext";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
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
  const { t } = useUnifiedTranslation();
  
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

  // Safely get direction context (fallback to 'ar' if not available)
  let direction;
  try {
    direction = useDirection();
  } catch (error) {
    // Fallback for when DirectionProvider is not available
    debugLog.warn('DirectionProvider not available, using fallback values');
    direction = { 
      language: 'en' as const, 
      setLanguage: () => {}, 
      isRTL: false 
    };
  }
  const { language, setLanguage, isRTL } = direction;

  const features = [
    {
      icon: Lightbulb,
      title: t('landing.features.innovation_challenges.title'),
      description: t('landing.features.innovation_challenges.description')
    },
    {
      icon: Users,
      title: t('landing.features.expert_network.title'),
      description: t('landing.features.expert_network.description')
    },
    {
      icon: Target,
      title: t('landing.features.collaboration_tools.title'),
      description: t('landing.features.collaboration_tools.description')
    },
    {
      icon: TrendingUp,
      title: t('landing.features.data_insights.title'),
      description: t('landing.features.data_insights.description')
    },
    {
      icon: Shield,
      title: t('landing.features.secure_platform.title'),
      description: t('landing.features.secure_platform.description')
    },
    {
      icon: Globe,
      title: t('landing.features.vision_2030.title'),
      description: t('landing.features.vision_2030.description')
    }
  ];

  // Mock statistics data
  const statistics = [
    { id: 1, metric_value: 124, metric_name: 'active_challenges', icon_name: 'lightbulb' },
    { id: 2, metric_value: 856, metric_name: 'registered_experts', icon_name: 'users' },
    { id: 3, metric_value: 45, metric_name: 'government_entities', icon_name: 'target' },
    { id: 4, metric_value: 94, metric_name: 'success_rate', icon_name: 'trending-up' }
  ];

  // Mock process steps
  const processSteps = [
    { id: 1, title: t('landing.process.step_1.title'), content: t('landing.process.step_1.description') },
    { id: 2, title: t('landing.process.step_2.title'), content: t('landing.process.step_2.description') },
    { id: 3, title: t('landing.process.step_3.title'), content: t('landing.process.step_3.description') },
    { id: 4, title: t('landing.process.step_4.title'), content: t('landing.process.step_4.description') }
  ];

  // Mock FAQs
  const faqs = [
    { id: 1, question: t('landing.faq.questions.what_is_platform.question'), answer: t('landing.faq.questions.what_is_platform.answer') },
    { id: 2, question: t('landing.faq.questions.how_to_participate.question'), answer: t('landing.faq.questions.how_to_participate.answer') },
    { id: 3, question: t('landing.faq.questions.vision_2030_alignment.question'), answer: t('landing.faq.questions.vision_2030_alignment.answer') }
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

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : ''}`}>
      <LandingNavigation user={user} loading={loading} />
      
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
            <span>{language === 'en' ? t('common.language.arabic') : t('common.language.english')}</span>
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
                {t('landing.hero.title')}
              </h1>
              <p className="text-xl text-primary-foreground/90">
                {t('landing.hero.subtitle')}
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <Badge variant="secondary" className="bg-background/20 text-primary-foreground border-background/30 text-lg px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('landing.features.vision_2030.title')}
            </Badge>
          </div>
          
          <p className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 max-w-3xl mx-auto">
            {t('landing.hero.description')}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
            <Button 
              size="lg" 
              className="bg-background text-primary hover:bg-background/90 text-lg px-8 py-4"
              onClick={() => navigate('/signup')}
            >
              {t('landing.hero.cta_primary')}
              <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-foreground/30 text-foreground hover:bg-foreground/10 text-lg px-8 py-4"
              asChild
            >
              <Link to="/challenges">
                {t('landing.hero.cta_secondary')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className={`text-center mb-12 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {t('landing.statistics.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('landing.statistics.subtitle')}
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
                      {t(`landing.statistics.${stat.metric_name}`)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {t('landing.process.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('landing.process.subtitle')}
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
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {step.content}
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

      {/* Features Section */}
      <section id="features-section" className="py-20 px-4">
        <div className="container mx-auto">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {t('landing.solutions.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('landing.solutions.subtitle')}
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
                          {t('common.buttons.learn_more')}
                        </span>
                        <ArrowRight className={`h-4 w-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className={`text-center mb-16 ${isRTL ? 'text-right' : ''}`}>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              <HelpCircle className={`inline-block w-8 h-8 ${isRTL ? 'ml-3' : 'mr-3'}`} />
              {t('landing.faq.title')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('landing.faq.subtitle')}
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.id} value={`item-${index}`}>
                <AccordionTrigger className={`text-left ${isRTL ? 'text-right' : ''}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={`text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              {t('landing.cta.subtitle')}
            </p>
            
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                onClick={() => navigate('/auth')}
              >
                {t('landing.cta.get_started')}
                <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-16 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className={`lg:col-span-2 space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <div className={`flex items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                  <div className="text-xl">🏗️</div>
                </div>
                <span className="text-xl font-bold">
                  {t('landing.hero.title')}
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm">
                {t('landing.footer.tagline')}
              </p>
            </div>
            
            {/* Quick Links */}
            <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <h3 className="font-semibold text-foreground">
                {t('navigation.discover')}
              </h3>
              <nav className="space-y-2">
                <Link to="/challenges" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('landing.features.innovation_challenges.title')}
                </Link>
                <Link to="/events" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('navigation.events')}
                </Link>
              </nav>
            </div>
            
            {/* Support */}
            <div className={`space-y-4 ${isRTL ? 'text-right' : ''}`}>
              <h3 className="font-semibold text-foreground">
                {t('landing.footer.links.support')}
              </h3>
              <nav className="space-y-2">
                <Link to="/help" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t('landing.footer.links.support')}
                </Link>
              </nav>
            </div>
          </div>
          
          {/* Copyright */}
          <div className={`text-center pt-8 mt-8 border-t ${isRTL ? 'text-right' : ''}`}>
            <p className="text-xs text-muted-foreground">
              © 2024 {t('landing.hero.title')}. {t('landing.footer.tagline')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}