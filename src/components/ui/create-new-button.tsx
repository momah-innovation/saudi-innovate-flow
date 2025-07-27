import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface CreateNewButtonProps {
  onClick: () => void;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const CreateNewButton = ({ 
  onClick, 
  className, 
  size = "default",
  variant = "default" 
}: CreateNewButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button 
      onClick={onClick} 
      className={className}
      size={size}
      variant={variant}
    >
      <Plus className="h-4 w-4" />
      {t("createNew")}
    </Button>
  );
};