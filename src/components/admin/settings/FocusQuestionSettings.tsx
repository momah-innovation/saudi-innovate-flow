import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FocusQuestionSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function FocusQuestionSettings({ settings, onSettingChange }: FocusQuestionSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات الأسئلة المحورية</CardTitle>
          <CardDescription>التحكم في إنشاء وإدارة الأسئلة المحورية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="maxQuestionsPerChallenge">الحد الأقصى للأسئلة لكل تحدي</Label>
              <Input
                id="maxQuestionsPerChallenge"
                type="number"
                defaultValue="10"
                min="1"
                max="50"
                className="rtl:text-right ltr:text-left"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="questionMinLength">الحد الأدنى لطول السؤال</Label>
              <Input
                id="questionMinLength"
                type="number"
                defaultValue="20"
                min="5"
                max="100"
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">السماح بالأسئلة الحساسة</Label>
              <p className="text-sm text-muted-foreground">السماح بإنشاء أسئلة ذات طبيعة حساسة</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}