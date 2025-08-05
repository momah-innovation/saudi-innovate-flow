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
import { useDirection } from '@/components/ui/direction-provider';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { OpportunityImageSelector } from '@/components/opportunities/OpportunityImageSelector';
import { UploadedFile } from '@/hooks/useFileUploader';
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

// Form validation schema
const formSchema = z.object({
  title_ar: z.string().min(1, 'Arabic title is required'),
  title_en: z.string().optional(),
  description_ar: z.string().min(1, 'Arabic description is required'),
  description_en: z.string().optional(),
  opportunity_type: z.string().min(1, 'Opportunity type is required'),
  status: z.string().min(1, 'Status is required'),
  priority_level: z.string().min(1, 'Priority level is required'),
  budget_min: z.coerce.number().optional(),
  budget_max: z.coerce.number().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
  location: z.string().optional(),
  contact_person: z.string().min(1, 'Contact person is required'),
  contact_email: z.string().email('Valid email is required'),
  requirements: z.string().optional(),
  benefits: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CreateOpportunityDialog = ({
  open,
  onOpenChange,
  onSuccess
}: CreateOpportunityDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');

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
        title: isRTL ? 'نجح' : 'Success',
        description: isRTL ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully',
      });
    }
  };

  const handleUnsplashSelect = (image: UnsplashImage) => {
    setImageUrl(image.urls.regular);
    toast({
      title: isRTL ? 'نجح' : 'Success',
      description: isRTL ? 'تم اختيار الصورة من Unsplash' : 'Image selected from Unsplash',
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يجب تسجيل الدخول أولاً' : 'You must be logged in',
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
        title: isRTL ? 'تم بنجاح' : 'Success',
        description: isRTL ? 'تم إنشاء الفرصة بنجاح' : 'Opportunity created successfully',
      });

      form.reset();
      setImageUrl('');
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حدث خطأ أثناء إنشاء الفرصة' : 'Error creating opportunity',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const opportunityTypes = [
    { value: 'funding', label: isRTL ? 'تمويل' : 'Funding' },
    { value: 'partnership', label: isRTL ? 'شراكة' : 'Partnership' },
    { value: 'collaboration', label: isRTL ? 'تعاون' : 'Collaboration' },
    { value: 'research', label: isRTL ? 'بحث' : 'Research' },
    { value: 'development', label: isRTL ? 'تطوير' : 'Development' },
  ];

  const statusOptions = [
    { value: 'open', label: isRTL ? 'مفتوح' : 'Open' },
    { value: 'closed', label: isRTL ? 'مغلق' : 'Closed' },
    { value: 'draft', label: isRTL ? 'مسودة' : 'Draft' },
  ];

  const priorityOptions = [
    { value: 'low', label: isRTL ? 'منخفض' : 'Low' },
    { value: 'medium', label: isRTL ? 'متوسط' : 'Medium' },
    { value: 'high', label: isRTL ? 'عالي' : 'High' },
    { value: 'urgent', label: isRTL ? 'عاجل' : 'Urgent' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            <Plus className="w-5 h-5" />
            {isRTL ? 'إنشاء فرصة شراكة جديدة' : 'Create New Partnership Opportunity'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
                {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {isRTL ? 'العنوان (بالإنجليزية)' : 'Title (English)'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                          placeholder={isRTL ? 'أدخل العنوان بالإنجليزية' : 'Enter title in English'}
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
                        {isRTL ? 'العنوان (بالعربية)' : 'Title (Arabic)'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                           className="text-end"
                           placeholder="أدخل العنوان بالعربية"
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
                       <FormLabel className={isRTL ? 'text-end' : 'text-start'}>
                         {isRTL ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
                       </FormLabel>
                       <FormControl>
                         <Textarea
                           {...field}
                           className={isRTL ? 'text-end' : 'text-start'}
                           placeholder={isRTL ? 'أدخل الوصف بالإنجليزية' : 'Enter description in English'}
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
                       <FormLabel className={isRTL ? 'text-end' : 'text-start'}>
                         {isRTL ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
                       </FormLabel>
                       <FormControl>
                         <Textarea
                           {...field}
                           className="text-end"
                           placeholder="أدخل الوصف بالعربية"
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
                {isRTL ? 'تفاصيل الفرصة' : 'Opportunity Details'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="opportunity_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {isRTL ? 'نوع الفرصة' : 'Opportunity Type'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? 'اختر النوع' : 'Select type'} />
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
                        {isRTL ? 'الحالة' : 'Status'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? 'اختر الحالة' : 'Select status'} />
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
                        {isRTL ? 'مستوى الأولوية' : 'Priority Level'}
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={isRTL ? 'اختر الأولوية' : 'Select priority'} />
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
                        {isRTL ? 'الحد الأدنى للميزانية (ريال)' : 'Minimum Budget (SAR)'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className={isRTL ? 'text-right' : 'text-left'}
                          placeholder={isRTL ? 'الحد الأدنى' : 'Minimum amount'}
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
                        {isRTL ? 'الحد الأقصى للميزانية (ريال)' : 'Maximum Budget (SAR)'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className={isRTL ? 'text-right' : 'text-left'}
                          placeholder={isRTL ? 'الحد الأقصى' : 'Maximum amount'}
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
                        {isRTL ? 'الموعد النهائي' : 'Deadline'}
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
                {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {isRTL ? 'الشخص المسؤول' : 'Contact Person'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                          placeholder={isRTL ? 'اسم الشخص المسؤول' : 'Contact person name'}
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
                        {isRTL ? 'البريد الإلكتروني' : 'Contact Email'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className={isRTL ? 'text-right' : 'text-left'}
                          placeholder={isRTL ? 'البريد الإلكتروني' : 'Email address'}
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
                        {isRTL ? 'الموقع' : 'Location'}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                          placeholder={isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
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
                {isRTL ? 'تفاصيل إضافية' : 'Additional Details'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRTL ? 'text-right' : 'text-left'}>
                        {isRTL ? 'المتطلبات' : 'Requirements'}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                          placeholder={isRTL ? 'اذكر المتطلبات والشروط...' : 'List requirements and conditions...'}
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
                        {isRTL ? 'الفوائد والمميزات' : 'Benefits'}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={isRTL ? 'text-right' : 'text-left'}
                          placeholder={isRTL ? 'اذكر الفوائد والمميزات...' : 'List benefits and advantages...'}
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
                {isRTL ? 'صورة الفرصة' : 'Opportunity Image'}
              </h3>
              
              <div className="space-y-4">
                {imageUrl ? (
                  <div className="relative">
                    <img 
                      src={imageUrl.startsWith('http') ? imageUrl : `https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public${imageUrl}`}
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
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {isRTL ? 'جاري الإنشاء...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    {isRTL ? 'إنشاء الفرصة' : 'Create Opportunity'}
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