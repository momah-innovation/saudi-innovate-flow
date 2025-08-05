import React from "react";
import { type LucideIcon, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

interface IconProps extends Omit<LucideProps, 'ref'> {
  icon: LucideIcon;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'default' | 'muted' | 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info';
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

const variantMap = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  destructive: "text-destructive",
  success: "text-green-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
};

export function Icon({ 
  icon: IconComponent, 
  className, 
  size = 'md', 
  variant = 'default',
  ...props 
}: IconProps) {
  const iconSize = typeof size === 'number' ? size : sizeMap[size];
  
  return (
    <IconComponent
      size={iconSize}
      className={cn(variantMap[variant], className)}
      {...props}
    />
  );
}

// Icon button wrapper
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  iconSize?: IconProps['size'];
  iconVariant?: IconProps['variant'];
  variant?: 'default' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({
  icon,
  iconSize = 'md',
  iconVariant = 'default',
  variant = 'ghost',
  size = 'md',
  className,
  children,
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 p-1',
    md: 'h-10 w-10 p-2',
    lg: 'h-12 w-12 p-3',
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <Icon icon={icon} size={iconSize} variant={iconVariant} />
      {children}
    </button>
  );
}

// Icon with badge
interface IconWithBadgeProps extends IconProps {
  badge?: {
    content: string | number;
    variant?: 'default' | 'destructive' | 'success' | 'warning';
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  };
}

export function IconWithBadge({ badge, className, ...iconProps }: IconWithBadgeProps) {
  const badgeVariants = {
    default: 'bg-primary text-primary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
  };

  const badgePositions = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1',
  };

  if (!badge) {
    return <Icon className={className} {...iconProps} />;
  }

  return (
    <div className={cn("relative inline-block", className)}>
      <Icon {...iconProps} />
      <span
        className={cn(
          "absolute flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
          badgeVariants[badge.variant || 'default'],
          badgePositions[badge.position || 'top-right']
        )}
      >
        {badge.content}
      </span>
    </div>
  );
}