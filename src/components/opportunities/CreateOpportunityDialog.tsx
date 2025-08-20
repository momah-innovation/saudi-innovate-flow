import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { OpportunityImageSelector } from '@/components/opportunities/OpportunityImageSelector';
import { UploadedFile } from '@/hooks/useFileUploader';
import { getOpportunityImageUrl } from '@/utils/storageUtils';
import {
  Plus,
  X
} from 'lucide-react';

interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
    profile_image: {
      small: string
    }
  }
  width: number
  height: number
  color: string
  likes: number
  attribution: {
    photographer: string
    photographer_username: string
    source: string
    source_url: string
    photographer_url: string
  }
}

interface CreateOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Form validation schema - using a factory function to get translated messages
const createFormSchema = (t: (key: string) => string) => z.object({
  title_ar: z.string().min(1, t('opportunities:validation.title_ar_required')),
  title_en: z.string().optional(),
  description_ar: z.string().min(1, t('opportunities:validation.description_ar_required')),
  description_en: z.string().optional(),
  opportunity_type: z.string().min(1, t('opportunities:validation.opportunity_type_required')),
  status: z.string().min(1, t('opportunities:validation.status_required')),
  priority_level: z.string().min(1, t('opportunities:validation.priority_level_required')),
  budget_min: z.coerce.number().optional(),
  budget_max: z.coerce.number().optional(),
  deadline: z.string().min(1, t('opportunities:validation.deadline_required')),
  location: z.string().optional(),
  contact_person: z.string().min(1, t('opportunities:validation.contact_person_required')),
  contact_email: z.string().email(t('opportunities:validation.email_required')),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
});

type FormData = {
  title_ar: string;
  title_en?: string;
  description_ar: string;
  description_en?: string;
  opportunity_type: string;
  status: string;
  priority_level: string;
  budget_min?: number;
  budget_max?: number;
  deadline: string;
  location?: string;
  contact_person: string;
  contact_email: string;
  requirements?: string;
  benefits?: string;
};

export const CreateOpportunityDialog = ({
  open,
  onOpenChange,
  onSuccess
}: CreateOpportunityDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { isRTL } = useDirection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

  const formSchema = createFormSchema(t);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: 'open',
      priority_level: 'medium',
      opportunity_type: 'funding'
    }
  });

  const handleFileUpload = (files: UploadedFile[]) => {
    if (files.length > 0) {
      setImageUrl(files[0].url);
      toast({
        title: t('common:messages.success'),
        description: t('opportunities:messages.image_uploaded'),
      });
    }
  };

  const handleUnsplashSelect = (image: UnsplashImage) => {
    setImageUrl(image.urls.regular);
    toast({
      title: t('common:messages.success'),
      description: t('opportunities:messages.unsplash_selected'),
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: t('common:messages.error'),
        description: t('common:messages.login_required'),
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('opportunities')
        .insert({
          title_ar: data.title_ar,
          title_en: data.title_en || null,
          description_ar: data.description_ar,
          description_en: data.description_en || null,
          opportunity_type: data.opportunity_type,
          status: data.status,
          priority_level: data.priority_level,
          budget_min: data.budget_min || null,
          budget_max: data.budget_max || null,
          deadline: data.deadline,
          location: data.location || null,
          contact_person: data.contact_person,
          contact_email: data.contact_email,
          requirements: data.requirements || null,
          benefits: data.benefits || null,
          image_url: imageUrl || null,
          created_by: user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: t('common:messages.success'),
        description: t('opportunities:messages.created_successfully'),
      });

      form.reset();
      setImageUrl('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('common:messages.error'),
        description: t('opportunities:messages.create_error'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const opportunityTypes = [
    { value: 'funding', label: t('opportunities:types.funding') },
    { value: 'partnership', label: t('opportunities:types.partnership') },
    { value: 'collaboration', label: t('opportunities:types.collaboration') },
    { value: 'research', label: t('opportunities:types.research') },
    { value: 'development', label: t('opportunities:types.development') },
  ];

  const statusOptions = [
    { value: 'open', label: t('opportunities:status.open') },
    { value: 'closed', label: t('opportunities:status.closed') },
    { value: 'draft', label: t('opportunities:status.draft') },
  ];

  const priorityOptions = [
    { value: 'low', label: t('common:priority.low') },
    { value: 'medium', label: t('common:priority.medium') },
    { value: 'high', label: t('common:priority.high') },
    { value: 'urgent', label: t('common:priority.urgent') },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <Plus className="w-5 h-5" />
            {t('opportunities:create.title')}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('opportunities:create.basic_info')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.title_english')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.enter_title_english')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.title_arabic')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-right"
                        placeholder={t('opportunities:placeholders.enter_title_arabic')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.description_english')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.enter_description_english')}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.description_arabic')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="text-right"
                        placeholder={t('opportunities:placeholders.enter_description_arabic')}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Opportunity Details */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('opportunities:create.opportunity_details')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="opportunity_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.opportunity_type')}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('opportunities:create.select_type')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {opportunityTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.status')}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('opportunities:create.select_status')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.priority_level')}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('opportunities:create.select_priority')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityOptions.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="budget_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.min_budget')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.minimum_amount')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budget_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.max_budget')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.maximum_amount')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:deadline')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('opportunities:create.contact_info')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.contact_person')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.contact_person_name')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:create.contact_email')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.email_address')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:location')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.riyadh_saudi')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('opportunities:create.additional_details')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:requirements')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.enter_requirements')}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="benefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {t('opportunities:benefits')}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                        placeholder={t('opportunities:placeholders.enter_benefits')}
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Selection */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('opportunities:create.opportunity_image')}
              </h3>
              
              <div className="space-y-4">
                {imageUrl ? (
                  <div className="relative">
                    <img 
                      src={getOpportunityImageUrl(imageUrl)}
                      alt="Opportunity preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImageUrl('')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <OpportunityImageSelector
                    onFileUpload={handleFileUpload}
                    onUnsplashSelect={handleUnsplashSelect}
                    className="w-full"
                  />
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                {t('common:buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {t('opportunities:create.creating')}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('opportunities:create.create_opportunity')}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
