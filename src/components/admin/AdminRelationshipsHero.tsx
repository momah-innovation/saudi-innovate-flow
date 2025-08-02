import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useAppTranslation';
import { useRTLAwareClasses } from '@/components/ui/rtl-aware';
import { 
  Network, 
  GitBranch, 
  Users, 
  Layers, 
  Target,
  TrendingUp,
  Link,
  Activity
} from 'lucide-react';

interface AdminRelationshipsHeroProps {
  totalConnections: number;
  activeNodes: number;
  networkDensity: number;
  strongConnections: number;
  weakConnections: number;
  orphanedEntities: number;
  networkHealth: number;
  lastUpdate: string;
}

export function AdminRelationshipsHero({
  totalConnections,
  activeNodes,
  networkDensity,
  strongConnections,
  weakConnections,
  orphanedEntities,
  networkHealth,
  lastUpdate
}: AdminRelationshipsHeroProps) {
  const { t } = useTranslation();
  const { flexRow } = useRTLAwareClasses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Connections */}
      <Card className="gradient-border hover-scale">
        <CardHeader className={`flex ${flexRow} items-center justify-between space-y-0 pb-2`}>
          <CardTitle className="text-sm font-medium">{t('total_connections')}</CardTitle>
          <Network className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{totalConnections}</div>
          <p className="text-xs text-muted-foreground">
            {t('from_last_week', { percentage: 8 })}
          </p>
        </CardContent>
      </Card>

      {/* Active Nodes */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('active_nodes')}</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{activeNodes}</div>
          <p className="text-xs text-muted-foreground">
            {t('connected_entities')}
          </p>
        </CardContent>
      </Card>

      {/* Network Density */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('network_density')}</CardTitle>
          <Layers className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{networkDensity}%</div>
          <p className="text-xs text-muted-foreground">
            {t('connection_strength')}
          </p>
        </CardContent>
      </Card>

      {/* Network Health */}
      <Card className="hover-scale">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('network_health')}</CardTitle>
          <Activity className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{networkHealth}%</div>
          <p className="text-xs text-muted-foreground">
            {t('overall_connectivity')}
          </p>
        </CardContent>
      </Card>

      {/* Connection Types */}
      <Card className="md:col-span-2 lg:col-span-2 gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            {t('connection_analysis')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">{strongConnections}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Link className="h-3 w-3" />
                {t('strong_links')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">{weakConnections}</div>
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <Target className="h-3 w-3" />
                {t('weak_links')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Issues */}
      <Card className="md:col-span-2 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            {t('network_status')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('orphaned_entities')}</span>
              <span className="text-lg font-bold text-red-600">{orphanedEntities}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{t('last_updated')}</span>
              <span className="text-sm font-medium">{lastUpdate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}