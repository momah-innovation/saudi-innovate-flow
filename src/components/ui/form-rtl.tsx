/**
 * Enhanced Form Components with RTL Support
 * Phase 7: Complete RTL Support - Form field components
 */

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction-provider";
import { getFormFieldClasses, getButtonIconClasses, rtlCn } from "@/lib/rtl-utils";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormFieldRTL({ children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
}

interface FormLabelProps extends React.ComponentProps<typeof Label> {
  required?: boolean;
}

export function FormLabelRTL({ children, required, className, ...props }: FormLabelProps) {
  const { isRTL } = useDirection();
  const classes = getFormFieldClasses(isRTL);
  
  return (
    <Label 
      className={cn(classes.label, className)} 
      {...props}
    >
      {children}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
  );
}

interface FormInputProps extends React.ComponentProps<typeof Input> {
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export function FormInputRTL({ 
  icon, 
  iconPosition = 'start', 
  className, 
  ...props 
}: FormInputProps) {
  const { isRTL } = useDirection();
  
  if (!icon) {
    return <Input className={cn("w-full", className)} {...props} />;
  }
  
  const iconPlacement = iconPosition === 'start' 
    ? (isRTL ? 'right-3' : 'left-3')
    : (isRTL ? 'left-3' : 'right-3');
    
  const inputPadding = iconPosition === 'start'
    ? (isRTL ? 'pr-10' : 'pl-10')
    : (isRTL ? 'pl-10' : 'pr-10');
  
  return (
    <div className="relative">
      <Input 
        className={cn("w-full", inputPadding, className)} 
        {...props} 
      />
      <div className={cn("absolute top-1/2 transform -translate-y-1/2 text-muted-foreground", iconPlacement)}>
        {icon}
      </div>
    </div>
  );
}

interface FormTextareaProps extends React.ComponentProps<typeof Textarea> {}

export function FormTextareaRTL({ className, ...props }: FormTextareaProps) {
  return <Textarea className={cn("w-full resize-vertical", className)} {...props} />;
}

interface FormButtonProps extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode;
  iconPosition?: 'start' | 'end';
}

export function FormButtonRTL({ 
  children, 
  icon, 
  iconPosition = 'start', 
  className, 
  ...props 
}: FormButtonProps) {
  const { isRTL } = useDirection();
  
  if (!icon) {
    return (
      <Button className={className} {...props}>
        {children}
      </Button>
    );
  }
  
  const iconClasses = getButtonIconClasses(isRTL, iconPosition);
  
  return (
    <Button className={className} {...props}>
      {iconPosition === 'start' && (
        <span className={iconClasses}>{icon}</span>
      )}
      {children}
      {iconPosition === 'end' && (
        <span className={iconClasses}>{icon}</span>
      )}
    </Button>
  );
}

interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

export function FormErrorRTL({ children, className }: FormErrorProps) {
  const { isRTL } = useDirection();
  const classes = getFormFieldClasses(isRTL);
  
  return (
    <div className={cn(classes.error, className)}>
      {children}
    </div>
  );
}

interface FormHelpTextProps {
  children: React.ReactNode;
  className?: string;
}

export function FormHelpTextRTL({ children, className }: FormHelpTextProps) {
  const { isRTL } = useDirection();
  const classes = getFormFieldClasses(isRTL);
  
  return (
    <div className={cn(classes.helpText, className)}>
      {children}
    </div>
  );
}

interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function FormGroupRTL({ children, className, columns = 1 }: FormGroupProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };
  
  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {children}
    </div>
  );
}

interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'start' | 'center' | 'end';
}

export function FormActionsRTL({ children, className, align = 'end' }: FormActionsProps) {
  const { isRTL } = useDirection();
  
  const alignClasses = {
    start: isRTL ? 'justify-end' : 'justify-start',
    center: 'justify-center',
    end: isRTL ? 'justify-start' : 'justify-end'
  };
  
  return (
    <div className={cn("flex gap-3 pt-4", alignClasses[align], className)}>
      {children}
    </div>
  );
}

// Compound form component for complete forms
interface RTLFormProps {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent) => void;
}

export function RTLForm({ children, className, onSubmit }: RTLFormProps) {
  const { isRTL } = useDirection();
  
  return (
    <form 
      className={cn("space-y-6", isRTL && "rtl", className)} 
      onSubmit={onSubmit}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {children}
    </form>
  );
}

// Export all components
export {
  FormFieldRTL as FormField,
  FormLabelRTL as FormLabel,
  FormInputRTL as FormInput,
  FormTextareaRTL as FormTextarea,
  FormButtonRTL as FormButton,
  FormErrorRTL as FormError,
  FormHelpTextRTL as FormHelpText,
  FormGroupRTL as FormGroup,
  FormActionsRTL as FormActions,
  RTLForm as Form
};