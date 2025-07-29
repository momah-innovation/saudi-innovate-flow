import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SearchAndFilters } from '@/components/ui/search-and-filters';
import { 
  HelpCircle, Book, Video, MessageCircle, 
  Phone, Mail, ExternalLink, ChevronRight,
  Search, Star, ThumbsUp, Download,
  User, Calendar, Tag
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

const mockFAQs = [
  {
    id: 1,
    question: 'كيف يمكنني إنشاء حساب جديد؟',
    question_en: 'How can I create a new account?',
    answer: 'يمكنك إنشاء حساب جديد من خلال الضغط على زر "تسجيل" في أعلى الصفحة وملء النموذج المطلوب.',
    answer_en: 'You can create a new account by clicking the "Sign Up" button at the top of the page and filling out the required form.',
    category: 'حساب',
    category_en: 'Account',
    rating: 4.8,
    helpful: 234
  },
  {
    id: 2,
    question: 'كيف يمكنني تقديم فكرة جديدة؟',
    question_en: 'How can I submit a new idea?',
    answer: 'اذهب إلى صفحة "تقديم فكرة" واتبع الخطوات المطلوبة لإرسال فكرتك مع جميع التفاصيل اللازمة.',
    answer_en: 'Go to the "Submit Idea" page and follow the required steps to send your idea with all necessary details.',
    category: 'أفكار',
    category_en: 'Ideas',
    rating: 4.9,
    helpful: 567
  },
  {
    id: 3,
    question: 'ما هي معايير تقييم المشاريع؟',
    question_en: 'What are the project evaluation criteria?',
    answer: 'تشمل معايير التقييم: الإبداع والابتكار، الجدوى التقنية، الأثر المتوقع، وإمكانية التطبيق.',
    answer_en: 'Evaluation criteria include: creativity and innovation, technical feasibility, expected impact, and implementation possibility.',
    category: 'تقييم',
    category_en: 'Evaluation',
    rating: 4.7,
    helpful: 345
  }
];

const mockGuides = [
  {
    id: 1,
    title: 'دليل البداية السريعة',
    title_en: 'Quick Start Guide',
    description: 'تعلم أساسيات استخدام المنصة في 10 دقائق',
    description_en: 'Learn platform basics in 10 minutes',
    type: 'guide',
    duration: '10 min',
    level: 'مبتدئ',
    level_en: 'Beginner',
    chapters: 5
  },
  {
    id: 2,
    title: 'كيفية تقديم فكرة ناجحة',
    title_en: 'How to Submit a Successful Idea',
    description: 'دليل شامل لكتابة وتقديم أفكار مؤثرة',
    description_en: 'Comprehensive guide to writing and submitting impactful ideas',
    type: 'guide',
    duration: '25 min',
    level: 'متوسط',
    level_en: 'Intermediate',
    chapters: 8
  },
  {
    id: 3,
    title: 'دليل المقيمين والخبراء',
    title_en: 'Evaluators and Experts Guide',
    description: 'كيفية تقييم المشاريع والمساهمات بفعالية',
    description_en: 'How to evaluate projects and contributions effectively',
    type: 'guide',
    duration: '35 min',
    level: 'متقدم',
    level_en: 'Advanced',
    chapters: 12
  }
];

const mockVideos = [
  {
    id: 1,
    title: 'جولة تعريفية بالمنصة',
    title_en: 'Platform Overview Tour',
    description: 'جولة شاملة تعرفك على جميع ميزات المنصة',
    description_en: 'Comprehensive tour introducing all platform features',
    duration: '15:30',
    views: 2847,
    rating: 4.9
  },
  {
    id: 2,
    title: 'كيفية إنشاء مشروع فعال',
    title_en: 'Creating an Effective Project',
    description: 'تعلم خطوات إنشاء مشروع ناجح ومؤثر',
    description_en: 'Learn steps to create a successful and impactful project',
    duration: '22:45',
    views: 1456,
    rating: 4.8
  },
  {
    id: 3,
    title: 'استخدام أدوات التعاون',
    title_en: 'Using Collaboration Tools',
    description: 'كيفية التعاون مع الفرق والمشاركة في المشاريع',
    description_en: 'How to collaborate with teams and participate in projects',
    duration: '18:20',
    views: 1123,
    rating: 4.7
  }
];

const HelpPage = () => {
  const { isRTL } = useDirection();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const contactMethods = [
    {
      icon: MessageCircle,
      title: isRTL ? 'الدردشة المباشرة' : 'Live Chat',
      description: isRTL ? 'متاح 24/7 للمساعدة الفورية' : 'Available 24/7 for instant help',
      action: isRTL ? 'بدء المحادثة' : 'Start Chat',
      availability: isRTL ? 'متاح الآن' : 'Available Now'
    },
    {
      icon: Mail,
      title: isRTL ? 'البريد الإلكتروني' : 'Email Support',
      description: isRTL ? 'سنرد خلال 24 ساعة' : 'We respond within 24 hours',
      action: isRTL ? 'إرسال رسالة' : 'Send Email',
      availability: 'support@platform.com'
    },
    {
      icon: Phone,
      title: isRTL ? 'الهاتف' : 'Phone Support',
      description: isRTL ? 'الأحد-الخميس 9ص-5م' : 'Sun-Thu 9AM-5PM',
      action: isRTL ? 'اتصال' : 'Call Now',
      availability: '+966 11 123 4567'
    }
  ];

  const categories = [
    { value: 'all', label: isRTL ? 'جميع الفئات' : 'All Categories' },
    { value: 'account', label: isRTL ? 'الحساب' : 'Account' },
    { value: 'ideas', label: isRTL ? 'الأفكار' : 'Ideas' },
    { value: 'projects', label: isRTL ? 'المشاريع' : 'Projects' },
    { value: 'evaluation', label: isRTL ? 'التقييم' : 'Evaluation' },
    { value: 'technical', label: isRTL ? 'تقني' : 'Technical' }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'مبتدئ':
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'متوسط':
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'متقدم':
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-SA' : 'en-US').format(num);
  };

  const FAQCard = ({ faq }: { faq: any }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg">
            {isRTL ? faq.question : faq.question_en}
          </CardTitle>
          <Badge variant="outline">
            {isRTL ? faq.category : faq.category_en}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {isRTL ? faq.answer : faq.answer_en}
        </p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{faq.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{formatNumber(faq.helpful)}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const GuideCard = ({ guide }: { guide: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">
              {isRTL ? guide.title : guide.title_en}
            </CardTitle>
            <CardDescription>
              {isRTL ? guide.description : guide.description_en}
            </CardDescription>
          </div>
          <Badge className={getLevelColor(guide.level)}>
            {isRTL ? guide.level : guide.level_en}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>{guide.chapters} {isRTL ? 'فصل' : 'chapters'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{guide.duration}</span>
            </div>
          </div>
          <Button className="w-full">
            <ChevronRight className="h-4 w-4 mr-2" />
            {isRTL ? 'بدء القراءة' : 'Start Reading'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const VideoCard = ({ video }: { video: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          {isRTL ? video.title : video.title_en}
        </CardTitle>
        <CardDescription>
          {isRTL ? video.description : video.description_en}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              <span>{video.duration}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{video.rating}</span>
              </div>
              <span>{formatNumber(video.views)} {isRTL ? 'مشاهدة' : 'views'}</span>
            </div>
          </div>
          <Button className="w-full">
            <Video className="h-4 w-4 mr-2" />
            {isRTL ? 'مشاهدة الفيديو' : 'Watch Video'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ContactCard = ({ method }: { method: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <method.icon className="h-6 w-6 text-primary" />
          {method.title}
        </CardTitle>
        <CardDescription>
          {method.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            {method.availability}
          </div>
          <Button className="w-full">
            {method.action}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'المساعدة والوثائق' : 'Help & Documentation'}
        description={isRTL ? 'العثور على إجابات وأدلة شاملة لاستخدام المنصة' : 'Find answers and comprehensive guides for using the platform'}
      >
        <div className="space-y-6">
          {/* Quick Search */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">{isRTL ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}</h2>
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={isRTL ? 'ابحث عن إجابة...' : 'Search for an answer...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="faq">{isRTL ? 'الأسئلة الشائعة' : 'FAQ'}</TabsTrigger>
              <TabsTrigger value="guides">{isRTL ? 'الأدلة' : 'Guides'}</TabsTrigger>
              <TabsTrigger value="videos">{isRTL ? 'الفيديوهات' : 'Videos'}</TabsTrigger>
              <TabsTrigger value="contact">{isRTL ? 'اتصل بنا' : 'Contact'}</TabsTrigger>
              <TabsTrigger value="downloads">{isRTL ? 'التحميلات' : 'Downloads'}</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <div className="flex gap-2 flex-wrap mb-4">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    {category.label}
                  </Button>
                ))}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockFAQs.map((faq) => (
                  <FAQCard key={faq.id} faq={faq} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  {isRTL ? 'تحتاج مساعدة إضافية؟' : 'Need additional help?'}
                </h2>
                <p className="text-muted-foreground">
                  {isRTL ? 'فريق الدعم متاح لمساعدتك' : 'Our support team is here to help you'}
                </p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-3">
                {contactMethods.map((method, index) => (
                  <ContactCard key={index} method={method} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="downloads" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      {isRTL ? 'دليل المستخدم' : 'User Manual'}
                    </CardTitle>
                    <CardDescription>
                      {isRTL ? 'دليل شامل لجميع ميزات المنصة' : 'Comprehensive guide to all platform features'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">PDF - 2.3 MB</div>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        {isRTL ? 'تحميل' : 'Download'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      {isRTL ? 'قوالب المشاريع' : 'Project Templates'}
                    </CardTitle>
                    <CardDescription>
                      {isRTL ? 'قوالب جاهزة لإنشاء مشاريع ناجحة' : 'Ready templates for creating successful projects'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">ZIP - 1.8 MB</div>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        {isRTL ? 'تحميل' : 'Download'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      {isRTL ? 'دليل المطورين' : 'Developer Guide'}
                    </CardTitle>
                    <CardDescription>
                      {isRTL ? 'وثائق للمطورين والمهندسين' : 'Documentation for developers and engineers'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">PDF - 4.1 MB</div>
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        {isRTL ? 'تحميل' : 'Download'}
                      </Button>
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

export default HelpPage;