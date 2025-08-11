import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useDirection } from "@/components/ui/direction-provider";
import { AISettingsProps } from "@/types/admin-settings";

export function AISettings({ settings, onSettingChange }: AISettingsProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [newFeature, setNewFeature] = useState("");
  const [newModel, setNewModel] = useState("");
  
  const aiFeatures = settings.ai_features || ["idea_generation", "content_moderation", "smart_matching", "evaluation_assist", "trend_analysis"];
  const aiModels = settings.ai_models || ["gpt-4", "gpt-3.5-turbo", "claude-3", "gemini-pro"];

  const addAIFeature = () => {
    if (newFeature.trim() && !aiFeatures.includes(newFeature)) {
      const updatedFeatures = [...aiFeatures, newFeature.trim()];
      onSettingChange('ai_features', updatedFeatures);
      setNewFeature("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeAIFeature = (featureToRemove: string) => {
    const updatedFeatures = aiFeatures.filter((feature: string) => feature !== featureToRemove);
    onSettingChange('ai_features', updatedFeatures);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  const addAIModel = () => {
    if (newModel.trim() && !aiModels.includes(newModel)) {
      const updatedModels = [...aiModels, newModel.trim()];
      onSettingChange('ai_models', updatedModels);
      setNewModel("");
      toast({
        title: t('success'),
        description: t('itemAddedSuccessfully')
      });
    }
  };

  const removeAIModel = (modelToRemove: string) => {
    const updatedModels = aiModels.filter((model: string) => model !== modelToRemove);
    onSettingChange('ai_models', updatedModels);
    toast({
      title: t('success'),
      description: t('itemRemovedSuccessfully')
    });
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      <Card>
        <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
          <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Bot className="w-5 h-5" />
            {t('admin.ai.aiFeatures', 'AI Features')}
          </CardTitle>
          <CardDescription>
            {t('admin.ai.manageFeaturesDesc', 'Manage AI features available in the system')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder={t('admin.ai.addFeaturePlaceholder', 'Add new AI feature')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addAIFeature} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {aiFeatures.map((feature: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{t(`aiFeatures.${feature}`) || feature}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeAIFeature(feature)}
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
          <CardTitle>{t('admin.ai.aiModels', 'AI Models')}</CardTitle>
          <CardDescription>
            {t('admin.ai.manageModelsDesc', 'Manage available AI models')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Input
              value={newModel}
              onChange={(e) => setNewModel(e.target.value)}
              placeholder={t('admin.ai.addModelPlaceholder', 'Add new AI model')}
              className={isRTL ? 'text-right' : 'text-left'}
            />
            <Button onClick={addAIModel} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {aiModels.map((model: string, index: number) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <span>{model}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent"
                  onClick={() => removeAIModel(model)}
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
          <CardTitle>{isRTL ? 'إعدادات الذكاء الاصطناعي' : 'AI Settings'}</CardTitle>
          <CardDescription>
            {isRTL ? 'التحكم في إعدادات الذكاء الاصطناعي' : 'Control AI system settings'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <Label htmlFor="aiRequestLimit">
                {isRTL ? 'حد طلبات الذكاء الاصطناعي شهرياً' : 'AI Request Limit per Month'}
              </Label>
              <Input
                id="aiRequestLimit"
                type="number"
                min="1"
                max="100000"
                value={settings.ai_request_limit || 1000}
                onChange={(e) => onSettingChange('ai_request_limit', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aiResponseTimeout">
                {isRTL ? 'مهلة انتظار الاستجابة (ثانية)' : 'Response Timeout (seconds)'}
              </Label>
              <Input
                id="aiResponseTimeout"
                type="number"
                min="5"
                max="300"
                value={settings.ai_response_timeout || 30}
                onChange={(e) => onSettingChange('ai_response_timeout', parseInt(e.target.value))}
                className={isRTL ? 'text-right' : 'text-left'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultAIModel">
                {isRTL ? 'النموذج الافتراضي' : 'Default AI Model'}
              </Label>
              <Select 
                value={settings.default_ai_model || 'gpt-4'} 
                onValueChange={(value) => onSettingChange('default_ai_model', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aiModels.map((model: string) => (
                    <SelectItem key={model} value={model}>{model}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="creativityLevel">
                {isRTL ? 'مستوى الإبداع' : 'Creativity Level'}
              </Label>
              <Select 
                value={settings.creativity_level || 'balanced'} 
                onValueChange={(value) => onSettingChange('creativity_level', value)}
              >
                <SelectTrigger className={isRTL ? 'text-right' : 'text-left'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">{isRTL ? 'محافظ' : 'Conservative'}</SelectItem>
                  <SelectItem value="balanced">{isRTL ? 'متوازن' : 'Balanced'}</SelectItem>
                  <SelectItem value="creative">{isRTL ? 'إبداعي' : 'Creative'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تفعيل الذكاء الاصطناعي' : 'Enable AI Features'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تفعيل ميزات الذكاء الاصطناعي في النظام' : 'Enable AI features throughout the system'}
              </p>
            </div>
            <Switch
              checked={settings.enable_ai !== false}
              onCheckedChange={(checked) => onSettingChange('enable_ai', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'توليد الأفكار بالذكاء الاصطناعي' : 'AI Idea Generation'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'استخدام الذكاء الاصطناعي لتوليد الأفكار المبتكرة' : 'Use AI to generate innovative ideas'}
              </p>
            </div>
            <Switch
              checked={settings.enable_idea_generation !== false}
              onCheckedChange={(checked) => onSettingChange('enable_idea_generation', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'مراقبة المحتوى بالذكاء الاصطناعي' : 'AI Content Moderation'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'فحص المحتوى تلقائياً باستخدام الذكاء الاصطناعي' : 'Automatically moderate content using AI'}
              </p>
            </div>
            <Switch
              checked={settings.enable_content_moderation !== false}
              onCheckedChange={(checked) => onSettingChange('enable_content_moderation', checked)}
            />
          </div>

          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`space-y-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <Label className="text-base">
                {isRTL ? 'تحليل الاتجاهات' : 'Trend Analysis'}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'تحليل الاتجاهات والأنماط باستخدام الذكاء الاصطناعي' : 'Analyze trends and patterns using AI'}
              </p>
            </div>
            <Switch
              checked={settings.enable_trend_analysis || false}
              onCheckedChange={(checked) => onSettingChange('enable_trend_analysis', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}