import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Plus, Edit, Trash2, Users, BarChart3, MapPin, Phone, Mail } from 'lucide-react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AdminPageWrapper } from '@/components/ui';

interface Entity {
  id: string;
  name_ar: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  entity_type: string;
  sector_id: string;
  entity_manager_id?: string;
  status: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

interface Sector {
  id: string;
  name_ar: string;
  name_en?: string;
}

interface Manager {
  id: string;
  display_name?: string;
  email?: string;
}

export default function EntitiesManagement() {
  const { t, language } = useUnifiedTranslation();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [activeTab, setActiveTab] = useState('entities');

  // Form state
  const [formData, setFormData] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    entity_type: 'government',
    sector_id: '',
    entity_manager_id: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    website_url: '',
    status: 'active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadEntities(),
        loadSectors(),
        loadManagers()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('خطأ في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  const loadEntities = async () => {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setEntities(data || []);
  };

  const loadSectors = async () => {
    const { data, error } = await supabase
      .from('sectors')
      .select('id, name_ar')
      .order('name_ar');

    if (error) throw error;
    setSectors(data || []);
  };

  const loadManagers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email')
      .order('email');

    if (error) throw error;
    setManagers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEntity) {
        // Update existing entity
        const { error } = await supabase
          .from('entities')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingEntity.id);

        if (error) throw error;
        toast.success('تم تحديث الكيان بنجاح');
      } else {
        // Create new entity
        const { error } = await supabase
          .from('entities')
          .insert([formData]);

        if (error) throw error;
        toast.success('تم إنشاء الكيان بنجاح');
      }

      setIsDialogOpen(false);
      setEditingEntity(null);
      resetForm();
      loadEntities();
    } catch (error: any) {
      console.error('Error saving entity:', error);
      toast.error(error.message || 'خطأ في حفظ البيانات');
    }
  };

  const handleEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setFormData({
      name_ar: entity.name_ar,
      name_en: entity.name_en || '',
      description_ar: entity.description_ar || '',
      description_en: entity.description_en || '',
      entity_type: entity.entity_type,
      sector_id: entity.sector_id,
      entity_manager_id: entity.entity_manager_id || '',
      contact_email: entity.contact_email || '',
      contact_phone: entity.contact_phone || '',
      address: entity.address || '',
      website_url: entity.website_url || '',
      status: entity.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (entityId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكيان؟')) return;

    try {
      const { error } = await supabase
        .from('entities')
        .delete()
        .eq('id', entityId);

      if (error) throw error;
      toast.success('تم حذف الكيان بنجاح');
      loadEntities();
    } catch (error: any) {
      console.error('Error deleting entity:', error);
      toast.error(error.message || 'خطأ في حذف الكيان');
    }
  };

  const resetForm = () => {
    setFormData({
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      entity_type: 'government',
      sector_id: '',
      entity_manager_id: '',
      contact_email: '',
      contact_phone: '',
      address: '',
      website_url: '',
      status: 'active'
    });
  };

  const getEntityTypeLabel = (type: string) => {
    const types = {
      government: { ar: 'حكومي', en: 'Government' },
      semi_government: { ar: 'شبه حكومي', en: 'Semi-Government' },
      private: { ar: 'خاص', en: 'Private' },
      non_profit: { ar: 'غير ربحي', en: 'Non-Profit' }
    };
    return language === 'ar' ? types[type as keyof typeof types]?.ar : types[type as keyof typeof types]?.en;
  };

  const getStatusBadge = (status: string) => {
    const config = {
      active: { variant: 'default', text: language === 'ar' ? 'نشط' : 'Active' },
      inactive: { variant: 'secondary', text: language === 'ar' ? 'غير نشط' : 'Inactive' },
      suspended: { variant: 'destructive', text: language === 'ar' ? 'معلق' : 'Suspended' }
    };
    
    const statusConfig = config[status as keyof typeof config] || config.active;
    return <Badge variant={statusConfig.variant as any}>{statusConfig.text}</Badge>;
  };

  if (loading) {
    return (
      <AdminPageWrapper>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {language === 'ar' ? 'إدارة الكيانات' : 'Entities Management'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'ar' 
                ? 'إدارة الكيانات التنظيمية والمؤسسات في النظام'
                : 'Manage organizational entities and institutions in the system'
              }
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingEntity(null); }}>
                <Plus className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إضافة كيان' : 'Add Entity'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEntity 
                    ? (language === 'ar' ? 'تعديل الكيان' : 'Edit Entity')
                    : (language === 'ar' ? 'إضافة كيان جديد' : 'Add New Entity')
                  }
                </DialogTitle>
                <DialogDescription>
                  {language === 'ar' 
                    ? 'املأ المعلومات التالية لإنشاء أو تعديل كيان'
                    : 'Fill in the following information to create or edit an entity'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name_ar">{language === 'ar' ? 'الاسم بالعربية *' : 'Name in Arabic *'}</Label>
                    <Input
                      id="name_ar"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name_en">{language === 'ar' ? 'الاسم بالإنجليزية' : 'Name in English'}</Label>
                    <Input
                      id="name_en"
                      value={formData.name_en}
                      onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description_ar">{language === 'ar' ? 'الوصف بالعربية' : 'Description in Arabic'}</Label>
                  <Textarea
                    id="description_ar"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'نوع الكيان *' : 'Entity Type *'}</Label>
                    <Select value={formData.entity_type} onValueChange={(value: any) => setFormData({ ...formData, entity_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="government">{getEntityTypeLabel('government')}</SelectItem>
                        <SelectItem value="semi_government">{getEntityTypeLabel('semi_government')}</SelectItem>
                        <SelectItem value="private">{getEntityTypeLabel('private')}</SelectItem>
                        <SelectItem value="non_profit">{getEntityTypeLabel('non_profit')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'القطاع *' : 'Sector *'}</Label>
                    <Select value={formData.sector_id} onValueChange={(value) => setFormData({ ...formData, sector_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر القطاع' : 'Select Sector'} />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {language === 'ar' ? sector.name_ar : (sector.name_en || sector.name_ar)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'مدير الكيان' : 'Entity Manager'}</Label>
                    <Select value={formData.entity_manager_id} onValueChange={(value) => setFormData({ ...formData, entity_manager_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder={language === 'ar' ? 'اختر المدير' : 'Select Manager'} />
                      </SelectTrigger>
                      <SelectContent>
                        {managers.map((manager) => (
                          <SelectItem key={manager.id} value={manager.id}>
                            {manager.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'الحالة' : 'Status'}</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                        <SelectItem value="inactive">{language === 'ar' ? 'غير نشط' : 'Inactive'}</SelectItem>
                        <SelectItem value="suspended">{language === 'ar' ? 'معلق' : 'Suspended'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact_email">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                    <Input
                      id="contact_email"
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                    <Input
                      id="contact_phone"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{language === 'ar' ? 'العنوان' : 'Address'}</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website_url">{language === 'ar' ? 'الموقع الإلكتروني' : 'Website URL'}</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </Button>
                  <Button type="submit">
                    {editingEntity 
                      ? (language === 'ar' ? 'تحديث' : 'Update')
                      : (language === 'ar' ? 'إضافة' : 'Add')
                    }
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="entities">{language === 'ar' ? 'الكيانات' : 'Entities'}</TabsTrigger>
            <TabsTrigger value="analytics">{language === 'ar' ? 'التحليلات' : 'Analytics'}</TabsTrigger>
          </TabsList>

          <TabsContent value="entities" className="space-y-4">
            <div className="grid gap-4">
              {entities.map((entity) => (
                <Card key={entity.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{entity.name_ar}</CardTitle>
                          {entity.name_en && (
                            <CardDescription>{entity.name_en}</CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(entity.status)}
                        <Badge variant="outline">
                          {getEntityTypeLabel(entity.entity_type)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        {entity.description_ar && (
                          <p className="text-sm text-muted-foreground">{entity.description_ar}</p>
                        )}
                        {entity.contact_email && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="w-4 h-4" />
                            <span>{entity.contact_email}</span>
                          </div>
                        )}
                        {entity.contact_phone && (
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="w-4 h-4" />
                            <span>{entity.contact_phone}</span>
                          </div>
                        )}
                        {entity.address && (
                          <div className="flex items-center space-x-2 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{entity.address}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(entity)}>
                          <Edit className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(entity.id)}>
                          <Trash2 className="w-4 h-4 mr-1" />
                          {language === 'ar' ? 'حذف' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {entities.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Building className="w-12 h-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      {language === 'ar' ? 'لا توجد كيانات' : 'No Entities Found'}
                    </h3>
                    <p className="text-muted-foreground text-center">
                      {language === 'ar' 
                        ? 'ابدأ بإضافة كيان جديد للنظام'
                        : 'Start by adding a new entity to the system'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'ar' ? 'إجمالي الكيانات' : 'Total Entities'}
                  </CardTitle>
                  <Building className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entities.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'ar' ? 'الكيانات النشطة' : 'Active Entities'}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {entities.filter(e => e.status === 'active').length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'ar' ? 'القطاعات المغطاة' : 'Covered Sectors'}
                  </CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(entities.map(e => e.sector_id)).size}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminPageWrapper>
  );
}