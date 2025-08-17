import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { logger } from '@/utils/logger';

export function TestPrivilegeElevation() {
  const loadingManager = useUnifiedLoading({ component: 'TestPrivilegeElevation' });
  const handleError = createErrorHandler({ component: 'TestPrivilegeElevation' });
  interface TestResult {
    success?: boolean;
    message?: string;
    data?: Record<string, unknown>;
    error?: string;
    details?: unknown;
  }
  
  const [result, setResult] = useState<TestResult | null>(null);
  const { t } = useUnifiedTranslation();

  const testElevation = async () => {
    await loadingManager.withLoading('test', async () => {
      setResult(null);
      
      try {
        // Calling elevate-user-privileges function
        const { data, error } = await supabase.functions.invoke('elevate-user-privileges', {
          body: { test: true }
        });
        
        if (error) {
          handleError.handleError('Function error', { component: 'TestPrivilegeElevation', operation: 'test' });
          setResult({ error: error.message, details: error });
          return;
        }
        
        // Function executed successfully
        setResult(data);
      } catch (err: unknown) {
        const error = err as Error;
        handleError.handleError('Request error', { component: 'TestPrivilegeElevation', operation: 'test' });
        setResult({ error: error.message, details: error });
        throw error;
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.testPrivilegeElevation', 'Test Privilege Elevation')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testElevation} 
          disabled={loadingManager.isLoading('test')}
          className="w-full"
        >
          {loadingManager.isLoading('test') && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('admin.callElevateFunction', 'Call Elevate Privileges Function')}
        </Button>
        
        {result && (
          <div className="mt-4 p-4 border rounded-lg bg-muted">
            <h4 className="font-semibold mb-2">{t('admin.functionResult', 'Function Result:')}</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}