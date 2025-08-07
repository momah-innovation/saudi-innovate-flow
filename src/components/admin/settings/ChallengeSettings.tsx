import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { ChallengeSettingsProps } from "@/types/admin-settings";

export function ChallengeSettings({ settings, onSettingChange }: ChallengeSettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newChallengeType, setNewChallengeType] = useState("");
  const [newPriorityLevel, setNewPriorityLevel] = useState("");
  const [newStatusOption, setNewStatusOption] = useState("");
  
  const challengeTypes = settings.challenge_types || ["تقنية", "استدامة", "صحة", "تعليم", "حوكمة"];
  const priorityLevels = settings.priority_levels || ["منخفض", "متوسط", "عالي", "عاجل"];
  const challengeStatusOptions = settings.challenge_status_options || ["مسودة", "منشور", "نشط", "مغلق", "مؤرشف"];

  const addChallengeType = () => {
    if (newChallengeType.trim() && !challengeTypes.includes(newChallengeType)) {
      const updatedTypes = [...challengeTypes, newChallengeType.trim()];
      onSettingChange('challenge_types', updatedTypes);
      setNewChallengeType("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeChallengeType = (typeToRemove: string) => {
    const updatedTypes = challengeTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('challenge_types', updatedTypes);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const addPriorityLevel = () => {
    if (newPriorityLevel.trim() && !priorityLevels.includes(newPriorityLevel)) {
      const updatedLevels = [...priorityLevels, newPriorityLevel.trim()];
      onSettingChange('priority_levels', updatedLevels);
      setNewPriorityLevel("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removePriorityLevel = (levelToRemove: string) => {
    const updatedLevels = priorityLevels.filter((level: string) => level !== levelToRemove);
    onSettingChange('priority_levels', updatedLevels);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const addStatusOption = () => {
    if (newStatusOption.trim() && !challengeStatusOptions.includes(newStatusOption)) {
      const updatedOptions = [...challengeStatusOptions, newStatusOption.trim()];
      onSettingChange('challenge_status_options', updatedOptions);
      setNewStatusOption("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeStatusOption = (optionToRemove: string) => {
    const updatedOptions = challengeStatusOptions.filter((option: string) => option !== optionToRemove);
    onSettingChange('challenge_status_options', updatedOptions);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.challengeTypes')}</CardTitle>
          <CardDescription>إدارة أنواع التحديات المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newChallengeType}
              onChange={(e) => setNewChallengeType(e.target.value)}
              placeholder="أضف نوع تحدي جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addChallengeType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {challengeTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`challengeTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeChallengeType(type)}
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
          <CardTitle>{t('systemLists.priorityLevels')}</CardTitle>
          <CardDescription>إدارة مستويات أولوية التحديات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newPriorityLevel}
              onChange={(e) => setNewPriorityLevel(e.target.value)}
              placeholder="أضف مستوى أولوية جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addPriorityLevel} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {priorityLevels.map((level: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`priorityLevels.${level}`) || level}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removePriorityLevel(level)}
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
          <CardTitle>{t('systemLists.challengeStatusOptions')}</CardTitle>
          <CardDescription>إدارة خيارات حالة التحديات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newStatusOption}
              onChange={(e) => setNewStatusOption(e.target.value)}
              placeholder="أضف حالة تحدي جديدة"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addStatusOption} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {challengeStatusOptions.map((option: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`challengeStatusOptions.${option}`) || option}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeStatusOption(option)}
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
          <CardTitle>الإعدادات الافتراضية للتحديات</CardTitle>
          <CardDescription>القيم الافتراضية عند إنشاء تحديات جديدة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="max_challenges_per_user">{t('settings.max_challenges_per_user.label')}</Label>
              <Input
                id="max_challenges_per_user"
                type="number"
                min="1"
                max="100"
                value={settings.max_challenges_per_user || 10}
                onChange={(e) => onSettingChange('max_challenges_per_user', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemsPerPage">عدد العناصر في الصفحة</Label>
              <Input
                id="itemsPerPage"
                type="number"
                min="6"
                max="48"
                value={settings.itemsPerPage || 12}
                onChange={(e) => onSettingChange('itemsPerPage', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>إعدادات سير العمل</CardTitle>
          <CardDescription>تحكم في آلية عمل التحديات والتعاون</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">مطالبة الموافقة للنشر</Label>
              <p className="text-sm text-muted-foreground">مطالبة موافقة إدارية قبل نشر التحديات</p>
            </div>
            <Switch
              checked={settings.requireApprovalForPublish !== false}
              onCheckedChange={(checked) => onSettingChange('requireApprovalForPublish', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">السماح بالمشاركات المجهولة</Label>
              <p className="text-sm text-muted-foreground">السماح بتقديم أفكار بدون الكشف عن الهوية</p>
            </div>
            <Switch
              checked={settings.allowAnonymousSubmissions || false}
              onCheckedChange={(checked) => onSettingChange('allowAnonymousSubmissions', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تفعيل التعاون</Label>
              <p className="text-sm text-muted-foreground">السماح بالعمل التعاوني على التحديات</p>
            </div>
            <Switch
              checked={settings.enableCollaboration !== false}
              onCheckedChange={(checked) => onSettingChange('enableCollaboration', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}