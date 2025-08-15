import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Users, 
  Layers, 
  Target,
  GitBranch,
  Link,
  Activity,
  Eye,
  Edit,
  RefreshCw
} from 'lucide-react';
import { AdminRelationshipsHero } from '@/components/admin/AdminRelationshipsHero';
import { ViewLayouts } from '@/components/ui/view-layouts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from '@/utils/error-handler';
import { formatDate } from '@/utils/unified-date-handler';

interface RelationshipData {
  id: string;
  source_entity_type: string;
  source_entity_id: string;
  target_entity_type: string;
  target_entity_id: string;
  relationship_type: string;
  strength: number;
  created_at: string;
  source_name?: string;
  target_name?: string;
}

interface RelationshipOverviewProps {
  viewMode?: 'cards' | 'list' | 'grid';
  searchTerm?: string;
}

export function RelationshipOverview({ 
  viewMode = 'cards',
  searchTerm = ''
}: RelationshipOverviewProps) {
  const [relationships, setRelationships] = useState<RelationshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();

  useEffect(() => {
    loadRelationships();
  }, []);

  const loadRelationships = async () => {
    try {
      setLoading(true);
      
      // Fetch challenge-partner relationships
      const { data: challengePartners } = await supabase
        .from('challenge_partners')
        .select(`
          id,
          challenge_id,
          partner_id,
          partnership_type,
          status,
          created_at,
          challenges!challenge_partners_challenge_id_fkey(title_ar, title_en),
          partners!challenge_partners_partner_id_fkey(name_ar, name_en)
        `)
        .eq('status', 'active');

      // Fetch campaign-partner relationships  
      const { data: campaignPartners } = await supabase
        .from('campaign_partners')
        .select(`
          id,
          campaign_id,
          partner_id,
          partnership_role,
          partnership_status,
          created_at,
          campaigns!campaign_partners_campaign_id_fkey(title_ar, title_en),
          partners!campaign_partners_partner_id_fkey(name_ar, name_en)
        `)
        .eq('partnership_status', 'active');

      const relationships: RelationshipData[] = [];

      // Process challenge-partner relationships
      challengePartners?.forEach(cp => {
        relationships.push({
          id: cp.id,
          source_entity_type: 'challenge',
          source_entity_id: cp.challenge_id,
          target_entity_type: 'partner',
          target_entity_id: cp.partner_id,
          relationship_type: cp.partnership_type || 'collaborator',
          strength: 8, // Default strength
          created_at: cp.created_at,
          source_name: cp.challenges?.title_ar || cp.challenges?.title_en || 'Challenge',
          target_name: cp.partners?.name_ar || cp.partners?.name_en || 'Partner'
        });
      });

      // Process campaign-partner relationships
      campaignPartners?.forEach(cp => {
        relationships.push({
          id: cp.id,
          source_entity_type: 'campaign',
          source_entity_id: cp.campaign_id,
          target_entity_type: 'partner',
          target_entity_id: cp.partner_id,
          relationship_type: cp.partnership_role || 'supporter',
          strength: 7, // Default strength
          created_at: cp.created_at,
          source_name: cp.campaigns?.title_ar || cp.campaigns?.title_en || 'Campaign',
          target_name: cp.partners?.name_ar || cp.partners?.name_en || 'Partner'
        });
      });
      
      setRelationships(relationships);
    } catch (error) {
      logger.error('Error loading relationships', error);
      toast({
        title: 'Error loading relationships',
        description: 'Failed to fetch relationship data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRelationships = relationships.filter(rel =>
    rel.source_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.target_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rel.relationship_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate metrics
  const totalConnections = relationships.length;
  const activeNodes = new Set([
    ...relationships.map(r => r.source_entity_id),
    ...relationships.map(r => r.target_entity_id)
  ]).size;
  const networkDensity = activeNodes > 0 ? Math.round((totalConnections / (activeNodes * (activeNodes - 1))) * 100) : 0;
  const strongConnections = relationships.filter(r => r.strength >= 7).length;
  const weakConnections = relationships.filter(r => r.strength < 5).length;
  const orphanedEntities = 0; // Would need to calculate based on actual data
  const networkHealth = Math.round((strongConnections / Math.max(totalConnections, 1)) * 100);

  const getRelationshipIcon = (type: string) => {
    switch (type) {
      case 'sponsors': return <Target className="w-4 h-4 icon-success" />;
      case 'supports': return <Link className="w-4 h-4 icon-info" />;
      case 'collaborates': return <Users className="w-4 h-4 text-innovation" />;
      default: return <GitBranch className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 8) return 'score-excellent';
    if (strength >= 6) return 'score-good';
    if (strength >= 4) return 'score-average';
    return 'score-poor';
  };

  const RelationshipCard = ({ relationship }: { relationship: RelationshipData }) => {
    if (viewMode === 'list') {
      return (
        <Card className="hover:shadow-md transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  {getRelationshipIcon(relationship.relationship_type)}
                  <div>
                    <h3 className="font-medium text-sm">{relationship.source_name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {relationship.relationship_type} {relationship.target_name}
                    </p>
                  </div>
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {relationship.source_entity_type} → {relationship.target_entity_type}
                </Badge>
                
                <Badge className={`${getStrengthColor(relationship.strength)} text-xs`}>
                  Strength: {relationship.strength}/10
                </Badge>
                
                <span className="text-xs text-muted-foreground">
                   {formatDate(relationship.created_at)}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="hover:shadow-lg transition-all duration-300 hover-scale group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                {getRelationshipIcon(relationship.relationship_type)}
                {relationship.relationship_type}
              </CardTitle>
              <div className="space-y-1">
                <div className="text-sm font-medium">{relationship.source_name}</div>
                <div className="text-xs text-muted-foreground">connects to</div>
                <div className="text-sm font-medium">{relationship.target_name}</div>
              </div>
            </div>
            <Badge className={getStrengthColor(relationship.strength)}>
              {relationship.strength}/10
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Source Type</div>
              <div className="font-medium capitalize">{relationship.source_entity_type}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Target Type</div>
              <div className="font-medium capitalize">{relationship.target_entity_type}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              Created {formatDate(relationship.created_at)}
            </span>
            
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Enhanced Hero Dashboard */}
      <AdminRelationshipsHero 
        totalConnections={totalConnections}
        activeNodes={activeNodes}
        networkDensity={networkDensity}
        strongConnections={strongConnections}
        weakConnections={weakConnections}
        orphanedEntities={orphanedEntities}
        networkHealth={networkHealth}
        lastUpdate={formatDate(new Date())}
      />

      <ViewLayouts viewMode={viewMode}>
        {loading ? [
          <div key="loading" className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading relationships...</p>
          </div>
        ] : filteredRelationships.length > 0 ? 
          filteredRelationships.map((relationship) => (
            <RelationshipCard key={relationship.id} relationship={relationship} />
          )) : [
          <div key="empty" className="text-center py-12">
            <Network className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">{t('common.no_results_found', 'No Relationships Found')}</p>
            <p className="text-muted-foreground">No entity relationships match the current search criteria</p>
          </div>
        ]}
      </ViewLayouts>
    </>
  );
}