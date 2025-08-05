import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

class ToastService {
  private static instance: ToastService;
  
  static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  success(message: string, options?: ToastOptions) {
    return toast({
      title: options?.title || "Success",
      description: message,
      duration: options?.duration || 4000,
      className: "border-success-border bg-success-light text-success",
    });
  }

  error(message: string, options?: ToastOptions) {
    return toast({
      title: options?.title || "Error",
      description: message,
      duration: options?.duration || 6000,
      variant: "destructive",
    });
  }

  warning(message: string, options?: ToastOptions) {
    return toast({
      title: options?.title || "Warning",
      description: message,
      duration: options?.duration || 5000,
      className: "border-warning-border bg-warning-light text-warning-foreground",
    });
  }

  info(message: string, options?: ToastOptions) {
    return toast({
      title: options?.title || "Info",
      description: message,
      duration: options?.duration || 4000,
      className: "border-info-border bg-info-light text-info-foreground",
    });
  }

  loading(message: string, options?: ToastOptions) {
    return toast({
      title: options?.title || "Loading",
      description: message,
      duration: options?.duration || 0, // No auto-dismiss
      className: "border-border bg-muted text-foreground",
    });
  }

  promise<T>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) {
    const toastId = this.loading(loading);

    promise
      .then((data) => {
        toastId.dismiss();
        const successMessage = typeof success === 'function' ? success(data) : success;
        this.success(successMessage);
        return data;
      })
      .catch((error) => {
        toastId.dismiss();
        const errorMessage = typeof error === 'function' ? error(error) : error;
        this.error(errorMessage);
        throw error;
      });

    return promise;
  }

  dismiss(toastId?: string) {
    if (toastId) {
      // Dismiss specific toast
      // Note: This would need to be implemented based on the toast library being used
    } else {
      // Dismiss all toasts
      document.querySelectorAll('[data-sonner-toast]').forEach((el) => {
        (el as HTMLElement).click();
      });
    }
  }
}

// Export singleton instance
export const toastService = ToastService.getInstance();

// Hook for easier usage in components
export function useToastService() {
  return toastService;
}

// Utility functions for common toast patterns
export const showSuccessToast = (message: string, options?: ToastOptions) => 
  toastService.success(message, options);

export const showErrorToast = (message: string, options?: ToastOptions) => 
  toastService.error(message, options);

export const showWarningToast = (message: string, options?: ToastOptions) => 
  toastService.warning(message, options);

export const showInfoToast = (message: string, options?: ToastOptions) => 
  toastService.info(message, options);

export const showLoadingToast = (message: string, options?: ToastOptions) => 
  toastService.loading(message, options);

// Common toast messages
export const TOAST_MESSAGES = {
  // CRUD Operations
  CREATED: (entity: string) => `${entity} created successfully`,
  UPDATED: (entity: string) => `${entity} updated successfully`,
  DELETED: (entity: string) => `${entity} deleted successfully`,
  SAVED: (entity: string) => `${entity} saved successfully`,
  
  // Errors
  CREATE_ERROR: (entity: string) => `Failed to create ${entity}`,
  UPDATE_ERROR: (entity: string) => `Failed to update ${entity}`,
  DELETE_ERROR: (entity: string) => `Failed to delete ${entity}`,
  LOAD_ERROR: (entity: string) => `Failed to load ${entity}`,
  NETWORK_ERROR: "Network error. Please check your connection.",
  PERMISSION_ERROR: "You don't have permission to perform this action",
  
  // Loading
  CREATING: (entity: string) => `Creating ${entity}...`,
  UPDATING: (entity: string) => `Updating ${entity}...`,
  DELETING: (entity: string) => `Deleting ${entity}...`,
  LOADING: (entity: string) => `Loading ${entity}...`,
  
  // Actions
  COPIED: "Copied to clipboard",
  EXPORTED: "Data exported successfully",
  IMPORTED: "Data imported successfully",
  EMAIL_SENT: "Email sent successfully",
  
  // Validation
  REQUIRED_FIELDS: "Please fill in all required fields",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PHONE: "Please enter a valid phone number",
  PASSWORDS_DONT_MATCH: "Passwords don't match",
  
  // File operations
  FILE_UPLOADED: "File uploaded successfully",
  FILE_DELETED: "File deleted successfully",
  INVALID_FILE_TYPE: "Invalid file type",
  FILE_TOO_LARGE: "File size too large",
} as const;

// Usage examples:
// toastService.success(TOAST_MESSAGES.CREATED("Campaign"));
// toastService.error(TOAST_MESSAGES.CREATE_ERROR("Campaign"));
// showSuccessToast("Operation completed");
// toastService.promise(apiCall, {
//   loading: TOAST_MESSAGES.CREATING("Campaign"),
//   success: TOAST_MESSAGES.CREATED("Campaign"),
//   error: TOAST_MESSAGES.CREATE_ERROR("Campaign")
// });