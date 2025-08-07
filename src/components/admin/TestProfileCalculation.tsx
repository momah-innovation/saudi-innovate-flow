import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

export function TestProfileCalculation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const { user } = useAuth();
  const { t } = useUnifiedTranslation();

  const testCalculation = async () => {
    if (!user) {
      setResult({ error: 'No user found' });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      logger.info('Testing profile calculation for user', { component: 'TestProfileCalculation', action: 'testCalculation', userId: user.id });
      
      const { data, error } = await supabase.functions.invoke('calculate-profile-completion', {
        body: { user_id: user.id }
      });
      
      if (error) {
        logger.error('Function error', { component: 'TestProfileCalculation', action: 'testCalculation' }, error as Error);
        setResult({ error: error.message, details: error });
        return;
      }
      
      logger.info('Function response received', { component: 'TestProfileCalculation', action: 'testCalculation', data });
      setResult(data);
    } catch (err: any) {
      logger.error('Request error', { component: 'TestProfileCalculation', action: 'testCalculation' }, err as Error);
      setResult({ error: err.message, details: err });
    } finally {
      setLoading(false);
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
          disabled={loading || !user}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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