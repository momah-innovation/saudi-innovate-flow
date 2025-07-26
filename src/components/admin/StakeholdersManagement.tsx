import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Edit, Trash2, User, Mail, Phone, Building } from "lucide-react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  // Hardcoded options for now
  const stakeholderTypes = ["government", "private_sector", "academic", "ngo", "community", "international"];
  const influenceLevels = ["high", "medium", "low"];
  const interestLevels = ["high", "medium", "low"];
  const engagementStatuses = ["active", "passive", "neutral", "resistant", "supporter"];

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    organization: "",
    position: "",
    email: "",
    phone: "",
    stakeholder_type: "government",
    influence_level: "medium",
    interest_level: "medium",
    engagement_status: "neutral",
    notes: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingStakeholder) {
        // Update existing stakeholder
        const { error } = await supabase
          .from("stakeholders")
          .update(formData)
          .eq("id", editingStakeholder.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Stakeholder updated successfully",
        });
      } else {
        // Add new stakeholder
        const { error } = await supabase
          .from("stakeholders")
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Stakeholder created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingStakeholder(null);
      resetForm();
      fetchStakeholders(); // Refresh the list
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      toast({
        title: "Error",
        description: "Failed to save stakeholder",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setFormData({
      name: stakeholder.name,
      name_ar: stakeholder.name_ar || "",
      organization: stakeholder.organization,
      position: stakeholder.position,
      email: stakeholder.email,
      phone: stakeholder.phone || "",
      stakeholder_type: stakeholder.stakeholder_type,
      influence_level: stakeholder.influence_level,
      interest_level: stakeholder.interest_level,
      engagement_status: stakeholder.engagement_status,
      notes: stakeholder.notes || "",
    });
    setIsDialogOpen(true);
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

  const resetForm = () => {
    setFormData({
      name: "",
      name_ar: "",
      organization: "",
      position: "",
      email: "",
      phone: "",
      stakeholder_type: "government",
      influence_level: "medium",
      interest_level: "medium",
      engagement_status: "neutral",
      notes: "",
    });
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
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingStakeholder(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Stakeholder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStakeholder ? "Edit Stakeholder" : "Add New Stakeholder"}</DialogTitle>
              <DialogDescription>
                {editingStakeholder ? "Update stakeholder engagement profile" : "Add a new stakeholder for engagement tracking and influence analysis"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name (English)*</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name_ar">Name (Arabic)</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization*</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position*</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stakeholder_type">Stakeholder Type</Label>
                  <Select value={formData.stakeholder_type} onValueChange={(value) => setFormData({ ...formData, stakeholder_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stakeholderTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engagement_status">Engagement Status</Label>
                  <Select value={formData.engagement_status} onValueChange={(value) => setFormData({ ...formData, engagement_status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {engagementStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="influence_level">Influence Level</Label>
                  <Select value={formData.influence_level} onValueChange={(value) => setFormData({ ...formData, influence_level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {influenceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest_level">Interest Level</Label>
                  <Select value={formData.interest_level} onValueChange={(value) => setFormData({ ...formData, interest_level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {interestLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStakeholder ? "Update" : "Create"} Stakeholder
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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