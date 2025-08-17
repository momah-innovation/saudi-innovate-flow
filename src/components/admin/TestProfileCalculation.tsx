import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';
import { logger } from '@/utils/logger';

export function TestProfileCalculation() {
  interface TestResult {
    success?: boolean;
    message?: string;
    data?: Record<string, unknown>;
    error?: string;
    details?: unknown;
  }
  
  const [result, setResult] = useState<TestResult | null>(null);
  const { user } = useAuth();
  const { t } = useUnifiedTranslation();
  
  const loadingManager = useUnifiedLoading({
    component: 'TestProfileCalculation',
    showToast: true,
    logErrors: true
  });

  const errorHandler = createErrorHandler({
    component: 'TestProfileCalculation',
    showToast: true,
    logError: true
  });

  const testCalculation = async () => {
    if (!user) {
      setResult({ error: 'No user found' });
      return;
    }

    setResult(null);
    
    const result = await loadingManager.withLoading(
      'test-profile-calculation',
      async () => {
        logger.info('Testing profile calculation for user', { component: 'TestProfileCalculation', action: 'testCalculation', userId: user.id });
        
        const { data, error } = await supabase.functions.invoke('calculate-profile-completion', {
          body: { user_id: user.id }
        });
        
        if (error) {
          logger.error('Function error', { component: 'TestProfileCalculation', action: 'testCalculation' }, error as Error);
          throw new Error(error.message);
        }
        
        logger.info('Function response received', { component: 'TestProfileCalculation', action: 'testCalculation', data });
        return data;
      },
      {
        successMessage: t('profile_calculation.test_success'),
        errorMessage: t('profile_calculation.test_failed'),
        logContext: { operation: 'testCalculation', userId: user.id }
      }
    );

    if (result) {
      setResult(result);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.testProfileCalculation', 'Test Profile Completion Calculation')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testCalculation} 
          disabled={loadingManager.hasAnyLoading || !user}
          className="w-full"
        >
          {loadingManager.hasAnyLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Calculate Profile Completion
        </Button>
        
        {!user && (
          <p className="text-muted-foreground text-sm">No user logged in</p>
        )}
        
        {result && (
          <div className="mt-4 p-4 border rounded-lg bg-muted">
            <h4 className="font-semibold mb-2">Function Result:</h4>
            <pre className="text-sm overflow-auto whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}