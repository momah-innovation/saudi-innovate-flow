import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { 
  Plus, 
  Building2, 
  DollarSign, 
  Calendar,
  MapPin,
  Users,
  Target,
  AlertCircle,
  Upload,
  X,
  Image
} from 'lucide-react';

interface CreateOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface OpportunityFormData {
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
  location: string;
  contact_person: string;
  contact_email: string;
  requirements: string;
  benefits: string;
  image_url?: string;
}

export const CreateOpportunityDialog = ({
  open,
  onOpenChange,
  onSuccess
}: CreateOpportunityDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isRTL } = useDirection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<OpportunityFormData>({
    defaultValues: {
      status: 'open',
      priority_level: 'medium',
      opportunity_type: 'funding'
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'يرجى اختيار ملف صورة' : 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'حجم الملف يجب أن يكون أقل من 5 ميجابايت' : 'File size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingImage(true);
    try {
      const fileName = `opportunity-${Date.now()}.${file.name.split('.').pop()}`;
      
      const { data, error } = await supabase.storage
        .from('opportunity-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const relativePath = `/opportunity-images/${fileName}`;
      setImageUrl(relativePath);
      
      toast({
        title: isRTL ? 'نجح' : 'Success',
        description: isRTL ? 'تم رفع الصورة بنجاح' : 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: isRTL ? 'فشل في رفع الصورة' : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: OpportunityFormData) => {
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
          ...data,
          image_url: imageUrl || null,
          created_by: user.id,
          deadline: new Date(data.deadline).toISOString().split('T')[0],
        });

      if (error) {
        throw error;
      }

      toast({
        title: isRTL ? 'تم بنجاح' : 'Success',
        description: isRTL ? 'تم إنشاء الفرصة بنجاح' : 'Opportunity created successfully',
      });

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating opportunity:', error);
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title_en" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'العنوان (بالإنجليزية)' : 'Title (English)'}
                </Label>
                <Input
                  id="title_en"
                  {...register('title_en')}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'أدخل العنوان بالإنجليزية' : 'Enter title in English'}
                />
                {errors.title_en && (
                  <p className="text-sm text-destructive">{errors.title_en.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title_ar" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'العنوان (بالعربية)' : 'Title (Arabic)'}
                </Label>
                <Input
                  id="title_ar"
                  {...register('title_ar', { required: 'Arabic title is required' })}
                  className="text-right"
                  placeholder="أدخل العنوان بالعربية"
                />
                {errors.title_ar && (
                  <p className="text-sm text-destructive">{errors.title_ar.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="description_en" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
                </Label>
                <Textarea
                  id="description_en"
                  {...register('description_en')}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'أدخل الوصف بالإنجليزية' : 'Enter description in English'}
                  rows={4}
                />
                {errors.description_en && (
                  <p className="text-sm text-destructive">{errors.description_en.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description_ar" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
                </Label>
                <Textarea
                  id="description_ar"
                  {...register('description_ar', { required: 'Arabic description is required' })}
                  className="text-right"
                  placeholder="أدخل الوصف بالعربية"
                  rows={4}
                />
                {errors.description_ar && (
                  <p className="text-sm text-destructive">{errors.description_ar.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Opportunity Details */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'تفاصيل الفرصة' : 'Opportunity Details'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'نوع الفرصة' : 'Opportunity Type'}
                </Label>
                <Select {...register('opportunity_type')}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر النوع' : 'Select type'} />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الحالة' : 'Status'}
                </Label>
                <Select {...register('status')}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر الحالة' : 'Select status'} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'مستوى الأولوية' : 'Priority Level'}
                </Label>
                <Select {...register('priority_level')}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRTL ? 'اختر الأولوية' : 'Select priority'} />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget_min" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الحد الأدنى للميزانية (ريال)' : 'Minimum Budget (SAR)'}
                </Label>
                <Input
                  id="budget_min"
                  type="number"
                  {...register('budget_min')}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'الحد الأدنى' : 'Minimum amount'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget_max" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الحد الأقصى للميزانية (ريال)' : 'Maximum Budget (SAR)'}
                </Label>
                <Input
                  id="budget_max"
                  type="number"
                  {...register('budget_max')}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'الحد الأقصى' : 'Maximum amount'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الموعد النهائي' : 'Deadline'}
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  {...register('deadline', { required: 'Deadline is required' })}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
                {errors.deadline && (
                  <p className="text-sm text-destructive">{errors.deadline.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'معلومات الاتصال' : 'Contact Information'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_person" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الشخص المسؤول' : 'Contact Person'}
                </Label>
                <Input
                  id="contact_person"
                  {...register('contact_person', { required: 'Contact person is required' })}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'اسم الشخص المسؤول' : 'Contact person name'}
                />
                {errors.contact_person && (
                  <p className="text-sm text-destructive">{errors.contact_person.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'البريد الإلكتروني' : 'Contact Email'}
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  {...register('contact_email', { required: 'Email is required' })}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'البريد الإلكتروني' : 'Email address'}
                />
                {errors.contact_email && (
                  <p className="text-sm text-destructive">{errors.contact_email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الموقع' : 'Location'}
                </Label>
                <Input
                  id="location"
                  {...register('location')}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'تفاصيل إضافية' : 'Additional Details'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="requirements" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'المتطلبات' : 'Requirements'}
                </Label>
                <Textarea
                  id="requirements"
                  {...register('requirements')}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'اذكر المتطلبات والشروط...' : 'List requirements and conditions...'}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الفوائد والمميزات' : 'Benefits'}
                </Label>
                <Textarea
                  id="benefits"
                  {...register('benefits')}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'اذكر الفوائد والمميزات...' : 'List benefits and advantages...'}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${isRTL ? 'text-right' : 'text-left'}`}>
              {isRTL ? 'صورة الفرصة' : 'Opportunity Image'}
            </h3>
            
            <div className="space-y-4">
              {imageUrl ? (
                <div className="relative">
                  <img 
                    src={`https://jxpbiljkoibvqxzdkgod.supabase.co/storage/v1/object/public${imageUrl}`}
                    alt="Opportunity preview"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        {uploadingImage ? (
                          <>
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            {isRTL ? 'جاري الرفع...' : 'Uploading...'}
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            {isRTL ? 'رفع صورة' : 'Upload Image'}
                          </>
                        )}
                      </Button>
                      <p className="mt-2 text-sm text-gray-500">
                        {isRTL ? 'PNG أو JPG أو JPEG (حد أقصى 5 ميجابايت)' : 'PNG, JPG, or JPEG (max 5MB)'}
                      </p>
                    </div>
                  </div>
                </div>
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
      </DialogContent>
    </Dialog>
  );
};