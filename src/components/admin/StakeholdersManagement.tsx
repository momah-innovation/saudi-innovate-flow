import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Edit, Trash2, User, Mail, Phone, Building, Search, X } from "lucide-react";
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
} from "@/components/ui/dialog";
import { StakeholderWizard } from "./StakeholderWizard";

interface Stakeholder {
  id: string;
  name: string;
  name_ar?: string;
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
      
      fetchStakeholders(); // Refresh the list
    } catch (error) {
      console.error("Error deleting stakeholder:", error);
      toast({
        title: "Error",
        description: "Failed to delete stakeholder",
        variant: "destructive",
      });
    }
  };

  // Filter stakeholders based on search and filters
  const filteredStakeholders = stakeholders.filter((stakeholder) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      stakeholder.name.toLowerCase().includes(searchLower) ||
      (stakeholder.name_ar && stakeholder.name_ar.toLowerCase().includes(searchLower)) ||
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Stakeholders Management</h1>
          <p className="text-muted-foreground">Track and manage stakeholder relationships, influence levels, and engagement strategies</p>
        </div>
        
        <Button onClick={() => { setEditingStakeholder(null); setIsWizardOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Stakeholder
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stakeholders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
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

            <Select value={influenceFilter} onValueChange={setInfluenceFilter}>
              <SelectTrigger>
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

            <Select value={engagementFilter} onValueChange={setEngagementFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Engagement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Engagement</SelectItem>
                {engagementStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(searchTerm || typeFilter !== "all" || influenceFilter !== "all" || engagementFilter !== "all") && (
            <div className="mt-4 flex justify-between items-center">
              <div className="flex gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchTerm}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm("")} />
                  </Badge>
                )}
                {typeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {typeFilter.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setTypeFilter("all")} />
                  </Badge>
                )}
                {influenceFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Influence: {influenceFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setInfluenceFilter("all")} />
                  </Badge>
                )}
                {engagementFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Engagement: {engagementFilter}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setEngagementFilter("all")} />
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {filteredStakeholders.length === 0 && (searchTerm || typeFilter !== "all" || influenceFilter !== "all" || engagementFilter !== "all") && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No stakeholders found matching your criteria</p>
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="mt-2"
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}

      {stakeholders.length === 0 && !(searchTerm || typeFilter !== "all" || influenceFilter !== "all" || engagementFilter !== "all") && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No stakeholders found</p>
          </CardContent>
        </Card>
      )}

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
                  {viewingStakeholder.name_ar && (
                    <p className="text-muted-foreground">{viewingStakeholder.name_ar}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">
                      {viewingStakeholder.stakeholder_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                    <Badge className={getInfluenceColor(viewingStakeholder.influence_level)}>
                      {viewingStakeholder.influence_level} influence
                    </Badge>
                    <Badge className={getEngagementColor(viewingStakeholder.engagement_status)}>
                      {viewingStakeholder.engagement_status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsDetailOpen(false);
                    handleEdit(viewingStakeholder);
                  }}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsDetailOpen(false);
                    handleDelete(viewingStakeholder.id);
                  }}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Organization</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="w-4 h-4" />
                    <span>{viewingStakeholder.organization}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Position</span>
                  <div className="flex items-center gap-2 mt-1">
                    <User className="w-4 h-4" />
                    <span>{viewingStakeholder.position}</span>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Email</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-4 h-4" />
                    <span>{viewingStakeholder.email}</span>
                  </div>
                </div>
                {viewingStakeholder.phone && (
                  <div>
                    <span className="font-medium text-sm text-muted-foreground">Phone</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-4 h-4" />
                      <span>{viewingStakeholder.phone}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Interest Level</span>
                  <Badge className={getInfluenceColor(viewingStakeholder.interest_level)} variant="secondary">
                    {viewingStakeholder.interest_level}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Engagement Status</span>
                  <Badge className={getEngagementColor(viewingStakeholder.engagement_status)}>
                    {viewingStakeholder.engagement_status}
                  </Badge>
                </div>
              </div>

              {viewingStakeholder.notes && (
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Notes</span>
                  <p className="mt-1 text-sm">{viewingStakeholder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Minimal Cards Grid */}
      <div className="grid gap-3">
        {stakeholders.map((stakeholder) => (
          <Card 
            key={stakeholder.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setViewingStakeholder(stakeholder);
              setIsDetailOpen(true);
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    <h3 className="font-medium">{stakeholder.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {stakeholder.position} at {stakeholder.organization}
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">
                      {stakeholder.stakeholder_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </Badge>
                    <Badge className={getInfluenceColor(stakeholder.influence_level)}>
                      {stakeholder.influence_level} influence
                    </Badge>
                    <Badge className={getEngagementColor(stakeholder.engagement_status)}>
                      {stakeholder.engagement_status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(stakeholder)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(stakeholder.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {stakeholders.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No stakeholders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}