import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  Sparkles, 
  Settings, 
  BarChart3,
  Users,
  MessageSquare,
  Zap
} from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { AIPreferencesPanel } from '@/components/ai/AIPreferencesPanel';
import { SmartRecommendations } from '@/components/ai/SmartRecommendations';
import { IdeaEvaluationAI } from '@/components/ai/IdeaEvaluationAI';
import { useAIFeatures } from '@/hooks/useAIFeatures';
import { useTranslation } from '@/hooks/useAppTranslation';

const AICenter: React.FC = () => {
  const { features, loading } = useAIFeatures();
  const { t } = useTranslation();

  const featureCards = [
    {
      icon: Brain,
      title: 'تقييم الأفكار',
      title_en: 'Idea Evaluation',
      description: 'تقييم شامل للأفكار باستخدام الذكاء الاصطناعي',
      description_en: 'Comprehensive AI-powered idea evaluation',
      feature_name: 'idea_evaluation',
      color: 'bg-blue-100 text-blue-800',
      path: '/ai/idea-evaluation'
    },
    {
      icon: Lightbulb,
      title: 'مساعد التحديات',
      title_en: 'Challenge Assistant',
      description: 'مساعدة في إنشاء وتطوير التحديات',
      description_en: 'AI assistance for creating and developing challenges',
      feature_name: 'challenge_assist',
      color: 'bg-green-100 text-green-800',
      path: '/ai/challenge-assist'
    },
    {
      icon: MessageSquare,
      title: 'اكتشاف الأفكار المشابهة',
      title_en: 'Similar Ideas Detection',
      description: 'اكتشاف الأفكار المشابهة لمنع التكرار',
      description_en: 'Detect similar ideas to prevent duplication',
      feature_name: 'similar_idea_detection',
      color: 'bg-orange-100 text-orange-800',
      path: '/ai/similarity-detection'
    },
    {
      icon: Users,
      title: 'مطابقة الشركاء الذكية',
      title_en: 'Smart Partner Matching',
      description: 'توصيات الشركاء باستخدام الذكاء الاصطناعي',
      description_en: 'AI-powered partner recommendations',
      feature_name: 'smart_partner_matching',
      color: 'bg-purple-100 text-purple-800',
      path: '/ai/partner-matching'
    },
    {
      icon: Settings,
      title: 'توليد الأسئلة المحورية',
      title_en: 'Focus Question Generation',
      description: 'توليد أسئلة محورية للتحديات',
      description_en: 'Generate focus questions for challenges',
      feature_name: 'focus_question_generation',
      color: 'bg-indigo-100 text-indigo-800',
      path: '/ai/question-generation'
    },
    {
      icon: BarChart3,
      title: 'تحليلات ذكية',
      title_en: 'Smart Analytics',
      description: 'تحليلات متقدمة بالذكاء الاصطناعي',
      description_en: 'Advanced AI-powered analytics',
      feature_name: 'smart_analytics',
      color: 'bg-cyan-100 text-cyan-800',
      path: '/ai/analytics'
    }
  ];

  const enabledFeatures = features.filter(f => f.is_enabled);
  const betaFeatures = features.filter(f => f.is_beta);

  return (
    <AppShell>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">مركز الذكاء الاصطناعي</h1>
              <p className="text-muted-foreground">
                استخدم قوة الذكاء الاصطناعي لتحسين تجربة الابتكار
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">الميزات المتاحة</p>
                    <p className="text-2xl font-bold">{enabledFeatures.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">ميزات تجريبية</p>
                    <p className="text-2xl font-bold">{betaFeatures.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">معدل الدقة</p>
                    <p className="text-2xl font-bold">95%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Brain className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">استخدام شهري</p>
                    <p className="text-2xl font-bold">1.2K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="features" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="features">الميزات</TabsTrigger>
            <TabsTrigger value="recommendations">التوصيات</TabsTrigger>
            <TabsTrigger value="evaluation">تقييم الأفكار</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((feature) => {
                const IconComponent = feature.icon;
                const isEnabled = enabledFeatures.some(f => f.feature_name === feature.feature_name);
                const featureData = features.find(f => f.feature_name === feature.feature_name);
                
                return (
                  <Card key={feature.feature_name} className={`relative ${isEnabled ? 'border-primary/20' : 'opacity-75'}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${feature.color}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            {featureData?.is_beta && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                تجريبي
                              </Badge>
                            )}
                          </div>
                        </div>
                        {isEnabled && (
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                      <CardDescription>
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {featureData?.required_subscription_tier && (
                          <Badge variant="outline" className="text-xs">
                            {featureData.required_subscription_tier}
                          </Badge>
                        )}
                        
                        {featureData?.usage_limit_per_month && (
                          <div className="text-xs text-muted-foreground">
                            الحد الأقصى: {featureData.usage_limit_per_month} استخدام/شهر
                          </div>
                        )}
                        
                        <Button 
                          variant={isEnabled ? "default" : "secondary"} 
                          size="sm" 
                          className="w-full"
                          disabled={!isEnabled}
                        >
                          {isEnabled ? 'استخدام الميزة' : 'غير متاح'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <SmartRecommendations context="dashboard" limit={10} />
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-6">
            <IdeaEvaluationAI
              ideaTitle="تطبيق الخدمات الحكومية الذكي"
              ideaDescription="تطبيق موحد يجمع جميع الخدمات الحكومية في مكان واحد باستخدام تقنيات الذكاء الاصطناعي لتحسين تجربة المستخدم"
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <AIPreferencesPanel />
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default AICenter;