import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';
import { Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { EntityForm } from './EntityForm';
import type { 
  SystemSector, 
  Entity, 
  Deputy, 
  Department, 
  Domain, 
  SubDomain, 
  Service 
} from '@/types/organization';

interface EntityListProps {
  sectors: SystemSector[];
  entities: Entity[];
  deputies: Deputy[];
  departments: Department[];
  domains: Domain[];
  subDomains: SubDomain[];
  services: Service[];
  onRefresh: () => void;
}

export function EntityList({ 
  sectors, 
  entities, 
  deputies, 
  departments, 
  domains, 
  subDomains, 
  services, 
  onRefresh 
}: EntityListProps) {
  const { isRTL, language } = useDirection();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingEntity, setEditingEntity] = useState<{ type: string; id: string } | null>(null);
  const [deletingEntity, setDeletingEntity] = useState<{ type: string; id: string; name: string } | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const getAllEntities = () => {
    const allEntities = [
      ...sectors.map(s => ({ ...s, type: 'sector', displayName: s.name })),
      ...entities.map(e => ({ ...e, type: 'entity', displayName: e.name_ar })),
      ...deputies.map(d => ({ ...d, type: 'deputy', displayName: d.name })),
      ...departments.map(d => ({ ...d, type: 'department', displayName: d.name })),
      ...domains.map(d => ({ ...d, type: 'domain', displayName: d.name })),
      ...subDomains.map(sd => ({ ...sd, type: 'sub_domain', displayName: sd.name })),
      ...services.map(s => ({ ...s, type: 'service', displayName: s.name }))
    ];

    return allEntities.filter(entity => {
      const matchesSearch = entity.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entity.name_ar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entity.name_en?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || entity.type === filterType;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredEntities = getAllEntities();

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

  const getTypeLabel = (type: string) => {
    const labels = {
      sector: isRTL ? 'قطاع' : 'Sector',
      entity: isRTL ? 'جهة' : 'Entity',
      deputy: isRTL ? 'نائب' : 'Deputy',
      department: isRTL ? 'إدارة' : 'Department',
      domain: isRTL ? 'نطاق' : 'Domain',
      sub_domain: isRTL ? 'نطاق فرعي' : 'Sub Domain',
      service: isRTL ? 'خدمة' : 'Service'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getParentInfo = (entity: any) => {
    switch (entity.type) {
      case 'entity':
        const sector = sectors.find(s => s.id === entity.sector_id);
        return sector ? `${isRTL ? 'قطاع:' : 'Sector:'} ${sector.name}` : '';
      case 'deputy':
        const parentEntity = entities.find(e => e.id === entity.entity_id);
        return parentEntity ? `${isRTL ? 'جهة:' : 'Entity:'} ${parentEntity.name_ar}` : '';
      case 'department':
        const deputy = deputies.find(d => d.id === entity.deputy_id);
        return deputy ? `${isRTL ? 'نائب:' : 'Deputy:'} ${deputy.name}` : '';
      case 'domain':
        const department = departments.find(d => d.id === entity.department_id);
        return department ? `${isRTL ? 'إدارة:' : 'Department:'} ${department.name}` : '';
      case 'sub_domain':
        const domain = domains.find(d => d.id === entity.domain_id);
        return domain ? `${isRTL ? 'نطاق:' : 'Domain:'} ${domain.name}` : '';
      case 'service':
        const subDomain = subDomains.find(sd => sd.id === entity.sub_domain_id);
        return subDomain ? `${isRTL ? 'نطاق فرعي:' : 'Sub Domain:'} ${subDomain.name}` : '';
      default:
        return '';
    }
  };

  const handleEdit = (entity: any) => {
    setEditingEntity({ type: entity.type, id: entity.id });
    setShowEditDialog(true);
  };

  const handleDelete = (entity: any) => {
    setDeletingEntity({ type: entity.type, id: entity.id, name: entity.displayName });
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingEntity) return;

    try {
      const tableName = getTableName(deletingEntity.type);
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', deletingEntity.id);

      if (error) throw error;

      toast({
        title: isRTL ? 'تم الحذف' : 'Deleted',
        description: isRTL ? 'تم حذف العنصر بنجاح' : 'Entity deleted successfully'
      });

      onRefresh();
    } catch (error) {
      logger.error('Failed to delete entity', { entity: deletingEntity }, error as Error);
      toast({
        title: 'Error',
        description: 'Failed to delete entity',
        variant: 'destructive'
      });
    } finally {
      setShowDeleteDialog(false);
      setDeletingEntity(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <div className="relative flex-1">
          <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isRTL ? 'البحث في العناصر...' : 'Search entities...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rtl:pl-3 rtl:pr-10"
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
            <SelectItem value="sector">{isRTL ? 'قطاع' : 'Sector'}</SelectItem>
            <SelectItem value="entity">{isRTL ? 'جهة' : 'Entity'}</SelectItem>
            <SelectItem value="deputy">{isRTL ? 'نائب' : 'Deputy'}</SelectItem>
            <SelectItem value="department">{isRTL ? 'إدارة' : 'Department'}</SelectItem>
            <SelectItem value="domain">{isRTL ? 'نطاق' : 'Domain'}</SelectItem>
            <SelectItem value="sub_domain">{isRTL ? 'نطاق فرعي' : 'Sub Domain'}</SelectItem>
            <SelectItem value="service">{isRTL ? 'خدمة' : 'Service'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {isRTL 
          ? `${filteredEntities.length} عنصر موجود`
          : `${filteredEntities.length} entities found`
        }
      </div>

      {/* Entity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntities.map((entity) => (
          <Card key={`${entity.type}-${entity.id}`} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-base">{entity.displayName}</CardTitle>
                  {entity.name_ar && entity.name_en && (
                    <CardDescription className="text-sm">
                      {isRTL ? entity.name_en : entity.name_ar}
                    </CardDescription>
                  )}
                </div>
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(entity.type)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-2">
                {getParentInfo(entity) && (
                  <p className="text-xs text-muted-foreground">
                    {getParentInfo(entity)}
                  </p>
                )}
                
                {entity.description_ar && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isRTL ? entity.description_ar : entity.description_en || entity.description_ar}
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex space-x-1 rtl:space-x-reverse">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(entity)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(entity)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {(entity.is_active === false) && (
                    <Badge variant="secondary" className="text-xs">
                      {isRTL ? 'غير نشط' : 'Inactive'}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {isRTL ? 'لم يتم العثور على نتائج' : 'No results found'}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isRTL ? 'تحرير العنصر' : 'Edit Entity'}
            </DialogTitle>
            <DialogDescription>
              {isRTL ? 'تحديث معلومات العنصر التنظيمي' : 'Update organizational entity information'}
            </DialogDescription>
          </DialogHeader>
          
          {editingEntity && (
            <EntityForm
              entityType={editingEntity.type}
              entityId={editingEntity.id}
              onSubmit={() => {
                setShowEditDialog(false);
                setEditingEntity(null);
                onRefresh();
              }}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingEntity(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isRTL ? 'تأكيد الحذف' : 'Confirm Delete'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isRTL 
                ? `هل أنت متأكد من حذف "${deletingEntity?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Are you sure you want to delete "${deletingEntity?.name}"? This action cannot be undone.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {isRTL ? 'إلغاء' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isRTL ? 'حذف' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}