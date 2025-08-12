import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { useOrganizationalHierarchy } from '@/hooks/useOrganizationalHierarchy';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface EntityFormProps {
  entityType: string;
  entityId?: string;
  onSubmit: () => void;
  onCancel: () => void;
}

export function EntityForm({ entityType, entityId, onSubmit, onCancel }: EntityFormProps) {
  const { isRTL, language } = useDirection();
  const { toast } = useToast();
  const { sectors, entities, deputies, departments, domains, subDomains } = useOrganizationalHierarchy();
  
  const [formData, setFormData] = useState({
    name: '',
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    sector_id: '',
    entity_id: '',
    deputy_id: '',
    department_id: '',
    domain_id: '',
    sub_domain_id: '',
    entity_type: '',
    entity_head: '',
    deputy_minister: '',
    department_head: '',
    domain_head: '',
    sub_domain_head: '',
    service_head: '',
    service_type: '',
    budget_allocation: '',
    is_active: true,
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entityId) {
      // Load existing entity data for editing
      loadEntityData(entityId);
    }
  }, [entityId]);

  const loadEntityData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from(getTableName(entityType))
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      logger.error('Failed to load entity data', { entityType, entityId }, error as Error);
      toast({
        title: 'Error',
        description: 'Failed to load entity data',
        variant: 'destructive'
      });
    }
  };

  const getTableName = (type: string) => {
    const tableMap = {
      sector: 'sectors',
      entity: 'entities',
      deputy: 'deputies',
      department: 'departments',
      domain: 'domains',
      sub_domain: 'sub_domains',
      service: 'services'
    };
    return tableMap[type as keyof typeof tableMap] || type;
  };

  const getParentOptions = () => {
    switch (entityType) {
      case 'entity':
        return sectors.map(s => ({ value: s.id, label: s.name }));
      case 'deputy':
        return entities.map(e => ({ value: e.id, label: e.name_ar }));
      case 'department':
        return deputies.map(d => ({ value: d.id, label: d.name }));
      case 'domain':
        return departments.map(d => ({ value: d.id, label: d.name }));
      case 'sub_domain':
        return domains.map(d => ({ value: d.id, label: d.name }));
      case 'service':
        return subDomains.map(sd => ({ value: sd.id, label: sd.name }));
      default:
        return [];
    }
  };

  const getParentFieldName = () => {
    const fieldMap = {
      entity: 'sector_id',
      deputy: 'entity_id',
      department: 'deputy_id',
      domain: 'department_id',
      sub_domain: 'domain_id',
      service: 'sub_domain_id'
    };
    return fieldMap[entityType as keyof typeof fieldMap];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = { ...formData };
      
      // Clean up data based on entity type
      if (entityType === 'sector') {
        delete submitData.entity_id;
        delete submitData.deputy_id;
        delete submitData.department_id;
        delete submitData.domain_id;
        delete submitData.sub_domain_id;
      }

      if (submitData.budget_allocation) {
        submitData.budget_allocation = parseFloat(submitData.budget_allocation as string);
      }

      const tableName = getTableName(entityType);
      
      if (entityId) {
        // Update existing
        const { error } = await supabase
          .from(tableName)
          .update(submitData)
          .eq('id', entityId);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم التحديث' : 'Updated',
          description: isRTL ? 'تم تحديث العنصر بنجاح' : 'Entity updated successfully'
        });
      } else {
        // Create new
        const { error } = await supabase
          .from(tableName)
          .insert(submitData);
        
        if (error) throw error;
        
        toast({
          title: isRTL ? 'تم الإنشاء' : 'Created',
          description: isRTL ? 'تم إنشاء العنصر بنجاح' : 'Entity created successfully'
        });
      }

      onSubmit();
    } catch (error) {
      logger.error('Failed to save entity', { entityType, formData }, error as Error);
      toast({
        title: 'Error',
        description: 'Failed to save entity',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const parentOptions = getParentOptions();
  const parentFieldName = getParentFieldName();

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name_ar">
            {isRTL ? 'الاسم (عربي)' : 'Name (Arabic)'}
          </Label>
          <Input
            id="name_ar"
            value={formData.name_ar}
            onChange={(e) => setFormData(prev => ({ ...prev, name_ar: e.target.value }))}
            placeholder={isRTL ? 'أدخل الاسم بالعربية' : 'Enter Arabic name'}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="name_en">
            {isRTL ? 'الاسم (إنجليزي)' : 'Name (English)'}
          </Label>
          <Input
            id="name_en"
            value={formData.name_en}
            onChange={(e) => setFormData(prev => ({ ...prev, name_en: e.target.value }))}
            placeholder={isRTL ? 'أدخل الاسم بالإنجليزية' : 'Enter English name'}
          />
        </div>
      </div>

      {/* For legacy fields */}
      {(entityType === 'deputy' || entityType === 'department' || entityType === 'domain' || entityType === 'sub_domain' || entityType === 'service') && (
        <div>
          <Label htmlFor="name">
            {isRTL ? 'الاسم' : 'Name'}
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder={isRTL ? 'أدخل الاسم' : 'Enter name'}
            required
          />
        </div>
      )}

      {/* Parent Selection */}
      {parentFieldName && parentOptions.length > 0 && (
        <div>
          <Label htmlFor={parentFieldName}>
            {isRTL ? 'العنصر الأب' : 'Parent Entity'}
          </Label>
          <Select
            value={formData[parentFieldName as keyof typeof formData] as string}
            onValueChange={(value) => setFormData(prev => ({ ...prev, [parentFieldName]: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder={isRTL ? 'اختر العنصر الأب' : 'Select parent entity'} />
            </SelectTrigger>
            <SelectContent>
              {parentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="description_ar">
            {isRTL ? 'الوصف (عربي)' : 'Description (Arabic)'}
          </Label>
          <Textarea
            id="description_ar"
            value={formData.description_ar}
            onChange={(e) => setFormData(prev => ({ ...prev, description_ar: e.target.value }))}
            placeholder={isRTL ? 'أدخل الوصف بالعربية' : 'Enter Arabic description'}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="description_en">
            {isRTL ? 'الوصف (إنجليزي)' : 'Description (English)'}
          </Label>
          <Textarea
            id="description_en"
            value={formData.description_en}
            onChange={(e) => setFormData(prev => ({ ...prev, description_en: e.target.value }))}
            placeholder={isRTL ? 'أدخل الوصف بالإنجليزية' : 'Enter English description'}
            rows={3}
          />
        </div>
      </div>

      {/* Entity-specific fields */}
      {entityType === 'entity' && (
        <div>
          <Label htmlFor="entity_type">
            {isRTL ? 'نوع الجهة' : 'Entity Type'}
          </Label>
          <Input
            id="entity_type"
            value={formData.entity_type}
            onChange={(e) => setFormData(prev => ({ ...prev, entity_type: e.target.value }))}
            placeholder={isRTL ? 'نوع الجهة' : 'Entity type'}
            required
          />
        </div>
      )}

      {entityType === 'service' && (
        <div>
          <Label htmlFor="service_type">
            {isRTL ? 'نوع الخدمة' : 'Service Type'}
          </Label>
          <Input
            id="service_type"
            value={formData.service_type}
            onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
            placeholder={isRTL ? 'نوع الخدمة' : 'Service type'}
          />
        </div>
      )}

      {/* Head/Manager fields */}
      {entityType === 'entity' && (
        <div>
          <Label htmlFor="entity_head">
            {isRTL ? 'رئيس الجهة' : 'Entity Head'}
          </Label>
          <Input
            id="entity_head"
            value={formData.entity_head}
            onChange={(e) => setFormData(prev => ({ ...prev, entity_head: e.target.value }))}
            placeholder={isRTL ? 'رئيس الجهة' : 'Entity head'}
          />
        </div>
      )}

      {entityType === 'deputy' && (
        <div>
          <Label htmlFor="deputy_minister">
            {isRTL ? 'نائب الوزير' : 'Deputy Minister'}
          </Label>
          <Input
            id="deputy_minister"
            value={formData.deputy_minister}
            onChange={(e) => setFormData(prev => ({ ...prev, deputy_minister: e.target.value }))}
            placeholder={isRTL ? 'نائب الوزير' : 'Deputy minister'}
          />
        </div>
      )}

      {entityType === 'department' && (
        <div>
          <Label htmlFor="department_head">
            {isRTL ? 'مدير الإدارة' : 'Department Head'}
          </Label>
          <Input
            id="department_head"
            value={formData.department_head}
            onChange={(e) => setFormData(prev => ({ ...prev, department_head: e.target.value }))}
            placeholder={isRTL ? 'مدير الإدارة' : 'Department head'}
          />
        </div>
      )}

      {entityType === 'domain' && (
        <div>
          <Label htmlFor="domain_head">
            {isRTL ? 'رئيس النطاق' : 'Domain Head'}
          </Label>
          <Input
            id="domain_head"
            value={formData.domain_head}
            onChange={(e) => setFormData(prev => ({ ...prev, domain_head: e.target.value }))}
            placeholder={isRTL ? 'رئيس النطاق' : 'Domain head'}
          />
        </div>
      )}

      {entityType === 'sub_domain' && (
        <div>
          <Label htmlFor="sub_domain_head">
            {isRTL ? 'رئيس النطاق الفرعي' : 'Sub Domain Head'}
          </Label>
          <Input
            id="sub_domain_head"
            value={formData.sub_domain_head}
            onChange={(e) => setFormData(prev => ({ ...prev, sub_domain_head: e.target.value }))}
            placeholder={isRTL ? 'رئيس النطاق الفرعي' : 'Sub domain head'}
          />
        </div>
      )}

      {entityType === 'service' && (
        <div>
          <Label htmlFor="service_head">
            {isRTL ? 'مسؤول الخدمة' : 'Service Head'}
          </Label>
          <Input
            id="service_head"
            value={formData.service_head}
            onChange={(e) => setFormData(prev => ({ ...prev, service_head: e.target.value }))}
            placeholder={isRTL ? 'مسؤول الخدمة' : 'Service head'}
          />
        </div>
      )}

      {/* Budget */}
      {(entityType === 'entity' || entityType === 'department') && (
        <div>
          <Label htmlFor="budget_allocation">
            {isRTL ? 'المخصص المالي' : 'Budget Allocation'}
          </Label>
          <Input
            id="budget_allocation"
            type="number"
            value={formData.budget_allocation}
            onChange={(e) => setFormData(prev => ({ ...prev, budget_allocation: e.target.value }))}
            placeholder={isRTL ? 'المخصص المالي' : 'Budget allocation'}
          />
        </div>
      )}

      {/* Active Status */}
      {entityType === 'entity' && (
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
          />
          <Label htmlFor="is_active">
            {isRTL ? 'نشط' : 'Active'}
          </Label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2 rtl:space-x-reverse pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {isRTL ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ' : 'Save')}
        </Button>
      </div>
    </form>
  );
}