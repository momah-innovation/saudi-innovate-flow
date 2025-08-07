import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { supabase } from "@/integrations/supabase/client";

interface EvaluationSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function EvaluationSettings({ settings, onSettingChange }: EvaluationSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newEvaluatorType, setNewEvaluatorType] = useState("");
  const [newExpertRoleType, setNewExpertRoleType] = useState("");
  const [systemSettings, setSystemSettings] = useState<any>({});

  useEffect(() => {
    fetchSystemSettings();
  }, []);

  const fetchSystemSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'evaluation_evaluator_types',
          'evaluation_expert_role_types',
          'evaluation_min_evaluators_per_idea',
          'evaluation_max_evaluators_per_idea',
          'evaluation_time_limit_days',
          'evaluation_min_score',
          'evaluation_max_score',
          'evaluation_passing_score',
          'evaluation_enable_anonymous',
          'evaluation_enable_collaborative',
          'evaluation_require_comments'
        ]);

      if (error) throw error;

      const settingsObj = data?.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as any) || {};

      setSystemSettings(settingsObj);
    } catch (error) {
      console.error('Error fetching system settings:', error);
    }
  };

  const updateSystemSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({ 
          setting_key: key, 
          setting_value: value,
          setting_category: 'evaluations',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setSystemSettings(prev => ({ ...prev, [key]: value }));
      onSettingChange(key, value);
      
      toast({
        title: t('success'),
        description: t('settingUpdated')
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: t('error'),
        description: t('updateSettingError'),
        variant: "destructive"
      });
    }
  };
  
  const evaluatorTypes = systemSettings.evaluation_evaluator_types || ["lead_expert", "evaluator", "reviewer", "subject_matter_expert", "external_consultant"];
  const expertRoleTypes = systemSettings.evaluation_expert_role_types || ["خبير رئيسي", "مقيم", "مراجع", "خبير موضوع", "مستشار خارجي"];

  const addEvaluatorType = () => {
    if (newEvaluatorType.trim() && !evaluatorTypes.includes(newEvaluatorType)) {
      const updatedTypes = [...evaluatorTypes, newEvaluatorType.trim()];
      onSettingChange('evaluator_types', updatedTypes);
      setNewEvaluatorType("");
      toast({
        title: t('success'),
        description: "تم إضافة نوع المقيم بنجاح"
      });
    }
  };

  const removeEvaluatorType = (typeToRemove: string) => {
    const updatedTypes = evaluatorTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('evaluator_types', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف نوع المقيم بنجاح"
    });
  };

  const addExpertRoleType = () => {
    if (newExpertRoleType.trim() && !expertRoleTypes.includes(newExpertRoleType)) {
      const updatedTypes = [...expertRoleTypes, newExpertRoleType.trim()];
      onSettingChange('expert_role_types', updatedTypes);
      setNewExpertRoleType("");
      toast({
        title: t('success'),
        description: "تم إضافة دور الخبير بنجاح"
      });
    }
  };

  const removeExpertRoleType = (typeToRemove: string) => {
    const updatedTypes = expertRoleTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('expert_role_types', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف دور الخبير بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.evaluatorTypes')}</CardTitle>
          <CardDescription>إدارة أنواع المقيمين المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newEvaluatorType}
              onChange={(e) => setNewEvaluatorType(e.target.value)}
              placeholder="أضف نوع مقيم جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addEvaluatorType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {evaluatorTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`evaluatorTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeEvaluatorType(type)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.expertRoleTypes')}</CardTitle>
          <CardDescription>إدارة أدوار الخبراء المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newExpertRoleType}
              onChange={(e) => setNewExpertRoleType(e.target.value)}
              placeholder="أضف دور خبير جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addExpertRoleType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {expertRoleTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`expertRoleTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeExpertRoleType(type)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إعدادات التقييم</CardTitle>
          <CardDescription>التحكم في نظام التقييم والمراجعة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="minEvaluatorsPerIdea">الحد الأدنى للمقيمين لكل فكرة</Label>
              <Input
                id="minEvaluatorsPerIdea"
                type="number"
                value={settings.minEvaluatorsPerIdea || 2}
                onChange={(e) => onSettingChange('minEvaluatorsPerIdea', parseInt(e.target.value))}
                min="1"
                max="10"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxEvaluatorsPerIdea">الحد الأقصى للمقيمين لكل فكرة</Label>
              <Input
                id="maxEvaluatorsPerIdea"
                type="number"
                value={settings.maxEvaluatorsPerIdea || 5}
                onChange={(e) => onSettingChange('maxEvaluatorsPerIdea', parseInt(e.target.value))}
                min="1"
                max="20"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluationTimeLimit">المهلة الزمنية للتقييم (بالأيام)</Label>
              <Input
                id="evaluationTimeLimit"
                type="number"
                value={settings.evaluationTimeLimit || 7}
                onChange={(e) => onSettingChange('evaluationTimeLimit', parseInt(e.target.value))}
                min="1"
                max="30"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minEvaluationScore">الحد الأدنى لدرجة التقييم</Label>
              <Input
                id="minEvaluationScore"
                type="number"
                value={settings.minEvaluationScore || 1}
                onChange={(e) => onSettingChange('minEvaluationScore', parseInt(e.target.value))}
                min="1"
                max="5"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxEvaluationScore">الحد الأقصى لدرجة التقييم</Label>
              <Input
                id="maxEvaluationScore"
                type="number"
                value={settings.maxEvaluationScore || 10}
                onChange={(e) => onSettingChange('maxEvaluationScore', parseInt(e.target.value))}
                min="5"
                max="100"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingScore">الدرجة المطلوبة للنجاح</Label>
              <Input
                id="passingScore"
                type="number"
                value={settings.passingScore || 70}
                onChange={(e) => onSettingChange('passingScore', parseInt(e.target.value))}
                min="1"
                max="100"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التقييم المجهول</Label>
              <p className="text-sm text-muted-foreground">إخفاء هوية المقيمين عن بعضهم البعض</p>
            </div>
            <Switch 
              checked={settings.enableAnonymousEvaluation !== false}
              onCheckedChange={(checked) => onSettingChange('enableAnonymousEvaluation', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التقييم التعاوني</Label>
              <p className="text-sm text-muted-foreground">السماح للمقيمين بمناقشة التقييمات</p>
            </div>
            <Switch 
              checked={settings.enableCollaborativeEvaluation || false}
              onCheckedChange={(checked) => onSettingChange('enableCollaborativeEvaluation', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">التقييم الإجباري للتعليقات</Label>
              <p className="text-sm text-muted-foreground">مطالبة المقيمين بكتابة تعليقات مفصلة</p>
            </div>
            <Switch 
              checked={settings.requireEvaluationComments !== false}
              onCheckedChange={(checked) => onSettingChange('requireEvaluationComments', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}