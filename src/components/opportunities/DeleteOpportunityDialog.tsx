import React, { useState } from 'react';
import { OpportunityData } from '@/types/common';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteOpportunityDialogProps {
  opportunity: OpportunityData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteOpportunityDialog = ({
  opportunity,
  open,
  onOpenChange,
  onSuccess
}: DeleteOpportunityDialogProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('partnership_opportunities')
        .delete()
        .eq('id', opportunity.id);

      if (error) throw error;

      toast({
        title: t('opportunities:delete.success_title'),
        description: t('opportunities:delete.success_message'),
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t('opportunities:common.error'),
        description: error.message || t('opportunities:delete.error_message'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={isRTL ? 'text-right' : 'text-left'}>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            {t('opportunities:delete.confirm_title')}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {t('opportunities:delete.confirm_message')}
            </p>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">
                {t('opportunities:delete.opportunity_label')} {opportunity?.title_ar || opportunity?.title_en || opportunity?.title}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('opportunities:delete.type_label')} {opportunity?.opportunity_type || opportunity?.type}
              </p>
            </div>
            <p className="text-sm text-destructive">
              {t('opportunities:delete.warning_message')}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isRTL ? 'flex-row-reverse' : 'flex-row'}>
          <AlertDialogCancel disabled={loading}>
            {t('opportunities:common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {loading ? t('opportunities:delete.deleting') : t('opportunities:delete.delete_button')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
