import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Hero button variants for enhanced contrast and theme matching
        "hero-primary": "gradient-primary text-primary-foreground hover:opacity-90 shadow-lg border-0 font-semibold",
        "hero-secondary": "border border-overlay-button/30 text-overlay-text hover:bg-overlay-button/20 backdrop-blur-sm bg-overlay-button/10",
        "hero-ghost": "text-overlay-text hover:bg-overlay-button/10 backdrop-blur-sm",
        "hero-outline": "border border-overlay-button/40 text-overlay-text hover:bg-overlay-button hover:text-foreground backdrop-blur-sm bg-overlay-button/5 transition-all duration-300",
        // Action button variants for consistent styling
        "action-edit": "border border-input bg-background hover:bg-info/10 hover:text-info hover:border-info/20",
        "action-delete": "border border-destructive/20 bg-background hover:bg-destructive hover:text-destructive-foreground text-destructive",
        "action-view": "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "action-icon": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
