import { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

interface CreateOpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface OpportunityFormData {
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
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

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<OpportunityFormData>({
    defaultValues: {
      status: 'open',
      priority_level: 'medium',
      opportunity_type: 'funding'
    }
  });

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
        .from('partnership_opportunities')
        .insert({
          ...data,
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
                <Label htmlFor="title" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'العنوان (بالإنجليزية)' : 'Title (English)'}
                </Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'أدخل العنوان بالإنجليزية' : 'Enter title in English'}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
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
                <Label htmlFor="description" className={isRTL ? 'text-right' : 'text-left'}>
                  {isRTL ? 'الوصف (بالإنجليزية)' : 'Description (English)'}
                </Label>
                <Textarea
                  id="description"
                  {...register('description', { required: 'Description is required' })}
                  className={isRTL ? 'text-right' : 'text-left'}
                  placeholder={isRTL ? 'أدخل الوصف بالإنجليزية' : 'Enter description in English'}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
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