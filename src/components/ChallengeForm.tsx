import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useAppTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
// TagSelector will be implemented in next phase
import { FileUploader } from '@/components/ui/file-uploader';
import { Calendar, MapPin, DollarSign, Clock, Target, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChallengeFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

export function ChallengeForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  mode = 'create'
}: ChallengeFormProps) {
  const { t, language, isRTL } = useTranslation();
  
  const [formData, setFormData] = useState({
    title_ar: initialData?.title_ar || '',
    description_ar: initialData?.description_ar || '',
    challenge_type: initialData?.challenge_type || '',
    priority_level: initialData?.priority_level || 'medium',
    estimated_budget: initialData?.estimated_budget || '',
    start_date: initialData?.start_date || '',
    end_date: initialData?.end_date || '',
    max_participants: initialData?.max_participants || '',
    tags: initialData?.tags || [],
    image_url: initialData?.image_url || '',
    ...initialData
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const challengeTypes = [
    { value: 'digital_transformation', label: 'Digital Transformation', labelAr: 'التحول الرقمي' },
    { value: 'smart_cities', label: 'Smart Cities', labelAr: 'المدن الذكية' },
    { value: 'education', label: 'Education', labelAr: 'التعليم' },
    { value: 'healthcare', label: 'Healthcare', labelAr: 'الصحة' },
    { value: 'environment', label: 'Environment', labelAr: 'البيئة' },
    { value: 'fintech', label: 'Financial Technology', labelAr: 'التقنية المالية' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', labelAr: 'أولوية منخفضة' },
    { value: 'medium', label: 'Medium Priority', labelAr: 'أولوية متوسطة' },
    { value: 'high', label: 'High Priority', labelAr: 'أولوية عالية' },
    { value: 'urgent', label: 'Urgent', labelAr: 'طارئ' }
  ];

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30",
      "p-6"
    )}>
      <div className="container mx-auto max-w-4xl">
        <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <CardHeader className="pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {mode === 'create' ? t('challenge_form.create_challenge') : t('challenge_form.edit_challenge')}
              </CardTitle>
            </div>
            <p className="text-muted-foreground">
              {mode === 'create' 
                ? t('challenge_form.create_challenge_description')
                : t('challenge_form.edit_challenge_description')
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <Label htmlFor="title_ar" className="text-base font-medium">
                    {t('challenge_form.challenge_title')} *
                  </Label>
                  <Input
                    id="title_ar"
                    value={formData.title_ar}
                    onChange={(e) => handleInputChange('title_ar', e.target.value)}
                    placeholder={t('challenge_form.challenge_title_placeholder')}
                    required
                    className="text-lg"
                    dir="rtl"
                  />
                </div>

                <div className="lg:col-span-2 space-y-4">
                  <Label htmlFor="description_ar" className="text-base font-medium">
                    {t('challenge_form.challenge_description')} *
                  </Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => handleInputChange('description_ar', e.target.value)}
                    placeholder={t('challenge_form.challenge_description_placeholder')}
                    required
                    className="min-h-32 resize-y"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Challenge Type and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t('challenge_form.challenge_type')} *
                  </Label>
                  <Select
                    value={formData.challenge_type}
                    onValueChange={(value) => handleInputChange('challenge_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('challenge_form.select_challenge_type')} />
                    </SelectTrigger>
                    <SelectContent>
                      {challengeTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {language === 'ar' ? type.labelAr : type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {t('challenge_form.priority_level')} *
                  </Label>
                  <Select
                    value={formData.priority_level}
                    onValueChange={(value) => handleInputChange('priority_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('challenge_form.select_priority')} />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {language === 'ar' ? priority.labelAr : priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Budget and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    {t('challenge_form.estimated_budget')}
                  </Label>
                  <Input
                    type="number"
                    value={formData.estimated_budget}
                    onChange={(e) => handleInputChange('estimated_budget', e.target.value)}
                    placeholder={t('challenge_form.budget_placeholder')}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('challenge_form.start_date')}
                  </Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t('challenge_form.end_date')}
                  </Label>
                  <Input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                  />
                </div>
              </div>

              {/* Max Participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('challenge_form.max_participants')}
                  </Label>
                  <Input
                    type="number"
                    value={formData.max_participants}
                    onChange={(e) => handleInputChange('max_participants', e.target.value)}
                    placeholder={t('challenge_form.max_participants_placeholder')}
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {t('challenge_form.tags')}
                </Label>
              <div className="text-sm text-muted-foreground">
                {t('advanced_search.tag_selector_coming_soon')}
              </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  {t('challenge_form.challenge_image')}
                </Label>
                <FileUploader
                  uploadType="CHALLENGE_IMAGES"
                  onUploadComplete={(files) => {
                    if (files.length > 0) {
                      handleInputChange('image_url', files[0].url);
                    }
                  }}
                  className="w-full"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-6 border-t">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 md:flex-none md:px-8"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      {t('challenge_form.saving')}
                    </div>
                  ) : (
                    mode === 'create' ? t('challenge_form.create_challenge') : t('challenge_form.save_changes')
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 md:flex-none md:px-8"
                >
                  {t('challenge_form.cancel')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}