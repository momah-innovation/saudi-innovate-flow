import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit, Trash2, User, Mail, Phone, Building, Search, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StakeholderWizard } from "./StakeholderWizard";
import { PageLayout } from "@/components/layout/PageLayout";

interface Stakeholder {
  id: string;
  name: string;
  organization: string;
  position: string;
  email: string;
  phone?: string;
  stakeholder_type: string;
  influence_level: string;
  interest_level: string;
  engagement_status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export function StakeholdersManagement() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [viewingStakeholder, setViewingStakeholder] = useState<Stakeholder | null>(null);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list' | 'grid'>('cards');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [influenceFilter, setInfluenceFilter] = useState("all");
  const [engagementFilter, setEngagementFilter] = useState("all");
  const { toast } = useToast();

  // Hardcoded options for now
  const stakeholderTypes = ["government", "private_sector", "academic", "ngo", "community", "international"];
  const influenceLevels = ["high", "medium", "low"];
  const interestLevels = ["high", "medium", "low"];
  const engagementStatuses = ["active", "passive", "neutral", "resistant", "supporter"];

  useEffect(() => {
    fetchStakeholders();
  }, []);

  const fetchStakeholders = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("stakeholders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching stakeholders:", error);
        toast({
          title: "Error",
          description: "Failed to fetch stakeholders",
          variant: "destructive",
        });
        return;
      }

      setStakeholders(data || []);
    } catch (error) {
      console.error("Error fetching stakeholders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch stakeholders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setIsWizardOpen(true);
  };

  const handleWizardSave = () => {
    setIsWizardOpen(false);
    setEditingStakeholder(null);
    fetchStakeholders();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this stakeholder?")) return;

    try {
      const { error } = await supabase
        .from("stakeholders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Stakeholder deleted successfully",
      });
      
      fetchStakeholders();
    } catch (error) {
      console.error("Error deleting stakeholder:", error);
      toast({
        title: "Error",
        description: "Failed to delete stakeholder",
        variant: "destructive",
      });
    }
  };

  const filteredStakeholders = stakeholders.filter((stakeholder) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (stakeholder.name && stakeholder.name.toLowerCase().includes(searchLower)) ||
      (stakeholder.organization && stakeholder.organization.toLowerCase().includes(searchLower)) ||
      (stakeholder.position && stakeholder.position.toLowerCase().includes(searchLower)) ||
      (stakeholder.email && stakeholder.email.toLowerCase().includes(searchLower));
    
    const matchesType = typeFilter === "all" || stakeholder.stakeholder_type === typeFilter;
    const matchesInfluence = influenceFilter === "all" || stakeholder.influence_level === influenceFilter;
    const matchesEngagement = engagementFilter === "all" || stakeholder.engagement_status === engagementFilter;
    
    return matchesSearch && matchesType && matchesInfluence && matchesEngagement;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setInfluenceFilter("all");
    setEngagementFilter("all");
  };

  const getInfluenceColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getEngagementColor = (status: string) => {
    switch (status) {
      case "supporter": return "bg-green-100 text-green-700";
      case "active": return "bg-blue-100 text-blue-700";
      case "neutral": return "bg-gray-100 text-gray-700";
      case "passive": return "bg-yellow-100 text-yellow-700";
      case "resistant": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading stakeholders...</p>
        </div>
      </div>
    );
  }

  // Create filters for PageLayout
  const filters = (
    <>
      <div className="min-w-[140px]">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {stakeholderTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[140px]">
        <Select value={influenceFilter} onValueChange={setInfluenceFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Influence Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Influence Levels</SelectItem>
            {influenceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="min-w-[140px]">
        <Select value={engagementFilter} onValueChange={setEngagementFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Engagement Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Engagement Statuses</SelectItem>
            {engagementStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );

  const secondaryActions = (
    <Button
      variant="outline"
      onClick={() => {
        toast({
          title: "Export Data",
          description: "Export functionality will be added soon",
        });
      }}
    >
      Export
    </Button>
  );

  return (
    <>
      <PageLayout 
        title="Stakeholders Management"
        description="Track and manage stakeholder relationships, influence levels, and engagement strategies"
        itemCount={filteredStakeholders.length}
        primaryAction={{
          label: "Add Stakeholder",
          onClick: () => { setEditingStakeholder(null); setIsWizardOpen(true); },
          icon: <Plus className="w-4 h-4" />
        }}
        secondaryActions={secondaryActions}
        showLayoutSelector={true}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        showSearch={true}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search stakeholders..."
        filters={filters}
        spacing="md"
        maxWidth="full"
      >
        <div className={
          viewMode === 'cards' ? 'grid gap-4 md:grid-cols-2 lg:grid-cols-3' :
          viewMode === 'grid' ? 'grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
          'space-y-4'
        }>
        {viewMode === 'list' ? (
          // List View
          filteredStakeholders.map((stakeholder) => (
            <Card key={stakeholder.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">{stakeholder.name}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {stakeholder.organization}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {stakeholder.position}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {stakeholder.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {stakeholder.stakeholder_type.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getInfluenceColor(stakeholder.influence_level)}`}>
                          {stakeholder.influence_level.charAt(0).toUpperCase() + stakeholder.influence_level.slice(1)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getEngagementColor(stakeholder.engagement_status)}`}>
                          {stakeholder.engagement_status.charAt(0).toUpperCase() + stakeholder.engagement_status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setViewingStakeholder(stakeholder);
                        setIsDetailOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(stakeholder)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(stakeholder.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Card/Grid View
          filteredStakeholders.map((stakeholder) => (
            <Card key={stakeholder.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3" />
                        {stakeholder.organization}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        {stakeholder.position}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {stakeholder.email}
                      </div>
                      {stakeholder.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {stakeholder.phone}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">
                        {stakeholder.stakeholder_type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                      <Badge variant="outline" className={getInfluenceColor(stakeholder.influence_level)}>
                        {stakeholder.influence_level.charAt(0).toUpperCase() + stakeholder.influence_level.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getEngagementColor(stakeholder.engagement_status)}>
                        {stakeholder.engagement_status.charAt(0).toUpperCase() + stakeholder.engagement_status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setViewingStakeholder(stakeholder);
                      setIsDetailOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(stakeholder)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(stakeholder.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {(filteredStakeholders.length === 0 && (searchTerm || typeFilter !== "all" || influenceFilter !== "all" || engagementFilter !== "all")) && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            No stakeholders match the search criteria
          </div>
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </div>
      )}

      {(stakeholders.length === 0 && !(searchTerm || typeFilter !== "all" || influenceFilter !== "all" || engagementFilter !== "all")) && (
        <div className="text-center py-8">
          <div className="text-muted-foreground mb-4">
            No stakeholders
          </div>
          <Button onClick={() => { setEditingStakeholder(null); setIsWizardOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Stakeholder
          </Button>
        </div>
      )}
      </PageLayout>

      {/* Stakeholder Wizard */}
      <StakeholderWizard
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setEditingStakeholder(null);
        }}
        stakeholder={editingStakeholder}
        onSave={handleWizardSave}
      />

      {/* Detail View Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Stakeholder Details</DialogTitle>
          </DialogHeader>
          {viewingStakeholder && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{viewingStakeholder.name}</h3>
                  <p className="text-muted-foreground">{viewingStakeholder.position} - {viewingStakeholder.organization}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {viewingStakeholder.stakeholder_type.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{viewingStakeholder.email}</span>
                    </div>
                    {viewingStakeholder.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{viewingStakeholder.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Influence and Engagement Levels</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Influence Level: </span>
                      <Badge variant="outline" className={getInfluenceColor(viewingStakeholder.influence_level)}>
                        {viewingStakeholder.influence_level.charAt(0).toUpperCase() + viewingStakeholder.influence_level.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Interest Level: </span>
                      <Badge variant="outline">
                        {viewingStakeholder.interest_level.charAt(0).toUpperCase() + viewingStakeholder.interest_level.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Engagement Status: </span>
                      <Badge variant="outline" className={getEngagementColor(viewingStakeholder.engagement_status)}>
                        {viewingStakeholder.engagement_status.charAt(0).toUpperCase() + viewingStakeholder.engagement_status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {viewingStakeholder.notes && (
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{viewingStakeholder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default StakeholdersManagement;