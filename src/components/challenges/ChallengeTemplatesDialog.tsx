import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Zap,
  Target, 
  Lightbulb, 
  Code, 
  Heart, 
  Leaf, 
  Briefcase,
  Search,
  Filter,
  Plus,
  Star,
  Clock,
  Users,
  Award
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getCategoryMapping, getDifficultyMapping, getFilterOptions } from '@/config/challengesPageConfig';

interface ChallengeTemplate {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  category: string;
  difficulty: 'سهل' | 'متوسط' | 'صعب';
  estimated_duration: number; // days
  suggested_budget: number;
  requirements: string[];
  timeline_phases: Array<{
    phase_ar: string;
    phase_en: string;
    duration_days: number;
    description_ar: string;
    description_en: string;
  }>;
  success_criteria: string[];
  is_featured: boolean;
  usage_count: number;
  template_data: {
    title_template_ar: string;
    title_template_en: string;
    description_template_ar: string;
    description_template_en: string;
    challenge_type: string;
    priority_level: string;
  };
}

interface ChallengeTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (template: ChallengeTemplate) => void;
}

export const ChallengeTemplatesDialog = ({
  open,
  onOpenChange,
  onTemplateSelect
}: ChallengeTemplatesDialogProps) => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ChallengeTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock templates data - in real app, this would come from Supabase
  const mockTemplates: ChallengeTemplate[] = [
    {
      id: '1',
      name_ar: 'تطبيق ذكي للصحة',
      name_en: 'Smart Health App',
      description_ar: 'تطوير تطبيق ذكي لمراقبة الصحة واللياقة البدنية',
      description_en: 'Develop a smart app for health and fitness monitoring',
      category: 'health',
      difficulty: 'متوسط',
      estimated_duration: 60,
      suggested_budget: 100000,
      requirements: ['خبرة في تطوير التطبيقات', 'معرفة بأجهزة الاستشعار', 'فهم المجال الصحي'],
      timeline_phases: [
        {
          phase_ar: 'التخطيط والتصميم',
          phase_en: 'Planning & Design',
          duration_days: 15,
          description_ar: 'وضع خطة المشروع وتصميم واجهة المستخدم',
          description_en: 'Project planning and UI/UX design'
        },
        {
          phase_ar: 'التطوير',
          phase_en: 'Development',
          duration_days: 30,
          description_ar: 'تطوير التطبيق والميزات الأساسية',
          description_en: 'App development and core features'
        },
        {
          phase_ar: 'الاختبار والتحسين',
          phase_en: 'Testing & Optimization',
          duration_days: 15,
          description_ar: 'اختبار التطبيق وتحسين الأداء',
          description_en: 'Testing and performance optimization'
        }
      ],
      success_criteria: ['تطبيق يعمل بكفاءة', 'واجهة مستخدم سهلة', 'دقة في البيانات'],
      is_featured: true,
      usage_count: 45,
      template_data: {
        title_template_ar: 'تطبيق ذكي للصحة - [اسم المشروع]',
        title_template_en: 'Smart Health App - [Project Name]',
        description_template_ar: 'تطوير تطبيق ذكي يساعد المستخدمين على مراقبة صحتهم ولياقتهم البدنية...',
        description_template_en: 'Develop a smart application that helps users monitor their health and fitness...',
        challenge_type: 'health',
        priority_level: 'متوسط'
      }
    },
    {
      id: '2',
      name_ar: 'منصة تعليمية تفاعلية',
      name_en: 'Interactive Learning Platform',
      description_ar: 'إنشاء منصة تعليمية تفاعلية تستخدم التقنيات الحديثة',
      description_en: 'Create an interactive learning platform using modern technologies',
      category: 'educational',
      difficulty: 'صعب',
      estimated_duration: 90,
      suggested_budget: 200000,
      requirements: ['خبرة في تطوير الويب', 'معرفة بتقنيات الذكاء الاصطناعي', 'فهم التعليم الإلكتروني'],
      timeline_phases: [
        {
          phase_ar: 'البحث والتحليل',
          phase_en: 'Research & Analysis',
          duration_days: 20,
          description_ar: 'دراسة احتياجات السوق والمستخدمين',
          description_en: 'Market and user needs analysis'
        },
        {
          phase_ar: 'التطوير التدريجي',
          phase_en: 'Iterative Development',
          duration_days: 50,
          description_ar: 'تطوير المنصة على مراحل',
          description_en: 'Platform development in phases'
        },
        {
          phase_ar: 'التجريب والإطلاق',
          phase_en: 'Testing & Launch',
          duration_days: 20,
          description_ar: 'اختبار شامل وإطلاق تجريبي',
          description_en: 'Comprehensive testing and pilot launch'
        }
      ],
      success_criteria: ['منصة قابلة للتوسع', 'تجربة مستخدم ممتازة', 'محتوى تعليمي عالي الجودة'],
      is_featured: true,
      usage_count: 32,
      template_data: {
        title_template_ar: 'منصة تعليمية تفاعلية - [التخصص]',
        title_template_en: 'Interactive Learning Platform - [Specialization]',
        description_template_ar: 'إنشاء منصة تعليمية متطورة تستخدم أحدث التقنيات لتوفير تجربة تعليمية تفاعلية...',
        description_template_en: 'Create an advanced learning platform using cutting-edge technologies for interactive education...',
        challenge_type: 'educational',
        priority_level: 'عالي'
      }
    },
    {
      id: '3',
      name_ar: 'حل بيئي مبتكر',
      name_en: 'Innovative Environmental Solution',
      description_ar: 'تطوير حل تقني مبتكر لمعالجة التحديات البيئية',
      description_en: 'Develop an innovative technical solution for environmental challenges',
      category: 'environmental',
      difficulty: 'متوسط',
      estimated_duration: 45,
      suggested_budget: 75000,
      requirements: ['معرفة بالقضايا البيئية', 'خبرة في التقنيات الخضراء', 'مهارات في الابتكار'],
      timeline_phases: [
        {
          phase_ar: 'تحديد المشكلة',
          phase_en: 'Problem Definition',
          duration_days: 10,
          description_ar: 'تحديد التحدي البيئي المحدد',
          description_en: 'Define specific environmental challenge'
        },
        {
          phase_ar: 'تطوير الحل',
          phase_en: 'Solution Development',
          duration_days: 25,
          description_ar: 'تصميم وتطوير الحل التقني',
          description_en: 'Design and develop technical solution'
        },
        {
          phase_ar: 'التجريب والتحقق',
          phase_en: 'Testing & Validation',
          duration_days: 10,
          description_ar: 'اختبار فعالية الحل',
          description_en: 'Test solution effectiveness'
        }
      ],
      success_criteria: ['حل قابل للتطبيق', 'تأثير بيئي إيجابي', 'جدوى اقتصادية'],
      is_featured: false,
      usage_count: 28,
      template_data: {
        title_template_ar: 'حل بيئي مبتكر - [نوع التحدي]',
        title_template_en: 'Environmental Solution - [Challenge Type]',
        description_template_ar: 'تطوير حل تقني مبتكر ومستدام لمعالجة التحديات البيئية...',
        description_template_en: 'Develop an innovative and sustainable technical solution for environmental challenges...',
        challenge_type: 'environmental',
        priority_level: 'عالي'
      }
    }
  ];

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTemplates(mockTemplates);
      setLoading(false);
    }, 1000);
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name_ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.name_en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getCategoryIcon = (category: string) => {
    const mapping = getCategoryMapping(category);
    const IconComponent = mapping.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  const getDifficultyColor = (difficulty: string) => {
    return getDifficultyMapping(difficulty).color;
  };

  const handleTemplateSelect = (template: ChallengeTemplate) => {
    onTemplateSelect(template);
    toast({
      title: isRTL ? 'تم اختيار القالب' : 'Template Selected',
      description: isRTL ? 
        `تم اختيار قالب "${template.name_ar}"` : 
        `Selected template "${template.name_en}"`,
    });
    onOpenChange(false);
  };

  const TemplateCard = ({ template }: { template: ChallengeTemplate }) => (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" 
          onClick={() => handleTemplateSelect(template)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(template.category)}
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {isRTL ? template.name_ar : template.name_en}
            </CardTitle>
            {template.is_featured && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Star className="w-3 h-3 mr-1" />
                {isRTL ? 'مميز' : 'Featured'}
              </Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {isRTL ? template.description_ar : template.description_en}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={getDifficultyColor(template.difficulty)}>
            {template.difficulty}
          </Badge>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {template.estimated_duration} {isRTL ? 'يوم' : 'days'}
          </Badge>
          <Badge variant="outline">
            <Award className="w-3 h-3 mr-1" />
            {Math.floor(template.suggested_budget / 1000)}K {isRTL ? 'ر.س' : 'SAR'}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{template.usage_count} {isRTL ? 'استخدام' : 'uses'}</span>
          </div>
          <span>{template.timeline_phases.length} {isRTL ? 'مراحل' : 'phases'}</span>
        </div>
        
        <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {isRTL ? 'استخدام القالب' : 'Use Template'}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-primary" />
            {isRTL ? 'قوالب التحديات' : 'Challenge Templates'}
          </DialogTitle>
        </DialogHeader>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={isRTL ? 'البحث في القوالب...' : 'Search templates...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder={isRTL ? 'الفئة' : 'Category'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع الفئات' : 'All Categories'}</SelectItem>
              {getFilterOptions('category').filter(cat => cat.value !== 'all').map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {isRTL ? category.labelAr : category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder={isRTL ? 'المستوى' : 'Difficulty'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isRTL ? 'جميع المستويات' : 'All Levels'}</SelectItem>
              {getFilterOptions('difficulty').filter(diff => diff.value !== 'all').map((difficulty) => (
                <SelectItem key={difficulty.value} value={difficulty.value}>
                  {isRTL ? difficulty.labelAr : difficulty.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Templates Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="h-5 bg-muted rounded w-16" />
                      <div className="h-5 bg-muted rounded w-20" />
                    </div>
                    <div className="h-9 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              {isRTL ? 'لم يتم العثور على قوالب' : 'No templates found'}
            </h3>
            <p className="text-muted-foreground">
              {isRTL ? 'جرب تعديل معايير البحث' : 'Try adjusting your search criteria'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};