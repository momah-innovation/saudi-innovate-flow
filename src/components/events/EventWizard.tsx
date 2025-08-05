import { Dialog, DialogContent } from "@/components/ui/dialog";

interface EventWizardProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSave: () => void;
}

export function EventWizard({ isOpen, onClose, event, onSave }: EventWizardProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Event Wizard</h2>
          <p className="text-muted-foreground">
            Event wizard is temporarily disabled for maintenance.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}