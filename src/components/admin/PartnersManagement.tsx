import { useState, useEffect } from "react";
import { usePartnerManagement } from "@/hooks/usePartnerManagement";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from '@/components/ui/StatusBadge';
import { TypeBadge } from '@/components/ui/TypeBadge';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Building2, Phone, Mail, Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from "@/hooks/useUnifiedTranslation";
import { useSystemLists } from "@/hooks/useSystemLists";
import { useUnifiedLoading } from '@/hooks/useUnifiedLoading';
import { createErrorHandler } from '@/utils/unified-error-handler';

interface Partner {
  id: string;
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
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
  const { 
    partners, 
    loading: isLoading, 
    error, 
    loadPartners, 
    createPartner, 
    updatePartner, 
    deletePartner 
  } = usePartnerManagement();
  
  const [editingPartner, setEditingPartner] = useState<any | null>(null);
  // Detail view states
  const [viewingPartner, setViewingPartner] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const { partnerStatusOptions, partnerTypeOptions } = useSystemLists();

  // ✅ MIGRATED: Using unified loading and error handling
  const { isLoading: isUnifiedLoading, withLoading } = useUnifiedLoading({
    component: 'PartnersManagement',
    showToast: true,
    logErrors: true
  });
  const errorHandler = createErrorHandler({ component: 'PartnersManagement' });

  const [formData, setFormData] = useState({
    name: "",
    name_ar: "",
    description: "",
    description_ar: "",
    partner_type: partnerTypeOptions[0] || "government",
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
    loadPartners();
  }, [loadPartners]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    return withLoading('save-partner', async () => {
      if (editingPartner) {
        await updatePartner(editingPartner.id, formData);
      } else {
        await createPartner(formData);
      }

      setIsDialogOpen(false);
      setEditingPartner(null);
      resetForm();
      return true;
    }, {
      successMessage: editingPartner ? t('success.partner_updated') : t('success.partner_created'),
      errorMessage: t('error.save_partner_failed'),
      logContext: { partnerId: editingPartner?.id, action: editingPartner ? 'update' : 'create' }
    });
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      name_ar: partner.name_ar || "",
      description: partner.description || "",
      description_ar: partner.description_ar || "",
      partner_type: partner.partner_type || partnerTypeOptions[0] || "government",
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

  // Filter partners based on search and filters
  const filteredPartners = partners.filter((partner) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchLower) ||
      (partner.name_ar && partner.name_ar.toLowerCase().includes(searchLower)) ||
      (partner.contact_person && partner.contact_person.toLowerCase().includes(searchLower)) ||
      (partner.email && partner.email.toLowerCase().includes(searchLower));
    
    const matchesType = typeFilter === "all" || partner.partner_type === typeFilter;
    const matchesStatus = statusFilter === "all" || partner.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const handleDelete = (id: string) => {
    if (!confirm(t('partners.delete_confirmation'))) return;

    return withLoading('delete-partner', async () => {
      await deletePartner(id);
      return true;
    }, {
      successMessage: t('success.partner_deleted'),
      errorMessage: t('error.delete_partner_failed'),
      logContext: { partnerId: id, action: 'delete' }
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      name_ar: "",
      description: "",
      description_ar: "",
      partner_type: partnerTypeOptions[0] || "government",
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


  if (isLoading) {
    return <div className="flex justify-center p-8">{t('loading.general')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.partners.management_title')}</h1>
          <p className="text-muted-foreground">{t('admin.partners.management_description')}</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPartner(null); }}>
              <Plus className="w-4 h-4 me-2" />
              {t('admin.partners.add_partner')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPartner ? t('admin.partners.edit_partner') : t('admin.partners.add_new_partner')}</DialogTitle>
              <DialogDescription>
                {editingPartner ? t('admin.partners.update_partner_description') : t('admin.partners.add_partner_description')}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div className="grid grid-cols-1 gap-4">
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
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="partner_type">{t('form.partner_type_label')}</Label>
                  <Select value={formData.partner_type} onValueChange={(value) => setFormData({ ...formData, partner_type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {partnerTypeOptions.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">{t('form.status_label')}</Label>
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
                  <Label htmlFor="email">{t('form.email_label')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">{t('form.phone_label')}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="contact_person">{t('form.contact_person_label')}</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="address">{t('form.address_label')}</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="funding_capacity">{t('form.funding_capacity_label')}</Label>
                <Input
                  id="funding_capacity"
                  type="number"
                  value={formData.funding_capacity}
                  onChange={(e) => setFormData({ ...formData, funding_capacity: Number(e.target.value) })}
                />
              </div>

              <div>
                <Label htmlFor="collaboration_history">{t('form.collaboration_history_label')}</Label>
                <Textarea
                  id="collaboration_history"
                  value={formData.collaboration_history}
                  onChange={(e) => setFormData({ ...formData, collaboration_history: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('ui.cancel')}
                </Button>
                <Button type="submit">
                  {editingPartner ? t('ui.update') : t('ui.create')}
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
            <DialogTitle>{t('partners.partner_details')}</DialogTitle>
          </DialogHeader>
          {viewingPartner && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{viewingPartner.name}</h3>
                  {viewingPartner.name_ar && (
                    <p className="text-muted-foreground">{viewingPartner.name_ar}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <TypeBadge type={viewingPartner.partner_type || ''} size="sm" />
                    <StatusBadge status={viewingPartner.status} size="sm" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsDetailOpen(false);
                    handleEdit(viewingPartner);
                  }}>
                    <Edit className="w-4 h-4 me-2" />
                    {t('ui.edit')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsDetailOpen(false);
                    handleDelete(viewingPartner.id);
                  }}>
                    <Trash2 className="w-4 h-4 me-2" />
                    {t('ui.delete')}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viewingPartner.contact_person && (
                  <div>
                    <span className="font-medium text-sm text-muted-foreground">{t('form.contact_person_label')}</span>
                    <p>{viewingPartner.contact_person}</p>
                  </div>
                )}
                {viewingPartner.email && (
                  <div>
                    <span className="font-medium text-sm text-muted-foreground">{t('form.email_label')}</span>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{viewingPartner.email}</span>
                    </div>
                  </div>
                )}
                {viewingPartner.phone && (
                  <div>
                    <span className="font-medium text-sm text-muted-foreground">{t('form.phone_label')}</span>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{viewingPartner.phone}</span>
                    </div>
                  </div>
                )}
                {viewingPartner.funding_capacity && (
                  <div>
                    <span className="font-medium text-sm text-muted-foreground">{t('form.funding_capacity_label')}</span>
                    <p>${viewingPartner.funding_capacity.toLocaleString()}</p>
                  </div>
                )}
              </div>

              {viewingPartner.address && (
                <div>
                  <span className="font-medium text-sm text-muted-foreground">{t('form.address_label')}</span>
                  <p className="mt-1">{viewingPartner.address}</p>
                </div>
              )}

              {viewingPartner.collaboration_history && (
                <div>
                  <span className="font-medium text-sm text-muted-foreground">{t('form.collaboration_history_label')}</span>
                  <p className="mt-1 text-sm">{viewingPartner.collaboration_history}</p>
                </div>
              )}

              {viewingPartner.capabilities && viewingPartner.capabilities.length > 0 && (
                <div>
                  <span className="font-medium text-sm text-muted-foreground">Capabilities</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {viewingPartner.capabilities.map((capability, index) => (
                      <Badge key={index} variant="secondary">{capability}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Minimal Cards Grid */}
      <div className="grid gap-3">
        {partners.map((partner) => (
          <Card 
            key={partner.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              setViewingPartner(partner);
              setIsDetailOpen(true);
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4" />
                    <h3 className="font-medium">{partner.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <TypeBadge type={partner.partner_type || ''} size="sm" />
                    <StatusBadge status={partner.status} size="sm" />
                  </div>
                  {partner.contact_person && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Contact: {partner.contact_person}
                    </p>
                  )}
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(partner)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(partner.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {partners.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">{t('partners.no_partners_found', 'No partners found')}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}