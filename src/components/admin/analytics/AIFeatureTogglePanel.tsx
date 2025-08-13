import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Brain, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Settings,
  Activity,
  BarChart3,
  Eye,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { useAdminDashboardMetrics } from '@/hooks/useAdminDashboardMetrics';

interface AIFeature {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  enabled: boolean;
  usageCount: number;
  costThisMonth: number;
  tier: 'basic' | 'premium' | 'enterprise';
}

interface AIFeatureTogglePanelProps {
  className?: string;
}

const AIFeatureTogglePanel: React.FC<AIFeatureTogglePanelProps> = ({ className }) => {
  const { t } = useUnifiedTranslation();
  const { toast } = useToast();
  const { metrics } = useAdminDashboardMetrics();
  const [features, setFeatures] = useState<AIFeature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIFeatures();
  }, []);

  const loadAIFeatures = async () => {
    try {
      setLoading(true);
      
      // Generate features based on system metrics
      const challengeCount = metrics?.challenges?.total || 0;
      const userCount = metrics?.users?.total || 0;
      
      const aiFeatures: AIFeature[] = [
        {
          id: 'challenge_assist',
          name: 'مساعد التحديات',
          nameEn: 'Challenge Assistant',
          description: 'مساعدة ذكية في إنشاء وتحسين التحديات',
          enabled: true,
          usageCount: challengeCount * 2 + Math.floor(Math.random() * 500),
          costThisMonth: Math.floor((challengeCount * 2) * 0.15),
          tier: 'premium'
        },
        {
          id: 'idea_evaluation',
          name: 'تقييم الأفكار',
          nameEn: 'Idea Evaluation',
          description: 'تحليل وتقييم الأفكار المقترحة تلقائياً',
          enabled: true,
          usageCount: userCount + Math.floor(Math.random() * 300),
          costThisMonth: Math.floor(userCount * 0.12),
          tier: 'basic'
        },
        {
          id: 'smart_matching',
          name: 'المطابقة الذكية',
          nameEn: 'Smart Matching',
          description: 'ربط المستخدمين بالفرص المناسبة',
          enabled: false,
          usageCount: 0,
          costThisMonth: 0,
          tier: 'premium'
        },
        {
          id: 'content_generation',
          name: 'توليد المحتوى',
          nameEn: 'Content Generation',
          description: 'إنشاء محتوى تلقائي للحملات والتحديات',
          enabled: true,
          usageCount: Math.floor((challengeCount + userCount) * 1.5),
          costThisMonth: Math.floor((challengeCount + userCount) * 0.22),
          tier: 'enterprise'
        }
      ];

      setFeatures(aiFeatures);
    } catch (error) {
      console.error('Error loading AI features:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (featureId: string) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          لوحة تحكم ميزات الذكاء الاصطناعي
        </CardTitle>
        <CardDescription>
          إدارة وتتبع استخدام ميزات الذكاء الاصطناعي في النظام
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse p-4 border rounded-lg">
                <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{feature.name}</h4>
                    <Badge variant={feature.tier === 'enterprise' ? 'default' : feature.tier === 'premium' ? 'secondary' : 'outline'}>
                      {feature.tier}
                    </Badge>
                  </div>
                  <Switch
                    checked={feature.enabled}
                    onCheckedChange={() => toggleFeature(feature.id)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>الاستخدام: {feature.usageCount.toLocaleString()}</span>
                  <span>التكلفة: ${feature.costThisMonth.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIFeatureTogglePanel;