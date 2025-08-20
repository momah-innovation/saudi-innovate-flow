import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, Download, Calendar, Users, 
  BarChart3, TrendingUp, Target, Award,
  Eye, Share, Filter, Plus
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

const mockReports = [
  {
    id: 1,
    title: 'تقرير الأداء الشهري - أغسطس 2024',
    title_en: 'Monthly Performance Report - August 2024',
    description: 'تقرير شامل عن أداء المنصة والمشاريع خلال شهر أغسطس',
    description_en: 'Comprehensive report on platform and project performance during August',
    type: 'performance',
    category: 'monthly',
    generatedDate: '2024-08-31',
    size: '2.3 MB',
    pages: 45,
    downloads: 234,
    status: 'published',
    tags: ['أداء', 'شهري', 'إحصائيات']
  },
  {
    id: 2,
    title: 'تحليل اتجاهات الابتكار Q2 2024',
    title_en: 'Innovation Trends Analysis Q2 2024',
    description: 'تحليل تفصيلي لاتجاهات الابتكار والتقنيات الناشئة في الربع الثاني',
    description_en: 'Detailed analysis of innovation trends and emerging technologies in Q2',
    type: 'analytics',
    category: 'quarterly',
    generatedDate: '2024-07-15',
    size: '5.7 MB',
    pages: 78,
    downloads: 567,
    status: 'published',
    tags: ['ابتكار', 'تحليل', 'اتجاهات']
  },
  {
    id: 3,
    title: 'تقرير رضا المستخدمين 2024',
    title_en: 'User Satisfaction Report 2024',
    description: 'استبيان شامل حول رضا المستخدمين وتجربتهم على المنصة',
    description_en: 'Comprehensive survey on user satisfaction and platform experience',
    type: 'survey',
    category: 'annual',
    generatedDate: '2024-07-01',
    size: '1.8 MB',
    pages: 32,
    downloads: 189,
    status: 'published',
    tags: ['رضا', 'مستخدمين', 'استبيان']
  },
  {
    id: 4,
    title: 'تقرير الأثر الاقتصادي للمشاريع',
    title_en: 'Economic Impact Report of Projects',
    description: 'تحليل الأثر الاقتصادي للمشاريع المنجزة على الاقتصاد المحلي',
    description_en: 'Analysis of the economic impact of completed projects on the local economy',
    type: 'impact',
    category: 'special',
    generatedDate: '2024-06-20',
    size: '4.2 MB',
    pages: 89,
    downloads: 456,
    status: 'published',
    tags: ['اقتصاد', 'أثر', 'مشاريع']
  },
  {
    id: 5,
    title: 'تقرير مالي ربعي Q3 2024',
    title_en: 'Quarterly Financial Report Q3 2024',
    description: 'تقرير مالي شامل للربع الثالث من عام 2024',
    description_en: 'Comprehensive financial report for Q3 2024',
    type: 'financial',
    category: 'quarterly',
    generatedDate: '2024-09-30',
    size: '3.1 MB',
    pages: 56,
    downloads: 0,
    status: 'draft',
    tags: ['مالي', 'ربعي', 'ميزانية']
  }
];

const mockReportTemplates = [
  {
    id: 1,
    name: 'تقرير الأداء الشهري',
    name_en: 'Monthly Performance Report',
    description: 'قالب لتقارير الأداء الشهرية',
    description_en: 'Template for monthly performance reports',
    sections: 8,
    lastUsed: '2024-08-31'
  },
  {
    id: 2,
    name: 'تحليل الاتجاهات',
    name_en: 'Trends Analysis',
    description: 'قالب لتحليل الاتجاهات والتوقعات',
    description_en: 'Template for trends analysis and predictions',
    sections: 12,
    lastUsed: '2024-07-15'
  },
  {
    id: 3,
    name: 'تقرير المشروع',
    name_en: 'Project Report',
    description: 'قالب لتقارير المشاريع الفردية',
    description_en: 'Template for individual project reports',
    sections: 6,
    lastUsed: '2024-08-20'
  }
];

const ReportsPage = () => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filterOptions = [
    {
      key: 'type',
      label: t('reports:filters.report_type'),
      options: [
        { value: 'all', label: t('reports:filters.types.all') },
        { value: 'performance', label: t('reports:filters.types.performance') },
        { value: 'analytics', label: t('reports:filters.types.analytics') },
        { value: 'financial', label: t('reports:filters.types.financial') },
        { value: 'survey', label: t('reports:filters.types.survey') },
        { value: 'impact', label: t('reports:filters.types.impact') }
      ]
    },
    {
      key: 'category',
      label: t('reports:filters.category'),
      options: [
        { value: 'all', label: t('reports:filters.categories.all') },
        { value: 'monthly', label: t('reports:filters.categories.monthly') },
        { value: 'quarterly', label: t('reports:filters.categories.quarterly') },
        { value: 'annual', label: t('reports:filters.categories.annual') },
        { value: 'special', label: t('reports:filters.categories.special') }
      ]
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'type') setTypeFilter(value);
    if (key === 'category') setCategoryFilter(value);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return <BarChart3 className="h-4 w-4" />;
      case 'analytics': return <TrendingUp className="h-4 w-4" />;
      case 'financial': return <Target className="h-4 w-4" />;
      case 'survey': return <Users className="h-4 w-4" />;
      case 'impact': return <Award className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'performance': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'analytics': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'financial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'survey': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'impact': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'reviewing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return t('reports:status.published');
      case 'draft': return t('reports:status.draft');
      case 'reviewing': return t('reports:status.reviewing');
      default: return status;
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US').format(num);
  };

  const ReportCard = ({ report }: { report: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {isRTL ? report.title : report.title_en}
            </CardTitle>
            <CardDescription className="text-sm">
              {isRTL ? report.description : report.description_en}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={getStatusColor(report.status)}>
              {getStatusText(report.status)}
            </Badge>
            <Badge className={getTypeColor(report.type)}>
              {getTypeIcon(report.type)}
              <span className="ml-1 capitalize">{report.type}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{report.generatedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{report.pages} {t('reports:card.pages')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>{formatNumber(report.downloads)} {t('reports:card.downloads')}</span>
            </div>
            <div>
              <span>{t('reports:card.size')} {report.size}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {report.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                {t('reports:card.view')}
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                {t('reports:card.share')}
              </Button>
            </div>
            {report.status === 'published' && (
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t('reports:card.download')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const TemplateCard = ({ template }: { template: any }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg">
          {isRTL ? template.name : template.name_en}
        </CardTitle>
        <CardDescription>
          {isRTL ? template.description : template.description_en}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('reports:card.sections')}</span>
            <span className="font-medium">{template.sections}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t('reports:card.last_used')}</span>
            <span className="font-medium">{template.lastUsed}</span>
          </div>
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            {t('reports:create_report')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <PageLayout
        title={t('reports:title')}
        description={t('reports:description')}
        secondaryActions={
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {t('reports:advanced_filter')}
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('reports:new_report')}
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder={t('reports:search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Tabs defaultValue="published" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="published">{t('reports:tabs.published')}</TabsTrigger>
              <TabsTrigger value="drafts">{t('reports:tabs.drafts')}</TabsTrigger>
              <TabsTrigger value="templates">{t('reports:tabs.templates')}</TabsTrigger>
              <TabsTrigger value="scheduled">{t('reports:tabs.scheduled')}</TabsTrigger>
            </TabsList>

            <TabsContent value="published" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockReports.filter(r => r.status === 'published').map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockReports.filter(r => r.status === 'draft').map((report) => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockReportTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="scheduled" className="space-y-4">
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t('reports:no_scheduled_reports')}</p>
                  <Button variant="outline" className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('reports:schedule_report')}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default ReportsPage;
