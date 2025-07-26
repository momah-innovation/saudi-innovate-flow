import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Building2, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSystemLists } from "@/hooks/useSystemLists";

interface Partner {
  id: string;
  name: string;
  name_ar?: string;
  partner_type?: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_person?: string;
  capabilities?: string[];
  funding_capacity?: number;
  collaboration_history?: string;
  status: string;
  created_at: string;
}

export function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { partnerStatusOptions } = useSystemLists();

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    partner_type: "academic",
    email: "",
    phone: "",
    address: "",
    contact_person: "",
    capabilities: [] as string[],
    funding_capacity: 0,
    collaboration_history: "",
    status: "active"
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast({
        title: "Error",
        description: "Failed to fetch partners",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPartner) {
        const { error } = await supabase
          .from("partners")
          .update(formData)
          .eq("id", editingPartner.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Partner updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("partners")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Partner created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingPartner(null);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error("Error saving partner:", error);
      toast({
        title: "Error",
        description: "Failed to save partner",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      name_ar: partner.name_ar || "",
      partner_type: partner.partner_type || "academic",
      email: partner.email || "",
      phone: partner.phone || "",
      address: partner.address || "",
      contact_person: partner.contact_person || "",
      capabilities: partner.capabilities || [],
      funding_capacity: partner.funding_capacity || 0,
      collaboration_history: partner.collaboration_history || "",
      status: partner.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    try {
      const { error } = await supabase
        .from("partners")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Partner deleted successfully",
      });
      fetchPartners();
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast({
        title: "Error",
        description: "Failed to delete partner",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      name_ar: "",
      partner_type: "academic",
      email: "",
      phone: "",
      address: "",
      contact_person: "",
      capabilities: [],
      funding_capacity: 0,
      collaboration_history: "",
      status: "active"
    });
  };

  const getPartnerTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      academic: "bg-blue-100 text-blue-800",
      corporate: "bg-green-100 text-green-800",
      government: "bg-purple-100 text-purple-800",
      ngo: "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Partners Management</h1>
          <p className="text-muted-foreground">Manage organization partners and collaborators</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPartner(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Partner
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPartner ? "Edit Partner" : "Add New Partner"}</DialogTitle>
              <DialogDescription>
                {editingPartner ? "Update partner information" : "Create a new partner profile"}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name (English)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_ar">Name (Arabic)</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partner_type">Partner Type</Label>
                  <Select value={formData.partner_type} onValueChange={(value) => setFormData({ ...formData, partner_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="ngo">NGO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="funding_capacity">Funding Capacity</Label>
                <Input
                  id="funding_capacity"
                  type="number"
                  value={formData.funding_capacity}
                  onChange={(e) => setFormData({ ...formData, funding_capacity: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="collaboration_history">Collaboration History</Label>
                <Textarea
                  id="collaboration_history"
                  value={formData.collaboration_history}
                  onChange={(e) => setFormData({ ...formData, collaboration_history: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPartner ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {partners.map((partner) => (
          <Card key={partner.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    {partner.name}
                    {partner.name_ar && <span className="text-sm text-muted-foreground">({partner.name_ar})</span>}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge className={getPartnerTypeColor(partner.partner_type || '')}>
                      {partner.partner_type}
                    </Badge>
                    <Badge className={getStatusColor(partner.status)}>
                      {partner.status}
                    </Badge>
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(partner)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(partner.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {partner.contact_person && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Contact:</span>
                    <span>{partner.contact_person}</span>
                  </div>
                )}
                {partner.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{partner.email}</span>
                  </div>
                )}
                {partner.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{partner.phone}</span>
                  </div>
                )}
                {partner.funding_capacity && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Funding Capacity:</span>
                    <span>${partner.funding_capacity.toLocaleString()}</span>
                  </div>
                )}
              </div>
              {partner.address && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Address:</span> {partner.address}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}