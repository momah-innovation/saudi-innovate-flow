import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrganizationalHierarchy } from '@/hooks/useOrganizationalHierarchy';
import { useDirection } from '@/components/ui/direction-provider';
import { Building, Users, MapPin, Briefcase, Globe, Settings } from 'lucide-react';

export function OrganizationalStructureManagement() {
  const { isRTL } = useDirection();
  const [activeTab, setActiveTab] = useState('hierarchy');
  
  const {
    sectors,
    entities,
    deputies,
    departments,
    domains,
    subDomains,
    services,
    loading
  } = useOrganizationalHierarchy();

  const entityTypes = [
    { value: 'sector', label: isRTL ? 'قطاع' : 'Sector', icon: Globe },
    { value: 'entity', label: isRTL ? 'جهة' : 'Entity', icon: Building },
    { value: 'deputy', label: isRTL ? 'نائب' : 'Deputy', icon: Users },
    { value: 'department', label: isRTL ? 'إدارة' : 'Department', icon: Briefcase },
    { value: 'domain', label: isRTL ? 'نطاق' : 'Domain', icon: MapPin },
    { value: 'sub_domain', label: isRTL ? 'نطاق فرعي' : 'Sub Domain', icon: MapPin },
    { value: 'service', label: isRTL ? 'خدمة' : 'Service', icon: Settings }
  ];

  const getEntityCounts = () => ({
    sectors: sectors.length,
    entities: entities.length,
    deputies: deputies.length,
    departments: departments.length,
    domains: domains.length,
    subDomains: subDomains.length,
    services: services.length
  });

  const counts = getEntityCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {isRTL ? 'جاري تحميل الهيكل التنظيمي...' : 'Loading organizational structure...'}
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
          const count = counts[type.value as keyof typeof counts] || 0;
          
          return (
            <Card key={type.value} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-muted-foreground">{type.label}</p>
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
          <TabsTrigger value="hierarchy">
            {isRTL ? 'الهيكل الهرمي' : 'Hierarchy'}
          </TabsTrigger>
          <TabsTrigger value="entities">
            {isRTL ? 'إدارة العناصر' : 'Manage Entities'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {isRTL ? 'التحليلات' : 'Analytics'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'الهيكل التنظيمي الهرمي' : 'Organizational Hierarchy'}</CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'عرض الهيكل التنظيمي في شكل شجرة هرمية' 
                  : 'View the organizational structure in a hierarchical tree format'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {isRTL ? 'مكونات الهيكل التنظيمي قيد التطوير' : 'Organizational structure components under development'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{isRTL ? 'إدارة العناصر التنظيمية' : 'Manage Organizational Entities'}</CardTitle>
              <CardDescription>
                {isRTL 
                  ? 'إضافة وتحرير وحذف العناصر التنظيمية' 
                  : 'Add, edit, and delete organizational entities'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {isRTL ? 'نماذج إدارة العناصر قيد التطوير' : 'Entity management forms under development'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isRTL ? 'إجمالي العناصر' : 'Total Entities'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.values(counts).reduce((a, b) => a + b, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? 'عبر جميع المستويات' : 'Across all levels'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isRTL ? 'أعمق مستوى' : 'Deepest Level'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7</div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? 'مستويات في الهيكل' : 'Levels in structure'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isRTL ? 'معدل التكليفات' : 'Assignment Rate'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">
                  {isRTL ? 'العناصر المكلفة' : 'Entities assigned'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}