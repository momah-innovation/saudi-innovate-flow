import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChallengeSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function ChallengeSettings({ settings, onSettingChange }: ChallengeSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>الإعدادات الافتراضية للتحديات</CardTitle>
          <CardDescription>القيم الافتراضية عند إنشاء تحديات جديدة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultStatus">الحالة الافتراضية</Label>
              <Select 
                value={settings.defaultStatus || 'draft'} 
                onValueChange={(value) => onSettingChange('defaultStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">مسودة</SelectItem>
                  <SelectItem value="published">منشور</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultPriority">الأولوية الافتراضية</Label>
              <Select 
                value={settings.defaultPriority || 'medium'} 
                onValueChange={(value) => onSettingChange('defaultPriority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفض</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultSensitivity">مستوى الحساسية الافتراضي</Label>
              <Select 
                value={settings.defaultSensitivity || 'normal'} 
                onValueChange={(value) => onSettingChange('defaultSensitivity', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">عادي</SelectItem>
                  <SelectItem value="sensitive">حساس</SelectItem>
                  <SelectItem value="confidential">سري</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>حدود وقيود التحديات</CardTitle>
          <CardDescription>إعدادات الحدود والقيود الخاصة بالتحديات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxChallengesPerUser">الحد الأقصى للتحديات لكل مستخدم</Label>
              <Input
                id="maxChallengesPerUser"
                type="number"
                min="1"
                max="100"
                value={settings.maxChallengesPerUser || 10}
                onChange={(e) => onSettingChange('maxChallengesPerUser', parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="itemsPerPage">عدد العناصر في الصفحة</Label>
              <Select 
                value={(settings.itemsPerPage || 12).toString()} 
                onValueChange={(value) => onSettingChange('itemsPerPage', parseInt(value))}
              >
                <SelectTrigger>
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات واجهة المستخدم</CardTitle>
          <CardDescription>تخصيص تجربة المستخدم لصفحات التحديات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="defaultViewMode">وضع العرض الافتراضي</Label>
            <Select 
              value={settings.defaultViewMode || 'cards'} 
              onValueChange={(value) => onSettingChange('defaultViewMode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cards">بطاقات</SelectItem>
                <SelectItem value="list">قائمة</SelectItem>
                <SelectItem value="grid">شبكة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">تفعيل المرشحات المتقدمة</Label>
              <p className="text-sm text-muted-foreground">عرض خيارات تصفية إضافية</p>
            </div>
            <Switch
              checked={settings.enableAdvancedFilters !== false}
              onCheckedChange={(checked) => onSettingChange('enableAdvancedFilters', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">معاينة عند التمرير</Label>
              <p className="text-sm text-muted-foreground">عرض معاينة سريعة عند التمرير فوق البطاقات</p>
            </div>
            <Switch
              checked={settings.showPreviewOnHover !== false}
              onCheckedChange={(checked) => onSettingChange('showPreviewOnHover', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>إعدادات سير العمل</CardTitle>
          <CardDescription>تحكم في آلية عمل التحديات والتعاون</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">مطالبة الموافقة للنشر</Label>
              <p className="text-sm text-muted-foreground">مطالبة موافقة إدارية قبل نشر التحديات</p>
            </div>
            <Switch
              checked={settings.requireApprovalForPublish !== false}
              onCheckedChange={(checked) => onSettingChange('requireApprovalForPublish', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">السماح بالمشاركات المجهولة</Label>
              <p className="text-sm text-muted-foreground">السماح بتقديم أفكار بدون الكشف عن الهوية</p>
            </div>
            <Switch
              checked={settings.allowAnonymousSubmissions || false}
              onCheckedChange={(checked) => onSettingChange('allowAnonymousSubmissions', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">تفعيل التعاون</Label>
              <p className="text-sm text-muted-foreground">السماح بالعمل التعاوني على التحديات</p>
            </div>
            <Switch
              checked={settings.enableCollaboration !== false}
              onCheckedChange={(checked) => onSettingChange('enableCollaboration', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">تفعيل التعليقات</Label>
              <p className="text-sm text-muted-foreground">السماح بالتعليق على التحديات والأفكار</p>
            </div>
            <Switch
              checked={settings.enableComments !== false}
              onCheckedChange={(checked) => onSettingChange('enableComments', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">تفعيل التقييمات</Label>
              <p className="text-sm text-muted-foreground">السماح بتقييم التحديات والأفكار</p>
            </div>
            <Switch
              checked={settings.enableRatings !== false}
              onCheckedChange={(checked) => onSettingChange('enableRatings', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}