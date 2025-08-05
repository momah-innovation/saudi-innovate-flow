import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampaignSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function CampaignSettings({ settings, onSettingChange }: CampaignSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات الحملات</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الحملات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="campaignDuration">المدة الافتراضية للحملة (بالأيام)</Label>
              <Input
                id="campaignDuration"
                type="number"
                defaultValue="30"
                min="1"
                max="365"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxCampaigns">الحد الأقصى للحملات النشطة</Label>
              <Input
                id="maxCampaigns"
                type="number"
                defaultValue="5"
                min="1"
                max="50"
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">الموافقة التلقائية</Label>
              <p className="text-sm text-muted-foreground">قبول الحملات تلقائياً عند الإنشاء</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}