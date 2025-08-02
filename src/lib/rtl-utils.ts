/**
 * RTL (Right-to-Left) Utilities for Arabic and multilingual support
 * Phase 7: Complete RTL Support - Enhanced utilities
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface RTLConfig {
  isRTL: boolean;
  direction: 'rtl' | 'ltr';
  lang: 'ar' | 'en';
}

/**
 * Enhanced className utility with RTL awareness
 */
export function rtlCn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get direction-aware text alignment
 */
export function getTextAlign(isRTL: boolean, align?: 'start' | 'center' | 'end') {
  if (align === 'center') return 'text-center';
  if (align === 'start') return isRTL ? 'text-right' : 'text-left';
  if (align === 'end') return isRTL ? 'text-left' : 'text-right';
  return isRTL ? 'text-right' : 'text-left';
}

/**
 * Get direction-aware flex alignment
 */
export function getFlexAlign(isRTL: boolean, align?: 'start' | 'center' | 'end' | 'between' | 'around') {
  const alignments = {
    start: isRTL ? 'justify-end' : 'justify-start',
    center: 'justify-center',
    end: isRTL ? 'justify-start' : 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };
  return alignments[align || 'start'];
}

/**
 * Get direction-aware margins
 */
export function getDirectionalMargin(isRTL: boolean, side: 'start' | 'end', size: string) {
  const actualSide = (side === 'start') 
    ? (isRTL ? 'mr' : 'ml') 
    : (isRTL ? 'ml' : 'mr');
  return `${actualSide}-${size}`;
}

/**
 * Get direction-aware padding
 */
export function getDirectionalPadding(isRTL: boolean, side: 'start' | 'end', size: string) {
  const actualSide = (side === 'start') 
    ? (isRTL ? 'pr' : 'pl') 
    : (isRTL ? 'pl' : 'pr');
  return `${actualSide}-${size}`;
}

/**
 * Format numbers for RTL display (Arabic numerals vs Latin numerals)
 */
export function formatNumber(
  num: number | string, 
  isRTL: boolean, 
  options?: { 
    useArabicNumerals?: boolean;
    locale?: string;
  }
): string {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return String(num);
  
  const { useArabicNumerals = false, locale } = options || {};
  
  if (isRTL && useArabicNumerals) {
    // Convert to Arabic-Indic numerals (٠١٢٣٤٥٦٧٨٩)
    return number.toLocaleString(locale || 'ar-SA').replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
  }
  
  return number.toLocaleString(locale || (isRTL ? 'ar-SA' : 'en-US'));
}

/**
 * Format currency for RTL display
 */
export function formatCurrency(
  amount: number, 
  isRTL: boolean, 
  currency: string = 'SAR',
  options?: {
    useArabicNumerals?: boolean;
    showSymbol?: boolean;
  }
): string {
  const { useArabicNumerals = false, showSymbol = true } = options || {};
  
  const locale = isRTL ? 'ar-SA' : 'en-US';
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
  
  if (isRTL && useArabicNumerals) {
    return formatted.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
  }
  
  return formatted;
}

/**
 * Format date for RTL display
 */
export function formatDate(
  date: Date | string, 
  isRTL: boolean,
  options?: {
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    useArabicNumerals?: boolean;
  }
): string {
  const { dateStyle = 'medium', timeStyle, useArabicNumerals = false } = options || {};
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const locale = isRTL ? 'ar-SA' : 'en-US';
  
  const formatted = new Intl.DateTimeFormat(locale, {
    dateStyle,
    timeStyle,
    calendar: isRTL ? 'gregory' : undefined // Can be changed to 'islamic' if needed
  }).format(dateObj);
  
  if (isRTL && useArabicNumerals) {
    return formatted.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);
  }
  
  return formatted;
}

/**
 * Get direction-aware icon rotation
 */
export function getIconRotation(isRTL: boolean, icon: 'arrow' | 'chevron' | 'caret') {
  if (!isRTL) return '';
  
  const rotations = {
    arrow: 'rotate-180',
    chevron: 'rotate-180', 
    caret: 'rotate-180'
  };
  
  return rotations[icon] || '';
}

/**
 * Get proper form field layout classes for RTL
 */
export function getFormFieldClasses(isRTL: boolean) {
  return {
    label: rtlCn(getTextAlign(isRTL, 'start'), 'block text-sm font-medium mb-1'),
    input: 'w-full',
    helpText: rtlCn(getTextAlign(isRTL, 'start'), 'text-xs text-muted-foreground mt-1'),
    error: rtlCn(getTextAlign(isRTL, 'start'), 'text-xs text-destructive mt-1')
  };
}

/**
 * Get button icon positioning for RTL
 */
export function getButtonIconClasses(isRTL: boolean, position: 'start' | 'end') {
  if (position === 'start') {
    return isRTL ? 'ml-2' : 'mr-2';
  }
  return isRTL ? 'mr-2' : 'ml-2';
}

/**
 * Get navigation menu direction classes
 */
export function getNavigationClasses(isRTL: boolean) {
  return {
    menu: isRTL ? 'flex-row-reverse' : 'flex-row',
    item: 'relative',
    link: rtlCn(
      'block px-3 py-2 transition-colors',
      getTextAlign(isRTL, 'start')
    ),
    dropdown: isRTL ? 'right-0' : 'left-0'
  };
}

/**
 * Enhanced card layout for RTL
 */
export function getCardClasses(isRTL: boolean) {
  return {
    card: 'rounded-lg border bg-card text-card-foreground shadow-sm',
    header: rtlCn('flex flex-col space-y-1.5 p-6', getTextAlign(isRTL, 'start')),
    title: rtlCn('text-lg font-semibold leading-none tracking-tight', getTextAlign(isRTL, 'start')),
    description: rtlCn('text-sm text-muted-foreground', getTextAlign(isRTL, 'start')),
    content: 'p-6 pt-0',
    footer: rtlCn('flex items-center p-6 pt-0', isRTL ? 'justify-end' : 'justify-start')
  };
}

/**
 * Get dialog/modal positioning for RTL
 */
export function getDialogClasses(isRTL: boolean) {
  return {
    content: 'relative bg-background p-6 shadow-lg duration-200',
    header: rtlCn('flex flex-col space-y-1.5', getTextAlign(isRTL, 'start')),
    title: rtlCn('text-lg font-semibold leading-none tracking-tight', getTextAlign(isRTL, 'start')),
    description: rtlCn('text-sm text-muted-foreground', getTextAlign(isRTL, 'start')),
    footer: rtlCn('flex gap-2', isRTL ? 'justify-start' : 'justify-end')
  };
}

/**
 * Table direction utilities
 */
export function getTableClasses(isRTL: boolean) {
  return {
    table: 'w-full caption-bottom text-sm',
    header: '',
    row: '',
    head: rtlCn('h-12 px-4 font-medium', getTextAlign(isRTL, 'start'), '[&:has([role=checkbox])]:pr-0'),
    cell: rtlCn('p-4', getTextAlign(isRTL, 'start'), '[&:has([role=checkbox])]:pr-0')
  };
}

/**
 * Get responsive direction classes
 */
export function getResponsiveClasses(isRTL: boolean) {
  return {
    container: 'container mx-auto px-4',
    grid: 'grid gap-4',
    flex: rtlCn('flex', isRTL ? 'flex-row-reverse' : 'flex-row'),
    stack: 'flex flex-col space-y-4'
  };
}

export default {
  rtlCn,
  getTextAlign,
  getFlexAlign,
  getDirectionalMargin,
  getDirectionalPadding,
  formatNumber,
  formatCurrency,
  formatDate,
  getIconRotation,
  getFormFieldClasses,
  getButtonIconClasses,
  getNavigationClasses,
  getCardClasses,
  getDialogClasses,
  getTableClasses,
  getResponsiveClasses
};