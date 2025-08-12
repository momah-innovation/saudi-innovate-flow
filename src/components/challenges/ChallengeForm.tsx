import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationalHierarchy } from '@/hooks/useOrganizationalHierarchy';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

const challengeSchema = z.object({
  title_ar: z.string().min(1, 'Arabic title is required'),
  title_en: z.string().optional(),
  description_ar: z.string().min(1, 'Arabic description is required'),
  description_en: z.string().optional(),
  sector_id: z.string().optional(),
  deputy_id: z.string().optional(),
  department_id: z.string().optional(),
  domain_id: z.string().optional(),
  sub_domain_id: z.string().optional(),
  service_id: z.string().optional(),
  priority_level: z.string().default('medium'),
  sensitivity_level: z.string().default('normal'),
  challenge_type: z.string().optional(),
});

type ChallengeFormData = z.infer<typeof challengeSchema>;

interface ChallengeFormProps {
  challenge?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ChallengeForm({ challenge, onSuccess, onCancel }: ChallengeFormProps) {
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { sectors, deputies, departments, domains, subDomains, services } = useOrganizationalHierarchy();
  const [loading, setLoading] = useState(false);

  const form = useForm<ChallengeFormData>({
    resolver: zodResolver(challengeSchema),
    defaultValues: {
      title_ar: challenge?.title_ar || '',
      title_en: challenge?.title_en || '',
      description_ar: challenge?.description_ar || '',
      description_en: challenge?.description_en || '',
      sector_id: challenge?.sector_id || '',
      deputy_id: challenge?.deputy_id || '',
      department_id: challenge?.department_id || '',
      domain_id: challenge?.domain_id || '',
      sub_domain_id: challenge?.sub_domain_id || '',
      service_id: challenge?.service_id || '',
      priority_level: challenge?.priority_level || 'medium',
      sensitivity_level: challenge?.sensitivity_level || 'normal',
      challenge_type: challenge?.challenge_type || '',
    },
  });

  const handleSubmit = async (data: ChallengeFormData) => {
    setLoading(true);
    try {
      if (challenge?.id) {
        const { error } = await supabase
          .from('challenges')
          .update(data)
          .eq('id', challenge.id);
        
        if (error) throw error;
        
        toast({
          title: t('challenges.updated'),
          description: t('challenges.update_success')
        });
      } else {
        const { error } = await supabase
          .from('challenges')
          .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }]);
        
        if (error) throw error;
        
        toast({
          title: t('challenges.created'),
          description: t('challenges.create_success')
        });
      }
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{challenge ? t('challenges.edit') : t('challenges.create')}</CardTitle>
        <CardDescription>
          {challenge ? t('challenges.edit_description') : t('challenges.create_description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title_ar">{t('form.title_ar')} *</Label>
              <Input
                id="title_ar"
                {...form.register('title_ar')}
                placeholder={t('placeholder.enter_title')}
                dir="rtl"
              />
              {form.formState.errors.title_ar && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.title_ar.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="title_en">{t('form.title_en')}</Label>
              <Input
                id="title_en"
                {...form.register('title_en')}
                placeholder={t('placeholder.enter_title_en')}
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description_ar">{t('form.description_ar')} *</Label>
            <Textarea
              id="description_ar"
              {...form.register('description_ar')}
              placeholder={t('placeholder.enter_description')}
              dir="rtl"
              rows={4}
            />
            {form.formState.errors.description_ar && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.description_ar.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description_en">{t('form.description_en')}</Label>
            <Textarea
              id="description_en"
              {...form.register('description_en')}
              placeholder={t('placeholder.enter_description_en')}
              dir="ltr"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sector_id">{t('form.sector')}</Label>
              <Select value={form.watch('sector_id')} onValueChange={(value) => form.setValue('sector_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('placeholder.select_sector')} />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name_ar || sector.name_en || 'Unnamed Sector'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department_id">{t('form.department')}</Label>
              <Select value={form.watch('department_id')} onValueChange={(value) => form.setValue('department_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('placeholder.select_department')} />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name_ar || dept.name || 'Unnamed Department'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('saving') : challenge ? t('update') : t('create')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}