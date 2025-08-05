import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRTLAware } from '@/hooks/useRTLAware';

export function TestProfileCalculation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user } = useAuth();
  const { me } = useRTLAware();

  const testCalculation = async () => {
    if (!user) {
      setResult({ error: 'No user found' });
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      console.log('Testing profile calculation for user:', user.id);
      
      const { data, error } = await supabase.functions.invoke('calculate-profile-completion', {
        body: { user_id: user.id }
      });
      
      if (error) {
        console.error('Function error:', error);
        setResult({ error: error.message, details: error });
        return;
      }
      
      console.log('Function response:', data);
      setResult(data);
    } catch (err: any) {
      console.error('Request error:', err);
      setResult({ error: err.message, details: err });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Profile Completion Calculation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testCalculation} 
          disabled={loading || !user}
          className="w-full"
        >
          {loading && <Loader2 className={`${me('2')} h-4 w-4 animate-spin`} />}
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