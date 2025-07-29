import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface IdeaSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function IdeaSettings({ settings, onSettingChange }: IdeaSettingsProps) {
  const parseJsonValue = (value: any) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  };

  const handleNumberChange = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    onSettingChange(key, numValue.toString());
  };

  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      {/* Idea Submission Settings */}
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات تقديم الأفكار</CardTitle>
          <CardDescription>التحكم في كيفية تقديم الأفكار الجديدة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="ideaMaxTitleLength">الحد الأقصى لطول العنوان</Label>
              <Input
                id="ideaMaxTitleLength"
                type="number"
                min="10"
                max="500"
                value={parseJsonValue(settings.idea_max_title_length) || 200}
                onChange={(e) => handleNumberChange('idea_max_title_length', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideaMaxDescLength">الحد الأقصى لطول الوصف</Label>
              <Input
                id="ideaMaxDescLength"
                type="number"
                min="100"
                max="10000"
                value={parseJsonValue(settings.idea_max_description_length) || 5000}
                onChange={(e) => handleNumberChange('idea_max_description_length', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideaMinDescLength">الحد الأدنى لطول الوصف</Label>
              <Input
                id="ideaMinDescLength"
                type="number"
                min="10"
                max="500"
                value={parseJsonValue(settings.idea_min_description_length) || 50}
                onChange={(e) => handleNumberChange('idea_min_description_length', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">السماح بالتقديمات المجهولة</Label>
                <p className="text-sm text-muted-foreground">السماح بتقديم أفكار بدون الكشف عن الهوية</p>
              </div>
              <Switch
                checked={settings.idea_allow_anonymous_submissions || false}
                onCheckedChange={(checked) => onSettingChange('idea_allow_anonymous_submissions', checked)}
              />
            </div>

            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">الحفظ التلقائي للمسودات</Label>
                <p className="text-sm text-muted-foreground">حفظ تلقائي لمسودات الأفكار أثناء الكتابة</p>
              </div>
              <Switch
                checked={settings.idea_auto_save_drafts !== false}
                onCheckedChange={(checked) => onSettingChange('idea_auto_save_drafts', checked)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideaDraftExpiry">مدة انتهاء صلاحية المسودات (بالأيام)</Label>
              <Input
                id="ideaDraftExpiry"
                type="number"
                min="1"
                max="365"
                value={parseJsonValue(settings.idea_draft_expiry_days) || 30}
                onChange={(e) => handleNumberChange('idea_draft_expiry_days', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Idea Workflow Settings */}
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات سير العمل</CardTitle>
          <CardDescription>التحكم في مراحل معالجة الأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="ideaDefaultStatus">الحالة الافتراضية للأفكار الجديدة</Label>
              <Select 
                value={parseJsonValue(settings.idea_default_status) || 'draft'} 
                onValueChange={(value) => onSettingChange('idea_default_status', JSON.stringify(value))}
              >
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="submitted">مقدمة</SelectItem>
                  <SelectItem value="under_review">قيد المراجعة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideaAssignmentDays">المدة الافتراضية للتكليفات (بالأيام)</Label>
              <Input
                id="ideaAssignmentDays"
                type="number"
                min="1"
                max="90"
                value={parseJsonValue(settings.idea_assignment_due_date_days) || 7}
                onChange={(e) => handleNumberChange('idea_assignment_due_date_days', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">الموافقة التلقائية على الأفكار</Label>
                <p className="text-sm text-muted-foreground">قبول الأفكار تلقائياً عند التقديم</p>
              </div>
              <Switch
                checked={settings.idea_auto_approve_submissions || false}
                onCheckedChange={(checked) => onSettingChange('idea_auto_approve_submissions', checked)}
              />
            </div>

            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">إجبار اختيار السؤال المحوري</Label>
                <p className="text-sm text-muted-foreground">مطالبة اختيار سؤال محوري عند تقديم الفكرة</p>
              </div>
              <Switch
                checked={settings.idea_require_focus_question !== false}
                onCheckedChange={(checked) => onSettingChange('idea_require_focus_question', checked)}
              />
            </div>

            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">إشعارات سير العمل</Label>
                <p className="text-sm text-muted-foreground">إرسال إشعارات عند تغيير حالة الأفكار</p>
              </div>
              <Switch
                checked={settings.idea_workflow_notifications_enabled !== false}
                onCheckedChange={(checked) => onSettingChange('idea_workflow_notifications_enabled', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Idea Evaluation Settings */}
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات التقييم</CardTitle>
          <CardDescription>التحكم في آلية تقييم الأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="ideaEvalScale">أقصى درجة للتقييم</Label>
              <Select 
                value={parseJsonValue(settings.idea_evaluation_scale_max) || '10'} 
                onValueChange={(value) => onSettingChange('idea_evaluation_scale_max', JSON.stringify(value))}
              >
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 درجات</SelectItem>
                  <SelectItem value="10">10 درجات</SelectItem>
                  <SelectItem value="100">100 درجة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">إجبار التعليقات في التقييم</Label>
                <p className="text-sm text-muted-foreground">مطالبة كتابة تعليق مع كل تقييم</p>
              </div>
              <Switch
                checked={settings.idea_evaluation_require_comments || false}
                onCheckedChange={(checked) => onSettingChange('idea_evaluation_require_comments', checked)}
              />
            </div>

            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">السماح بتقييمات متعددة</Label>
                <p className="text-sm text-muted-foreground">السماح لأكثر من مقيم بتقييم نفس الفكرة</p>
              </div>
              <Switch
                checked={settings.idea_evaluation_multiple_allowed !== false}
                onCheckedChange={(checked) => onSettingChange('idea_evaluation_multiple_allowed', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Idea Collaboration Settings */}
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات التعاون</CardTitle>
          <CardDescription>إدارة العمل التعاوني على الأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تفعيل التعاون</Label>
              <p className="text-sm text-muted-foreground">السماح بالعمل التعاوني على الأفكار</p>
            </div>
            <Switch
              checked={settings.idea_collaboration_enabled !== false}
              onCheckedChange={(checked) => onSettingChange('idea_collaboration_enabled', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="ideaMaxCollaborators">الحد الأقصى للمتعاونين</Label>
              <Input
                id="ideaMaxCollaborators"
                type="number"
                min="1"
                max="20"
                value={parseJsonValue(settings.idea_max_collaborators) || 5}
                onChange={(e) => handleNumberChange('idea_max_collaborators', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideaInviteExpiry">انتهاء صلاحية دعوات التعاون (بالساعات)</Label>
              <Input
                id="ideaInviteExpiry"
                type="number"
                min="1"
                max="168"
                value={parseJsonValue(settings.idea_collaboration_invite_expiry_hours) || 48}
                onChange={(e) => handleNumberChange('idea_collaboration_invite_expiry_hours', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تتبع الإصدارات</Label>
              <p className="text-sm text-muted-foreground">حفظ تاريخ التغييرات على الأفكار</p>
            </div>
            <Switch
              checked={settings.idea_version_tracking_enabled !== false}
              onCheckedChange={(checked) => onSettingChange('idea_version_tracking_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comments & Attachments Settings */}
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات التعليقات والمرفقات</CardTitle>
          <CardDescription>التحكم في التعليقات والملفات المرفقة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تفعيل التعليقات</Label>
              <p className="text-sm text-muted-foreground">السماح بالتعليق على الأفكار</p>
            </div>
            <Switch
              checked={settings.idea_comments_enabled !== false}
              onCheckedChange={(checked) => onSettingChange('idea_comments_enabled', checked)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="ideaCommentsMaxLength">الحد الأقصى لطول التعليق</Label>
              <Input
                id="ideaCommentsMaxLength"
                type="number"
                min="50"
                max="5000"
                value={parseJsonValue(settings.idea_comments_max_length) || 1000}
                onChange={(e) => handleNumberChange('idea_comments_max_length', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideaMaxAttachments">الحد الأقصى للمرفقات</Label>
              <Input
                id="ideaMaxAttachments"
                type="number"
                min="0"
                max="50"
                value={parseJsonValue(settings.idea_max_attachments_per_idea) || 10}
                onChange={(e) => handleNumberChange('idea_max_attachments_per_idea', e.target.value)}
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تفعيل المرفقات</Label>
              <p className="text-sm text-muted-foreground">السماح بإرفاق ملفات مع الأفكار</p>
            </div>
            <Switch
              checked={settings.idea_attachments_enabled !== false}
              onCheckedChange={(checked) => onSettingChange('idea_attachments_enabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Display Settings */}
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات العرض</CardTitle>
          <CardDescription>تخصيص واجهة عرض الأفكار</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="ideaItemsPerPage">عدد الأفكار في الصفحة</Label>
              <Select 
                value={parseJsonValue(settings.idea_items_per_page) || '12'} 
                onValueChange={(value) => onSettingChange('idea_items_per_page', JSON.stringify(value))}
              >
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ideaDefaultViewMode">وضع العرض الافتراضي</Label>
              <Select 
                value={parseJsonValue(settings.idea_default_view_mode) || 'cards'} 
                onValueChange={(value) => onSettingChange('idea_default_view_mode', JSON.stringify(value))}
              >
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cards">بطاقات</SelectItem>
                  <SelectItem value="list">قائمة</SelectItem>
                  <SelectItem value="grid">شبكة</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">معاينة عند التمرير</Label>
                <p className="text-sm text-muted-foreground">عرض معاينة سريعة عند التمرير فوق بطاقات الأفكار</p>
              </div>
              <Switch
                checked={settings.idea_show_preview_on_hover !== false}
                onCheckedChange={(checked) => onSettingChange('idea_show_preview_on_hover', checked)}
              />
            </div>

            <div className="flex items-center justify-between rtl:flex-row-reverse">
              <div className="space-y-0.5 rtl:text-right ltr:text-left">
                <Label className="text-base">تفعيل المرشحات المتقدمة</Label>
                <p className="text-sm text-muted-foreground">عرض خيارات تصفية إضافية</p>
              </div>
              <Switch
                checked={settings.idea_enable_advanced_filters !== false}
                onCheckedChange={(checked) => onSettingChange('idea_enable_advanced_filters', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}