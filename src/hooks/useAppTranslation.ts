import { useUnifiedTranslation } from './useUnifiedTranslation';

/**
 * Main translation hook - now uses unified system
 * This provides the primary translation interface for the application
 */
export function useTranslation() {
  return useUnifiedTranslation();
}

// Export the unified hook as well for direct usage
export { useUnifiedTranslation };