import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary variants using semantic tokens
        default: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md",
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active shadow-sm hover:shadow-md",
        
        // Secondary variants
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active border border-border",
        
        // Outline variants
        outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground hover:border-accent",
        
        // Ghost variants
        ghost: "hover:bg-accent hover:text-accent-foreground",
        
        // Link variant
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-hover",
        
        // Status variants using semantic tokens
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive shadow-sm hover:shadow-md",
        success: "bg-success text-success-foreground hover:bg-success/90 active:bg-success shadow-sm hover:shadow-md",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 active:bg-warning shadow-sm hover:shadow-md",
        info: "bg-info text-info-foreground hover:bg-info/90 active:bg-info shadow-sm hover:shadow-md",
        
        // Subtle status variants
        "destructive-subtle": "bg-destructive-light text-destructive border border-destructive-border hover:bg-destructive hover:text-destructive-foreground",
        "success-subtle": "bg-success-light text-success border border-success-border hover:bg-success hover:text-success-foreground",
        "warning-subtle": "bg-warning-light text-warning border border-warning-border hover:bg-warning hover:text-warning-foreground",
        "info-subtle": "bg-info-light text-info border border-info-border hover:bg-info hover:text-info-foreground",
        
        // Overlay variants for hero sections
        "overlay-primary": "bg-overlay-button/10 text-overlay-text border border-overlay-button/20 backdrop-blur-sm hover:bg-overlay-button/20 hover:border-overlay-button/30",
        "overlay-secondary": "bg-background/10 text-overlay-text border border-overlay-button/20 backdrop-blur-sm hover:bg-background/20",
        "overlay-ghost": "text-overlay-text hover:bg-overlay-button/10 backdrop-blur-sm",
        
        // Gradient variants
        "gradient-primary": "bg-gradient-to-r from-primary to-primary-hover text-primary-foreground hover:opacity-90 shadow-md hover:shadow-lg",
        "gradient-success": "bg-gradient-to-r from-success to-success/80 text-success-foreground hover:opacity-90 shadow-md hover:shadow-lg",
        "gradient-info": "bg-gradient-to-r from-info to-info/80 text-info-foreground hover:opacity-90 shadow-md hover:shadow-lg",
        
        // Special purpose variants
        cta: "bg-gradient-to-r from-primary via-primary-hover to-primary text-primary-foreground hover:opacity-90 shadow-lg hover:shadow-xl font-semibold",
        elevated: "bg-background text-foreground border border-border shadow-lg hover:shadow-xl hover:bg-accent hover:text-accent-foreground",
        glass: "bg-background/80 text-foreground border border-border/50 backdrop-blur-md shadow-lg hover:bg-background/90",
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
