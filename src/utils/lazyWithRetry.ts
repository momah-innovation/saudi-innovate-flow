import { lazy } from 'react';
import { debugLog } from '@/utils/debugLogger';

/**
 * Enhanced lazy loading with retry logic and error handling
 * Implements automatic retry on component load failure
 */
export const lazyWithRetry = (importFn: () => Promise<any>) => {
  return lazy(() =>
    importFn().catch((error) => {
      debugLog.error('Failed to load component on first attempt', { 
        component: 'lazyWithRetry', 
        action: 'componentLoad' 
      }, error);
      
      // Retry once after 1 second
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          importFn()
            .then(resolve)
            .catch((retryError) => {
              debugLog.error('Failed to load component on retry', { 
                component: 'lazyWithRetry', 
                action: 'componentLoadRetry' 
              }, retryError);
              reject(retryError);
            });
        }, 1000);
      });
    })
  );
};