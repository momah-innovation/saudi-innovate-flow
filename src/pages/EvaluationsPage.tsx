import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { SearchAndFilters } from '@/components/ui/search-and-filters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, CheckCircle, AlertCircle, Eye, FileText } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

const mockEvaluations = [
  {
    id: 1,
    title: 'تقييم نظام إدارة المشاريع الذكي',
    title_en: 'Smart Project Management System Evaluation',
    challenge: 'تطوير حلول إدارة المشاريع',
    challenge_en: 'Project Management Solutions Development',
    status: 'pending',
    priority: 'high',
    deadline: '2024-08-15',
    submittedDate: '2024-07-20',
    criteriaCount: 8,
    completedCriteria: 3,
    overallScore: 0,
    author: 'أحمد محمد السالم',
    author_en: 'Ahmed Mohammed Al-Salem'
  },
  {
    id: 2,
    title: 'تقييم تطبيق التجارة الإلكترونية',
    title_en: 'E-commerce Application Evaluation',
    challenge: 'حلول التجارة الرقمية',
    challenge_en: 'Digital Commerce Solutions',
    status: 'in_progress',
    priority: 'medium',
    deadline: '2024-08-20',
    submittedDate: '2024-07-18',
    criteriaCount: 10,
    completedCriteria: 7,
    overallScore: 78,
    author: 'فاطمة علي الزهراني',
    author_en: 'Fatima Ali Al-Zahrani'
  },
  {
    id: 3,
    title: 'تقييم منصة التعليم الإلكتروني',
    title_en: 'E-learning Platform Evaluation',
    challenge: 'ابتكارات التعليم الرقمي',
    challenge_en: 'Digital Education Innovations',
    status: 'completed',
    priority: 'low',
    deadline: '2024-07-30',
    submittedDate: '2024-07-10',
    criteriaCount: 12,
    completedCriteria: 12,
    overallScore: 92,
    author: 'خالد عبدالله النصر',
    author_en: 'Khalid Abdullah Al-Nasr'
  }
];

const EvaluationsPage = () => {
  const { isRTL } = useDirection();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filterOptions = [
    {
      key: 'status',
      label: isRTL ? 'الحالة' : 'Status',
      options: [
        { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Status' },
        { value: 'pending', label: isRTL ? 'في الانتظار' : 'Pending' },
        { value: 'in_progress', label: isRTL ? 'قيد التقييم' : 'In Progress' },
        { value: 'completed', label: isRTL ? 'مكتمل' : 'Completed' }
      ]
    },
    {
      key: 'priority',
      label: isRTL ? 'الأولوية' : 'Priority',
      options: [
        { value: 'all', label: isRTL ? 'جميع الأولويات' : 'All Priorities' },
        { value: 'high', label: isRTL ? 'عالية' : 'High' },
        { value: 'medium', label: isRTL ? 'متوسطة' : 'Medium' },
        { value: 'low', label: isRTL ? 'منخفضة' : 'Low' }
      ]
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') setStatusFilter(value);
    if (key === 'priority') setPriorityFilter(value);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return isRTL ? 'في الانتظار' : 'Pending';
      case 'in_progress': return isRTL ? 'قيد التقييم' : 'In Progress';
      case 'completed': return isRTL ? 'مكتمل' : 'Completed';
      default: return status;
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return isRTL ? 'عالية' : 'High';
      case 'medium': return isRTL ? 'متوسطة' : 'Medium';
      case 'low': return isRTL ? 'منخفضة' : 'Low';
      default: return priority;
    }
  };

  const EvaluationCard = ({ evaluation }: { evaluation: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {isRTL ? evaluation.title : evaluation.title_en}
            </CardTitle>
            <CardDescription className="text-sm">
              {isRTL ? evaluation.challenge : evaluation.challenge_en}
            </CardDescription>
            <div className="mt-2 text-sm text-muted-foreground">
              {isRTL ? 'المؤلف:' : 'Author:'} {isRTL ? evaluation.author : evaluation.author_en}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={getStatusColor(evaluation.status)}>
              {getStatusIcon(evaluation.status)}
              <span className="ml-1">{getStatusText(evaluation.status)}</span>
            </Badge>
            <Badge className={getPriorityColor(evaluation.priority)}>
              {getPriorityText(evaluation.priority)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">{isRTL ? 'تاريخ التقديم:' : 'Submitted:'}</span>
              <br />
              {evaluation.submittedDate}
            </div>
            <div>
              <span className="font-medium">{isRTL ? 'الموعد النهائي:' : 'Deadline:'}</span>
              <br />
              {evaluation.deadline}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{isRTL ? 'تقدم التقييم' : 'Evaluation Progress'}</span>
              <span>{evaluation.completedCriteria}/{evaluation.criteriaCount}</span>
            </div>
            <Progress value={(evaluation.completedCriteria / evaluation.criteriaCount) * 100} className="h-2" />
          </div>

          {evaluation.status === 'completed' && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">
                {isRTL ? 'النتيجة النهائية:' : 'Final Score:'} {evaluation.overallScore}/100
              </span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                {isRTL ? 'عرض التفاصيل' : 'View Details'}
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                {isRTL ? 'التقرير' : 'Report'}
              </Button>
            </div>
            {evaluation.status !== 'completed' && (
              <Button size="sm">
                {isRTL ? 'متابعة التقييم' : 'Continue Evaluation'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'التقييمات' : 'Evaluations'}
        description={isRTL ? 'إدارة ومراجعة تقييمات المشاريع والمساهمات' : 'Manage and review project and contribution evaluations'}
      >
        <div className="space-y-6">
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder={isRTL ? 'البحث في التقييمات...' : 'Search evaluations...'}
            filterOptions={filterOptions}
            onFilterChange={handleFilterChange}
          />

          <Tabs defaultValue="assigned" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="assigned">{isRTL ? 'المخصصة لي' : 'Assigned to Me'}</TabsTrigger>
              <TabsTrigger value="pending">{isRTL ? 'في الانتظار' : 'Pending'}</TabsTrigger>
              <TabsTrigger value="in_progress">{isRTL ? 'قيد المراجعة' : 'In Progress'}</TabsTrigger>
              <TabsTrigger value="completed">{isRTL ? 'المكتملة' : 'Completed'}</TabsTrigger>
            </TabsList>

            <TabsContent value="assigned" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockEvaluations.map((evaluation) => (
                  <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockEvaluations.filter(e => e.status === 'pending').map((evaluation) => (
                  <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="in_progress" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockEvaluations.filter(e => e.status === 'in_progress').map((evaluation) => (
                  <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockEvaluations.filter(e => e.status === 'completed').map((evaluation) => (
                  <EvaluationCard key={evaluation.id} evaluation={evaluation} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default EvaluationsPage;