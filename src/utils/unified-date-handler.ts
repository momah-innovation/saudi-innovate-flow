import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

interface DateHandlerConfig {
  locale?: 'ar' | 'en';
  timezone?: string;
}

class UnifiedDateHandler {
  private config: DateHandlerConfig;

  constructor(config: DateHandlerConfig = {}) {
    this.config = {
      locale: 'en',
      timezone: 'UTC',
      ...config
    };
  }

  private getLocale() {
    return this.config.locale === 'ar' ? ar : enUS;
  }

  // Safe date parsing
  parseDate(dateInput: string | Date | null | undefined): Date | null {
    if (!dateInput) return null;
    
    try {
      if (dateInput instanceof Date) {
        return isValid(dateInput) ? dateInput : null;
      }
      
      const parsed = parseISO(dateInput);
      return isValid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  // Format date for display
  formatDate(
    dateInput: string | Date | null | undefined,
    formatString: string = 'PPP'
  ): string {
    const date = this.parseDate(dateInput);
    if (!date) return 'Invalid Date';
    
    try {
      return format(date, formatString, { locale: this.getLocale() });
    } catch {
      return 'Invalid Date';
    }
  }

  // Format date for API (ISO string)
  formatForAPI(dateInput: string | Date | null | undefined): string | null {
    const date = this.parseDate(dateInput);
    if (!date) return null;
    
    try {
      return date.toISOString();
    } catch {
      return null;
    }
  }

  // Format relative time
  formatRelative(dateInput: string | Date | null | undefined): string {
    const date = this.parseDate(dateInput);
    if (!date) return 'Unknown time';
    
    try {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: this.getLocale() 
      });
    } catch {
      return 'Unknown time';
    }
  }

  // Get current timestamp for API
  now(): string {
    return new Date().toISOString();
  }

  // Check if date is in future
  isFuture(dateInput: string | Date | null | undefined): boolean {
    const date = this.parseDate(dateInput);
    if (!date) return false;
    return date > new Date();
  }

  // Check if date is in past
  isPast(dateInput: string | Date | null | undefined): boolean {
    const date = this.parseDate(dateInput);
    if (!date) return false;
    return date < new Date();
  }

  // Calculate days difference
  daysDifference(
    date1: string | Date | null | undefined,
    date2: string | Date | null | undefined = new Date()
  ): number | null {
    const d1 = this.parseDate(date1);
    const d2 = this.parseDate(date2);
    
    if (!d1 || !d2) return null;
    
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

// Default instances
export const dateHandler = new UnifiedDateHandler();
export const arabicDateHandler = new UnifiedDateHandler({ locale: 'ar' });

// Convenience functions
export const formatDate = (date: string | Date | null | undefined, format?: string) => 
  dateHandler.formatDate(date, format);

export const formatDateArabic = (date: string | Date | null | undefined, format?: string) => 
  arabicDateHandler.formatDate(date, format);

export const formatRelativeTime = (date: string | Date | null | undefined) => 
  dateHandler.formatRelative(date);

export const formatForAPI = (date: string | Date | null | undefined) => 
  dateHandler.formatForAPI(date);

export const currentTimestamp = () => dateHandler.now();

export const isValidDate = (date: string | Date | null | undefined): boolean => 
  dateHandler.parseDate(date) !== null;