import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useAppTranslation";
import { useRTLAware } from "@/hooks/useRTLAware";

interface EvaluationSettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
}

export function EvaluationSettings({ settings, onSettingChange }: EvaluationSettingsProps) {
  const { t } = useTranslation();
  const { textStart, flexRowReverse } = useRTLAware();
  
  return (
    <div className={`space-y-6 ${textStart}`}>
      <Card>
        <CardHeader className={textStart}>
          <CardTitle>{t('general_evaluation_settings')}</CardTitle>
          <CardDescription>{t('evaluation_mechanism_control')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${textStart}`}>
            <div className="space-y-2">
              <Label htmlFor="evalScale">{t('evaluation_scale')}</Label>
              <Select 
                value={settings.evaluationScale || "10"} 
                onValueChange={(value) => onSettingChange('evaluationScale', value)}
              >
                <SelectTrigger className={textStart}>
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
              <Label htmlFor="evalRequiredFields">{t('required_criteria_count')}</Label>
              <Input
                id="evalRequiredFields"
                type="number"
                value={settings.evaluationRequiredFields || 5}
                onChange={(e) => onSettingChange('evaluationRequiredFields', parseInt(e.target.value))}
                min="1"
                max="10"
                className={textStart}
              />
            </div>
          </div>

          <div className={`flex items-center justify-between ${flexRowReverse}`}>
            <div className={`space-y-0.5 ${textStart}`}>
              <Label className="text-base">{t('require_comments')}</Label>
              <p className="text-sm text-muted-foreground">{t('require_evaluator_comments')}</p>
            </div>
            <Switch 
              checked={settings.evaluationRequireComments !== false}
              onCheckedChange={(checked) => onSettingChange('evaluationRequireComments', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}