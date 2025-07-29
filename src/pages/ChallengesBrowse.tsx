import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Target, Users, Award, Star, Eye } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

const mockChallenges = [
  {
    id: 1,
    title: 'تطوير حلول ذكية للنقل المستدام',
    title_en: 'Smart Sustainable Transportation Solutions',
    description: 'ابتكار حلول تقنية لتحسين وسائل النقل العام وتقليل الانبعاثات',
    description_en: 'Innovate technical solutions to improve public transport and reduce emissions',
    status: 'active',
    deadline: '2024-12-31',
    participants: 245,
    submissions: 67,
    category: 'البيئة والاستدامة',
    category_en: 'Environment & Sustainability',
    prize: '50,000 ريال',
    difficulty: 'متوسط'
  },
  {
    id: 2,
    title: 'منصة رقمية لدعم المشاريع الصغيرة',
    title_en: 'Digital Platform for Small Business Support',
    description: 'تطوير منصة شاملة لدعم وتمويل المشاريع الصغيرة والمتوسطة',
    description_en: 'Develop a comprehensive platform to support and finance small and medium enterprises',
    status: 'active',
    deadline: '2024-11-15',
    participants: 189,
    submissions: 43,
    category: 'التكنولوجيا المالية',
    category_en: 'FinTech',
    prize: '75,000 ريال',
    difficulty: 'صعب'
  },
  {
    id: 3,
    title: 'نظام ذكي لإدارة الموارد المائية',
    title_en: 'Smart Water Resource Management System',
    description: 'تصميم نظام متطور لمراقبة وإدارة استخدام الموارد المائية',
    description_en: 'Design an advanced system for monitoring and managing water resource usage',
    status: 'upcoming',
    deadline: '2025-01-20',
    participants: 0,
    submissions: 0,
    category: 'البيئة والاستدامة',
    category_en: 'Environment & Sustainability',
    prize: '60,000 ريال',
    difficulty: 'متوسط'
  }
];

const ChallengesBrowse = () => {
  const { isRTL } = useDirection();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filterOptions = [
    {
      key: 'status',
      label: isRTL ? 'الحالة' : 'Status',
      options: [
        { value: 'all', label: isRTL ? 'جميع الحالات' : 'All Status' },
        { value: 'active', label: isRTL ? 'نشط' : 'Active' },
        { value: 'upcoming', label: isRTL ? 'قريباً' : 'Upcoming' },
        { value: 'closed', label: isRTL ? 'مغلق' : 'Closed' }
      ]
    },
    {
      key: 'category',
      label: isRTL ? 'الفئة' : 'Category',
      options: [
        { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
        { value: 'environment', label: isRTL ? 'البيئة والاستدامة' : 'Environment & Sustainability' },
        { value: 'fintech', label: isRTL ? 'التكنولوجيا المالية' : 'FinTech' },
        { value: 'health', label: isRTL ? 'الصحة' : 'Healthcare' }
      ]
    }
  ];

  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') setStatusFilter(value);
    if (key === 'category') setCategoryFilter(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'upcoming': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'سهل': case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'متوسط': case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'صعب': case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const ChallengeCard = ({ challenge }: { challenge: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {isRTL ? challenge.title : challenge.title_en}
            </CardTitle>
            <CardDescription className="text-sm">
              {isRTL ? challenge.description : challenge.description_en}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge className={getStatusColor(challenge.status)}>
              {challenge.status === 'active' ? (isRTL ? 'نشط' : 'Active') : 
               challenge.status === 'upcoming' ? (isRTL ? 'قريباً' : 'Upcoming') : 
               (isRTL ? 'مغلق' : 'Closed')}
            </Badge>
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>{isRTL ? 'الموعد النهائي:' : 'Deadline:'} {challenge.deadline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{challenge.participants} {isRTL ? 'مشارك' : 'participants'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>{challenge.submissions} {isRTL ? 'مساهمة' : 'submissions'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>{challenge.prize}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="outline">
            {isRTL ? challenge.category : challenge.category_en}
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              {isRTL ? 'عرض التفاصيل' : 'View Details'}
            </Button>
            <Button size="sm">
              {isRTL ? 'المشاركة' : 'Participate'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'استكشاف التحديات' : 'Browse Challenges'}
        description={isRTL ? 'اكتشف التحديات المثيرة وشارك في حلها' : 'Discover exciting challenges and participate in solving them'}
      >
        <div className="space-y-6">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder={isRTL ? 'البحث في التحديات...' : 'Search challenges...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">{isRTL ? 'جميع التحديات' : 'All Challenges'}</TabsTrigger>
              <TabsTrigger value="active">{isRTL ? 'النشطة' : 'Active'}</TabsTrigger>
              <TabsTrigger value="upcoming">{isRTL ? 'القادمة' : 'Upcoming'}</TabsTrigger>
              <TabsTrigger value="trending">{isRTL ? 'الأكثر شعبية' : 'Trending'}</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockChallenges.map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="active" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockChallenges.filter(c => c.status === 'active').map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upcoming" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockChallenges.filter(c => c.status === 'upcoming').map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockChallenges.filter(c => c.participants > 200).map((challenge) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </AppShell>
  );
};

export default ChallengesBrowse;