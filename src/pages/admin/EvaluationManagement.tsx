import { useState, useEffect } from 'react';
import { AdminBreadcrumb } from "@/components/layout/AdminBreadcrumb";
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
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

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
  const { t } = useUnifiedTranslation();
  
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
      <PageLayout
          title={t('admin:evaluation.title')}
          description={t('admin:common.loading')}
        >
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">{t('admin:evaluation.loading')}</p>
            </div>
          </div>
        </PageLayout>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminBreadcrumb />
      <PageLayout
        title={t('admin:evaluation.title')}
        description={t('admin:evaluation.description')}
        primaryAction={{
          label: t('admin:evaluation.system_settings'),
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
                  <p className="text-sm text-muted-foreground">{t('admin:evaluation.metrics.active_criteria')}</p>
                  <p className="text-2xl font-bold">{criteria.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin:evaluation.metrics.templates')}</p>
                  <p className="text-2xl font-bold">{templates.length}</p>
                </div>
                <FileText className="h-8 w-8 text-success" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin:evaluation.metrics.active_rules')}</p>
                  <p className="text-2xl font-bold">{rules.filter(r => r.is_active).length}</p>
                </div>
                <Scale className="h-8 w-8 text-warning" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('admin:evaluation.metrics.avg_weight')}</p>
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
                {t('admin:evaluation.tabs.criteria')}
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {t('admin:evaluation.tabs.templates')}
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                {t('admin:evaluation.tabs.rules')}
              </TabsTrigger>
              <TabsTrigger value="scorecards" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                {t('admin:evaluation.tabs.scorecards')}
              </TabsTrigger>
              <TabsTrigger value="framework" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                {t('admin:evaluation.tabs.framework')}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                {t('admin:evaluation.tabs.analytics')}
              </TabsTrigger>
            </TabsList>

            {/* Criteria Tab */}
            <TabsContent value="criteria" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('admin:evaluation.criteria.title')}</h3>
                <Dialog open={isCriteriaDialogOpen} onOpenChange={setIsCriteriaDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetCriteriaForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('admin:evaluation.criteria.add')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? t('admin:evaluation.criteria.edit') : t('admin:evaluation.criteria.add_new')}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="criteria-name">{t('admin:evaluation.criteria.name')}</Label>
                          <Input
                            id="criteria-name"
                            value={criteriaForm.name}
                            onChange={(e) => setCriteriaForm({...criteriaForm, name: e.target.value})}
                            placeholder={t('admin:evaluation.criteria.name_placeholder')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="criteria-category">{t('admin:evaluation.criteria.category')}</Label>
                          <Select value={criteriaForm.category} onValueChange={(value) => setCriteriaForm({...criteriaForm, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('admin:evaluation.criteria.category_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technical">{t('admin:evaluation.criteria.categories.technical')}</SelectItem>
                              <SelectItem value="financial">{t('admin:evaluation.criteria.categories.financial')}</SelectItem>
                              <SelectItem value="strategic">{t('admin:evaluation.criteria.categories.strategic')}</SelectItem>
                              <SelectItem value="innovation">{t('admin:evaluation.criteria.categories.innovation')}</SelectItem>
                              <SelectItem value="market">{t('admin:evaluation.criteria.categories.market')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="criteria-description">{t('admin:evaluation.criteria.description')}</Label>
                        <Textarea
                          id="criteria-description"
                          value={criteriaForm.description}
                          onChange={(e) => setCriteriaForm({...criteriaForm, description: e.target.value})}
                          placeholder={t('admin:evaluation.criteria.description_placeholder')}
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>{t('admin:evaluation.criteria.weight')}</Label>
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
                          <Label>{t('admin:evaluation.criteria.min_score')}</Label>
                          <Input
                            type="number"
                            value={criteriaForm.min_score}
                            onChange={(e) => setCriteriaForm({...criteriaForm, min_score: Number(e.target.value)})}
                            min={1}
                            max={10}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t('admin:evaluation.criteria.max_score')}</Label>
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
                        <Label htmlFor="scoring-guide">{t('admin:evaluation.criteria.scoring_guide')}</Label>
                        <Textarea
                          id="scoring-guide"
                          value={criteriaForm.scoring_guide}
                          onChange={(e) => setCriteriaForm({...criteriaForm, scoring_guide: e.target.value})}
                          placeholder={t('admin:evaluation.criteria.scoring_guide_placeholder')}
                          rows={4}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is-required"
                          checked={criteriaForm.is_required}
                          onCheckedChange={(checked) => setCriteriaForm({...criteriaForm, is_required: checked})}
                        />
                        <Label htmlFor="is-required">{t('admin:evaluation.criteria.required')}</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCriteriaDialogOpen(false)}>
                          {t('admin:evaluation.common.cancel')}
                        </Button>
                        <Button onClick={saveCriteria}>
                          <Save className="w-4 h-4 mr-2" />
                          {t('admin:evaluation.common.save')}
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
                              {t('admin:evaluation.common.weight_label')} {criterion.weight}%
                            </Badge>
                            <Badge variant="outline">
                              {criterion.min_score}-{criterion.max_score}
                            </Badge>
                            {criterion.is_required && (
                              <Badge variant="destructive">{t('admin:evaluation.criteria.required')}</Badge>
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
                                <AlertDialogTitle>{t('admin:evaluation.criteria.delete_title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('admin:evaluation.criteria.delete_confirm')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('admin:evaluation.common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteCriteria(criterion.id)}>
                                  {t('admin:evaluation.common.delete')}
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
                          <Label className="text-sm font-medium">{t('admin:evaluation.criteria.scoring_guide')}</Label>
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
                <h3 className="text-lg font-semibold">{t('admin:evaluation.templates.title')}</h3>
                <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetTemplateForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('admin:evaluation.templates.add')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? t('admin:evaluation.templates.edit') : t('admin:evaluation.templates.add_new')}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="template-name">{t('admin:evaluation.templates.name')}</Label>
                          <Input
                            id="template-name"
                            value={templateForm.name}
                            onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                            placeholder={t('admin:evaluation.templates.name_placeholder')}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="evaluation-type">{t('admin:evaluation.templates.type')}</Label>
                          <Select value={templateForm.evaluation_type} onValueChange={(value) => setTemplateForm({...templateForm, evaluation_type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder={t('admin:evaluation.templates.type_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="innovation">{t('admin:evaluation.templates.types.innovation')}</SelectItem>
                              <SelectItem value="feasibility">{t('admin:evaluation.templates.types.feasibility')}</SelectItem>
                              <SelectItem value="impact">{t('admin:evaluation.templates.types.impact')}</SelectItem>
                              <SelectItem value="comprehensive">{t('admin:evaluation.templates.types.comprehensive')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="template-description">{t('admin:evaluation.templates.description')}</Label>
                        <Textarea
                          id="template-description"
                          value={templateForm.description}
                          onChange={(e) => setTemplateForm({...templateForm, description: e.target.value})}
                          placeholder={t('admin:evaluation.templates.description_placeholder')}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t('admin:evaluation.templates.selected_criteria')}</Label>
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
                        <Label htmlFor="is-default">{t('admin:evaluation.templates.default')}</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>
                          {t('admin:evaluation.common.cancel')}
                        </Button>
                        <Button onClick={saveTemplate}>
                          <Save className="w-4 h-4 mr-2" />
                          {t('admin:evaluation.common.save')}
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
                              <Badge className="bg-primary/10 text-primary">{t('admin:evaluation.templates.default')}</Badge>
                            )}
                          </div>
                          <CardDescription>{template.description}</CardDescription>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{template.evaluation_type}</Badge>
                            <Badge variant="outline">
                              {template.criteria_ids.length} {t('admin:evaluation.templates.criteria_count')}
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
                                <AlertDialogTitle>{t('admin:evaluation.templates.delete_title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('admin:evaluation.templates.delete_confirm')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('admin:evaluation.common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTemplate(template.id)}>
                                  {t('admin:evaluation.common.delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">{t('admin:evaluation.templates.included_criteria')}</Label>
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
                <h3 className="text-lg font-semibold">{t('admin:evaluation.rules.title')}</h3>
                <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetRuleForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('admin:evaluation.rules.add')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? t('admin:evaluation.rules.edit') : t('admin:evaluation.rules.add_new')}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="rule-name">{t('admin:evaluation.rules.name')}</Label>
                        <Input
                          id="rule-name"
                          value={ruleForm.name}
                          onChange={(e) => setRuleForm({...ruleForm, name: e.target.value})}
                          placeholder={t('admin:evaluation.rules.name_placeholder')}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t('admin:evaluation.rules.condition_type')}</Label>
                          <Select value={ruleForm.condition_type} onValueChange={(value) => setRuleForm({...ruleForm, condition_type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="min_score">{t('admin:evaluation.rules.conditions.min_score')}</SelectItem>
                              <SelectItem value="max_score">{t('admin:evaluation.rules.conditions.max_score')}</SelectItem>
                              <SelectItem value="avg_score">{t('admin:evaluation.rules.conditions.avg_score')}</SelectItem>
                              <SelectItem value="criteria_score">{t('admin:evaluation.rules.conditions.criteria_score')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('admin:evaluation.rules.condition_value')}</Label>
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
                          <Label>{t('admin:evaluation.rules.action_type')}</Label>
                          <Select value={ruleForm.action_type} onValueChange={(value) => setRuleForm({...ruleForm, action_type: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto_approve">{t('admin:evaluation.rules.actions.auto_approve')}</SelectItem>
                              <SelectItem value="auto_reject">{t('admin:evaluation.rules.actions.auto_reject')}</SelectItem>
                              <SelectItem value="flag_review">{t('admin:evaluation.rules.actions.flag_review')}</SelectItem>
                              <SelectItem value="assign_evaluator">{t('admin:evaluation.rules.actions.assign_evaluator')}</SelectItem>
                              <SelectItem value="send_notification">{t('admin:evaluation.rules.actions.send_notification')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('admin:evaluation.rules.priority')}</Label>
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
                        <Label>{t('admin:evaluation.rules.action_value')}</Label>
                        <Input
                          value={ruleForm.action_value}
                          onChange={(e) => setRuleForm({...ruleForm, action_value: e.target.value})}
                          placeholder={t('admin:evaluation.rules.action_value_placeholder')}
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="rule-active"
                          checked={ruleForm.is_active}
                          onCheckedChange={(checked) => setRuleForm({...ruleForm, is_active: checked})}
                        />
                        <Label htmlFor="rule-active">{t('admin:evaluation.rules.active')}</Label>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsRuleDialogOpen(false)}>
                          {t('admin:evaluation.common.cancel')}
                        </Button>
                        <Button onClick={saveRule}>
                          <Save className="w-4 h-4 mr-2" />
                          {t('admin:evaluation.common.save')}
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
                              {rule.is_active ? t('admin:evaluation.rules.status_active') : t('admin:evaluation.rules.status_inactive')}
                            </Badge>
                            <Badge variant="outline">
                              {t('admin:evaluation.rules.priority')} {rule.priority}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{t('admin:evaluation.rules.condition')}</span> {rule.condition_type} ≥ {rule.condition_value}
                            <br />
                            <span className="font-medium">{t('admin:evaluation.rules.action')}</span> {rule.action_type}
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
                                <AlertDialogTitle>{t('admin:evaluation.rules.delete_title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('admin:evaluation.rules.delete_confirm')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('admin:evaluation.common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteRule(rule.id)}>
                                  {t('admin:evaluation.common.delete')}
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
                  {t('admin:evaluation.scorecards.title')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t('admin:evaluation.scorecards.description')}
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('admin:evaluation.scorecards.create')}
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
                      {t('admin:evaluation.framework.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('admin:evaluation.framework.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('admin:evaluation.framework.scale_type')}</Label>
                        <Select defaultValue="1-10">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-5">{t('admin:evaluation.framework.scales.points_5')}</SelectItem>
                            <SelectItem value="1-10">{t('admin:evaluation.framework.scales.points_10')}</SelectItem>
                            <SelectItem value="1-100">{t('admin:evaluation.framework.scales.points_100')}</SelectItem>
                            <SelectItem value="percentage">{t('admin:evaluation.framework.scales.percentage')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('admin:evaluation.framework.final_score')}</Label>
                        <Select defaultValue="weighted_average">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weighted_average">{t('admin:evaluation.framework.calculations.weighted_average')}</SelectItem>
                            <SelectItem value="simple_average">{t('admin:evaluation.framework.calculations.simple_average')}</SelectItem>
                            <SelectItem value="sum">{t('admin:evaluation.framework.calculations.sum')}</SelectItem>
                            <SelectItem value="custom">{t('admin:evaluation.framework.calculations.custom')}</SelectItem>
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
                      {t('admin:evaluation.framework.thresholds')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-success">{t('admin:evaluation.framework.approval_threshold')}</Label>
                        <Input type="number" defaultValue="8" min="1" max="10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-warning">{t('admin:evaluation.framework.review_threshold')}</Label>
                        <Input type="number" defaultValue="6" min="1" max="10" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-destructive">{t('admin:evaluation.framework.rejection_threshold')}</Label>
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
                      {t('admin:evaluation.analytics.criteria_stats')}
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
                      {t('admin:evaluation.analytics.usage_stats')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>{t('admin:evaluation.analytics.total_evaluations')}</span>
                        <span className="font-bold">124</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('admin:evaluation.analytics.average_score')}</span>
                        <span className="font-bold">7.2/10</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('admin:evaluation.analytics.approval_rate')}</span>
                        <span className="font-bold">68%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>{t('admin:evaluation.analytics.avg_evaluation_time')}</span>
                        <span className="font-bold">3.5 {t('admin:evaluation.analytics.days')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </div>
  );
};

export default EvaluationManagement;
