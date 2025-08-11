import * as React from "react"
import { cn } from "@/lib/utils"
import { useDirection } from "@/components/ui/direction-provider"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    const { isRTL } = useDirection();
    
    return (
      <textarea
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation resize-y",
          "min-h-[100px] sm:min-h-[80px]", // Larger on mobile for better usability
          isRTL ? "text-right" : "text-left",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
