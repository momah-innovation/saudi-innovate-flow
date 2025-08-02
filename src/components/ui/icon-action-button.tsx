import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface IconActionButtonProps {
  icon: ReactNode;
  tooltip: string;
  onClick?: () => void;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
  className?: string;
  disabled?: boolean;
}

export function IconActionButton({
  icon,
  tooltip,
  onClick,
  variant = "ghost",
  size = "sm",
  className,
  disabled = false
}: IconActionButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={variant}
            size={size}
            onClick={onClick}
            disabled={disabled}
            className={cn("h-8 w-8 p-0", className)}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}