import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useOpportunityOperations } from '@/hooks/useOpportunityOperations';
import { 
  Building2, 
  DollarSign, 
  Calendar,
  MapPin,
  Users,
  Target,
  AlertCircle,
  Save,
  Upload,
  X,
  Image
} from 'lucide-react';
import { getOpportunityImageUrl } from '@/utils/storageUtils';

interface EditOpportunityDialogProps {
  opportunity: any;
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

export const EditOpportunityDialog = ({
  opportunity,
  open,
  onOpenChange,
  onSuccess
}: EditOpportunityDialogProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateOpportunity, uploadOpportunityImage, loading } = useOpportunityOperations();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<OpportunityFormData>();

  useEffect(() => {
    if (opportunity && open) {
      // Pre-populate form with existing opportunity data
      setValue('title_ar', opportunity.title_ar || '');
      setValue('title_en', opportunity.title_en || '');
      setValue('description_ar', opportunity.description_ar || '');
      setValue('description_en', opportunity.description_en || '');
      setValue('opportunity_type', opportunity.opportunity_type || '');
      setValue('status', opportunity.status || '');
      setValue('priority_level', opportunity.priority_level || '');
      setValue('budget_min', opportunity.budget_min || 0);
      setValue('budget_max', opportunity.budget_max || 0);
      setValue('deadline', opportunity.deadline ? opportunity.deadline.split('T')[0] : '');
      setValue('location', opportunity.location || '');
      setValue('contact_person', opportunity.contact_person || '');
      setValue('contact_email', opportunity.contact_email || '');
      setValue('requirements', typeof opportunity.requirements === 'string' ? opportunity.requirements : JSON.stringify(opportunity.requirements || {}));
      setValue('benefits', typeof opportunity.benefits === 'string' ? opportunity.benefits : JSON.stringify(opportunity.benefits || {}));
      setImageUrl(opportunity.image_url || '');
    }
  }, [opportunity, open, setValue]);

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
      const fileName = `opportunity-${opportunity.id}-${Date.now()}.${file.name.split('.').pop()}`;
      
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
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
    try {
      const { error } = await supabase
        .from('opportunities')
        .update({
          title_ar: data.title_ar,
          title_en: data.title_en,
          description_ar: data.description_ar,
          description_en: data.description_en,
          opportunity_type: data.opportunity_type,
          status: data.status,
          priority_level: data.priority_level,
          budget_min: data.budget_min,
          budget_max: data.budget_max,
          deadline: data.deadline,
          location: data.location,
          contact_person: data.contact_person,
          contact_email: data.contact_email,
          requirements: data.requirements,
          benefits: data.benefits,
          image_url: imageUrl || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', opportunity.id);

      if (error) throw error;

      // Send notification email if status changed
      if (opportunity.status !== data.status) {
        try {
          await supabase.functions.invoke('send-opportunity-notification', {
            body: {
              to: data.contact_email,
              subject: isRTL ? 'تحديث حالة الفرصة' : 'Opportunity Status Update',
              html: `
                <div dir="${isRTL ? 'rtl' : 'ltr'}">
                  <h2>${isRTL ? 'تحديث حالة الفرصة' : 'Opportunity Status Update'}</h2>
                  <p>${isRTL ? 'تم تحديث حالة فرصة' : 'The status of opportunity'} "${data.title_ar}" ${isRTL ? 'إلى' : 'has been updated to'}: <strong>${data.status}</strong></p>
                  <p>${isRTL ? 'يمكنكم مراجعة التفاصيل في لوحة التحكم.' : 'You can review the details in the dashboard.'}</p>
                </div>
              `,
              opportunityId: opportunity.id,
              notificationType: 'status_update'
            }
          });
        } catch (emailError) {
          // Email notification failed - continue without blocking update
          // User will still see successful update notification
        }
      }

      toast({
        title: isRTL ? 'تم التحديث بنجاح' : 'Updated Successfully',
        description: isRTL ? 'تم تحديث الفرصة بنجاح' : 'Opportunity updated successfully',
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message || (isRTL ? 'حدث خطأ أثناء تحديث الفرصة' : 'An error occurred while updating the opportunity'),
        variant: 'destructive',
      });
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            {isRTL ? 'تعديل الفرصة' : 'Edit Opportunity'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title_ar" className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'العنوان (بالعربية)' : 'Title (Arabic)'}
              </Label>
              <Input
                id="title_ar"
                {...register('title_ar', { required: 'Arabic title is required' })}
                className={isRTL ? 'text-right' : 'text-left'}
                placeholder={isRTL ? 'أدخل العنوان بالعربية' : 'Enter title in Arabic'}
              />
              {errors.title_ar && (
                <p className="text-sm text-destructive">{errors.title_ar.message}</p>
              )}
            </div>

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
            </div>
          </div>

          {/* Description Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description_ar" className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'الوصف (بالعربية)' : 'Description (Arabic)'}
              </Label>
              <Textarea
                id="description_ar"
                {...register('description_ar', { required: 'Arabic description is required' })}
                className={isRTL ? 'text-right' : 'text-left'}
                placeholder={isRTL ? 'أدخل الوصف بالعربية' : 'Enter description in Arabic'}
                rows={4}
              />
              {errors.description_ar && (
                <p className="text-sm text-destructive">{errors.description_ar.message}</p>
              )}
            </div>

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
            </div>
          </div>

          {/* Type, Status, Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'نوع الفرصة' : 'Opportunity Type'}
              </Label>
              <Select onValueChange={(value) => setValue('opportunity_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر النوع' : 'Select type'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="funding">{isRTL ? 'تمويل' : 'Funding'}</SelectItem>
                  <SelectItem value="collaboration">{isRTL ? 'تعاون' : 'Collaboration'}</SelectItem>
                  <SelectItem value="sponsorship">{isRTL ? 'رعاية' : 'Sponsorship'}</SelectItem>
                  <SelectItem value="research">{isRTL ? 'بحث' : 'Research'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'الحالة' : 'Status'}
              </Label>
              <Select onValueChange={(value) => setValue('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر الحالة' : 'Select status'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">{isRTL ? 'مفتوح' : 'Open'}</SelectItem>
                  <SelectItem value="closed">{isRTL ? 'مغلق' : 'Closed'}</SelectItem>
                  <SelectItem value="paused">{isRTL ? 'متوقف' : 'Paused'}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'مستوى الأولوية' : 'Priority Level'}
              </Label>
              <Select onValueChange={(value) => setValue('priority_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر الأولوية' : 'Select priority'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">{isRTL ? 'عالي' : 'High'}</SelectItem>
                  <SelectItem value="medium">{isRTL ? 'متوسط' : 'Medium'}</SelectItem>
                  <SelectItem value="low">{isRTL ? 'منخفض' : 'Low'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Budget and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_min" className={isRTL ? 'text-right' : 'text-left'}>
                <DollarSign className="w-4 h-4 inline mr-1" />
                {isRTL ? 'الحد الأدنى للميزانية' : 'Minimum Budget'}
              </Label>
              <Input
                id="budget_min"
                type="number"
                {...register('budget_min')}
                placeholder={isRTL ? 'أدخل الحد الأدنى' : 'Enter minimum amount'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget_max" className={isRTL ? 'text-right' : 'text-left'}>
                <DollarSign className="w-4 h-4 inline mr-1" />
                {isRTL ? 'الحد الأقصى للميزانية' : 'Maximum Budget'}
              </Label>
              <Input
                id="budget_max"
                type="number"
                {...register('budget_max')}
                placeholder={isRTL ? 'أدخل الحد الأقصى' : 'Enter maximum amount'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline" className={isRTL ? 'text-right' : 'text-left'}>
                <Calendar className="w-4 h-4 inline mr-1" />
                {isRTL ? 'الموعد النهائي' : 'Deadline'}
              </Label>
              <Input
                id="deadline"
                type="date"
                {...register('deadline', { required: 'Deadline is required' })}
              />
              {errors.deadline && (
                <p className="text-sm text-destructive">{errors.deadline.message}</p>
              )}
            </div>
          </div>

          {/* Location and Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className={isRTL ? 'text-right' : 'text-left'}>
                <MapPin className="w-4 h-4 inline mr-1" />
                {isRTL ? 'الموقع' : 'Location'}
              </Label>
              <Input
                id="location"
                {...register('location')}
                placeholder={isRTL ? 'أدخل الموقع' : 'Enter location'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_person" className={isRTL ? 'text-right' : 'text-left'}>
                <Users className="w-4 h-4 inline mr-1" />
                {isRTL ? 'الشخص المسؤول' : 'Contact Person'}
              </Label>
              <Input
                id="contact_person"
                {...register('contact_person', { required: 'Contact person is required' })}
                placeholder={isRTL ? 'أدخل اسم المسؤول' : 'Enter contact person name'}
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
                {...register('contact_email', { required: 'Contact email is required' })}
                placeholder={isRTL ? 'أدخل البريد الإلكتروني' : 'Enter email address'}
              />
              {errors.contact_email && (
                <p className="text-sm text-destructive">{errors.contact_email.message}</p>
              )}
            </div>
          </div>

          {/* Requirements and Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="requirements" className={isRTL ? 'text-right' : 'text-left'}>
                <Target className="w-4 h-4 inline mr-1" />
                {isRTL ? 'المتطلبات' : 'Requirements'}
              </Label>
              <Textarea
                id="requirements"
                {...register('requirements')}
                placeholder={isRTL ? 'أدخل المتطلبات' : 'Enter requirements'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits" className={isRTL ? 'text-right' : 'text-left'}>
                {isRTL ? 'الفوائد' : 'Benefits'}
              </Label>
              <Textarea
                id="benefits"
                {...register('benefits')}
                placeholder={isRTL ? 'أدخل الفوائد' : 'Enter benefits'}
                rows={3}
              />
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
                    src={getOpportunityImageUrl(imageUrl)}
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
        

          {/* Form Actions */}
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};