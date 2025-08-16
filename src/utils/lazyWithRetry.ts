import React, { lazy } from 'react';
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
      return new Promise((resolve) => {
        setTimeout(() => {
          importFn()
            .then(resolve)
            .catch((retryError) => {
              debugLog.error('Failed to load component on retry', { 
                component: 'lazyWithRetry', 
                action: 'componentLoadRetry' 
              }, retryError);
              // Gracefully resolve to an inline error component instead of rejecting to avoid infinite Suspense fallback
              resolve({
                default: () => (
                  React.createElement(
                    'div',
                    { className: 'min-h-[300px] flex items-center justify-center p-6 text-center' },
                    React.createElement(
                      'div',
                      null,
                      React.createElement('p', { className: 'mb-3' }, 'Error loading component.'),
                      React.createElement(
                        'button',
                        {
                          onClick: () => window.location.reload(),
                          className: 'inline-flex items-center rounded-md border px-3 py-1 text-sm',
                        },
                        'Reload'
                      )
                    )
                  )
                )
              });
            });
        }, 1000);
      });
    })
  );
};