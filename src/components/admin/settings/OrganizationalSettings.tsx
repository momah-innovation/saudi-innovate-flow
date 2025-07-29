import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrganizationalSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function OrganizationalSettings({ settings, onSettingChange }: OrganizationalSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات الهيكل التنظيمي</CardTitle>
          <CardDescription>التحكم في إدارة الهيكل التنظيمي والقطاعات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="maxHierarchyLevels">الحد الأقصى لمستويات التسلسل الهرمي</Label>
              <Input
                id="maxHierarchyLevels"
                type="number"
                defaultValue="5"
                min="2"
                max="10"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxSectors">الحد الأقصى للقطاعات</Label>
              <Input
                id="maxSectors"
                type="number"
                defaultValue="20"
                min="1"
                max="100"
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">تحديث تلقائي للهيكل</Label>
              <p className="text-sm text-muted-foreground">تحديث الهيكل التنظيمي تلقائياً عند تغيير البيانات</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}