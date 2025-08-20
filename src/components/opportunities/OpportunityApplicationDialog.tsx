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
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  Send, 
  Upload, 
  Building2, 
  Users, 
  Calendar,
  DollarSign,
  FileText,
  Phone,
  Mail,
  User
} from 'lucide-react';

interface OpportunityApplicationDialogProps {
  opportunity: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface ApplicationFormData {
  application_type: 'individual' | 'organization';
  organization_name?: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  proposal_summary: string;
  expected_budget?: number;
  timeline_months?: number;
  team_size?: number;
  relevant_experience: string;
}

export const OpportunityApplicationDialog = ({
  opportunity,
  open,
  onOpenChange,
  onSuccess
}: OpportunityApplicationDialogProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<ApplicationFormData>({
    defaultValues: {
      application_type: 'individual',
      contact_person: '',
      contact_email: user?.email || '',
      contact_phone: '',
      proposal_summary: '',
      relevant_experience: '',
    }
  });

  const applicationType = watch('application_type');

  const uploadAttachments = async (): Promise<string[]> => {
    if (attachments.length === 0) return [];

    const uploadPromises = attachments.map(async (file) => {
      const fileName = `${user?.id}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('opportunity-attachments')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('opportunity-attachments')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!user || !opportunity) return;

    setIsSubmitting(true);
    try {
      // Upload attachments first
      const attachmentUrls = await uploadAttachments();

      // Submit application
      const { error } = await supabase
        .from('opportunity_applications')
        .insert({
          opportunity_id: opportunity.id,
          applicant_id: user.id,
          application_type: data.application_type,
          organization_name: data.organization_name,
          contact_person: data.contact_person,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          proposal_summary: data.proposal_summary,
          expected_budget: data.expected_budget,
          timeline_months: data.timeline_months,
          team_size: data.team_size,
          relevant_experience: data.relevant_experience,
          attachment_urls: attachmentUrls,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: t('opportunities:application.submit_success_title'),
        description: t('opportunities:application.submit_success_description'),
      });

      reset();
      setAttachments([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: t('opportunities:application.submit_error_title'),
        description: t('opportunities:application.submit_error_description'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  if (!opportunity) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Send className="w-5 h-5" />
            {t('opportunities:application.dialog_title')}
          </DialogTitle>
          <p className="text-muted-foreground">{opportunity.title_ar}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Application Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {t('opportunities:application.application_type')}
            </Label>
            <Select
              value={applicationType}
              onValueChange={(value) => setValue('application_type', value as 'individual' | 'organization')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  {t('opportunities:application.type_individual')}
                </SelectItem>
                <SelectItem value="organization">
                  {t('opportunities:application.type_organization')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Organization Name (if organization type) */}
          {applicationType === 'organization' && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {t('opportunities:application.organization_name')}
              </Label>
              <Input
                {...register('organization_name', { 
                  required: applicationType === 'organization' ? t('opportunities:application.organization_name_required') : false 
                })}
                placeholder={t('opportunities:application.organization_name_placeholder')}
              />
              {errors.organization_name && (
                <p className="text-sm text-red-500">{errors.organization_name.message}</p>
              )}
            </div>
          )}

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {t('opportunities:application.contact_person')}
              </Label>
              <Input
                {...register('contact_person', { 
                  required: t('opportunities:application.contact_person_required')
                })}
                placeholder={t('opportunities:application.contact_person_placeholder')}
              />
              {errors.contact_person && (
                <p className="text-sm text-red-500">{errors.contact_person.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {t('opportunities:application.email_address')}
              </Label>
              <Input
                type="email"
                {...register('contact_email', { 
                  required: t('opportunities:application.email_required'),
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: t('opportunities:application.email_invalid')
                  }
                })}
                placeholder={t('opportunities:application.email_placeholder')}
              />
              {errors.contact_email && (
                <p className="text-sm text-red-500">{errors.contact_email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {t('opportunities:application.phone_number')}
            </Label>
            <Input
              {...register('contact_phone', { 
                required: t('opportunities:application.phone_required')
              })}
              placeholder={t('opportunities:application.phone_placeholder')}
            />
            {errors.contact_phone && (
              <p className="text-sm text-red-500">{errors.contact_phone.message}</p>
            )}
          </div>

          {/* Proposal Summary */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t('opportunities:application.proposal_summary')}
            </Label>
            <Textarea
              {...register('proposal_summary', { 
                required: t('opportunities:application.proposal_summary_required'),
                minLength: {
                  value: 100,
                  message: t('opportunities:application.proposal_summary_min_length')
                }
              })}
              placeholder={t('opportunities:application.proposal_summary_placeholder')}
              rows={4}
            />
            {errors.proposal_summary && (
              <p className="text-sm text-red-500">{errors.proposal_summary.message}</p>
            )}
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                {t('opportunities:application.expected_budget')}
              </Label>
              <Input
                type="number"
                {...register('expected_budget')}
                placeholder={t('opportunities:application.budget_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t('opportunities:application.timeline_months')}
              </Label>
              <Input
                type="number"
                {...register('timeline_months')}
                placeholder={t('opportunities:application.timeline_placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {t('opportunities:application.team_size')}
              </Label>
              <Input
                type="number"
                {...register('team_size')}
                placeholder={t('opportunities:application.team_size_placeholder')}
              />
            </div>
          </div>

          {/* Relevant Experience */}
          <div className="space-y-2">
            <Label>
              {t('opportunities:application.relevant_experience')}
            </Label>
            <Textarea
              {...register('relevant_experience', { 
                required: t('opportunities:application.relevant_experience_required')
              })}
              placeholder={t('opportunities:application.relevant_experience_placeholder')}
              rows={3}
            />
            {errors.relevant_experience && (
              <p className="text-sm text-red-500">{errors.relevant_experience.message}</p>
            )}
          </div>

          {/* File Attachments */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              {t('opportunities:application.attachments_optional')}
            </Label>
            <Input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-xs text-muted-foreground">
              {t('opportunities:application.attachments_hint')}
            </p>
            {attachments.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">{t('opportunities:application.selected_files')}</p>
                {attachments.map((file, index) => (
                  <p key={index} className="text-xs text-muted-foreground">• {file.name}</p>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              {t('opportunities:application.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <span className={`animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`}>⏳</span>
                  {t('opportunities:application.submitting')}
                </>
              ) : (
                <>
                  <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t('opportunities:application.submit_application')}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
