import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Target, 
  Scale, 
  FileText, 
  ClipboardList, 
  AlertTriangle, 
  MessageSquare,
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
  Info,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Calculator
} from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  category: string;
  is_required: boolean;
  min_score: number;
  max_score: number;
  scoring_guide: string;
  created_at: string;
}

interface ScoringTemplate {
  id: string;
  name: string;
  description: string;
  criteria_ids: string[];
  evaluation_type: string;
  is_default: boolean;
  created_at: string;
}

interface EvaluationRule {
  id: string;
  name: string;
  condition_type: string;
  condition_value: number;
  action_type: string;
  action_value: string;
  is_active: boolean;
  priority: number;
}

const EvaluationManagement = () => {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  
  // State management
  const [criteria, setCriteria] = useState<EvaluationCriteria[]>([]);
  const [templates, setTemplates] = useState<ScoringTemplate[]>([]);
  const [rules, setRules] = useState<EvaluationRule[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [isCriteriaDialogOpen, setIsCriteriaDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false);
  
  // Form states
  const [criteriaForm, setCriteriaForm] = useState({
    name: '',
    description: '',
    weight: 10,
    category: '',
    is_required: true,
    min_score: 1,
    max_score: 10,
    scoring_guide: ''
  });
  
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    evaluation_type: 'innovation',
    is_default: false,
    selected_criteria: [] as string[]
  });
  
  const [ruleForm, setRuleForm] = useState({
    name: '',
    condition_type: 'min_score',
    condition_value: 5,
    action_type: 'auto_approve',
    action_value: '',
    is_active: true,
    priority: 1
  });

  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Since we don't have specific tables for evaluation management,
      // we'll use mock data for now
      setCriteria([
        {
          id: '1',
          name: isRTL ? 'الجدوى التقنية' : 'Technical Feasibility',
          description: isRTL ? 'تقييم إمكانية التنفيذ التقني للفكرة' : 'Assess the technical implementation feasibility of the idea',
          weight: 20,
          category: 'technical',
          is_required: true,
          min_score: 1,
          max_score: 10,
          scoring_guide: isRTL ? 'دليل التقييم التقني المفصل...' : 'Detailed technical evaluation guide...',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: isRTL ? 'الجدوى المالية' : 'Financial Viability',
          description: isRTL ? 'تحليل الجدوى المالية والعائد المتوقع' : 'Financial feasibility analysis and expected return',
          weight: 25,
          category: 'financial',
          is_required: true,
          min_score: 1,
          max_score: 10,
          scoring_guide: isRTL ? 'دليل التقييم المالي...' : 'Financial evaluation guide...',
          created_at: new Date().toISOString()
        }
      ]);

      setTemplates([
        {
          id: '1',
          name: isRTL ? 'قالب تقييم الابتكار' : 'Innovation Evaluation Template',
          description: isRTL ? 'قالب شامل لتقييم الأفكار الابتكارية' : 'Comprehensive template for evaluating innovative ideas',
          criteria_ids: ['1', '2'],
          evaluation_type: 'innovation',
          is_default: true,
          created_at: new Date().toISOString()
        }
      ]);

      setRules([
        {
          id: '1',
          name: isRTL ? 'قاعدة الموافقة التلقائية' : 'Auto-Approval Rule',
          condition_type: 'min_score',
          condition_value: 8,
          action_type: 'auto_approve',
          action_value: 'approved',
          is_active: true,
          priority: 1
        }
      ]);
      
    } catch (error) {
      logger.error('Failed to fetch evaluation data', { component: 'EvaluationManagement', action: 'fetchData' }, error as Error);
      toast({
        title: 'Error',
        description: 'Failed to fetch evaluation management data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveCriteria = async () => {
    try {
      if (editingItem) {
        // Update existing criteria
        const updatedCriteria = criteria.map(c => 
          c.id === editingItem.id 
            ? { ...c, ...criteriaForm, id: editingItem.id, created_at: c.created_at }
            : c
        );
        setCriteria(updatedCriteria);
      } else {
        // Add new criteria
        const newCriteria = {
          ...criteriaForm,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        setCriteria([...criteria, newCriteria]);
      }
      
      toast({
        title: isRTL ? 'تم الحفظ' : 'Saved',
        description: isRTL ? 'تم حفظ المعيار بنجاح' : 'Criteria saved successfully'
      });
      
      resetCriteriaForm();
      setIsCriteriaDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save criteria',
        variant: 'destructive'
      });
    }
  };

  const saveTemplate = async () => {
    try {
      if (editingItem) {
        const updatedTemplates = templates.map(t => 
          t.id === editingItem.id 
            ? { ...t, ...templateForm, criteria_ids: templateForm.selected_criteria, id: editingItem.id, created_at: t.created_at }
            : t
        );
        setTemplates(updatedTemplates);
      } else {
        const newTemplate = {
          ...templateForm,
          criteria_ids: templateForm.selected_criteria,
          id: Date.now().toString(),
          created_at: new Date().toISOString()
        };
        setTemplates([...templates, newTemplate]);
      }
      
      toast({
        title: isRTL ? 'تم الحفظ' : 'Saved',
        description: isRTL ? 'تم حفظ القالب بنجاح' : 'Template saved successfully'
      });
      
      resetTemplateForm();
      setIsTemplateDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save template',
        variant: 'destructive'
      });
    }
  };

  const saveRule = async () => {
    try {
      if (editingItem) {
        const updatedRules = rules.map(r => 
          r.id === editingItem.id 
            ? { ...r, ...ruleForm, id: editingItem.id }
            : r
        );
        setRules(updatedRules);
      } else {
        const newRule = {
          ...ruleForm,
          id: Date.now().toString()
        };
        setRules([...rules, newRule]);
      }
      
      toast({
        title: isRTL ? 'تم الحفظ' : 'Saved',
        description: isRTL ? 'تم حفظ القاعدة بنجاح' : 'Rule saved successfully'
      });
      
      resetRuleForm();
      setIsRuleDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save rule',
        variant: 'destructive'
      });
    }
  };

  const deleteCriteria = async (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
    toast({
      title: isRTL ? 'تم الحذف' : 'Deleted',
      description: isRTL ? 'تم حذف المعيار بنجاح' : 'Criteria deleted successfully'
    });
  };

  const deleteTemplate = async (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast({
      title: isRTL ? 'تم الحذف' : 'Deleted',
      description: isRTL ? 'تم حذف القالب بنجاح' : 'Template deleted successfully'
    });
  };

  const deleteRule = async (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    toast({
      title: isRTL ? 'تم الحذف' : 'Deleted',
      description: isRTL ? 'تم حذف القاعدة بنجاح' : 'Rule deleted successfully'
    });
  };

  const editCriteria = (criteria: EvaluationCriteria) => {
    setCriteriaForm({
      name: criteria.name,
      description: criteria.description,
      weight: criteria.weight,
      category: criteria.category,
      is_required: criteria.is_required,
      min_score: criteria.min_score,
      max_score: criteria.max_score,
      scoring_guide: criteria.scoring_guide
    });
    setEditingItem(criteria);
    setIsCriteriaDialogOpen(true);
  };

  const editTemplate = (template: ScoringTemplate) => {
    setTemplateForm({
      name: template.name,
      description: template.description,
      evaluation_type: template.evaluation_type,
      is_default: template.is_default,
      selected_criteria: template.criteria_ids
    });
    setEditingItem(template);
    setIsTemplateDialogOpen(true);
  };

  const editRule = (rule: EvaluationRule) => {
    setRuleForm({
      name: rule.name,
      condition_type: rule.condition_type,
      condition_value: rule.condition_value,
      action_type: rule.action_type,
      action_value: rule.action_value,
      is_active: rule.is_active,
      priority: rule.priority
    });
    setEditingItem(rule);
    setIsRuleDialogOpen(true);
  };

  const resetCriteriaForm = () => {
    setCriteriaForm({
      name: '',
      description: '',
      weight: 10,
      category: '',
      is_required: true,
      min_score: 1,
      max_score: 10,
      scoring_guide: ''
    });
    setEditingItem(null);
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      evaluation_type: 'innovation',
      is_default: false,
      selected_criteria: []
    });
    setEditingItem(null);
  };

  const resetRuleForm = () => {
    setRuleForm({
      name: '',
      condition_type: 'min_score',
      condition_value: 5,
      action_type: 'auto_approve',
      action_value: '',
      is_active: true,
      priority: 1
    });
    setEditingItem(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      technical: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      financial: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      strategic: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      innovation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      market: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  if (loading) {
    return (
      <AppShell>
        <PageLayout 
          title={isRTL ? 'إدارة نظام التقييم' : 'Evaluation System Management'}
          description={isRTL ? 'جاري التحميل...' : 'Loading...'}
        >
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">{isRTL ? 'جاري تحميل البيانات...' : 'Loading data...'}</p>
            </div>
          </div>
        </PageLayout>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageLayout
        title={isRTL ? 'إدارة نظام التقييم' : 'Evaluation System Management'}
        description={isRTL ? 'إدارة معايير التقييم والقوالب والقواعد' : 'Manage evaluation criteria, templates, and rules'}
        primaryAction={{
          label: isRTL ? 'إعدادات النظام' : 'System Settings',
          onClick: () => {},
          icon: <Settings className="w-4 h-4" />
        }}
      >
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'المعايير النشطة' : 'Active Criteria'}</p>
                  <p className="text-2xl font-bold">{criteria.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'القوالب' : 'Templates'}</p>
                  <p className="text-2xl font-bold">{templates.length}</p>
                </div>
                <FileText className="h-8 w-8 text-success" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'القواعد النشطة' : 'Active Rules'}</p>
                  <p className="text-2xl font-bold">{rules.filter(r => r.is_active).length}</p>
                </div>
                <Scale className="h-8 w-8 text-warning" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{isRTL ? 'متوسط الوزن' : 'Avg Weight'}</p>
                  <p className="text-2xl font-bold">{criteria.length > 0 ? Math.round(criteria.reduce((sum, c) => sum + c.weight, 0) / criteria.length) : 0}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-info" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="criteria" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="criteria" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                {isRTL ? 'المعايير' : 'Criteria'}
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {isRTL ? 'القوالب' : 'Templates'}
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                {isRTL ? 'القواعد' : 'Rules'}
              </TabsTrigger>
              <TabsTrigger value="scorecards" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                {isRTL ? 'بطاقات النتائج' : 'Scorecards'}
              </TabsTrigger>
              <TabsTrigger value="framework" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {isRTL ? 'الإطار' : 'Framework'}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {isRTL ? 'التحليلات' : 'Analytics'}
              </TabsTrigger>
            </TabsList>

            {/* Criteria Tab */}
            <TabsContent value="criteria" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{isRTL ? 'معايير التقييم' : 'Evaluation Criteria'}</h3>
                <Dialog open={isCriteriaDialogOpen} onOpenChange={setIsCriteriaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetCriteriaForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      {isRTL ? 'إضافة معيار' : 'Add Criteria'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? (isRTL ? 'تعديل المعيار' : 'Edit Criteria') : (isRTL ? 'إضافة معيار جديد' : 'Add New Criteria')}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="criteria-name">{isRTL ? 'اسم المعيار' : 'Criteria Name'}</Label>
                          <Input
                            id="criteria-name"
                            value={criteriaForm.name}
                            onChange={(e) => setCriteriaForm({...criteriaForm, name: e.target.value})}
                            placeholder={isRTL ? 'أدخل اسم المعيار' : 'Enter criteria name'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="criteria-category">{isRTL ? 'الفئة' : 'Category'}</Label>
                          <Select value={criteriaForm.category} onValueChange={(value) => setCriteriaForm({...criteriaForm, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? 'اختر الفئة' : 'Select category'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">{isRTL ? 'تقني' : 'Technical'}</SelectItem>
                              <SelectItem value="financial">{isRTL ? 'مالي' : 'Financial'}</SelectItem>
                              <SelectItem value="strategic">{isRTL ? 'استراتيجي' : 'Strategic'}</SelectItem>
                              <SelectItem value="innovation">{isRTL ? 'ابتكار' : 'Innovation'}</SelectItem>
                              <SelectItem value="market">{isRTL ? 'سوق' : 'Market'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="criteria-description">{isRTL ? 'الوصف' : 'Description'}</Label>
                        <Textarea
                          id="criteria-description"
                          value={criteriaForm.description}
                          onChange={(e) => setCriteriaForm({...criteriaForm, description: e.target.value})}
                          placeholder={isRTL ? 'أدخل وصف المعيار' : 'Enter criteria description'}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>{isRTL ? 'الوزن (%)' : 'Weight (%)'}</Label>
                          <div className="px-3">
                            <Slider
                              value={[criteriaForm.weight]}
                              onValueChange={(value) => setCriteriaForm({...criteriaForm, weight: value[0]})}
                              max={50}
                              min={1}
                              step={1}
                              className="w-full"
                            />
                            <div className="text-center text-sm text-muted-foreground mt-1">
                              {criteriaForm.weight}%
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>{isRTL ? 'الحد الأدنى' : 'Min Score'}</Label>
                          <Input
                            type="number"
                            value={criteriaForm.min_score}
                            onChange={(e) => setCriteriaForm({...criteriaForm, min_score: Number(e.target.value)})}
                            min={1}
                            max={10}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{isRTL ? 'الحد الأقصى' : 'Max Score'}</Label>
                          <Input
                            type="number"
                            value={criteriaForm.max_score}
                            onChange={(e) => setCriteriaForm({...criteriaForm, max_score: Number(e.target.value)})}
                            min={1}
                            max={10}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scoring-guide">{isRTL ? 'دليل التقييم' : 'Scoring Guide'}</Label>
                        <Textarea
                          id="scoring-guide"
                          value={criteriaForm.scoring_guide}
                          onChange={(e) => setCriteriaForm({...criteriaForm, scoring_guide: e.target.value})}
                          placeholder={isRTL ? 'أدخل دليل التقييم المفصل' : 'Enter detailed scoring guide'}
                          rows={4}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-required"
                          checked={criteriaForm.is_required}
                          onCheckedChange={(checked) => setCriteriaForm({...criteriaForm, is_required: checked})}
                        />
                        <Label htmlFor="is-required">{isRTL ? 'معيار إجباري' : 'Required Criteria'}</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCriteriaDialogOpen(false)}>
                          {isRTL ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button onClick={saveCriteria}>
                          <Save className="w-4 h-4 mr-2" />
                          {isRTL ? 'حفظ' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {criteria.map((criterion) => (
                  <Card key={criterion.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{criterion.name}</CardTitle>
                          <CardDescription>{criterion.description}</CardDescription>
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(criterion.category)}>
                              {criterion.category}
                            </Badge>
                            <Badge variant="outline">
                              {isRTL ? 'الوزن:' : 'Weight:'} {criterion.weight}%
                            </Badge>
                            <Badge variant="outline">
                              {criterion.min_score}-{criterion.max_score}
                            </Badge>
                            {criterion.is_required && (
                              <Badge variant="destructive">{isRTL ? 'إجباري' : 'Required'}</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editCriteria(criterion)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{isRTL ? 'حذف المعيار' : 'Delete Criteria'}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {isRTL ? 'هل أنت متأكد من حذف هذا المعيار؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this criteria? This action cannot be undone.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteCriteria(criterion.id)}>
                                  {isRTL ? 'حذف' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    {criterion.scoring_guide && (
                      <CardContent>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{isRTL ? 'دليل التقييم:' : 'Scoring Guide:'}</Label>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {criterion.scoring_guide}
                          </p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{isRTL ? 'قوالب التقييم' : 'Evaluation Templates'}</h3>
                <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetTemplateForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      {isRTL ? 'إضافة قالب' : 'Add Template'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? (isRTL ? 'تعديل القالب' : 'Edit Template') : (isRTL ? 'إضافة قالب جديد' : 'Add New Template')}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="template-name">{isRTL ? 'اسم القالب' : 'Template Name'}</Label>
                          <Input
                            id="template-name"
                            value={templateForm.name}
                            onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                            placeholder={isRTL ? 'أدخل اسم القالب' : 'Enter template name'}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="evaluation-type">{isRTL ? 'نوع التقييم' : 'Evaluation Type'}</Label>
                          <Select value={templateForm.evaluation_type} onValueChange={(value) => setTemplateForm({...templateForm, evaluation_type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={isRTL ? 'اختر النوع' : 'Select type'} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="innovation">{isRTL ? 'ابتكار' : 'Innovation'}</SelectItem>
                              <SelectItem value="feasibility">{isRTL ? 'جدوى' : 'Feasibility'}</SelectItem>
                              <SelectItem value="impact">{isRTL ? 'تأثير' : 'Impact'}</SelectItem>
                              <SelectItem value="comprehensive">{isRTL ? 'شامل' : 'Comprehensive'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="template-description">{isRTL ? 'الوصف' : 'Description'}</Label>
                        <Textarea
                          id="template-description"
                          value={templateForm.description}
                          onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                          placeholder={isRTL ? 'أدخل وصف القالب' : 'Enter template description'}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{isRTL ? 'المعايير المحددة' : 'Selected Criteria'}</Label>
                        <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                          {criteria.map((criterion) => (
                            <div key={criterion.id} className="flex items-center space-x-2 mb-2">
                              <input
                                type="checkbox"
                                id={`criteria-${criterion.id}`}
                                checked={templateForm.selected_criteria.includes(criterion.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setTemplateForm({
                                      ...templateForm,
                                      selected_criteria: [...templateForm.selected_criteria, criterion.id]
                                    });
                                  } else {
                                    setTemplateForm({
                                      ...templateForm,
                                      selected_criteria: templateForm.selected_criteria.filter(id => id !== criterion.id)
                                    });
                                  }
                                }}
                                className="rounded"
                              />
                              <Label htmlFor={`criteria-${criterion.id}`} className="text-sm">
                                {criterion.name} ({criterion.weight}%)
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-default"
                          checked={templateForm.is_default}
                          onCheckedChange={(checked) => setTemplateForm({...templateForm, is_default: checked})}
                        />
                        <Label htmlFor="is-default">{isRTL ? 'قالب افتراضي' : 'Default Template'}</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                          {isRTL ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button onClick={saveTemplate}>
                          <Save className="w-4 h-4 mr-2" />
                          {isRTL ? 'حفظ' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {templates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{template.name}</CardTitle>
                            {template.is_default && (
                              <Badge className="bg-primary/10 text-primary">{isRTL ? 'افتراضي' : 'Default'}</Badge>
                            )}
                          </div>
                          <CardDescription>{template.description}</CardDescription>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{template.evaluation_type}</Badge>
                            <Badge variant="outline">
                              {template.criteria_ids.length} {isRTL ? 'معيار' : 'criteria'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editTemplate(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{isRTL ? 'حذف القالب' : 'Delete Template'}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {isRTL ? 'هل أنت متأكد من حذف هذا القالب؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this template? This action cannot be undone.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTemplate(template.id)}>
                                  {isRTL ? 'حذف' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{isRTL ? 'المعايير المضمنة:' : 'Included Criteria:'}</Label>
                        <div className="flex flex-wrap gap-2">
                          {template.criteria_ids.map(criteriaId => {
                            const criterion = criteria.find(c => c.id === criteriaId);
                            return criterion ? (
                              <Badge key={criteriaId} variant="secondary" className="text-xs">
                                {criterion.name} ({criterion.weight}%)
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Rules Tab */}
            <TabsContent value="rules" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{isRTL ? 'قواعد التقييم' : 'Evaluation Rules'}</h3>
                <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetRuleForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      {isRTL ? 'إضافة قاعدة' : 'Add Rule'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? (isRTL ? 'تعديل القاعدة' : 'Edit Rule') : (isRTL ? 'إضافة قاعدة جديدة' : 'Add New Rule')}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-name">{isRTL ? 'اسم القاعدة' : 'Rule Name'}</Label>
                        <Input
                          id="rule-name"
                          value={ruleForm.name}
                          onChange={(e) => setRuleForm({...ruleForm, name: e.target.value})}
                          placeholder={isRTL ? 'أدخل اسم القاعدة' : 'Enter rule name'}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{isRTL ? 'نوع الشرط' : 'Condition Type'}</Label>
                          <Select value={ruleForm.condition_type} onValueChange={(value) => setRuleForm({...ruleForm, condition_type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="min_score">{isRTL ? 'الحد الأدنى للنتيجة' : 'Minimum Score'}</SelectItem>
                              <SelectItem value="max_score">{isRTL ? 'الحد الأقصى للنتيجة' : 'Maximum Score'}</SelectItem>
                              <SelectItem value="avg_score">{isRTL ? 'متوسط النتيجة' : 'Average Score'}</SelectItem>
                              <SelectItem value="criteria_score">{isRTL ? 'نتيجة معيار محدد' : 'Specific Criteria Score'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{isRTL ? 'قيمة الشرط' : 'Condition Value'}</Label>
                          <Input
                            type="number"
                            value={ruleForm.condition_value}
                            onChange={(e) => setRuleForm({...ruleForm, condition_value: Number(e.target.value)})}
                            min={1}
                            max={10}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{isRTL ? 'نوع الإجراء' : 'Action Type'}</Label>
                          <Select value={ruleForm.action_type} onValueChange={(value) => setRuleForm({...ruleForm, action_type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto_approve">{isRTL ? 'موافقة تلقائية' : 'Auto Approve'}</SelectItem>
                              <SelectItem value="auto_reject">{isRTL ? 'رفض تلقائي' : 'Auto Reject'}</SelectItem>
                              <SelectItem value="flag_review">{isRTL ? 'تحديد للمراجعة' : 'Flag for Review'}</SelectItem>
                              <SelectItem value="assign_evaluator">{isRTL ? 'تعيين مقيم' : 'Assign Evaluator'}</SelectItem>
                              <SelectItem value="send_notification">{isRTL ? 'إرسال إشعار' : 'Send Notification'}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{isRTL ? 'الأولوية' : 'Priority'}</Label>
                          <Input
                            type="number"
                            value={ruleForm.priority}
                            onChange={(e) => setRuleForm({...ruleForm, priority: Number(e.target.value)})}
                            min={1}
                            max={10}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>{isRTL ? 'قيمة الإجراء' : 'Action Value'}</Label>
                        <Input
                          value={ruleForm.action_value}
                          onChange={(e) => setRuleForm({...ruleForm, action_value: e.target.value})}
                          placeholder={isRTL ? 'أدخل قيمة الإجراء (اختياري)' : 'Enter action value (optional)'}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="rule-active"
                          checked={ruleForm.is_active}
                          onCheckedChange={(checked) => setRuleForm({...ruleForm, is_active: checked})}
                        />
                        <Label htmlFor="rule-active">{isRTL ? 'قاعدة نشطة' : 'Active Rule'}</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                          {isRTL ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button onClick={saveRule}>
                          <Save className="w-4 h-4 mr-2" />
                          {isRTL ? 'حفظ' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {rules.map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{rule.name}</CardTitle>
                            <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                              {rule.is_active ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                            </Badge>
                            <Badge variant="outline">
                              {isRTL ? 'أولوية' : 'Priority'} {rule.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{isRTL ? 'الشرط:' : 'Condition:'}</span> {rule.condition_type} ≥ {rule.condition_value}
                            <br />
                            <span className="font-medium">{isRTL ? 'الإجراء:' : 'Action:'}</span> {rule.action_type}
                            {rule.action_value && ` (${rule.action_value})`}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => editRule(rule)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{isRTL ? 'حذف القاعدة' : 'Delete Rule'}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {isRTL ? 'هل أنت متأكد من حذف هذه القاعدة؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete this rule? This action cannot be undone.'}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{isRTL ? 'إلغاء' : 'Cancel'}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteRule(rule.id)}>
                                  {isRTL ? 'حذف' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Scorecards Tab */}
            <TabsContent value="scorecards" className="space-y-4">
              <div className="text-center py-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {isRTL ? 'بطاقات النتائج' : 'Evaluation Scorecards'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isRTL ? 'إدارة وتخصيص بطاقات النتائج لتقييم الأفكار' : 'Manage and customize scorecards for idea evaluation'}
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {isRTL ? 'إنشاء بطاقة نتائج' : 'Create Scorecard'}
                </Button>
              </div>
            </TabsContent>

            {/* Framework Tab */}
            <TabsContent value="framework" className="space-y-4">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {isRTL ? 'إطار التقييم' : 'Evaluation Framework'}
                    </CardTitle>
                    <CardDescription>
                      {isRTL ? 'تكوين الإطار العام لنظام التقييم' : 'Configure the overall evaluation system framework'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{isRTL ? 'نوع المقياس' : 'Scale Type'}</Label>
                        <Select defaultValue="1-10">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">1-5 {isRTL ? 'نقاط' : 'Points'}</SelectItem>
                            <SelectItem value="1-10">1-10 {isRTL ? 'نقاط' : 'Points'}</SelectItem>
                            <SelectItem value="1-100">1-100 {isRTL ? 'نقطة' : 'Points'}</SelectItem>
                            <SelectItem value="percentage">{isRTL ? 'نسبة مئوية' : 'Percentage'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{isRTL ? 'طريقة حساب النتيجة النهائية' : 'Final Score Calculation'}</Label>
                        <Select defaultValue="weighted_average">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weighted_average">{isRTL ? 'متوسط مرجح' : 'Weighted Average'}</SelectItem>
                            <SelectItem value="simple_average">{isRTL ? 'متوسط بسيط' : 'Simple Average'}</SelectItem>
                            <SelectItem value="sum">{isRTL ? 'مجموع' : 'Sum'}</SelectItem>
                            <SelectItem value="custom">{isRTL ? 'مخصص' : 'Custom'}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      {isRTL ? 'حدود التقييم' : 'Evaluation Thresholds'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-success">{isRTL ? 'حد الموافقة (ممتاز)' : 'Approval Threshold (Excellent)'}</Label>
                        <Input type="number" defaultValue="8" min="1" max="10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-warning">{isRTL ? 'حد المراجعة (جيد)' : 'Review Threshold (Good)'}</Label>
                        <Input type="number" defaultValue="6" min="1" max="10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-destructive">{isRTL ? 'حد الرفض (ضعيف)' : 'Rejection Threshold (Poor)'}</Label>
                        <Input type="number" defaultValue="4" min="1" max="10" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      {isRTL ? 'إحصائيات المعايير' : 'Criteria Statistics'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {criteria.map((criterion) => (
                        <div key={criterion.id} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{criterion.name}</div>
                            <div className="text-sm text-muted-foreground">{criterion.category}</div>
                          </div>
                          <Badge variant="outline">{criterion.weight}%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      {isRTL ? 'إحصائيات الاستخدام' : 'Usage Statistics'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'إجمالي التقييمات' : 'Total Evaluations'}</span>
                        <span className="font-bold">124</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'متوسط النتيجة' : 'Average Score'}</span>
                        <span className="font-bold">7.2/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'معدل الموافقة' : 'Approval Rate'}</span>
                        <span className="font-bold">68%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{isRTL ? 'وقت التقييم المتوسط' : 'Avg Evaluation Time'}</span>
                        <span className="font-bold">{isRTL ? '3.5 أيام' : '3.5 days'}</span>
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

export default EvaluationManagement;