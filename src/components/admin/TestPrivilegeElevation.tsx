import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/logger';

export function TestPrivilegeElevation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const { t } = useUnifiedTranslation();

  const testElevation = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Calling elevate-user-privileges function
      
      const { data, error } = await supabase.functions.invoke('elevate-user-privileges', {
        body: { test: true }
      });
      
      if (error) {
        logger.error('Function error', { component: 'TestPrivilegeElevation', action: 'testElevation' }, error as Error);
        setResult({ error: error.message, details: error });
        return;
      }
      
      // Function executed successfully
      setResult(data);
    } catch (err: any) {
      logger.error('Request error', { component: 'TestPrivilegeElevation', action: 'testElevation' }, err as Error);
      setResult({ error: err.message, details: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.testPrivilegeElevation', 'Test Privilege Elevation')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testElevation} 
          disabled={loading}
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Call Elevate Privileges Function
        </Button>
        
        {result && (
          <div className="mt-4 p-4 border rounded-lg bg-muted">
            <h4 className="font-semibold mb-2">Function Result:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}