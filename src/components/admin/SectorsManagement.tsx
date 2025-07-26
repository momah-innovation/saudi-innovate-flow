import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sector {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  vision_2030_alignment?: string;
  created_at: string;
}

export function SectorsManagement() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingSector, setEditingSector] = useState<Sector | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Detail view states
  const [viewingSector, setViewingSector] = useState<Sector | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    description: "",
    vision_2030_alignment: ""
  });

  useEffect(() => {
    fetchSectors();
  }, []);

  const fetchSectors = async () => {
    try {
      const { data, error } = await supabase
        .from("sectors")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSectors(data || []);
    } catch (error) {
      console.error("Error fetching sectors:", error);
      toast({
        title: "Error",
        description: "Failed to fetch sectors",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSector) {
        const { error } = await supabase
          .from("sectors")
          .update(formData)
          .eq("id", editingSector.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Sector updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("sectors")
          .insert([formData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Sector created successfully",
        });
      }

      setIsDialogOpen(false);
      setEditingSector(null);
      resetForm();
      fetchSectors();
    } catch (error) {
      console.error("Error saving sector:", error);
      toast({
        title: "Error",
        description: "Failed to save sector",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setFormData({
      name: sector.name,
      name_ar: sector.name_ar || "",
      description: sector.description || "",
      vision_2030_alignment: sector.vision_2030_alignment || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sector?")) return;

    try {
      const { error } = await supabase
        .from("sectors")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Sector deleted successfully",
      });
      fetchSectors();
    } catch (error) {
      console.error("Error deleting sector:", error);
      toast({
        title: "Error",
        description: "Failed to delete sector",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      name_ar: "",
      description: "",
      vision_2030_alignment: ""
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Sectors Management</h1>
          <p className="text-muted-foreground">Manage government sectors and their Vision 2030 alignment</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingSector(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Sector
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSector ? "Edit Sector" : "Add New Sector"}</DialogTitle>
              <DialogDescription>
                {editingSector ? "Update sector information" : "Create a new sector"}
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

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="vision_2030_alignment">Vision 2030 Alignment</Label>
                <Textarea
                  id="vision_2030_alignment"
                  value={formData.vision_2030_alignment}
                  onChange={(e) => setFormData({ ...formData, vision_2030_alignment: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSector ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {sectors.map((sector) => (
          <Card key={sector.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {sector.name}
                    {sector.name_ar && <span className="text-sm text-muted-foreground">({sector.name_ar})</span>}
                  </CardTitle>
                  {sector.description && (
                    <CardDescription className="mt-2">
                      {sector.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(sector)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(sector.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {sector.vision_2030_alignment && (
              <CardContent>
                <div className="text-sm">
                  <span className="font-medium">Vision 2030 Alignment:</span>
                  <p className="mt-1 text-muted-foreground">{sector.vision_2030_alignment}</p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}