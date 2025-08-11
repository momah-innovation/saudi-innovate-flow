import * as React from "react"
import { cn } from "@/lib/utils"
import { useDirection } from "@/components/ui/direction-provider"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const { isRTL } = useDirection();
    
    return (
      <input
        type={type}
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation",
          "min-h-[44px] sm:min-h-[40px]", // Touch-friendly on mobile
          isRTL ? "text-right" : "text-left",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
