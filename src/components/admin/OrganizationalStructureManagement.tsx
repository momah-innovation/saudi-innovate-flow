import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Users, Building, Network, Mail, Search, Filter, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { logger } from "@/utils/error-handler";

interface Deputy {
  id: string;
  name: string;
  name_ar?: string;
  deputy_minister?: string;
  contact_email?: string;
  sector_id?: string;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
  name_ar?: string;
  department_head?: string;
  budget_allocation?: number;
  deputy_id?: string;
  created_at: string;
}

interface Domain {
  id: string;
  name: string;
  name_ar?: string;
  domain_lead?: string;
  specialization?: string;
  department_id?: string;
  created_at: string;
}

interface SubDomain {
  id: string;
  name: string;
  name_ar?: string;
  technical_focus?: string;
  domain_id?: string;
  created_at: string;
}

interface Service {
  id: string;
  name: string;
  name_ar?: string;
  service_type?: string;
  citizen_facing: boolean;
  digital_maturity_score: number;
  sub_domain_id?: string;
  created_at: string;
}

export function OrganizationalStructureManagement() {
  const [deputies, setDeputies] = useState<Deputy[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [subDomains, setSubDomains] = useState<SubDomain[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  interface SectorData {
    id: string;
    name?: string;
    name_ar?: string;
    description?: string;
  }
  
  const [sectors, setSectors] = useState<SectorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  interface SelectedItemData {
    id: string;
    name?: string;
    name_ar?: string;
    description?: string;
    type?: string;
    deputy_minister?: string;
    contact_email?: string;
    created_at?: string;
  }
  
  const [selectedItem, setSelectedItem] = useState<SelectedItemData | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();

  // States for dialogs and editing
  const [isDeputyDialogOpen, setIsDeputyDialogOpen] = useState(false);
  const [isDepartmentDialogOpen, setIsDepartmentDialogOpen] = useState(false);
  const [isDomainDialogOpen, setIsDomainDialogOpen] = useState(false);
  const [isSubDomainDialogOpen, setIsSubDomainDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);

  const [editingDeputy, setEditingDeputy] = useState<Deputy | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [editingSubDomain, setEditingSubDomain] = useState<SubDomain | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form states
  const [deputyForm, setDeputyForm] = useState({
    name: "", name_ar: "", deputy_minister: "", contact_email: "", sector_id: ""
  });
  const [departmentForm, setDepartmentForm] = useState({
    name: "", name_ar: "", department_head: "", budget_allocation: 0, deputy_id: ""
  });
  const [domainForm, setDomainForm] = useState({
    name: "", name_ar: "", domain_lead: "", specialization: "", department_id: ""
  });
  const [subDomainForm, setSubDomainForm] = useState({
    name: "", name_ar: "", technical_focus: "", domain_id: ""
  });
  const [serviceForm, setServiceForm] = useState({
    name: "", name_ar: "", service_type: "", citizen_facing: false, digital_maturity_score: 0, sub_domain_id: ""
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [deputiesRes, departmentsRes, domainsRes, subDomainsRes, servicesRes, sectorsRes] = await Promise.all([
        supabase.from("deputies").select("*").order("created_at", { ascending: false }),
        supabase.from("departments").select("*").order("created_at", { ascending: false }),
        supabase.from("domains").select("*").order("created_at", { ascending: false }),
        supabase.from("sub_domains").select("*").order("created_at", { ascending: false }),
        supabase.from("services").select("*").order("created_at", { ascending: false }),
        supabase.from("sectors").select("*").order("created_at", { ascending: false })
      ]);

      setDeputies(deputiesRes.data || []);
      setDepartments(departmentsRes.data || []);
      setDomains(domainsRes.data || []);
      setSubDomains(subDomainsRes.data || []);
      setServices(servicesRes.data || []);
      setSectors(sectorsRes.data || []);
    } catch (error) {
      logger.error("Error fetching data", error);
      toast({
        title: "Error",
        description: "Failed to fetch organizational data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeputySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDeputy) {
        await supabase.from("deputies").update(deputyForm).eq("id", editingDeputy.id);
        toast({ title: t('success'), description: t('deputyUpdated') });
      } else {
        await supabase.from("deputies").insert([deputyForm]);
        toast({ title: t('success'), description: t('deputyCreated') });
      }
      setIsDeputyDialogOpen(false);
      setEditingDeputy(null);
      setDeputyForm({ name: "", name_ar: "", deputy_minister: "", contact_email: "", sector_id: "" });
      fetchAllData();
    } catch (error) {
      toast({ title: t('error'), description: t('failedToSaveDeputy'), variant: "destructive" });
    }
  };

  const handleDepartmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await supabase.from("departments").update(departmentForm).eq("id", editingDepartment.id);
        toast({ title: "Success", description: "Department updated successfully" });
      } else {
        await supabase.from("departments").insert([departmentForm]);
        toast({ title: "Success", description: "Department created successfully" });
      }
      setIsDepartmentDialogOpen(false);
      setEditingDepartment(null);
      setDepartmentForm({ name: "", name_ar: "", department_head: "", budget_allocation: 0, deputy_id: "" });
      fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save department", variant: "destructive" });
    }
  };

  const handleDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDomain) {
        await supabase.from("domains").update(domainForm).eq("id", editingDomain.id);
        toast({ title: "Success", description: "Domain updated successfully" });
      } else {
        await supabase.from("domains").insert([domainForm]);
        toast({ title: "Success", description: "Domain created successfully" });
      }
      setIsDomainDialogOpen(false);
      setEditingDomain(null);
      setDomainForm({ name: "", name_ar: "", domain_lead: "", specialization: "", department_id: "" });
      fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save domain", variant: "destructive" });
    }
  };

  const handleSubDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSubDomain) {
        await supabase.from("sub_domains").update(subDomainForm).eq("id", editingSubDomain.id);
        toast({ title: "Success", description: "Sub-domain updated successfully" });
      } else {
        await supabase.from("sub_domains").insert([subDomainForm]);
        toast({ title: "Success", description: "Sub-domain created successfully" });
      }
      setIsSubDomainDialogOpen(false);
      setEditingSubDomain(null);
      setSubDomainForm({ name: "", name_ar: "", technical_focus: "", domain_id: "" });
      fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save sub-domain", variant: "destructive" });
    }
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await supabase.from("services").update(serviceForm).eq("id", editingService.id);
        toast({ title: "Success", description: "Service updated successfully" });
      } else {
        await supabase.from("services").insert([serviceForm]);
        toast({ title: "Success", description: "Service created successfully" });
      }
      setIsServiceDialogOpen(false);
      setEditingService(null);
      setServiceForm({ name: "", name_ar: "", service_type: "", citizen_facing: false, digital_maturity_score: 0, sub_domain_id: "" });
      fetchAllData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save service", variant: "destructive" });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('organizational_structure.title')}</h1>
        <p className="text-muted-foreground">{t('organizational_structure.description')}</p>
      </div>

      <Tabs defaultValue="deputies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="deputies">{t('organizational_structure.deputies')}</TabsTrigger>
          <TabsTrigger value="departments">{t('organizational_structure.departments')}</TabsTrigger>
          <TabsTrigger value="domains">{t('organizational_structure.domains')}</TabsTrigger>
          <TabsTrigger value="subdomains">{t('organizational_structure.sub_domains')}</TabsTrigger>
          <TabsTrigger value="services">{t('organizational_structure.services')}</TabsTrigger>
        </TabsList>

        <TabsContent value="deputies">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Deputies</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder={t('organizational_structure.search_deputies')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-64"
                  />
              </div>
              <Dialog open={isDeputyDialogOpen} onOpenChange={setIsDeputyDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingDeputy(null); setDeputyForm({ name: "", name_ar: "", deputy_minister: "", contact_email: "", sector_id: "" }); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('organizational_structure.add_deputy')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingDeputy ? t('editDeputy') : t('addNewDeputy')}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleDeputySubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Name (English)</Label>
                        <Input value={deputyForm.name} onChange={(e) => setDeputyForm({...deputyForm, name: e.target.value})} required />
                      </div>
                      <div>
                        <Label>Name (Arabic)</Label>
                        <Input value={deputyForm.name_ar} onChange={(e) => setDeputyForm({...deputyForm, name_ar: e.target.value})} />
                      </div>
                    </div>
                    <div>
                      <Label>Deputy Minister</Label>
                      <Input value={deputyForm.deputy_minister} onChange={(e) => setDeputyForm({...deputyForm, deputy_minister: e.target.value})} />
                    </div>
                    <div>
                      <Label>Contact Email</Label>
                      <Input type="email" value={deputyForm.contact_email} onChange={(e) => setDeputyForm({...deputyForm, contact_email: e.target.value})} />
                    </div>
                    <div>
                      <Label>Sector</Label>
                      <Select value={deputyForm.sector_id} onValueChange={(value) => setDeputyForm({...deputyForm, sector_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectSector')} />
                        </SelectTrigger>
                        <SelectContent>
                          {sectors.map((sector) => (
                            <SelectItem key={sector.id} value={sector.id}>{sector.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsDeputyDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">{editingDeputy ? "Update" : "Create"}</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="grid gap-4">
            {deputies
              .filter(deputy => 
                deputy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                deputy.name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                deputy.deputy_minister?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((deputy) => (
              <Card key={deputy.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader onClick={() => { setSelectedItem(deputy); setIsDetailDialogOpen(true); }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {deputy.name}
                        {deputy.name_ar && <span className="text-sm text-muted-foreground">({deputy.name_ar})</span>}
                      </CardTitle>
                      {deputy.deputy_minister && <CardDescription>{deputy.deputy_minister}</CardDescription>}
                    </div>
                    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="outline" size="sm" onClick={() => {
                        setSelectedItem(deputy);
                        setIsDetailDialogOpen(true);
                      }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingDeputy(deputy);
                        setDeputyForm({
                          name: deputy.name,
                          name_ar: deputy.name_ar || "",
                          deputy_minister: deputy.deputy_minister || "",
                          contact_email: deputy.contact_email || "",
                          sector_id: deputy.sector_id || ""
                        });
                        setIsDeputyDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {deputy.contact_email && (
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{deputy.contact_email}</span>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Departments</h2>
            <Dialog open={isDepartmentDialogOpen} onOpenChange={setIsDepartmentDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingDepartment(null); setDepartmentForm({ name: "", name_ar: "", department_head: "", budget_allocation: 0, deputy_id: "" }); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingDepartment ? t('organizational_structure.edit_department') : t('organizational_structure.add_new_department')}</DialogTitle>
                  </DialogHeader>
                <form onSubmit={handleDepartmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name (English)</Label>
                      <Input value={departmentForm.name} onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})} required />
                    </div>
                    <div>
                      <Label>Name (Arabic)</Label>
                      <Input value={departmentForm.name_ar} onChange={(e) => setDepartmentForm({...departmentForm, name_ar: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label>Department Head</Label>
                    <Input value={departmentForm.department_head} onChange={(e) => setDepartmentForm({...departmentForm, department_head: e.target.value})} />
                  </div>
                  <div>
                    <Label>Budget Allocation</Label>
                    <Input type="number" value={departmentForm.budget_allocation} onChange={(e) => setDepartmentForm({...departmentForm, budget_allocation: Number(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Deputy</Label>
                    <Select value={departmentForm.deputy_id} onValueChange={(value) => setDepartmentForm({...departmentForm, deputy_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select deputy" />
                      </SelectTrigger>
                      <SelectContent>
                        {deputies.map((deputy) => (
                          <SelectItem key={deputy.id} value={deputy.id}>{deputy.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDepartmentDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingDepartment ? "Update" : "Create"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {departments.map((department) => (
              <Card key={department.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5" />
                        {department.name}
                        {department.name_ar && <span className="text-sm text-muted-foreground">({department.name_ar})</span>}
                      </CardTitle>
                      {department.department_head && <CardDescription>Head: {department.department_head}</CardDescription>}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingDepartment(department);
                        setDepartmentForm({
                          name: department.name,
                          name_ar: department.name_ar || "",
                          department_head: department.department_head || "",
                          budget_allocation: department.budget_allocation || 0,
                          deputy_id: department.deputy_id || ""
                        });
                        setIsDepartmentDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    Budget: ${department.budget_allocation?.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="domains">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Domains</h2>
            <Dialog open={isDomainDialogOpen} onOpenChange={setIsDomainDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingDomain(null); setDomainForm({ name: "", name_ar: "", domain_lead: "", specialization: "", department_id: "" }); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingDomain ? "Edit Domain" : "Add New Domain"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleDomainSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name (English)</Label>
                      <Input value={domainForm.name} onChange={(e) => setDomainForm({...domainForm, name: e.target.value})} required />
                    </div>
                    <div>
                      <Label>Name (Arabic)</Label>
                      <Input value={domainForm.name_ar} onChange={(e) => setDomainForm({...domainForm, name_ar: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label>Domain Lead</Label>
                    <Input value={domainForm.domain_lead} onChange={(e) => setDomainForm({...domainForm, domain_lead: e.target.value})} />
                  </div>
                  <div>
                    <Label>Specialization</Label>
                    <Input value={domainForm.specialization} onChange={(e) => setDomainForm({...domainForm, specialization: e.target.value})} />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select value={domainForm.department_id} onValueChange={(value) => setDomainForm({...domainForm, department_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((department) => (
                          <SelectItem key={department.id} value={department.id}>{department.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsDomainDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingDomain ? "Update" : "Create"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {domains.map((domain) => (
              <Card key={domain.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        {domain.name}
                        {domain.name_ar && <span className="text-sm text-muted-foreground">({domain.name_ar})</span>}
                      </CardTitle>
                      {domain.specialization && <CardDescription>{domain.specialization}</CardDescription>}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingDomain(domain);
                        setDomainForm({
                          name: domain.name,
                          name_ar: domain.name_ar || "",
                          domain_lead: domain.domain_lead || "",
                          specialization: domain.specialization || "",
                          department_id: domain.department_id || ""
                        });
                        setIsDomainDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {domain.domain_lead && (
                  <CardContent>
                    <div className="text-sm">
                      Lead: {domain.domain_lead}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subdomains">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Sub-domains</h2>
            <Dialog open={isSubDomainDialogOpen} onOpenChange={setIsSubDomainDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingSubDomain(null); setSubDomainForm({ name: "", name_ar: "", technical_focus: "", domain_id: "" }); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sub-domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingSubDomain ? "Edit Sub-domain" : "Add New Sub-domain"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubDomainSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name (English)</Label>
                      <Input value={subDomainForm.name} onChange={(e) => setSubDomainForm({...subDomainForm, name: e.target.value})} required />
                    </div>
                    <div>
                      <Label>Name (Arabic)</Label>
                      <Input value={subDomainForm.name_ar} onChange={(e) => setSubDomainForm({...subDomainForm, name_ar: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label>Technical Focus</Label>
                    <Input value={subDomainForm.technical_focus} onChange={(e) => setSubDomainForm({...subDomainForm, technical_focus: e.target.value})} />
                  </div>
                  <div>
                    <Label>Domain</Label>
                    <Select value={subDomainForm.domain_id} onValueChange={(value) => setSubDomainForm({...subDomainForm, domain_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domains.map((domain) => (
                          <SelectItem key={domain.id} value={domain.id}>{domain.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsSubDomainDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingSubDomain ? "Update" : "Create"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {subDomains.map((subDomain) => (
              <Card key={subDomain.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        {subDomain.name}
                        {subDomain.name_ar && <span className="text-sm text-muted-foreground">({subDomain.name_ar})</span>}
                      </CardTitle>
                      {subDomain.technical_focus && <CardDescription>{subDomain.technical_focus}</CardDescription>}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingSubDomain(subDomain);
                        setSubDomainForm({
                          name: subDomain.name,
                          name_ar: subDomain.name_ar || "",
                          technical_focus: subDomain.technical_focus || "",
                          domain_id: subDomain.domain_id || ""
                        });
                        setIsSubDomainDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Services</h2>
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingService(null); setServiceForm({ name: "", name_ar: "", service_type: "", citizen_facing: false, digital_maturity_score: 0, sub_domain_id: "" }); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleServiceSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name (English)</Label>
                      <Input value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} required />
                    </div>
                    <div>
                      <Label>Name (Arabic)</Label>
                      <Input value={serviceForm.name_ar} onChange={(e) => setServiceForm({...serviceForm, name_ar: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label>Service Type</Label>
                    <Input value={serviceForm.service_type} onChange={(e) => setServiceForm({...serviceForm, service_type: e.target.value})} />
                  </div>
                  <div>
                    <Label>Citizen Facing</Label>
                    <Input type="checkbox" checked={serviceForm.citizen_facing} onChange={(e) => setServiceForm({...serviceForm, citizen_facing: e.target.checked})} />
                  </div>
                  <div>
                    <Label>Digital Maturity Score</Label>
                    <Input type="number" value={serviceForm.digital_maturity_score} onChange={(e) => setServiceForm({...serviceForm, digital_maturity_score: Number(e.target.value)})} />
                  </div>
                  <div>
                    <Label>Sub-domain</Label>
                    <Select value={serviceForm.sub_domain_id} onValueChange={(value) => setServiceForm({...serviceForm, sub_domain_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {subDomains.map((subDomain) => (
                          <SelectItem key={subDomain.id} value={subDomain.id}>{subDomain.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsServiceDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingService ? "Update" : "Create"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        {service.name}
                        {service.name_ar && <span className="text-sm text-muted-foreground">({service.name_ar})</span>}
                      </CardTitle>
                      {service.service_type && <CardDescription>{service.service_type}</CardDescription>}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        setEditingService(service);
                        setServiceForm({
                          name: service.name,
                          name_ar: service.name_ar || "",
                          service_type: service.service_type || "",
                          citizen_facing: service.citizen_facing || false,
                          digital_maturity_score: service.digital_maturity_score || 0,
                          sub_domain_id: service.sub_domain_id || ""
                        });
                        setIsServiceDialogOpen(true);
                      }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.name} Details
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name (English)</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
                </div>
                {selectedItem.name_ar && (
                  <div>
                    <Label className="text-sm font-medium">Name (Arabic)</Label>
                    <p className="text-sm text-muted-foreground">{selectedItem.name_ar}</p>
                  </div>
                )}
              </div>
              {selectedItem.deputy_minister && (
                <div>
                  <Label className="text-sm font-medium">Deputy Minister</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.deputy_minister}</p>
                </div>
              )}
              {selectedItem.contact_email && (
                <div>
                  <Label className="text-sm font-medium">Contact Email</Label>
                  <p className="text-sm text-muted-foreground">{selectedItem.contact_email}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedItem.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
