# 🎨 Design System Guide

## Overview
Comprehensive guide for implementing and maintaining the design system in the Ruwād Platform, ensuring consistent visual language and user experience.

## Design System Philosophy

### Core Principles
1. **Consistency**: Unified visual language across all interfaces
2. **Scalability**: Components that work at any scale
3. **Accessibility**: WCAG 2.1 AA compliance by default
4. **Efficiency**: Reusable components reduce development time
5. **Flexibility**: Adaptable to various use cases and contexts

### Design Tokens
Design tokens are the foundation of our design system, storing design decisions as data.

```typescript
// File: src/styles/design-tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: 'hsl(210, 100%, 98%)',
      100: 'hsl(210, 100%, 95%)',
      500: 'hsl(210, 100%, 50%)',
      900: 'hsl(210, 100%, 20%)'
    },
    semantic: {
      success: 'hsl(142, 76%, 36%)',
      warning: 'hsl(38, 92%, 50%)',
      error: 'hsl(0, 84%, 60%)',
      info: 'hsl(210, 100%, 50%)'
    }
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'Monaco', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  }
} as const;
```

## CSS Architecture

### Tailwind Configuration
```typescript
// File: tailwind.config.ts
import { designTokens } from './src/styles/design-tokens';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: designTokens.colors.primary,
        success: designTokens.colors.semantic.success,
        warning: designTokens.colors.semantic.warning,
        error: designTokens.colors.semantic.error,
        info: designTokens.colors.semantic.info
      },
      spacing: designTokens.spacing,
      fontFamily: designTokens.typography.fontFamily,
      fontSize: designTokens.typography.fontSize,
      fontWeight: designTokens.typography.fontWeight,
      lineHeight: designTokens.typography.lineHeight,
      borderRadius: designTokens.borderRadius,
      boxShadow: designTokens.shadows
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
};
```

### CSS Custom Properties
```css
/* File: src/styles/globals.css */
:root {
  /* Color system */
  --color-primary-50: 210 100% 98%;
  --color-primary-100: 210 100% 95%;
  --color-primary-500: 210 100% 50%;
  --color-primary-900: 210 100% 20%;
  
  /* Semantic colors */
  --color-success: 142 76% 36%;
  --color-warning: 38 92% 50%;
  --color-error: 0 84% 60%;
  --color-info: 210 100% 50%;
  
  /* Typography */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'Fira Code', Monaco, monospace;
  
  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  
  /* Border radius */
  --radius-sm: 0.125rem;
  --radius-base: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.dark {
  /* Dark mode color overrides */
  --color-primary-50: 210 100% 8%;
  --color-primary-100: 210 100% 12%;
  --color-primary-500: 210 100% 60%;
  --color-primary-900: 210 100% 85%;
}

/* Utility classes */
.text-balance {
  text-wrap: balance;
}

.animate-in {
  animation: animate-in 0.2s ease-out;
}

@keyframes animate-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Component Library

### Base Components

#### Button Component
```typescript
// File: src/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500',
        destructive: 'bg-error text-white hover:bg-error/90 focus-visible:ring-error',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 focus-visible:ring-primary-500',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
        ghost: 'hover:bg-gray-100 focus-visible:ring-gray-500',
        link: 'text-primary-500 underline-offset-4 hover:underline focus-visible:ring-primary-500'
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### Input Component
```typescript
// File: src/components/ui/Input.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-error focus-visible:ring-error'
      },
      size: {
        default: 'h-10',
        sm: 'h-9',
        lg: 'h-11'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, label, error, helperText, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            className={cn(
              inputVariants({ variant: error ? 'error' : variant, size }),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-error mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

### Composite Components

#### Card Component
```typescript
// File: src/components/ui/Card.tsx
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg bg-white',
          {
            'border border-gray-200': variant === 'outlined',
            'shadow-md': variant === 'elevated',
            'shadow-sm border border-gray-100': variant === 'default'
          },
          {
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg'
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';
```

## Layout System

### Grid System
```typescript
// File: src/components/ui/Grid.tsx
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: GridProps['cols'];
    md?: GridProps['cols'];
    lg?: GridProps['cols'];
    xl?: GridProps['cols'];
  };
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, gap = 'md', responsive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          {
            'grid-cols-1': cols === 1,
            'grid-cols-2': cols === 2,
            'grid-cols-3': cols === 3,
            'grid-cols-4': cols === 4,
            'grid-cols-5': cols === 5,
            'grid-cols-6': cols === 6,
            'grid-cols-12': cols === 12
          },
          {
            'gap-0': gap === 'none',
            'gap-2': gap === 'sm',
            'gap-4': gap === 'md',
            'gap-6': gap === 'lg',
            'gap-8': gap === 'xl'
          },
          responsive && {
            [`sm:grid-cols-${responsive.sm}`]: responsive.sm,
            [`md:grid-cols-${responsive.md}`]: responsive.md,
            [`lg:grid-cols-${responsive.lg}`]: responsive.lg,
            [`xl:grid-cols-${responsive.xl}`]: responsive.xl
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ className, colSpan = 1, rowSpan = 1, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          {
            'col-span-1': colSpan === 1,
            'col-span-2': colSpan === 2,
            'col-span-3': colSpan === 3,
            'col-span-4': colSpan === 4,
            'col-span-5': colSpan === 5,
            'col-span-6': colSpan === 6,
            'col-span-12': colSpan === 12
          },
          {
            'row-span-1': rowSpan === 1,
            'row-span-2': rowSpan === 2,
            'row-span-3': rowSpan === 3,
            'row-span-4': rowSpan === 4,
            'row-span-5': rowSpan === 5,
            'row-span-6': rowSpan === 6
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GridItem.displayName = 'GridItem';
```

### Container System
```typescript
// File: src/components/ui/Container.tsx
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  center?: boolean;
  padding?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', center = true, padding = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'w-full',
          {
            'max-w-screen-sm': size === 'sm',
            'max-w-screen-md': size === 'md',
            'max-w-screen-lg': size === 'lg',
            'max-w-screen-xl': size === 'xl',
            'max-w-none': size === 'full'
          },
          center && 'mx-auto',
          padding && 'px-4 sm:px-6 lg:px-8',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';
```

## Typography System

### Text Components
```typescript
// File: src/components/ui/Typography.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 text-base font-semibold tracking-tight',
      body: 'leading-7',
      caption: 'text-sm text-gray-500',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-gray-500'
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify'
    },
    color: {
      default: '',
      primary: 'text-primary-500',
      success: 'text-success',
      warning: 'text-warning',
      error: 'text-error',
      muted: 'text-gray-500'
    }
  },
  defaultVariants: {
    variant: 'body',
    align: 'left',
    color: 'default'
  }
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant, align, color, as, children, ...props }, ref) => {
    const Component = as || getDefaultElement(variant);
    
    return (
      <Component
        className={cn(textVariants({ variant, align, color }), className)}
        ref={ref}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

const getDefaultElement = (variant?: string) => {
  switch (variant) {
    case 'h1': return 'h1';
    case 'h2': return 'h2';
    case 'h3': return 'h3';
    case 'h4': return 'h4';
    case 'h5': return 'h5';
    case 'h6': return 'h6';
    case 'caption':
    case 'small':
    case 'muted': return 'span';
    default: return 'p';
  }
};
```

## Accessibility Features

### Focus Management
```typescript
// File: src/components/ui/FocusRing.tsx
import { cn } from '@/lib/utils';

export interface FocusRingProps extends React.HTMLAttributes<HTMLDivElement> {
  within?: boolean;
  offset?: number;
}

export const FocusRing = React.forwardRef<HTMLDivElement, FocusRingProps>(
  ({ className, within = false, offset = 2, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          within 
            ? 'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2'
            : 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          `focus:ring-offset-${offset}`,
          'focus:outline-none',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FocusRing.displayName = 'FocusRing';
```

### Screen Reader Support
```typescript
// File: src/components/ui/VisuallyHidden.tsx
import { cn } from '@/lib/utils';

export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

VisuallyHidden.displayName = 'VisuallyHidden';
```

## Design System Testing

### Component Testing
```typescript
// File: src/components/ui/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500');
    
    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-gray-300');
  });
  
  it('supports all size variants', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9');
    
    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });
  
  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });
});
```

### Design Token Testing
```typescript
// File: src/styles/__tests__/design-tokens.test.ts
import { designTokens } from '../design-tokens';

describe('Design Tokens', () => {
  it('has consistent color palette', () => {
    Object.keys(designTokens.colors.primary).forEach(key => {
      expect(designTokens.colors.primary[key as keyof typeof designTokens.colors.primary])
        .toMatch(/^hsl\(\d+,\s*\d+%,\s*\d+%\)$/);
    });
  });
  
  it('has proper spacing scale', () => {
    const spacingValues = Object.values(designTokens.spacing);
    expect(spacingValues).toEqual(spacingValues.sort((a, b) => 
      parseFloat(a) - parseFloat(b)
    ));
  });
});
```

---

**Design Principles**: Consistency, Scalability, Accessibility  
**Component Library**: Modular, reusable, well-tested  
**Tokens**: Semantic, maintainable, flexible