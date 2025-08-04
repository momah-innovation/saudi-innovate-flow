import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from '@/hooks/useAppTranslation';
import { Loader2, Save, X } from 'lucide-react';

interface ProfileEditFormProps {
  onCancel: () => void;
  onSave: () => void;
}

interface ProfileFormData {
  name: string;
  name_ar: string;
  phone: string;
  bio: string;
  position: string;
  department: string;
  sector: string;
}

export function ProfileEditForm({ onCancel, onSave }: ProfileEditFormProps) {
  const { userProfile, user, refreshProfile } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: userProfile?.name || '',
      name_ar: userProfile?.name_ar || '',
      phone: userProfile?.phone || '',
      bio: userProfile?.bio || '',
      position: userProfile?.position || '',
      department: userProfile?.department || '',
      sector: userProfile?.sector || ''
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          name_ar: data.name_ar,
          phone: data.phone,
          bio: data.bio,
          position: data.position,
          department: data.department,
          sector: data.sector,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      
      toast({
        title: t('profile_updated'),
        description: t('profile_updated_successfully'),
      });

      onSave();
    } catch (error: any) {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t('edit_profile')}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              {t('cancel')}
            </Button>
            <Button 
              size="sm" 
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {t('save')}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('name_en')}</Label>
              <Input
                id="name"
                {...register('name', { required: t('name_required') })}
                placeholder={t('enter_name_en')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">{t('name_ar')}</Label>
              <Input
                id="name_ar"
                {...register('name_ar', { required: t('name_ar_required') })}
                placeholder={t('enter_name_ar')}
                dir="rtl"
              />
              {errors.name_ar && (
                <p className="text-sm text-destructive">{errors.name_ar.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t('phone')}</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder={t('enter_phone')}
            />
          </div>

          {/* Professional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">{t('position')}</Label>
              <Input
                id="position"
                {...register('position')}
                placeholder={t('enter_position')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">{t('department')}</Label>
              <Input
                id="department"
                {...register('department')}
                placeholder={t('enter_department')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sector">{t('sector')}</Label>
            <Input
              id="sector"
              {...register('sector')}
              placeholder={t('enter_sector')}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">{t('bio')}</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder={t('enter_bio')}
              rows={4}
              className="resize-none"
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}