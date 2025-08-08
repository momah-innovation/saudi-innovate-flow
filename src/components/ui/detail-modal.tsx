import { ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl'
};

export function DetailModal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  actions, 
  maxWidth = '2xl' 
}: DetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidthClasses[maxWidth]} max-h-[90vh]`} dir="rtl">
        <DialogHeader className="flex flex-row-reverse items-start justify-between">
          <div className="flex-1 text-right">
            <DialogTitle className="text-xl font-semibold text-right">{title}</DialogTitle>
            {subtitle && (
              <DialogDescription className="mt-1 text-right">{subtitle}</DialogDescription>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-6 -mr-6" dir="rtl">
          <div className="space-y-6">
            {children}
          </div>
        </ScrollArea>
        
        {actions && (
          <div className="flex justify-start gap-2 pt-4 border-t" dir="rtl">
            {actions}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}