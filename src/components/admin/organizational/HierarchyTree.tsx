import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Building, Users, MapPin, Briefcase, Globe, Settings } from 'lucide-react';
import { useDirection } from '@/components/ui/direction-provider';
import type { 
  SystemSector, 
  Entity, 
  Deputy, 
  Department, 
  Domain, 
  SubDomain, 
  Service 
} from '@/types/organization';

interface HierarchyTreeProps {
  sectors: SystemSector[];
  entities: Entity[];
  deputies: Deputy[];
  departments: Department[];
  domains: Domain[];
  subDomains: SubDomain[];
  services: Service[];
}

interface TreeNodeProps {
  id: string;
  name: string;
  nameAr?: string;
  type: 'sector' | 'entity' | 'deputy' | 'department' | 'domain' | 'sub_domain' | 'service';
  children?: TreeNodeProps[];
  level: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

function TreeNode({ id, name, nameAr, type, children = [], level, isExpanded = false, onToggle }: TreeNodeProps) {
  const { isRTL, language } = useDirection();
  const [expanded, setExpanded] = useState(isExpanded);

  const handleToggle = () => {
    setExpanded(!expanded);
    onToggle?.();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'sector': return Globe;
      case 'entity': return Building;
      case 'deputy': return Users;
      case 'department': return Briefcase;
      case 'domain': return MapPin;
      case 'sub_domain': return MapPin;
      case 'service': return Settings;
      default: return Building;
    }
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

  const Icon = getIcon(type);
  const displayName = (isRTL && language === 'ar' && nameAr) ? nameAr : name;
  const hasChildren = children.length > 0;

  return (
    <div className="w-full">
      <Card className={`mb-2 ${level > 0 ? 'ml-6 rtl:ml-0 rtl:mr-6' : ''}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleToggle}
                >
                  {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              {!hasChildren && <div className="w-6" />}
              
              <Icon className={`h-5 w-5 ${getTypeColor(type)}`} />
              
              <div>
                <div className="font-medium">{displayName}</div>
                {nameAr && !isRTL && (
                  <div className="text-sm text-muted-foreground">{nameAr}</div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(type)}
              </Badge>
              {hasChildren && (
                <Badge variant="secondary" className="text-xs">
                  {children.length} {isRTL ? 'عنصر' : 'items'}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {expanded && hasChildren && (
        <div className="space-y-2">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              {...child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getTypeColor(type: string) {
  const colors = {
    sector: 'text-blue-600',
    entity: 'text-green-600',
    deputy: 'text-purple-600',
    department: 'text-orange-600',
    domain: 'text-teal-600',
    sub_domain: 'text-indigo-600',
    service: 'text-pink-600'
  };
  return colors[type as keyof typeof colors] || 'text-gray-600';
}

export function HierarchyTree({ 
  sectors, 
  entities, 
  deputies, 
  departments, 
  domains, 
  subDomains, 
  services 
}: HierarchyTreeProps) {
  const { isRTL } = useDirection();

  const buildHierarchy = (): TreeNodeProps[] => {
    const sectorNodes: TreeNodeProps[] = sectors.map(sector => {
      const sectorEntities = entities.filter(entity => entity.sector_id === sector.id);
      
      const entityNodes: TreeNodeProps[] = sectorEntities.map(entity => {
        const entityDeputies = deputies.filter(deputy => deputy.entity_id === entity.id);
        
        const deputyNodes: TreeNodeProps[] = entityDeputies.map(deputy => {
          const deputyDepartments = departments.filter(dept => dept.deputy_id === deputy.id);
          
          const departmentNodes: TreeNodeProps[] = deputyDepartments.map(department => {
            const deptDomains = domains.filter(domain => domain.department_id === department.id);
            
            const domainNodes: TreeNodeProps[] = deptDomains.map(domain => {
              const domainSubDomains = subDomains.filter(subDomain => subDomain.domain_id === domain.id);
              
              const subDomainNodes: TreeNodeProps[] = domainSubDomains.map(subDomain => {
                const subDomainServices = services.filter(service => service.sub_domain_id === subDomain.id);
                
                const serviceNodes: TreeNodeProps[] = subDomainServices.map(service => ({
                  id: service.id,
                  name: service.name,
                  nameAr: service.name_ar,
                  type: 'service',
                  level: 6,
                  children: []
                }));
                
                return {
                  id: subDomain.id,
                  name: subDomain.name,
                  nameAr: subDomain.name_ar,
                  type: 'sub_domain' as const,
                  level: 5,
                  children: serviceNodes
                };
              });
              
              return {
                id: domain.id,
                name: domain.name,
                nameAr: domain.name_ar,
                type: 'domain' as const,
                level: 4,
                children: subDomainNodes
              };
            });
            
            return {
              id: department.id,
              name: department.name,
              nameAr: department.name_ar,
              type: 'department' as const,
              level: 3,
              children: domainNodes
            };
          });
          
          return {
            id: deputy.id,
            name: deputy.name,
            nameAr: deputy.name_ar,
            type: 'deputy' as const,
            level: 2,
            children: departmentNodes
          };
        });
        
        return {
          id: entity.id,
          name: entity.name_ar,
          nameAr: entity.name_en,
          type: 'entity' as const,
          level: 1,
          children: deputyNodes
        };
      });
      
      return {
        id: sector.id,
        name: sector.name,
        nameAr: sector.name_ar,
        type: 'sector' as const,
        level: 0,
        children: entityNodes
      };
    });
    
    return sectorNodes;
  };

  const hierarchyData = buildHierarchy();

  if (hierarchyData.length === 0) {
    return (
      <div className="text-center py-8">
        <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">
          {isRTL ? 'لا توجد بيانات في الهيكل التنظيمي' : 'No organizational structure data available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hierarchyData.map((node) => (
        <TreeNode key={node.id} {...node} />
      ))}
    </div>
  );
}