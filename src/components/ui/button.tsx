import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles with modern interactions
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Main action button
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm hover:shadow-md font-semibold",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 shadow-sm hover:shadow-md font-semibold",
        
        // Secondary - Alternative action
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70 border border-border",
        
        // Outline - Subtle emphasis
        outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent",
        
        // Ghost - Minimal style
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // Link - Text button
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        
        // Status variants with proper contrast
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 shadow-sm hover:shadow-md",
        success: "bg-success text-success-foreground hover:bg-success/90 active:bg-success/95 shadow-sm hover:shadow-md",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning/95 shadow-sm hover:shadow-md",
        info: "bg-info text-info-foreground hover:bg-info/90 active:bg-info/95 shadow-sm hover:shadow-md",
        
        // Subtle status variants
        "destructive-subtle": "bg-destructive-light text-destructive border border-destructive-border hover:bg-destructive/10",
        "success-subtle": "bg-success-light text-success border border-success-border hover:bg-success/10",
        "warning-subtle": "bg-warning-light text-warning border border-warning-border hover:bg-warning/10",
        "info-subtle": "bg-info-light text-info border border-info-border hover:bg-info/10",
        
        // Special variants
        gradient: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg",
        elevated: "bg-card text-card-foreground border border-border shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground",
        glass: "bg-background/80 text-foreground border border-border/50 backdrop-blur-sm shadow-lg hover:bg-background/90",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-sm",
        sm: "h-8 px-3 text-sm rounded-md",
        default: "h-10 px-4 py-2",
        lg: "h-11 px-8 text-base rounded-lg",
        xl: "h-12 px-10 text-lg rounded-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-11 w-11",
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
