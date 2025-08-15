import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Building, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from "@/utils/error-handler";

interface Sector {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
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
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    vision_2030_alignment: ""
  });

  // Filter sectors based on search term
  const filteredSectors = sectors.filter((sector) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      sector.name.toLowerCase().includes(searchLower) ||
      (sector.name_ar && sector.name_ar.toLowerCase().includes(searchLower)) ||
      (sector.description && sector.description.toLowerCase().includes(searchLower)) ||
      (sector.vision_2030_alignment && sector.vision_2030_alignment.toLowerCase().includes(searchLower))
    );
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
      logger.error("Error fetching sectors", error);
    }
  };

  const isFormValid = () => {
    return formData.name.trim().length > 0;
  };

  const handleSaveSector = async () => {
    if (!isFormValid()) return;

    try {
      setIsLoading(true);
      
      if (editingSector) {
        const { error } = await supabase
          .from('sectors')
          .update({
            name: formData.name,
            name_ar: formData.name_ar,
            description: formData.description,
            description_ar: formData.description_ar,
            vision_2030_alignment: formData.vision_2030_alignment,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSector.id);

        if (error) throw error;
        
        toast({
          title: t('sectors.update_success'),
          description: t('sectors.update_success_description')
        });
      } else {
        const { error } = await supabase
          .from('sectors')
          .insert([formData]);

        if (error) throw error;
        
        toast({
          title: t('sectors.create_success'),
          description: t('sectors.create_success_description')
        });
      }

      fetchSectors();
      resetForm();
    } catch (error) {
      logger.error("Error saving sector", error);
      toast({
        title: t('sectors.save_error'),
        description: t('sectors.save_error_description'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (sector: Sector) => {
    setEditingSector(sector);
    setFormData({
      name: sector.name,
      name_ar: sector.name_ar || "",
      description: sector.description || "",
      description_ar: sector.description_ar || "",
      vision_2030_alignment: sector.vision_2030_alignment || ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (sectorId: string) => {
    try {
      const { error } = await supabase
        .from('sectors')
        .delete()
        .eq('id', sectorId);

      if (error) throw error;

      toast({
        title: t('sectors.success_title'),
        description: t('sectors.deleted_successfully')
      });

      fetchSectors();
    } catch (error) {
      logger.error("Error deleting sector", error);
      toast({
        title: t('sectors.error_title'),
        description: t('sectors.failed_to_delete'),
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      vision_2030_alignment: ""
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">{t('sectors.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.sectors.title')}</h1>
          <p className="text-muted-foreground">{t('admin.sectors.description')}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingSector(null); }}>
              <Plus className="w-4 h-4 mr-2" />
              {t('admin.sectors.add_sector')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSector ? t('admin.edit_sector') : t('admin.add_new_sector')}</DialogTitle>
              <DialogDescription>
                {editingSector ? t('admin.sectors.update_sector_info') : t('admin.sectors.create_new_sector')}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={(e) => { e.preventDefault(); handleSaveSector(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">{t('form.name_english_label')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name_ar">{t('form.name_arabic_label')}</Label>
                  <Input
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t('form.description_english_label')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="description_ar">{t('form.description_arabic_label')}</Label>
                <Textarea
                  id="description_ar"
                  value={formData.description_ar || ''}
                  onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                  dir="rtl"
                />
              </div>

              <div>
                <Label htmlFor="vision_2030_alignment">{t('admin.sectors.vision_2030_alignment')}</Label>
                <Textarea
                  id="vision_2030_alignment"
                  value={formData.vision_2030_alignment}
                  onChange={(e) => setFormData({ ...formData, vision_2030_alignment: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {editingSector ? t('common.update') : t('common.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('admin.sectors.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredSectors.map((sector) => (
          <Card key={sector.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setViewingSector(sector); setIsDetailOpen(true); }}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    {sector.name}
                    {sector.name_ar && <span className="text-sm text-muted-foreground">({sector.name_ar})</span>}
                  </CardTitle>
                  {sector.description && (
                    <CardDescription className="mt-2 line-clamp-2">
                      {sector.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" onClick={() => handleEdit(sector)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(sector.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}

        {filteredSectors.length === 0 && searchTerm && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">{t('admin.sectors.no_sectors_matching')}</p>
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                {t('admin.sectors.clear_search')}
              </Button>
            </CardContent>
          </Card>
        )}

        {sectors.length === 0 && !searchTerm && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">{t('admin.sectors.no_sectors_found')}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detail View Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              {viewingSector?.name}
            </DialogTitle>
            {viewingSector?.name_ar && (
              <DialogDescription>{viewingSector.name_ar}</DialogDescription>
            )}
          </DialogHeader>
          
          {viewingSector && (
            <div className="space-y-4">
              {viewingSector.description && (
                <div>
                  <h4 className="font-medium mb-2">{t('admin.sectors.description_label')}</h4>
                  <p className="text-muted-foreground">{viewingSector.description}</p>
                </div>
              )}
              
              {viewingSector.vision_2030_alignment && (
                <div>
                  <h4 className="font-medium mb-2">{t('admin.sectors.vision_2030_alignment')}</h4>
                  <p className="text-muted-foreground">{viewingSector.vision_2030_alignment}</p>
                </div>
              )}
              
              <div>
                <h4 className="font-medium mb-2">{t('admin.sectors.created')}</h4>
                <p className="text-muted-foreground">{formatDate(viewingSector.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}