import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, TrendingDown, Target, Lightbulb, 
  BarChart3, Calendar, Users, Star,
  ArrowUp, ArrowDown, Eye, Share
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

const mockTrends = {
  emergingTopics: [
    {
      id: 1,
      topic: 'الذكاء الاصطناعي التوليدي',
      topic_en: 'Generative AI',
      growth: 245,
      projects: 67,
      category: 'تقنية',
      category_en: 'Technology',
      trend: 'up',
      description: 'نمو متزايد في مشاريع الذكاء الاصطناعي التوليدي',
      description_en: 'Growing interest in generative AI projects'
    },
    {
      id: 2,
      topic: 'التكنولوجيا المالية المستدامة',
      topic_en: 'Sustainable FinTech',
      growth: 178,
      projects: 34,
      category: 'مالية',
      category_en: 'Finance',
      trend: 'up',
      description: 'اهتمام متزايد بالحلول المالية المستدامة',
      description_en: 'Increasing focus on sustainable financial solutions'
    },
    {
      id: 3,
      topic: 'إنترنت الأشياء الصناعي',
      topic_en: 'Industrial IoT',
      growth: 156,
      projects: 45,
      category: 'صناعة',
      category_en: 'Industry',
      trend: 'up',
      description: 'نمو في تطبيقات إنترنت الأشياء الصناعية',
      description_en: 'Growth in industrial IoT applications'
    },
    {
      id: 4,
      topic: 'تطبيقات الواقع المعزز',
      topic_en: 'Augmented Reality Apps',
      growth: -23,
      projects: 18,
      category: 'تقنية',
      category_en: 'Technology',
      trend: 'down',
      description: 'انخفاض في الاهتمام بتطبيقات الواقع المعزز',
      description_en: 'Declining interest in AR applications'
    }
  ],
  insights: [
    {
      id: 1,
      title: 'اتجاه صاعد في مشاريع الاستدامة',
      title_en: 'Rising Trend in Sustainability Projects',
      description: 'زيادة 40% في المشاريع المتعلقة بالاستدامة البيئية خلال الربع الأخير',
      description_en: '40% increase in environmental sustainability projects in the last quarter',
      impact: 'high',
      timeframe: 'Q3 2024',
      category: 'بيئة',
      category_en: 'Environment'
    },
    {
      id: 2,
      title: 'تراجع في مشاريع blockchain',
      title_en: 'Decline in Blockchain Projects',
      description: 'انخفاض 25% في مشاريع البلوك تشين مقارنة بالعام الماضي',
      description_en: '25% decrease in blockchain projects compared to last year',
      impact: 'medium',
      timeframe: '2024',
      category: 'تقنية',
      category_en: 'Technology'
    },
    {
      id: 3,
      title: 'نمو مشاريع الصحة الرقمية',
      title_en: 'Growth in Digital Health Projects',
      description: 'زيادة كبيرة في المشاريع المتعلقة بالصحة الرقمية والتطبيب عن بعد',
      description_en: 'Significant increase in digital health and telemedicine projects',
      impact: 'high',
      timeframe: '2024',
      category: 'صحة',
      category_en: 'Healthcare'
    }
  ],
  popularKeywords: [
    { keyword: 'ذكاء اصطناعي', keyword_en: 'AI', count: 234, growth: 45 },
    { keyword: 'استدامة', keyword_en: 'Sustainability', count: 189, growth: 67 },
    { keyword: 'تكنولوجيا مالية', keyword_en: 'FinTech', count: 167, growth: 23 },
    { keyword: 'إنترنت الأشياء', keyword_en: 'IoT', count: 145, growth: 34 },
    { keyword: 'أمن سيبراني', keyword_en: 'Cybersecurity', count: 134, growth: 12 },
    { keyword: 'تعلم آلة', keyword_en: 'Machine Learning', count: 123, growth: 56 },
    { keyword: 'حوسبة سحابية', keyword_en: 'Cloud Computing', count: 112, growth: 28 },
    { keyword: 'واقع افتراضي', keyword_en: 'Virtual Reality', count: 98, growth: -15 }
  ],
  sectorTrends: [
    { sector: 'التكنولوجيا', sector_en: 'Technology', projects: 156, growth: 34, budget: 2400000 },
    { sector: 'الصحة', sector_en: 'Healthcare', projects: 89, growth: 67, budget: 1800000 },
    { sector: 'التعليم', sector_en: 'Education', projects: 78, growth: 23, budget: 1200000 },
    { sector: 'البيئة', sector_en: 'Environment', projects: 67, growth: 89, budget: 1500000 },
    { sector: 'المالية', sector_en: 'Finance', projects: 56, growth: 12, budget: 2100000 }
  ]
};

const TrendsPage = () => {
  const { isRTL } = useDirection();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (trend: string, growth: number) => {
    if (trend === 'up' || growth > 0) {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
  };

  const getTrendColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'high': return isRTL ? 'تأثير عالي' : 'High Impact';
      case 'medium': return isRTL ? 'تأثير متوسط' : 'Medium Impact';
      case 'low': return isRTL ? 'تأثير منخفض' : 'Low Impact';
      default: return impact;
    }
  };

  const TrendCard = ({ trend }: { trend: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getTrendIcon(trend.trend, trend.growth)}
              {isRTL ? trend.topic : trend.topic_en}
            </CardTitle>
            <CardDescription className="mt-2">
              {isRTL ? trend.description : trend.description_en}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {isRTL ? trend.category : trend.category_en}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{isRTL ? 'النمو:' : 'Growth:'}</span>
            <span className={`font-medium ${getTrendColor(trend.growth)}`}>
              {trend.growth > 0 ? '+' : ''}{trend.growth}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{isRTL ? 'المشاريع:' : 'Projects:'}</span>
            <span className="font-medium">{formatNumber(trend.projects)}</span>
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            {isRTL ? 'عرض التفاصيل' : 'View Details'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const InsightCard = ({ insight }: { insight: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {isRTL ? insight.title : insight.title_en}
            </CardTitle>
            <CardDescription className="mt-2">
              {isRTL ? insight.description : insight.description_en}
            </CardDescription>
          </div>
          <Badge className={getImpactColor(insight.impact)}>
            {getImpactText(insight.impact)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{insight.timeframe}</span>
          </div>
          <Badge variant="outline">
            {isRTL ? insight.category : insight.category_en}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const SectorCard = ({ sector }: { sector: any }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{isRTL ? sector.sector : sector.sector_en}</span>
          <Badge className={sector.growth > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'}>
            {getTrendIcon('', sector.growth)}
            <span className="ml-1">{sector.growth > 0 ? '+' : ''}{sector.growth}%</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{isRTL ? 'المشاريع:' : 'Projects:'}</span>
            <span className="font-medium">{formatNumber(sector.projects)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{isRTL ? 'الميزانية:' : 'Budget:'}</span>
            <span className="font-medium">{formatCurrency(sector.budget)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{isRTL ? 'متوسط القيمة:' : 'Avg Value:'}</span>
            <span className="font-medium">{formatCurrency(sector.budget / sector.projects)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'الاتجاهات والرؤى' : 'Trends & Insights'}
        description={isRTL ? 'تحليل الاتجاهات الناشئة والرؤى الاستراتيجية للمنصة' : 'Analysis of emerging trends and strategic insights for the platform'}
        secondaryActions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Share className="h-4 w-4 mr-2" />
              {isRTL ? 'مشاركة' : 'Share'}
            </Button>
            <Button>
              <BarChart3 className="h-4 w-4 mr-2" />
              {isRTL ? 'تحليل مخصص' : 'Custom Analysis'}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'اتجاهات صاعدة' : 'Rising Trends'}</div>
                    <div className="text-xl font-bold">12</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'اتجاهات هابطة' : 'Declining Trends'}</div>
                    <div className="text-xl font-bold">3</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'رؤى جديدة' : 'New Insights'}</div>
                    <div className="text-xl font-bold">8</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'فرص ناشئة' : 'Emerging Opportunities'}</div>
                    <div className="text-xl font-bold">15</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="emerging" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="emerging">{isRTL ? 'المواضيع الناشئة' : 'Emerging Topics'}</TabsTrigger>
              <TabsTrigger value="insights">{isRTL ? 'الرؤى' : 'Insights'}</TabsTrigger>
              <TabsTrigger value="keywords">{isRTL ? 'الكلمات المفتاحية' : 'Keywords'}</TabsTrigger>
              <TabsTrigger value="sectors">{isRTL ? 'القطاعات' : 'Sectors'}</TabsTrigger>
              <TabsTrigger value="predictions">{isRTL ? 'التنبؤات' : 'Predictions'}</TabsTrigger>
            </TabsList>

            <TabsContent value="emerging" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTrends.emergingTopics.map((trend) => (
                  <TrendCard key={trend.id} trend={trend} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTrends.insights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{isRTL ? 'الكلمات المفتاحية الأكثر شعبية' : 'Most Popular Keywords'}</CardTitle>
                  <CardDescription>
                    {isRTL ? 'الكلمات الأكثر استخداماً في المشاريع والمساهمات' : 'Most frequently used keywords in projects and submissions'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTrends.popularKeywords.map((keyword, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-4 text-center">{index + 1}</span>
                          <span className="font-medium">{isRTL ? keyword.keyword : keyword.keyword_en}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {formatNumber(keyword.count)} {isRTL ? 'مشروع' : 'projects'}
                          </span>
                          <div className="flex items-center gap-2">
                            <Progress value={Math.min(keyword.count / 2.34, 100)} className="w-16 h-2" />
                            <span className={`text-sm font-medium ${getTrendColor(keyword.growth)}`}>
                              {keyword.growth > 0 ? '+' : ''}{keyword.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sectors" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTrends.sectorTrends.map((sector, index) => (
                  <SectorCard key={index} sector={sector} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="predictions" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'توقعات الربع القادم' : 'Next Quarter Predictions'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'نمو مشاريع الذكاء الاصطناعي' : 'AI Projects Growth'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          +35%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'مشاريع الاستدامة' : 'Sustainability Projects'}</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          +28%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'التكنولوجيا المالية' : 'FinTech Solutions'}</span>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                          +12%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'تطبيقات الواقع المعزز' : 'AR Applications'}</span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          <ArrowDown className="h-3 w-3 mr-1" />
                          -15%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{isRTL ? 'الفرص الناشئة' : 'Emerging Opportunities'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <div className="font-medium">
                            {isRTL ? 'تقنيات الحوسبة الكمية' : 'Quantum Computing Technologies'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isRTL ? 'نمو متوقع 150% في المشاريع' : 'Expected 150% growth in projects'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <div className="font-medium">
                            {isRTL ? 'الطب الرقمي والتطبيب عن بعد' : 'Digital Medicine & Telemedicine'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isRTL ? 'زيادة الطلب بنسبة 85%' : '85% increase in demand'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <div className="font-medium">
                            {isRTL ? 'تقنيات الطاقة المتجددة' : 'Renewable Energy Technologies'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isRTL ? 'استثمارات متزايدة في القطاع' : 'Increasing investments in the sector'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default TrendsPage;