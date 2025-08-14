import { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
// Removed useTimerManager to prevent hook ordering issues

type ModalType = 'default' | 'confirm' | 'alert' | 'success' | 'error' | 'loading';
type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ModalConfig {
  id: string;
  type: ModalType;
  title?: string;
  description?: string;
  content?: ReactNode;
  size?: ModalSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showClose?: boolean;
  persistent?: boolean;
  className?: string;
  
  // Action buttons
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  onClose?: () => void;
  
  // Auto-close
  autoClose?: number;
  
  // Custom actions
  actions?: Array<{
    label: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    onClick: () => void | Promise<void>;
    loading?: boolean;
    disabled?: boolean;
  }>;
}

interface ModalContextType {
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  updateModal: (id: string, updates: Partial<ModalConfig>) => void;
  
  // Convenience methods
  confirm: (config: ConfirmModalConfig) => Promise<boolean>;
  alert: (config: AlertModalConfig) => Promise<void>;
  success: (message: string, title?: string) => Promise<void>;
  error: (message: string, title?: string) => Promise<void>;
  loading: (message: string, title?: string) => string;
}

interface ConfirmModalConfig {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'destructive';
}

interface AlertModalConfig {
  title?: string;
  message: string;
  buttonText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);
  const resolveRefs = useRef<Map<string, { resolve: (value: any) => void; reject: (error: any) => void }>>(new Map());
  const autoCloseTimeouts = useRef<Map<string, (() => void)>>(new Map());

  const generateId = useCallback(() => {
    return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const openModal = useCallback((config: Omit<ModalConfig, 'id'>) => {
    const id = generateId();
    const modalConfig: ModalConfig = {
      id,
      type: 'default',
      size: 'md',
      closeOnOverlayClick: true,
      closeOnEscape: true,
      showClose: true,
      persistent: false,
      ...config
    };

    setModals(prev => [...prev, modalConfig]);

    // Set up auto-close if specified
    if (modalConfig.autoClose && modalConfig.autoClose > 0) {
      const timeoutId = setTimeout(() => {
        closeModal(id);
      }, modalConfig.autoClose);
      
      // Store cleanup function
      autoCloseTimeouts.current.set(id, () => clearTimeout(timeoutId));
    }

    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
    
    // Clear auto-close timeout
    const clearTimer = autoCloseTimeouts.current.get(id);
    if (clearTimer) {
      clearTimer();
      autoCloseTimeouts.current.delete(id);
    }

    // Resolve any pending promises
    const resolver = resolveRefs.current.get(id);
    if (resolver) {
      resolver.resolve(false);
      resolveRefs.current.delete(id);
    }
  }, []);

  const closeAllModals = useCallback(() => {
    // Clear all auto-close timeouts
    autoCloseTimeouts.current.forEach(clearTimer => clearTimer());
    autoCloseTimeouts.current.clear();

    // Resolve all pending promises
    resolveRefs.current.forEach(resolver => resolver.resolve(false));
    resolveRefs.current.clear();

    setModals([]);
  }, []);

  const updateModal = useCallback((id: string, updates: Partial<ModalConfig>) => {
    setModals(prev => 
      prev.map(modal => 
        modal.id === id ? { ...modal, ...updates } : modal
      )
    );
  }, []);

  const confirm = useCallback((config: ConfirmModalConfig): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const id = openModal({
        type: 'confirm',
        title: config.title || 'Confirm Action',
        description: config.message,
        confirmText: config.confirmText || 'Confirm',
        cancelText: config.cancelText || 'Cancel',
        onConfirm: () => {
          closeModal(id);
          resolve(true);
        },
        onCancel: () => {
          closeModal(id);
          resolve(false);
        },
        onClose: () => {
          resolve(false);
        }
      });

      resolveRefs.current.set(id, { resolve, reject });
    });
  }, [openModal, closeModal]);

  const alert = useCallback((config: AlertModalConfig): Promise<void> => {
    return new Promise((resolve, reject) => {
      const id = openModal({
        type: 'alert',
        title: config.title || 'Alert',
        description: config.message,
        confirmText: config.buttonText || 'OK',
        onConfirm: () => {
          closeModal(id);
          resolve();
        },
        onClose: () => {
          resolve();
        }
      });

      resolveRefs.current.set(id, { resolve, reject });
    });
  }, [openModal, closeModal]);

  const success = useCallback((message: string, title?: string): Promise<void> => {
    return alert({
      title: title || 'Success',
      message,
      type: 'success',
      buttonText: 'OK'
    });
  }, [alert]);

  const error = useCallback((message: string, title?: string): Promise<void> => {
    return alert({
      title: title || 'Error',
      message,
      type: 'error',
      buttonText: 'OK'
    });
  }, [alert]);

  const loading = useCallback((message: string, title?: string): string => {
    return openModal({
      type: 'loading',
      title: title || 'Loading',
      description: message,
      persistent: true,
      closeOnOverlayClick: false,
      closeOnEscape: false,
      showClose: false
    });
  }, [openModal]);

  const contextValue: ModalContextType = {
    modals,
    openModal,
    closeModal,
    closeAllModals,
    updateModal,
    confirm,
    alert,
    success,
    error,
    loading
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <ModalRenderer />
    </ModalContext.Provider>
  );
}

function ModalRenderer() {
  const context = useContext(ModalContext);
  if (!context) return null;

  const { modals, closeModal } = context;

  const getSizeClassName = (size: ModalSize) => {
    const sizes = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full h-full'
    };
    return sizes[size];
  };

  const getIcon = (type: ModalType) => {
    const icons = {
      confirm: AlertTriangle,
      alert: Info,
      success: CheckCircle,
      error: AlertCircle,
      loading: undefined,
      default: undefined
    };
    return icons[type];
  };

  const getIconColor = (type: ModalType) => {
    const colors = {
      confirm: 'text-warning',
      alert: 'text-info',
      success: 'text-success',
      error: 'text-destructive',
      loading: 'text-primary',
      default: 'text-foreground'
    };
    return colors[type];
  };

  return (
    <>
      {modals.map((modal) => {
        const Icon = getIcon(modal.type);
        const iconColor = getIconColor(modal.type);

        return (
          <Dialog
            key={modal.id}
            open={true}
            onOpenChange={(open) => {
              if (!open && !modal.persistent) {
                modal.onClose?.();
                closeModal(modal.id);
              }
            }}
          >
            <DialogContent
              className={cn(
                getSizeClassName(modal.size || 'md'),
                modal.className
              )}
              onPointerDownOutside={(e) => {
                if (!modal.closeOnOverlayClick) {
                  e.preventDefault();
                }
              }}
              onEscapeKeyDown={(e) => {
                if (!modal.closeOnEscape) {
                  e.preventDefault();
                }
              }}
            >
              {modal.showClose && !modal.persistent && (
                <button
                  onClick={() => {
                    modal.onClose?.();
                    closeModal(modal.id);
                  }}
                  className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </button>
              )}

              {(modal.title || modal.description) && (
                <DialogHeader className={cn(Icon && "flex-row items-center gap-3")}>
                  {Icon && (
                    <div className={cn("shrink-0", iconColor)}>
                      <Icon className="h-6 w-6" />
                    </div>
                  )}
                  <div className="text-left">
                    {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
                    {modal.description && (
                      <DialogDescription>{modal.description}</DialogDescription>
                    )}
                  </div>
                </DialogHeader>
              )}

              {modal.content && (
                <div className="py-4">{modal.content}</div>
              )}

              {(modal.type === 'confirm' || modal.type === 'alert' || modal.actions) && (
                <DialogFooter>
                  {modal.actions ? (
                    <div className="flex gap-2 w-full justify-end">
                      {modal.actions.map((action, index) => (
                        <Button
                          key={index}
                          variant={action.variant || 'default'}
                          onClick={action.onClick}
                          disabled={action.disabled}
                          className={action.loading ? 'animate-pulse' : ''}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2 w-full justify-end">
                      {modal.type === 'confirm' && modal.onCancel && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            modal.onCancel?.();
                            closeModal(modal.id);
                          }}
                        >
                          {modal.cancelText || 'Cancel'}
                        </Button>
                      )}
                      {modal.onConfirm && (
                        <Button
                          variant={modal.type === 'confirm' ? 'default' : 'default'}
                          onClick={() => {
                            modal.onConfirm?.();
                            closeModal(modal.id);
                          }}
                        >
                          {modal.confirmText || 'OK'}
                        </Button>
                      )}
                    </div>
                  )}
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        );
      })}
    </>
  );
}

// Hook to use the modal context
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

// Convenience hooks for common modal types
export function useConfirmModal() {
  const { confirm } = useModal();
  return confirm;
}

export function useAlertModal() {
  const { alert } = useModal();
  return alert;
}

export function useLoadingModal() {
  const { loading, closeModal } = useModal();
  
  const showLoading = useCallback((message: string, title?: string) => {
    return loading(message, title);
  }, [loading]);
  
  const hideLoading = useCallback((id: string) => {
    closeModal(id);
  }, [closeModal]);
  
  return { showLoading, hideLoading };
}