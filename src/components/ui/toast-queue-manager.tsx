import { useToast } from "@/hooks/use-toast";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X, Loader2 } from "lucide-react";
import { useCallback, useRef } from "react";

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface ToastQueueItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  priority?: number;
  persistent?: boolean;
}

interface ToastOptions {
  title?: string;
  duration?: number;
  priority?: number;
  persistent?: boolean;
}

class ToastQueueManager {
  private static instance: ToastQueueManager;
  private queue: ToastQueueItem[] = [];
  private activeToasts = new Map<string, any>();
  private maxConcurrent = 3;
  private processing = false;

  static getInstance(): ToastQueueManager {
    if (!ToastQueueManager.instance) {
      ToastQueueManager.instance = new ToastQueueManager();
    }
    return ToastQueueManager.instance;
  }

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getIcon(type: ToastType) {
    const icons = {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
      loading: Loader2
    };
    return icons[type];
  }

  private getToastConfig(type: ToastType, message: string, options?: ToastOptions) {
    const Icon = this.getIcon(type);
    
    const baseConfig = {
      title: options?.title || this.getDefaultTitle(type),
      description: message,
      duration: options?.duration || this.getDefaultDuration(type),
    };

    switch (type) {
      case 'success':
        return {
          ...baseConfig,
          className: "border-success-border bg-success-light text-success-foreground",
        };
      case 'error':
        return {
          ...baseConfig,
          variant: "destructive" as const,
        };
      case 'warning':
        return {
          ...baseConfig,
          className: "border-warning-border bg-warning-light text-warning-foreground",
        };
      case 'info':
        return {
          ...baseConfig,
          className: "border-info-border bg-info-light text-info-foreground",
        };
      case 'loading':
        return {
          ...baseConfig,
          duration: 0, // No auto-dismiss for loading
          className: "border-border bg-muted text-foreground",
        };
      default:
        return baseConfig;
    }
  }

  private getDefaultTitle(type: ToastType): string {
    const titles = {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Information",
      loading: "Loading"
    };
    return titles[type];
  }

  private getDefaultDuration(type: ToastType): number {
    const durations = {
      success: 4000,
      error: 6000,
      warning: 5000,
      info: 4000,
      loading: 0
    };
    return durations[type];
  }

  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;

    while (this.queue.length > 0 && this.activeToasts.size < this.maxConcurrent) {
      // Sort by priority (higher first), then by timestamp
      this.queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
      
      const item = this.queue.shift();
      if (!item) continue;

      const config = this.getToastConfig(item.type, item.message, {
        title: item.title,
        duration: item.duration,
        priority: item.priority,
        persistent: item.persistent
      });

      const toastResult = toast(config);
      this.activeToasts.set(item.id, toastResult);

      // Remove from active when dismissed
      if (config.duration > 0) {
        // Note: Class methods can't use hooks directly, using timerManager singleton for memory safety
        import('@/utils/timerManager').then(({ default: timerManager }) => {
          timerManager.setTimeout(`toast-${item.id}`, () => {
            this.activeToasts.delete(item.id);
          }, config.duration);
        });
      }
    }

    this.processing = false;
  }

  add(type: ToastType, message: string, options?: ToastOptions): string {
    const id = this.generateId();
    
    const queueItem: ToastQueueItem = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration,
      priority: options?.priority || 0,
      persistent: options?.persistent
    };

    // High priority items go to front, others to back
    if ((options?.priority || 0) > 5) {
      this.queue.unshift(queueItem);
    } else {
      this.queue.push(queueItem);
    }

    this.processQueue();
    return id;
  }

  success(message: string, options?: ToastOptions): string {
    return this.add('success', message, options);
  }

  error(message: string, options?: ToastOptions): string {
    return this.add('error', message, { ...options, priority: (options?.priority || 0) + 2 });
  }

  warning(message: string, options?: ToastOptions): string {
    return this.add('warning', message, options);
  }

  info(message: string, options?: ToastOptions): string {
    return this.add('info', message, options);
  }

  loading(message: string, options?: ToastOptions): string {
    return this.add('loading', message, { ...options, persistent: true });
  }

  dismiss(id: string): void {
    const toastResult = this.activeToasts.get(id);
    if (toastResult && toastResult.dismiss) {
      toastResult.dismiss();
    }
    this.activeToasts.delete(id);
    
    // Remove from queue if not yet processed
    this.queue = this.queue.filter(item => item.id !== id);
  }

  dismissAll(): void {
    this.activeToasts.forEach((toastResult) => {
      if (toastResult && toastResult.dismiss) {
        toastResult.dismiss();
      }
    });
    this.activeToasts.clear();
    this.queue = [];
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
  ): Promise<T> {
    const loadingId = this.loading(loading);

    return promise
      .then((data) => {
        this.dismiss(loadingId);
        const successMessage = typeof success === 'function' ? success(data) : success;
        this.success(successMessage);
        return data;
      })
      .catch((error) => {
        this.dismiss(loadingId);
        const errorMessage = typeof error === 'function' ? error(error) : error;
        this.error(errorMessage);
        throw error;
      });
  }

  setMaxConcurrent(max: number): void {
    this.maxConcurrent = Math.max(1, max);
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  getActiveCount(): number {
    return this.activeToasts.size;
  }
}

// Export singleton instance
export const toastQueue = ToastQueueManager.getInstance();

// Hook for easier usage in components
export function useToastQueue() {
  const addToast = useCallback((type: ToastType, message: string, options?: ToastOptions) => {
    return toastQueue.add(type, message, options);
  }, []);

  const dismissToast = useCallback((id: string) => {
    toastQueue.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    toastQueue.dismissAll();
  }, []);

  return {
    success: useCallback((msg: string, opts?: ToastOptions) => toastQueue.success(msg, opts), []),
    error: useCallback((msg: string, opts?: ToastOptions) => toastQueue.error(msg, opts), []),
    warning: useCallback((msg: string, opts?: ToastOptions) => toastQueue.warning(msg, opts), []),
    info: useCallback((msg: string, opts?: ToastOptions) => toastQueue.info(msg, opts), []),
    loading: useCallback((msg: string, opts?: ToastOptions) => toastQueue.loading(msg, opts), []),
    promise: useCallback((promise: Promise<any>, messages: any) => toastQueue.promise(promise, messages), []),
    dismiss: dismissToast,
    dismissAll,
    addToast,
    queueSize: toastQueue.getQueueSize(),
    activeCount: toastQueue.getActiveCount(),
  };
}

// Utility functions for common patterns
export const showSuccessToast = (message: string, options?: ToastOptions) => 
  toastQueue.success(message, options);

export const showErrorToast = (message: string, options?: ToastOptions) => 
  toastQueue.error(message, options);

export const showWarningToast = (message: string, options?: ToastOptions) => 
  toastQueue.warning(message, options);

export const showInfoToast = (message: string, options?: ToastOptions) => 
  toastQueue.info(message, options);

export const showLoadingToast = (message: string, options?: ToastOptions) => 
  toastQueue.loading(message, options);