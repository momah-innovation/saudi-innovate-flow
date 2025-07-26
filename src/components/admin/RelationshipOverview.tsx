import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Users, 
  Building, 
  Calendar,
  Target, 
  Link, 
  Unlink,
  Plus,
  Eye,
  Filter,
  ArrowRight,
  Network,
  GitBranch
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RelationshipData {
  campaigns: any[];
  events: any[];
  challenges: any[];
  experts: any[];
  partners: any[];
  stakeholders: any[];
  focusQuestions: any[];
  relationships: {
    campaignPartners: any[];
    campaignStakeholders: any[];
    eventPartners: any[];
    eventStakeholders: any[];
    eventFocusQuestions: any[];
    challengeExperts: any[];
    challengePartners: any[];
  };
}

interface EntityConnection {
  id: string;
  name: string;
  type: string;
  connections: Array<{
    id: string;
    name: string;
    type: string;
    relationshipType: string;
  }>;
}

export function RelationshipOverview() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RelationshipData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntityType, setSelectedEntityType] = useState("all");
  const [selectedEntity, setSelectedEntity] = useState<EntityConnection | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRelationshipData();
  }, []);

  const fetchRelationshipData = async () => {
    try {
      setLoading(true);
      
      // Fetch all entities and their relationships
      const [
        campaignsRes,
        eventsRes,
        challengesRes,
        expertsRes,
        partnersRes,
        stakeholdersRes,
        focusQuestionsRes,
        // Relationship tables
        campaignPartnersRes,
        campaignStakeholdersRes,
        eventPartnersRes,
        eventStakeholdersRes,
        eventFocusQuestionsRes,
        challengeExpertsRes,
        challengePartnersRes,
      ] = await Promise.all([
        supabase.from("campaigns").select("id, title, status, theme").order("title"),
        supabase.from("events").select("id, title, status, event_type").order("title"),
        supabase.from("challenges").select("id, title, status, priority_level").order("title"),
        supabase.from("experts").select(`
          id, 
          expertise_areas, 
          expert_level,
          profiles:user_id(name)
        `).order("id"),
        supabase.from("partners").select("id, name, partner_type, status").order("name"),
        supabase.from("stakeholders").select("id, name, stakeholder_type, influence_level").order("name"),
        supabase.from("focus_questions").select("id, question_text, question_type").order("question_text"),
        // Relationships
        supabase.from("campaign_partner_links").select("campaign_id, partner_id"),
        supabase.from("campaign_stakeholder_links").select("campaign_id, stakeholder_id"),
        supabase.from("event_partner_links").select("event_id, partner_id"),
        supabase.from("event_stakeholder_links").select("event_id, stakeholder_id"),
        supabase.from("event_focus_question_links").select("event_id, focus_question_id"),
        supabase.from("challenge_experts").select("challenge_id, expert_id, role_type, status"),
        supabase.from("challenge_partners").select("challenge_id, partner_id, partnership_type"),
      ]);

      setData({
        campaigns: campaignsRes.data || [],
        events: eventsRes.data || [],
        challenges: challengesRes.data || [],
        experts: expertsRes.data || [],
        partners: partnersRes.data || [],
        stakeholders: stakeholdersRes.data || [],
        focusQuestions: focusQuestionsRes.data || [],
        relationships: {
          campaignPartners: campaignPartnersRes.data || [],
          campaignStakeholders: campaignStakeholdersRes.data || [],
          eventPartners: eventPartnersRes.data || [],
          eventStakeholders: eventStakeholdersRes.data || [],
          eventFocusQuestions: eventFocusQuestionsRes.data || [],
          challengeExperts: challengeExpertsRes.data || [],
          challengePartners: challengePartnersRes.data || [],
        }
      });
    } catch (error) {
      console.error("Error fetching relationship data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch relationship data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getEntityConnections = (entityId: string, entityType: string): EntityConnection | null => {
    if (!data) return null;

    const connections: Array<{
      id: string;
      name: string;
      type: string;
      relationshipType: string;
    }> = [];

    // Get entity name
    let entityName = "";
    switch (entityType) {
      case "campaign":
        const campaign = data.campaigns.find(c => c.id === entityId);
        entityName = campaign?.title || "Unknown Campaign";
        
        // Campaign connections
        data.relationships.campaignPartners
          .filter(cp => cp.campaign_id === entityId)
          .forEach(cp => {
            const partner = data.partners.find(p => p.id === cp.partner_id);
            if (partner) {
              connections.push({
                id: partner.id,
                name: partner.name,
                type: "partner",
                relationshipType: "Campaign Partner"
              });
            }
          });

        data.relationships.campaignStakeholders
          .filter(cs => cs.campaign_id === entityId)
          .forEach(cs => {
            const stakeholder = data.stakeholders.find(s => s.id === cs.stakeholder_id);
            if (stakeholder) {
              connections.push({
                id: stakeholder.id,
                name: stakeholder.name,
                type: "stakeholder",
                relationshipType: "Campaign Stakeholder"
              });
            }
          });
        break;

      case "event":
        const event = data.events.find(e => e.id === entityId);
        entityName = event?.title || "Unknown Event";
        
        // Event connections
        data.relationships.eventPartners
          .filter(ep => ep.event_id === entityId)
          .forEach(ep => {
            const partner = data.partners.find(p => p.id === ep.partner_id);
            if (partner) {
              connections.push({
                id: partner.id,
                name: partner.name,
                type: "partner",
                relationshipType: "Event Partner"
              });
            }
          });

        data.relationships.eventStakeholders
          .filter(es => es.event_id === entityId)
          .forEach(es => {
            const stakeholder = data.stakeholders.find(s => s.id === es.stakeholder_id);
            if (stakeholder) {
              connections.push({
                id: stakeholder.id,
                name: stakeholder.name,
                type: "stakeholder",
                relationshipType: "Event Stakeholder"
              });
            }
          });

        data.relationships.eventFocusQuestions
          .filter(efq => efq.event_id === entityId)
          .forEach(efq => {
            const question = data.focusQuestions.find(q => q.id === efq.focus_question_id);
            if (question) {
              connections.push({
                id: question.id,
                name: question.question_text.substring(0, 50) + "...",
                type: "focus_question",
                relationshipType: "Event Focus Question"
              });
            }
          });
        break;

      case "challenge":
        const challenge = data.challenges.find(c => c.id === entityId);
        entityName = challenge?.title || "Unknown Challenge";
        
        // Challenge connections
        data.relationships.challengeExperts
          .filter(ce => ce.challenge_id === entityId && ce.status === 'active')
          .forEach(ce => {
            const expert = data.experts.find(e => e.id === ce.expert_id);
            if (expert) {
              connections.push({
                id: expert.id,
                name: expert.profiles?.name || `Expert ${expert.id}`,
                type: "expert",
                relationshipType: `Challenge ${ce.role_type.replace('_', ' ')}`
              });
            }
          });

        data.relationships.challengePartners
          .filter(cp => cp.challenge_id === entityId)
          .forEach(cp => {
            const partner = data.partners.find(p => p.id === cp.partner_id);
            if (partner) {
              connections.push({
                id: partner.id,
                name: partner.name,
                type: "partner",
                relationshipType: `Challenge ${cp.partnership_type || 'Partner'}`
              });
            }
          });
        break;
    }

    return {
      id: entityId,
      name: entityName,
      type: entityType,
      connections
    };
  };

  const getEntityTypeIcon = (type: string) => {
    switch (type) {
      case "campaign": return <Target className="h-4 w-4" />;
      case "event": return <Calendar className="h-4 w-4" />;
      case "challenge": return <GitBranch className="h-4 w-4" />;
      case "expert": return <Users className="h-4 w-4" />;
      case "partner": return <Building className="h-4 w-4" />;
      case "stakeholder": return <Users className="h-4 w-4" />;
      case "focus_question": return <Target className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const getEntityTypeBadge = (type: string) => {
    switch (type) {
      case "campaign": return "default";
      case "event": return "secondary";
      case "challenge": return "outline";
      case "expert": return "default";
      case "partner": return "secondary";
      case "stakeholder": return "outline";
      case "focus_question": return "default";
      default: return "outline";
    }
  };

  const filteredEntities = () => {
    if (!data) return [];

    let entities: any[] = [];

    if (selectedEntityType === "all" || selectedEntityType === "campaign") {
      entities = entities.concat(
        data.campaigns.map(c => ({ ...c, entityType: "campaign" }))
      );
    }
    if (selectedEntityType === "all" || selectedEntityType === "event") {
      entities = entities.concat(
        data.events.map(e => ({ ...e, entityType: "event" }))
      );
    }
    if (selectedEntityType === "all" || selectedEntityType === "challenge") {
      entities = entities.concat(
        data.challenges.map(c => ({ ...c, entityType: "challenge" }))
      );
    }

    return entities.filter(entity => {
      const searchLower = searchTerm.toLowerCase();
      return entity.title?.toLowerCase().includes(searchLower) ||
             entity.name?.toLowerCase().includes(searchLower);
    });
  };

  const getRelationshipStats = () => {
    if (!data) return {};

    return {
      totalCampaigns: data.campaigns.length,
      totalEvents: data.events.length,
      totalChallenges: data.challenges.length,
      totalExperts: data.experts.length,
      totalPartners: data.partners.length,
      totalStakeholders: data.stakeholders.length,
      totalRelationships: 
        data.relationships.campaignPartners.length +
        data.relationships.campaignStakeholders.length +
        data.relationships.eventPartners.length +
        data.relationships.eventStakeholders.length +
        data.relationships.eventFocusQuestions.length +
        data.relationships.challengeExperts.filter(ce => ce.status === 'active').length +
        data.relationships.challengePartners.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading relationship data...</p>
        </div>
      </div>
    );
  }

  const stats = getRelationshipStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Relationship Overview</h1>
          <p className="text-muted-foreground">
            Visualize and manage connections between entities in the innovation ecosystem
          </p>
        </div>
        <Button onClick={fetchRelationshipData} variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entities</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalCampaigns || 0) + (stats.totalEvents || 0) + (stats.totalChallenges || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Campaigns, Events, Challenges
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Relationships</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRelationships || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active connections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partners & Stakeholders</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.totalPartners || 0) + (stats.totalStakeholders || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              External collaborators
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExperts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Available experts
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="entities" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entities">Entity Relationships</TabsTrigger>
          <TabsTrigger value="network">Network Map</TabsTrigger>
          <TabsTrigger value="analytics">Relationship Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="entities" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search Entities</Label>
              <Input
                id="search"
                placeholder="Search campaigns, events, challenges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-48">
              <Label htmlFor="entityType">Entity Type</Label>
              <Select value={selectedEntityType} onValueChange={setSelectedEntityType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="campaign">Campaigns</SelectItem>
                  <SelectItem value="event">Events</SelectItem>
                  <SelectItem value="challenge">Challenges</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Entity List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntities().map((entity) => {
              const connections = getEntityConnections(entity.id, entity.entityType);
              
              return (
                <Card key={entity.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getEntityTypeIcon(entity.entityType)}
                        <Badge variant={getEntityTypeBadge(entity.entityType)}>
                          {entity.entityType}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedEntity(connections);
                          setIsDetailDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg leading-tight">
                      {entity.title || entity.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Connections:</span>
                        <Badge variant="outline">
                          {connections?.connections.length || 0}
                        </Badge>
                      </div>
                      
                      {connections?.connections.slice(0, 3).map((connection) => (
                        <div key={connection.id} className="flex items-center gap-2 text-sm">
                          {getEntityTypeIcon(connection.type)}
                          <ArrowRight className="h-3 w-3 text-muted-foreground" />
                          <span className="truncate">{connection.name}</span>
                        </div>
                      ))}
                      
                      {(connections?.connections.length || 0) > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{(connections?.connections.length || 0) - 3} more connections
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Visualization</CardTitle>
              <CardDescription>
                Interactive network map showing all entity relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <Network className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Network Map Coming Soon</p>
                <p className="text-sm text-muted-foreground">
                  Interactive D3.js visualization will be available in the next release
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Relationship Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Campaign Partners</span>
                    <Badge variant="outline">{data?.relationships.campaignPartners.length || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Event Stakeholders</span>
                    <Badge variant="outline">{data?.relationships.eventStakeholders.length || 0}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Challenge Experts</span>
                    <Badge variant="outline">
                      {data?.relationships.challengeExperts.filter(ce => ce.status === 'active').length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Focus Question Links</span>
                    <Badge variant="outline">{data?.relationships.eventFocusQuestions.length || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Entity Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Campaigns with Partners</span>
                    <Badge variant="outline">
                      {new Set(data?.relationships.campaignPartners.map(cp => cp.campaign_id)).size || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Events with Stakeholders</span>
                    <Badge variant="outline">
                      {new Set(data?.relationships.eventStakeholders.map(es => es.event_id)).size || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Challenges with Experts</span>
                    <Badge variant="outline">
                      {new Set(data?.relationships.challengeExperts.filter(ce => ce.status === 'active').map(ce => ce.challenge_id)).size || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedEntity && getEntityTypeIcon(selectedEntity.type)}
              {selectedEntity?.name}
            </DialogTitle>
            <DialogDescription>
              Detailed view of all relationships for this entity
            </DialogDescription>
          </DialogHeader>

          {selectedEntity && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={getEntityTypeBadge(selectedEntity.type)}>
                  {selectedEntity.type}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedEntity.connections.length} connections
                </span>
              </div>

              <Separator />

              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {selectedEntity.connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getEntityTypeIcon(connection.type)}
                        <div>
                          <p className="font-medium">{connection.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {connection.relationshipType}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getEntityTypeBadge(connection.type)}>
                        {connection.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}