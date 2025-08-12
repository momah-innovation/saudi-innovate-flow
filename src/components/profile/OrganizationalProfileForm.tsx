import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationalHierarchy } from '@/hooks/useOrganizationalHierarchy';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { Building, MapPin, Briefcase, Globe, Settings } from 'lucide-react';

interface OrganizationalProfileFormProps {
  userProfile: any;
  isEditing: boolean;
  onSave: () => Promise<void>;
}

export function OrganizationalProfileForm({ userProfile, isEditing, onSave }: OrganizationalProfileFormProps) {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const {
    sectors,
    entities,
    deputies,
    departments,
    domains,
    subDomains,
    services,
    loading: hierarchyLoading
  } = useOrganizationalHierarchy();

  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    sector: '',
    
    // New organizational structure fields
    sector_id: '',
    entity_id: '',
    deputy_id: '',
    department_id: '',
    domain_id: '',
    sub_domain_id: '',
    service_id: '',
    
    // Additional fields
    bio: '',
    organization: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
        position: userProfile.position || '',
        department: userProfile.department || '',
        sector: userProfile.sector || '',
        sector_id: userProfile.sector_id || '',
        entity_id: userProfile.entity_id || '',
        deputy_id: userProfile.deputy_id || '',
        department_id: userProfile.department_id || '',
        domain_id: userProfile.domain_id || '',
        sub_domain_id: userProfile.sub_domain_id || '',
        service_id: userProfile.service_id || '',
        bio: userProfile.bio || '',
        organization: userProfile.organization || '',
      });
    }
  }, [userProfile]);

  // Filter functions for hierarchical dropdowns
  const getFilteredEntities = () => {
    return formData.sector_id 
      ? entities.filter(e => e.sector_id === formData.sector_id)
      : entities;
  };

  const getFilteredDeputies = () => {
    return formData.entity_id 
      ? deputies.filter(d => d.entity_id === formData.entity_id)
      : deputies;
  };

  const getFilteredDepartments = () => {
    return formData.deputy_id 
      ? departments.filter(d => d.deputy_id === formData.deputy_id)
      : departments;
  };

  const getFilteredDomains = () => {
    return formData.department_id 
      ? domains.filter(d => d.department_id === formData.department_id)
      : domains;
  };

  const getFilteredSubDomains = () => {
    return formData.domain_id 
      ? subDomains.filter(sd => sd.domain_id === formData.domain_id)
      : subDomains;
  };

  const getFilteredServices = () => {
    return formData.sub_domain_id 
      ? services.filter(s => s.sub_domain_id === formData.sub_domain_id)
      : services;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Clear dependent fields when parent changes
      if (field === 'sector_id') {
        newData.entity_id = '';
        newData.deputy_id = '';
        newData.department_id = '';
        newData.domain_id = '';
        newData.sub_domain_id = '';
        newData.service_id = '';
      } else if (field === 'entity_id') {
        newData.deputy_id = '';
        newData.department_id = '';
        newData.domain_id = '';
        newData.sub_domain_id = '';
        newData.service_id = '';
      } else if (field === 'deputy_id') {
        newData.department_id = '';
        newData.domain_id = '';
        newData.sub_domain_id = '';
        newData.service_id = '';
      } else if (field === 'department_id') {
        newData.domain_id = '';
        newData.sub_domain_id = '';
        newData.service_id = '';
      } else if (field === 'domain_id') {
        newData.sub_domain_id = '';
        newData.service_id = '';
      } else if (field === 'sub_domain_id') {
        newData.service_id = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          position: formData.position,
          department: formData.department,
          sector: formData.sector,
          sector_id: formData.sector_id || null,
          entity_id: formData.entity_id || null,
          deputy_id: formData.deputy_id || null,
          department_id: formData.department_id || null,
          domain_id: formData.domain_id || null,
          sub_domain_id: formData.sub_domain_id || null,
          service_id: formData.service_id || null,
          bio: formData.bio,
          organization: formData.organization,
          updated_at: new Date().toISOString()
        })
        .eq('id', userProfile?.id);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم التحديث' : 'Updated',
        description: isRTL ? 'تم تحديث البيانات التنظيمية بنجاح' : 'Organizational data updated successfully'
      });

      await onSave();
    } catch (error) {
      logger.error('Failed to update organizational profile', { userId: userProfile?.id }, error as Error);
      toast({
        title: 'Error',
        description: 'Failed to update organizational data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            {isRTL ? 'المعلومات الأساسية' : 'Basic Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">{isRTL ? 'الاسم' : 'Name'}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={isRTL ? 'أدخل الاسم' : 'Enter name'}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">{isRTL ? 'رقم الهاتف' : 'Phone'}</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={isRTL ? 'أدخل رقم الهاتف' : 'Enter phone number'}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">{isRTL ? 'المنصب' : 'Position'}</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                placeholder={isRTL ? 'أدخل المنصب' : 'Enter position'}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="organization">{isRTL ? 'المؤسسة' : 'Organization'}</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder={isRTL ? 'أدخل المؤسسة' : 'Enter organization'}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">{isRTL ? 'نبذة مختصرة' : 'Bio'}</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder={isRTL ? 'أدخل نبذة مختصرة' : 'Enter bio'}
              rows={3}
              disabled={!isEditing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Organizational Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {isRTL ? 'الهيكل التنظيمي' : 'Organizational Structure'}
          </CardTitle>
          <CardDescription>
            {isRTL 
              ? 'اختر موقعك في الهيكل التنظيمي الجديد' 
              : 'Select your position in the new organizational structure'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sector */}
            <div>
              <Label htmlFor="sector_id" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {isRTL ? 'القطاع' : 'Sector'}
              </Label>
              <Select value={formData.sector_id} onValueChange={(value) => handleInputChange('sector_id', value)} disabled={!isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر القطاع' : 'Select sector'} />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.id} value={sector.id}>
                      {sector.name_ar || sector.name_en || 'Unnamed Sector'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Entity */}
            <div>
              <Label htmlFor="entity_id" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                {isRTL ? 'الجهة' : 'Entity'}
              </Label>
              <Select 
                value={formData.entity_id} 
                onValueChange={(value) => handleInputChange('entity_id', value)}
                disabled={!formData.sector_id || !isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر الجهة' : 'Select entity'} />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredEntities().map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      {entity.name_ar || entity.name_en || 'Unnamed Entity'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deputy */}
            <div>
              <Label htmlFor="deputy_id" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {isRTL ? 'الوكالة/النائب' : 'Deputy'}
              </Label>
              <Select 
                value={formData.deputy_id} 
                onValueChange={(value) => handleInputChange('deputy_id', value)}
                disabled={!formData.entity_id || !isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر الوكالة' : 'Select deputy'} />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredDeputies().map((deputy) => (
                    <SelectItem key={deputy.id} value={deputy.id}>
                      {deputy.name_ar || deputy.name || 'Unnamed Deputy'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Department */}
            <div>
              <Label htmlFor="department_id" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {isRTL ? 'الإدارة' : 'Department'}
              </Label>
              <Select 
                value={formData.department_id} 
                onValueChange={(value) => handleInputChange('department_id', value)}
                disabled={!formData.deputy_id || !isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر الإدارة' : 'Select department'} />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredDepartments().map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name_ar || dept.name || 'Unnamed Department'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Domain */}
            <div>
              <Label htmlFor="domain_id" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {isRTL ? 'النطاق' : 'Domain'}
              </Label>
              <Select 
                value={formData.domain_id} 
                onValueChange={(value) => handleInputChange('domain_id', value)}
                disabled={!formData.department_id || !isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر النطاق' : 'Select domain'} />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredDomains().map((domain) => (
                    <SelectItem key={domain.id} value={domain.id}>
                      {domain.name_ar || domain.name || 'Unnamed Domain'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Domain */}
            <div>
              <Label htmlFor="sub_domain_id" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {isRTL ? 'النطاق الفرعي' : 'Sub Domain'}
              </Label>
              <Select 
                value={formData.sub_domain_id} 
                onValueChange={(value) => handleInputChange('sub_domain_id', value)}
                disabled={!formData.domain_id || !isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر النطاق الفرعي' : 'Select sub domain'} />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredSubDomains().map((subDomain) => (
                    <SelectItem key={subDomain.id} value={subDomain.id}>
                      {subDomain.name_ar || subDomain.name || 'Unnamed Sub Domain'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Service */}
            <div>
              <Label htmlFor="service_id" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {isRTL ? 'الخدمة' : 'Service'}
              </Label>
              <Select 
                value={formData.service_id} 
                onValueChange={(value) => handleInputChange('service_id', value)}
                disabled={!formData.sub_domain_id || !isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isRTL ? 'اختر الخدمة' : 'Select service'} />
                </SelectTrigger>
                <SelectContent>
                  {getFilteredServices().map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name_ar || service.name || 'Unnamed Service'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legacy Fields */}
      <Card>
        <CardHeader>
          <CardTitle>{isRTL ? 'البيانات القديمة' : 'Legacy Data'}</CardTitle>
          <CardDescription>
            {isRTL 
              ? 'البيانات النصية القديمة (سيتم استبدالها بالهيكل الجديد)' 
              : 'Legacy text-based data (will be replaced by new structure)'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="department">{isRTL ? 'الإدارة (نص)' : 'Department (Text)'}</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                placeholder={isRTL ? 'الإدارة الحالية' : 'Current department'}
                disabled={!isEditing}
              />
            </div>
            
            <div>
              <Label htmlFor="sector">{isRTL ? 'القطاع (نص)' : 'Sector (Text)'}</Label>
              <Input
                id="sector"
                value={formData.sector}
                onChange={(e) => handleInputChange('sector', e.target.value)}
                placeholder={isRTL ? 'القطاع الحالي' : 'Current sector'}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || hierarchyLoading} className="min-w-[120px]">
          {loading ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ التغييرات' : 'Save Changes')}
        </Button>
      </div>
    </form>
  );
}