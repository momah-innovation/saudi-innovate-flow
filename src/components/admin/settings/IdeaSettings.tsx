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

interface IdeaSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function IdeaSettings({ settings, onSettingChange }: IdeaSettingsProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [newAttachmentType, setNewAttachmentType] = useState("");
  const [newAssignmentType, setNewAssignmentType] = useState("");
  
  const allowedAttachmentTypes = settings.idea_allowed_attachment_types || ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png", "gif"];
  const assignmentTypes = settings.idea_assignment_types || ["reviewer", "evaluator", "implementer", "observer"];

  const addAttachmentType = () => {
    if (newAttachmentType.trim() && !allowedAttachmentTypes.includes(newAttachmentType)) {
      const updatedTypes = [...allowedAttachmentTypes, newAttachmentType.trim()];
      onSettingChange('idea_allowed_attachment_types', updatedTypes);
      setNewAttachmentType("");
      toast({
        title: t('success'),
        description: "تم إضافة نوع المرفق بنجاح"
      });
    }
  };

  const removeAttachmentType = (typeToRemove: string) => {
    const updatedTypes = allowedAttachmentTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('idea_allowed_attachment_types', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف نوع المرفق بنجاح"
    });
  };

  const addAssignmentType = () => {
    if (newAssignmentType.trim() && !assignmentTypes.includes(newAssignmentType)) {
      const updatedTypes = [...assignmentTypes, newAssignmentType.trim()];
      onSettingChange('idea_assignment_types', updatedTypes);
      setNewAssignmentType("");
      toast({
        title: t('success'),
        description: "تم إضافة نوع المهمة بنجاح"
      });
    }
  };

  const removeAssignmentType = (typeToRemove: string) => {
    const updatedTypes = assignmentTypes.filter((type: string) => type !== typeToRemove);
    onSettingChange('idea_assignment_types', updatedTypes);
    toast({
      title: t('success'),
      description: "تم حذف نوع المهمة بنجاح"
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle>{t('systemLists.ideaAttachmentTypes')}</CardTitle>
          <CardDescription>إدارة أنواع المرفقات المسموحة للأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newAttachmentType}
              onChange={(e) => setNewAttachmentType(e.target.value)}
              placeholder="أضف نوع مرفق جديد (مثل: pdf)"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addAttachmentType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {allowedAttachmentTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>.{type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeAttachmentType(type)}
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
          <CardTitle>{t('systemLists.ideaAssignmentTypes')}</CardTitle>
          <CardDescription>إدارة أنواع مهام الأفكار المتاحة في النظام</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newAssignmentType}
              onChange={(e) => setNewAssignmentType(e.target.value)}
              placeholder="أضف نوع مهمة جديد"
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addAssignmentType} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {assignmentTypes.map((type: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`ideaAssignmentTypes.${type}`) || type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeAssignmentType(type)}
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
          <CardTitle>إعدادات الأفكار</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="maxIdeasPerUser">الحد الأقصى للأفكار لكل مستخدم</Label>
              <Input
                id="maxIdeasPerUser"
                type="number"
                value={settings.maxIdeasPerUser || 50}
                onChange={(e) => onSettingChange('maxIdeasPerUser', parseInt(e.target.value))}
                min="1"
                max="500"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ideaMinLength">الحد الأدنى لطول وصف الفكرة (عدد الأحرف)</Label>
              <Input
                id="ideaMinLength"
                type="number"
                value={settings.ideaMinLength || 50}
                onChange={(e) => onSettingChange('ideaMinLength', parseInt(e.target.value))}
                min="10"
                max="200"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttachments">الحد الأقصى للمرفقات لكل فكرة</Label>
              <Input
                id="maxAttachments"
                type="number"
                value={settings.maxAttachments || 5}
                onChange={(e) => onSettingChange('maxAttachments', parseInt(e.target.value))}
                min="0"
                max="20"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxAttachmentSize">الحد الأقصى لحجم المرفق (بالميجابايت)</Label>
              <Input
                id="maxAttachmentSize"
                type="number"
                value={settings.maxAttachmentSize || 10}
                onChange={(e) => onSettingChange('maxAttachmentSize', parseInt(e.target.value))}
                min="1"
                max="100"
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">السماح بالأفكار المجهولة</Label>
              <p className="text-sm text-muted-foreground">السماح بتقديم أفكار بدون الكشف عن الهوية</p>
            </div>
            <Switch 
              checked={settings.allowAnonymousIdeas || false}
              onCheckedChange={(checked) => onSettingChange('allowAnonymousIdeas', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">مراجعة الأفكار تلقائياً</Label>
              <p className="text-sm text-muted-foreground">مطالبة مراجعة إدارية قبل نشر الأفكار</p>
            </div>
            <Switch 
              checked={settings.requireIdeaReview !== false}
              onCheckedChange={(checked) => onSettingChange('requireIdeaReview', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">تفعيل التعاون في الأفكار</Label>
              <p className="text-sm text-muted-foreground">السماح بالعمل التعاوني على تطوير الأفكار</p>
            </div>
            <Switch 
              checked={settings.enableIdeaCollaboration !== false}
              onCheckedChange={(checked) => onSettingChange('enableIdeaCollaboration', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}