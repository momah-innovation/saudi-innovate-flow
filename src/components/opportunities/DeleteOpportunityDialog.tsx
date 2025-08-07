import { useState } from 'react';
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
  opportunity: any;
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
        title: isRTL ? 'تم الحذف بنجاح' : 'Deleted Successfully',
        description: isRTL ? 'تم حذف الفرصة بنجاح' : 'Opportunity deleted successfully',
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: isRTL ? 'خطأ' : 'Error',
        description: error.message || (isRTL ? 'حدث خطأ أثناء حذف الفرصة' : 'An error occurred while deleting the opportunity'),
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
            {isRTL ? 'تأكيد الحذف' : 'Confirm Deletion'}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {isRTL 
                ? 'هل أنت متأكد من أنك تريد حذف هذه الفرصة؟' 
                : 'Are you sure you want to delete this opportunity?'
              }
            </p>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">
                {isRTL ? 'الفرصة:' : 'Opportunity:'} {opportunity?.title_ar || opportunity?.title_en}
              </p>
              <p className="text-sm text-muted-foreground">
                {isRTL ? 'النوع:' : 'Type:'} {opportunity?.opportunity_type}
              </p>
            </div>
            <p className="text-sm text-destructive">
              {isRTL 
                ? 'تحذير: هذا الإجراء لا يمكن التراجع عنه.' 
                : 'Warning: This action cannot be undone.'
              }
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={isRTL ? 'flex-row-reverse' : 'flex-row'}>
          <AlertDialogCancel disabled={loading}>
            {isRTL ? 'إلغاء' : 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {loading ? (isRTL ? 'جاري الحذف...' : 'Deleting...') : (isRTL ? 'حذف' : 'Delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};