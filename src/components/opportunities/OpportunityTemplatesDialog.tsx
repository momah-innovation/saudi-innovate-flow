import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Plus } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';

interface OpportunityTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OpportunityTemplatesDialog = ({ open, onOpenChange }: OpportunityTemplatesDialogProps) => {
  const { isRTL } = useDirection();

  // Note: In a real implementation, this would fetch from Supabase
  const templates = [
    {
      id: 1,
      name: isRTL ? 'قالب طلب الشراكة' : 'Partnership Request Template',
      description: isRTL ? 'قالب موحد لطلبات الشراكة' : 'Standard template for partnership requests',
      downloads: 0 // Would be fetched from database
    },
    {
      id: 2,
      name: isRTL ? 'قالب العرض التقني' : 'Technical Proposal Template',
      description: isRTL ? 'قالب للعروض التقنية المفصلة' : 'Template for detailed technical proposals',
      downloads: 0 // Would be fetched from database
    },
    {
      id: 3,
      name: isRTL ? 'قالب دراسة الجدوى' : 'Feasibility Study Template',
      description: isRTL ? 'قالب لدراسات الجدوى المفصلة' : 'Template for detailed feasibility studies',
      downloads: 0 // Would be fetched from database
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-2xl ${isRTL ? 'rtl' : 'ltr'}`}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {isRTL ? 'قوالب الفرص' : 'Opportunity Templates'}
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
                    {template.downloads} {isRTL ? 'تحميل' : 'downloads'}
                  </span>
                  <Button size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    {isRTL ? 'تحميل' : 'Download'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {isRTL ? 'إغلاق' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};