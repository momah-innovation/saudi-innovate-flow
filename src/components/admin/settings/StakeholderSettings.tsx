import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useDirection } from "@/components/ui/direction-provider";

interface StakeholderSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function StakeholderSettings({ settings, onSettingChange }: StakeholderSettingsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [newStakeholderCategory, setNewStakeholderCategory] = useState("");
  const [newRelationshipType, setNewRelationshipType] = useState("");
  
  const stakeholderCategories = settings.stakeholder_categories || ["government", "private_sector", "academic", "civil_society", "international", "media", "experts"];
  const relationshipTypes = settings.relationship_types || ["direct", "indirect", "collaborative", "competitive", "supportive"];

  const addStakeholderCategory = () => {
    if (newStakeholderCategory.trim() && !stakeholderCategories.includes(newStakeholderCategory)) {
      const updatedCategories = [...stakeholderCategories, newStakeholderCategory.trim()];
      onSettingChange('stakeholder_categories', updatedCategories);
      setNewStakeholderCategory("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeStakeholderCategory = (categoryToRemove: string) => {
    const updatedCategories = stakeholderCategories.filter((category: string) => category !== categoryToRemove);
    onSettingChange('stakeholder_categories', updatedCategories);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const addRelationshipType = () => {
    if (newRelationshipType.trim() && !relationshipTypes.includes(newRelationshipType)) {
      const updatedTypes = [...relationshipTypes, newRelationshipType.trim()];
      onSettingChange('relationship_types', updatedTypes);
      setNewRelationshipType("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeRelationshipType = (typeToRemove: string) => {
    const updatedTypes = relationshipTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('relationship_types', updatedTypes);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.stakeholderCategories')}</CardTitle>
          <CardDescription>إدارة فئات المعنيين المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newStakeholderCategory}
              onChange={(e) => setNewStakeholderCategory(e.target.value)}
              placeholder="أضف فئة معنيين جديدة"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addStakeholderCategory} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {stakeholderCategories.map((category: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`stakeholderCategories.${category}`) || category}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeStakeholderCategory(category)}
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
          <CardTitle>{t('systemLists.relationshipTypes')}</CardTitle>
          <CardDescription>إدارة أنواع العلاقات المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newRelationshipType}
              onChange={(e) => setNewRelationshipType(e.target.value)}
              placeholder="أضف نوع علاقة جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addRelationshipType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {relationshipTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`relationshipTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeRelationshipType(type)}
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
          <CardTitle>إعدادات المعنيين</CardTitle>
          <CardDescription>التحكم في إدارة المعنيين والجهات ذات العلاقة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxStakeholders">الحد الأقصى للمعنيين لكل مشروع</Label>
              <Input
                id="maxStakeholders"
                type="number"
                value={settings.maxStakeholders || 20}
                onChange={(e) => onSettingChange('maxStakeholders', parseInt(e.target.value))}
                min="1"
                max="100"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="engagementTrackingDays">فترة تتبع التفاعل (بالأيام)</Label>
              <Input
                id="engagementTrackingDays"
                type="number"
                value={settings.engagementTrackingDays || 30}
                onChange={(e) => onSettingChange('engagementTrackingDays', parseInt(e.target.value))}
                min="1"
                max="365"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تتبع تفاعل المعنيين</Label>
              <p className="text-sm text-muted-foreground">تسجيل وتتبع تفاعل المعنيين مع المشاريع</p>
            </div>
            <Switch 
              checked={settings.enableEngagementTracking !== false}
              onCheckedChange={(checked) => onSettingChange('enableEngagementTracking', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">إشعارات المعنيين</Label>
              <p className="text-sm text-muted-foreground">إرسال إشعارات للمعنيين عند التحديثات</p>
            </div>
            <Switch 
              checked={settings.enableStakeholderNotifications !== false}
              onCheckedChange={(checked) => onSettingChange('enableStakeholderNotifications', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}