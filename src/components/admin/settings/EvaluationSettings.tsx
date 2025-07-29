import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EvaluationSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function EvaluationSettings({ settings, onSettingChange }: EvaluationSettingsProps) {
  return (
    <div className="space-y-6 rtl:text-right ltr:text-left">
      <Card>
        <CardHeader className="rtl:text-right ltr:text-left">
          <CardTitle>إعدادات التقييم العامة</CardTitle>
          <CardDescription>التحكم في آلية تقييم الأفكار والتحديات</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rtl:text-right ltr:text-left">
            <div className="space-y-2">
              <Label htmlFor="evalScale">مقياس التقييم</Label>
              <Select defaultValue="10">
                <SelectTrigger className="rtl:text-right ltr:text-left">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">1-5</SelectItem>
                  <SelectItem value="10">1-10</SelectItem>
                  <SelectItem value="100">1-100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="evalRequiredFields">عدد المعايير المطلوبة</Label>
              <Input
                id="evalRequiredFields"
                type="number"
                defaultValue="5"
                min="1"
                max="10"
                className="rtl:text-right ltr:text-left"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rtl:flex-row-reverse">
            <div className="space-y-0.5 rtl:text-right ltr:text-left">
              <Label className="text-base">إجبار التعليقات</Label>
              <p className="text-sm text-muted-foreground">مطالبة المقيمين بكتابة تعليقات</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}