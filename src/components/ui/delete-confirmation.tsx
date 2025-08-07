import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";

interface DeleteConfirmationProps {
  title: string;
  description: string;
  onConfirm: () => void;
  trigger?: ReactNode;
  buttonSize?: "sm" | "default" | "lg";
  buttonVariant?: "outline" | "destructive" | "ghost";
}

export function DeleteConfirmation({
  title,
  description,
  onConfirm,
  trigger,
  buttonSize = "sm",
  buttonVariant = "outline"
}: DeleteConfirmationProps) {
  const { t } = useUnifiedTranslation();
  
  const defaultTrigger = (
    <Button variant={buttonVariant} size={buttonSize}>
      <Trash2 className="w-4 h-4" />
    </Button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}