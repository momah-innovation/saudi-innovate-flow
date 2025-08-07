import { useState } from "react";
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
import { FocusQuestionSettingsProps } from "@/types/admin-settings";

export function FocusQuestionSettings({ settings, onSettingChange }: FocusQuestionSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newQuestionType, setNewQuestionType] = useState("");
  
  const focusQuestionTypes = (settings.focus_question_types as string[]) || ["عام", "تقني", "تجاري", "تأثير", "تنفيذ", "اجتماعي", "أخلاقي", "طبي", "تنظيمي"];

  const addQuestionType = () => {
    if (newQuestionType.trim() && !focusQuestionTypes.includes(newQuestionType)) {
      const updatedTypes = [...focusQuestionTypes, newQuestionType.trim()];
      onSettingChange('focus_question_types', updatedTypes);
      setNewQuestionType("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeQuestionType = (typeToRemove: string) => {
    const updatedTypes = focusQuestionTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('focus_question_types', updatedTypes);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.focusQuestionTypes')}</CardTitle>
          <CardDescription>إدارة أنواع الأسئلة المحورية المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value)}
              placeholder="أضف نوع سؤال محوري جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addQuestionType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {focusQuestionTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`focusQuestionTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeQuestionType(type)}
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
          <CardTitle>إعدادات الأسئلة المحورية</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الأسئلة المحورية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxQuestionsPerChallenge">الحد الأقصى للأسئلة لكل تحدي</Label>
              <Input
                id="maxQuestionsPerChallenge"
                type="number"
                value={(settings.maxQuestionsPerChallenge as number) || 10}
                onChange={(e) => onSettingChange('maxQuestionsPerChallenge', parseInt(e.target.value))}
                min="1"
                max="50"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questionMinLength">الحد الأدنى لطول السؤال (عدد الأحرف)</Label>
              <Input
                id="questionMinLength"
                type="number"
                value={(settings.questionMinLength as number) || 20}
                onChange={(e) => onSettingChange('questionMinLength', parseInt(e.target.value))}
                min="5"
                max="100"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionMaxLength">الحد الأقصى لطول السؤال (عدد الأحرف)</Label>
              <Input
                id="questionMaxLength"
                type="number"
                value={(settings.questionMaxLength as number) || 500}
                onChange={(e) => onSettingChange('questionMaxLength', parseInt(e.target.value))}
                min="100"
                max="2000"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionResponseTimeLimit">المهلة الزمنية للإجابة (بالأيام)</Label>
              <Input
                id="questionResponseTimeLimit"
                type="number"
                value={(settings.questionResponseTimeLimit as number) || 7}
                onChange={(e) => onSettingChange('questionResponseTimeLimit', parseInt(e.target.value))}
                min="1"
                max="30"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">السماح بالأسئلة الحساسة</Label>
              <p className="text-sm text-muted-foreground">السماح بإنشاء أسئلة ذات طبيعة حساسة</p>
            </div>
            <Switch 
              checked={settings.allowSensitiveQuestions !== false}
              onCheckedChange={(checked) => onSettingChange('allowSensitiveQuestions', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تفعيل الأسئلة المجهولة</Label>
              <p className="text-sm text-muted-foreground">السماح بطرح أسئلة بدون الكشف عن الهوية</p>
            </div>
            <Switch 
              checked={(settings.enableAnonymousQuestions as boolean) || false}
              onCheckedChange={(checked) => onSettingChange('enableAnonymousQuestions', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">مراجعة الأسئلة المحورية</Label>
              <p className="text-sm text-muted-foreground">مطالبة مراجعة إدارية قبل نشر الأسئلة</p>
            </div>
            <Switch 
              checked={settings.requireQuestionReview !== false}
              onCheckedChange={(checked) => onSettingChange('requireQuestionReview', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}