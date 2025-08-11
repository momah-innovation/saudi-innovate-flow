import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useToast } from '@/hooks/use-toast';
import { invalidateTranslationCache } from '@/i18n/enhanced-config-v2';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Translation System Status and Controls
 * Provides diagnostics and management tools for the translation system
 */
export const TranslationSystemStatus: React.FC = () => {
  const { t, isLoading, translationCount, error, isReady } = useUnifiedTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleRefreshTranslations = async () => {
    try {
      // Invalidate i18next cache
      invalidateTranslationCache();
      
      // Invalidate React Query cache
      await queryClient.invalidateQueries({ 
        queryKey: ['system', 'translation'] 
      });
      
      // Reload the page to reinitialize everything
      window.location.reload();
      
      toast({
        title: t('success'),
        description: t('translation.cache.refresh_success', 'Translation cache refreshed successfully'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('translation.cache.refresh_error', 'Failed to refresh translation cache'),
        variant: "destructive",
      });
    }
  };

  const getStatusColor = () => {
    if (error) return 'text-red-600';
    if (isLoading) return 'text-yellow-600';
    if (isReady) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusIcon = () => {
    if (error) return <AlertTriangle className="w-5 h-5 text-red-600" />;
    if (isLoading) return <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" />;
    if (isReady) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <AlertTriangle className="w-5 h-5 text-gray-600" />;
  };

  const getStatusMessage = () => {
    if (error) return t('translation.status.error', 'Translation system error');
    if (isLoading) return t('translation.status.loading', 'Loading translations...');
    if (isReady) return t('translation.status.ready', 'Translation system ready');
    return t('translation.status.initializing', 'Initializing...');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          {t('translation.system.title', 'Translation System Status')}
        </CardTitle>
        <CardDescription>
          {t('translation.system.description', 'Monitor and manage the translation system')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-2xl font-bold ${getStatusColor()}`}>
              {isLoading ? '...' : translationCount}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('translation.status.total_keys', 'Total Translation Keys')}
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={`text-lg font-semibold ${getStatusColor()}`}>
              {getStatusMessage()}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('translation.status.current', 'Current Status')}
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-lg font-semibold text-blue-600">
              {t('translation.cache.unified', 'Unified Cache')}
            </div>
            <p className="text-sm text-muted-foreground">
              {t('translation.cache.type', 'Cache Type')}
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-800 dark:text-red-200">
                  {t('translation.error.title', 'Translation System Error')}
                </p>
                <p className="text-red-700 dark:text-red-300 mt-1">
                  {error.message || t('translation.error.generic', 'An unknown error occurred')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-3">
          <Button 
            onClick={handleRefreshTranslations}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {t('translation.actions.refresh', 'Refresh Cache')}
          </Button>
        </div>

        {/* System Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            {t('translation.system.info.unified', 'Using unified translation system with database-first loading')}
          </p>
          <p>
            {t('translation.system.info.fallback', 'Automatic fallback to static translations when database is unavailable')}
          </p>
          <p>
            {t('translation.system.info.cache', 'Intelligent caching with 10-minute expiry and error recovery')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};