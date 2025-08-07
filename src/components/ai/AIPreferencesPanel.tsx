import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, Lightbulb, Users, MessageSquare, Settings } from 'lucide-react';
import { useAIFeatures } from '@/hooks/useAIFeatures';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

export const AIPreferencesPanel: React.FC = () => {
  const { features, preferences, loading, updatePreferences, isFeatureEnabled } = useAIFeatures();
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  if (loading || !preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            إعدادات الذكاء الاصطناعي
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePreferenceChange = (key: keyof typeof preferences, value: string | boolean) => {
    logger.info('AI preference changed', { component: 'AIPreferencesPanel', action: 'handlePreferenceChange', data: { key, value } });
    updatePreferences({ [key]: value });
  };

  const featureIcons = {
    idea_evaluation: Brain,
    challenge_assist: Lightbulb,
    similar_idea_detection: MessageSquare,
    smart_partner_matching: Users,
    focus_question_generation: Settings,
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {t('ai_preferences.title', 'AI Settings')}
          </CardTitle>
          <CardDescription>
            {t('ai_preferences.description', 'Customize your preferences for AI features available on the platform')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Master AI Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="ai-enabled" className="text-base font-medium">
                تفعيل الذكاء الاصطناعي
              </Label>
              <div className="text-sm text-muted-foreground">
                تمكين جميع ميزات الذكاء الاصطناعي في المنصة
              </div>
            </div>
            <Switch
              id="ai-enabled"
              checked={preferences.ai_enabled}
              onCheckedChange={(value) => handlePreferenceChange('ai_enabled', value)}
            />
          </div>

          <Separator />

          {/* Language Preference */}
          <div className="space-y-2">
            <Label htmlFor="language-preference">لغة تفاعل الذكاء الاصطناعي</Label>
            <Select
              value={preferences.language_preference}
              onValueChange={(value) => handlePreferenceChange('language_preference', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر اللغة المفضلة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Creativity Level */}
          <div className="space-y-2">
            <Label htmlFor="creativity-level">مستوى الإبداع</Label>
            <Select
              value={preferences.creativity_level}
              onValueChange={(value) => handlePreferenceChange('creativity_level', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر مستوى الإبداع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">محافظ</SelectItem>
                <SelectItem value="balanced">متوازن</SelectItem>
                <SelectItem value="creative">إبداعي</SelectItem>
                <SelectItem value="innovative">مبتكر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Individual Feature Toggles */}
          <div className="space-y-4">
            <Label className="text-base font-medium">الميزات المتاحة</Label>
            
            {features.map((feature) => {
              const IconComponent = featureIcons[feature.feature_name as keyof typeof featureIcons] || Bot;
              const preferenceKey = feature.feature_name as keyof typeof preferences;
              const isEnabled = isFeatureEnabled(feature.feature_name);
              
              return (
                <div key={feature.id} className="flex items-start justify-between space-x-2">
                  <div className="flex items-start space-x-3 flex-1" dir={isRTL ? 'rtl' : 'ltr'}>
                    <IconComponent className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">
                          {feature.feature_name_ar}
                        </Label>
                        {feature.is_beta && (
                          <Badge variant="secondary" className="text-xs">
                            تجريبي
                          </Badge>
                        )}
                        {feature.required_subscription_tier && (
                          <Badge variant="outline" className="text-xs">
                            {feature.required_subscription_tier}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {feature.description_ar || feature.description}
                      </div>
                      {feature.usage_limit_per_month && (
                        <div className="text-xs text-amber-600">
                          الحد الأقصى: {feature.usage_limit_per_month} استخدام شهرياً
                        </div>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={preferences[preferenceKey] as boolean}
                    onCheckedChange={(value) => handlePreferenceChange(preferenceKey, value)}
                    disabled={!preferences.ai_enabled}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};