import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"
import { useDirection } from "@/components/ui/direction-provider"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const { isRTL } = useDirection();
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary touch-manipulation",
        "min-h-[6px] sm:min-h-[16px]", // Ensure visibility on mobile
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 gradient-primary transition-all"
        style={{ 
          transform: isRTL 
            ? `translateX(${100 - (value || 0)}%)`
            : `translateX(-${100 - (value || 0)}%)` 
        }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
