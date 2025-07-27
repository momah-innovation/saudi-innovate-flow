import React, { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      caption: "text-xs text-muted-foreground",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      blockquote: "mt-6 border-l-2 pl-6 italic",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
      inlineCode: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
    },
    color: {
      default: "",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      success: "text-green-600",
      warning: "text-yellow-600",
      info: "text-blue-600",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    }
  },
  defaultVariants: {
    variant: "p",
    color: "default",
    align: "left",
  },
});

export interface TypographyProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
  children: ReactNode;
}

export function Typography({
  className,
  variant,
  color: colorVariant,
  align,
  weight,
  as,
  children,
  ...props
}: TypographyProps) {
  const Comp = as || getDefaultElement(variant);
  
  return React.createElement(
    Comp,
    {
      className: cn(typographyVariants({ variant, color: colorVariant, align, weight, className })),
      ...props,
    },
    children
  );
}

function getDefaultElement(variant: string | null | undefined): keyof JSX.IntrinsicElements {
  switch (variant) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return variant as keyof JSX.IntrinsicElements;
    case 'blockquote':
      return 'blockquote';
    case 'code':
    case 'inlineCode':
      return 'code';
    case 'list':
      return 'ul';
    default:
      return 'p';
  }
}

// Predefined typography components for common use cases
export const Heading1 = ({ children, ...props }: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" {...props}>{children}</Typography>
);

export const Heading2 = ({ children, ...props }: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" {...props}>{children}</Typography>
);

export const Heading3 = ({ children, ...props }: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" {...props}>{children}</Typography>
);

export const BodyText = ({ children, ...props }: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="p" {...props}>{children}</Typography>
);

export const Lead = ({ children, ...props }: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="lead" {...props}>{children}</Typography>
);

export const Caption = ({ children, ...props }: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" {...props}>{children}</Typography>
);

export const MutedText = ({ children, ...props }: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="muted" {...props}>{children}</Typography>
);