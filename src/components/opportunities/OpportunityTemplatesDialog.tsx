import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Plus } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';

interface OpportunityTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OpportunityTemplatesDialog = ({ open, onOpenChange }: OpportunityTemplatesDialogProps) => {
  const { isRTL } = useDirection();
  const { t } = useUnifiedTranslation();

  // Note: In a real implementation, this would fetch from Supabase
  const templates = [
    {
      id: 1,
      name: t('opportunities:templates.partnership_request.name'),
      description: t('opportunities:templates.partnership_request.description'),
      downloads: 0 // Would be fetched from database
    },
    {
      id: 2,
      name: t('opportunities:templates.technical_proposal.name'),
      description: t('opportunities:templates.technical_proposal.description'),
      downloads: 0 // Would be fetched from database
    },
    {
      id: 3,
      name: t('opportunities:templates.feasibility_study.name'),
      description: t('opportunities:templates.feasibility_study.description'),
      downloads: 0 // Would be fetched from database
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {t('opportunities:templates.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <FileText className="w-5 h-5" />
                  {template.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-muted-foreground mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {template.description}
                </p>
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm text-muted-foreground">
                    {template.downloads} {t('opportunities:templates.downloads')}
                  </span>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    {t('opportunities:templates.download_button')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('opportunities:templates.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
