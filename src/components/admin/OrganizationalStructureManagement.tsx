import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOrganizationalHierarchy } from '@/hooks/useOrganizationalHierarchy';
import { formatDate, formatDateArabic } from '@/utils/unified-date-handler';
import { useDirection } from '@/components/ui/direction-provider';
import { useToast } from '@/hooks/use-toast';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Building, Users, MapPin, Briefcase, Globe, Settings, Plus, Edit, Search } from 'lucide-react';

export function OrganizationalStructureManagement() {
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const { t } = useUnifiedTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const {
    sectors,
    entities,
    deputies,
    departments,
    domains,
    subDomains,
    services,
    loading,
    refetch
  } = useOrganizationalHierarchy();

  const entityTypes = [
    { value: 'sector', label: t('admin:organizational_structure.entity_types.sector'), icon: Globe, count: sectors.length },
    { value: 'entity', label: t('admin:organizational_structure.entity_types.entity'), icon: Building, count: entities.length },
    { value: 'deputy', label: t('admin:organizational_structure.entity_types.deputy'), icon: Users, count: deputies.length },
    { value: 'department', label: t('admin:organizational_structure.entity_types.department'), icon: Briefcase, count: departments.length },
    { value: 'domain', label: t('admin:organizational_structure.entity_types.domain'), icon: MapPin, count: domains.length },
    { value: 'sub_domain', label: t('admin:organizational_structure.entity_types.sub_domain'), icon: MapPin, count: subDomains.length },
    { value: 'service', label: t('admin:organizational_structure.entity_types.service'), icon: Settings, count: services.length }
  ];

  const getAllEntities = () => {
    const allEntities = [
      ...sectors.map(s => ({ ...s, type: 'sector', displayName: s.name_ar || t('common.unnamed_sector', 'Unnamed Sector'), parent: null })),
      ...entities.map(e => ({ ...e, type: 'entity', displayName: e.name_ar, parent: sectors.find(s => s.id === e.sector_id)?.name_ar })),
      ...deputies.map(d => ({ ...d, type: 'deputy', displayName: d.name, parent: entities.find(e => e.id === d.entity_id)?.name_ar })),
      ...departments.map(d => ({ ...d, type: 'department', displayName: d.name, parent: deputies.find(dep => dep.id === d.deputy_id)?.name })),
      ...domains.map(d => ({ ...d, type: 'domain', displayName: d.name, parent: departments.find(dept => dept.id === d.department_id)?.name })),
      ...subDomains.map(sd => ({ ...sd, type: 'sub_domain', displayName: sd.name, parent: domains.find(d => d.id === sd.domain_id)?.name })),
      ...services.map(s => ({ ...s, type: 'service', displayName: s.name, parent: subDomains.find(sd => sd.id === s.sub_domain_id)?.name }))
    ];

    return allEntities.filter(entity => {
      const matchesSearch = entity.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || entity.type === filterType;
      return matchesSearch && matchesFilter;
    });
  };

  const filteredEntities = getAllEntities();
  const totalEntities = Object.values(entityTypes).reduce((sum, type) => sum + type.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {t('admin:organizational_structure.loading')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {entityTypes.map((type) => {
          const Icon = type.icon;
          
          return (
            <Card key={type.value} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setFilterType(type.value)}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-2xl font-bold">{type.count}</p>
                    <p className="text-xs text-muted-foreground truncate">{type.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">
            {t('admin.organizational_structure.overview')}
          </TabsTrigger>
          <TabsTrigger value="list">
            {t('admin.organizational_structure.entity_list')}
          </TabsTrigger>
          <TabsTrigger value="hierarchy">
            {t('admin.organizational_structure.hierarchy')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t('admin.organizational_structure.total_entities')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalEntities}</div>
                <p className="text-sm text-muted-foreground">
                  {t('admin.organizational_structure.across_all_levels')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t('admin:organizational_structure.organizational_levels')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">7</div>
                <p className="text-sm text-muted-foreground">
                  {t('admin:organizational_structure.levels_in_structure')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {t('admin:organizational_structure.active_sectors')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{sectors.length}</div>
                <p className="text-sm text-muted-foreground">
                  {t('admin:organizational_structure.government_sectors')}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="relative flex-1">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('admin:organizational_structure.search_entities')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rtl:pl-3 rtl:pr-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin:organizational_structure.all_types')}</SelectItem>
                {entityTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('admin.organizational_structure.add_entity')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {t('admin.organizational_structure.add_new_entity')}
                  </DialogTitle>
                  <DialogDescription>
                    {t('admin.organizational_structure.feature_under_development')}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          {/* Entity Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {t('admin:organizational_structure.organizational_entities')}
              </CardTitle>
              <CardDescription>
                {filteredEntities.length} {t('admin:organizational_structure.entities_found')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin:organizational_structure.name')}</TableHead>
                    <TableHead>{t('admin:organizational_structure.type')}</TableHead>
                    <TableHead>{t('admin:organizational_structure.parent')}</TableHead>
                    <TableHead>{t('admin:organizational_structure.created')}</TableHead>
                    <TableHead>{t('admin:organizational_structure.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntities.map((entity) => (
                    <TableRow key={`${entity.type}-${entity.id}`}>
                      <TableCell className="font-medium">
                        {entity.displayName}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {entityTypes.find(t => t.value === entity.type)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {entity.parent || t('admin:organizational_structure.none')}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {isRTL ? formatDateArabic(entity.created_at) : formatDate(entity.created_at)}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredEntities.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {t('admin:organizational_structure.no_results_found')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin:organizational_structure.hierarchical_tree')}</CardTitle>
              <CardDescription>
                {t('admin:organizational_structure.tree_format_description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectors.map((sector) => (
                  <div key={sector.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 font-semibold text-blue-600">
                      <Globe className="h-5 w-5" />
                      {sector.name_ar || t('common.unnamed_sector', 'Unnamed Sector')}
                    </div>
                    
                    {entities.filter(e => e.sector_id === sector.id).map((entity) => (
                      <div key={entity.id} className="ml-6 mt-3 border-l-2 border-gray-200 pl-4">
                        <div className="flex items-center gap-2 font-medium text-green-600">
                          <Building className="h-4 w-4" />
                          {entity.name_ar}
                        </div>
                        
                        {deputies.filter(d => d.entity_id === entity.id).map((deputy) => (
                          <div key={deputy.id} className="ml-6 mt-2 border-l-2 border-gray-100 pl-4">
                            <div className="flex items-center gap-2 text-purple-600">
                              <Users className="h-4 w-4" />
                              {deputy.name}
                            </div>
                            
                            <div className="ml-6 mt-1 text-sm text-muted-foreground">
                              {departments.filter(d => d.deputy_id === deputy.id).length > 0 && (
                                <span>{departments.filter(d => d.deputy_id === deputy.id).length} {t('admin:organizational_structure.departments')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
                
                {sectors.length === 0 && (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t('admin:organizational_structure.no_data_available')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
