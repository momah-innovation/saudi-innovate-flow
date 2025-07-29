import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Target, CheckCircle, AlertTriangle, MoreVertical 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface ProfileCardData {
  id: string;
  name?: string;
  name_ar?: string;
  email?: string;
  profile_image_url?: string;
  role?: string;
  department?: string;
  position?: string;
  specialization?: string | string[];
  current_workload?: number;
  status?: 'active' | 'inactive';
  activeAssignments?: number;
  [key: string]: any; // For additional custom fields
}

export interface ProfileCardAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

interface ProfileCardProps {
  data: ProfileCardData;
  actions?: ProfileCardAction[];
  onClick?: () => void;
  showWorkload?: boolean;
  showAssignments?: boolean;
  showDepartment?: boolean;
  showStatus?: boolean;
  customFields?: Array<{
    label: string;
    value: string | ReactNode;
    icon?: ReactNode;
  }>;
  className?: string;
}

export function ProfileCard({
  data,
  actions = [],
  onClick,
  showWorkload = true,
  showAssignments = true,
  showDepartment = true,
  showStatus = true,
  customFields = [],
  className = ""
}: ProfileCardProps) {
  const displayName = data.name || data.name_ar || 'مستخدم غير معروف';
  const displayEmail = data.email || 'غير محدد';
  const avatarFallback = displayName.charAt(0) || 'U';

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className={`relative transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:bg-accent/50' : ''
      } ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={data.profile_image_url} />
              <AvatarFallback>
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {displayName}
              </CardTitle>
              <CardDescription className="text-sm">
                {displayEmail}
              </CardDescription>
              {data.position && (
                <CardDescription className="text-xs text-muted-foreground">
                  {data.position}
                </CardDescription>
              )}
            </div>
          </div>
          
          {actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map((action, index) => (
                  <DropdownMenuItem 
                    key={index}
                    className={action.variant === 'destructive' ? 'text-destructive' : ''}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {data.role && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">الدور</span>
            <Badge variant="outline">{data.role}</Badge>
          </div>
        )}
        
        {data.specialization && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">التخصص</span>
            <Badge variant="secondary" className="text-xs">
              {Array.isArray(data.specialization) 
                ? data.specialization.join(', ') 
                : data.specialization}
            </Badge>
          </div>
        )}
        
        {showWorkload && data.current_workload !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>عبء العمل الحالي</span>
              <span>{data.current_workload}%</span>
            </div>
            <Progress value={data.current_workload} className="h-2" />
          </div>
        )}
        
        {showAssignments && data.activeAssignments !== undefined && (
          <div className="flex items-center justify-between text-sm">
            <span>المهام النشطة</span>
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              {data.activeAssignments}
            </span>
          </div>
        )}
        
        {showDepartment && data.department && (
          <div className="flex items-center justify-between text-sm">
            <span>القسم</span>
            <span>{data.department}</span>
          </div>
        )}

        {customFields.map((field, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              {field.icon}
              {field.label}
            </span>
            <span>{field.value}</span>
          </div>
        ))}
        
        {showStatus && data.status && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">الحالة</span>
            <Badge variant={data.status === 'active' ? 'default' : 'secondary'}>
              {data.status === 'active' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                <AlertTriangle className="h-3 w-3 mr-1" />
              )}
              {data.status === 'active' ? 'نشط' : 'غير نشط'}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}