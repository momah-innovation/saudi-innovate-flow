import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Target, CheckCircle, AlertTriangle, MoreVertical, Crown,
  Calendar, Users, Building, Briefcase, Clock, TrendingUp,
  Star, Award, MapPin, Mail, Phone, Globe
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CampaignReference, 
  ChallengeReference, 
  Event, 
  ProjectReference, 
  Stakeholder, 
  SystemPartner, 
  Expert, 
  TeamMemberExtended 
} from '@/types/common';

export interface CoreTeamMemberData {
  id: string;
  name?: string;
  name_ar?: string;
  email?: string;
  phone?: string;
  profile_image_url?: string;
  role?: string;
  cic_role?: string;
  department?: string;
  position?: string;
  specialization?: string | string[];
  bio?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  
  // Performance & Workload
  current_workload?: number;
  capacity?: number;
  efficiency_rating?: number;
  performance_score?: number;
  
  // Status & Availability
  status?: 'active' | 'inactive' | 'leave' | 'busy';
  availability_status?: 'available' | 'busy' | 'unavailable';
  
  // Assignments & Projects
  activeAssignments?: number;
  completedAssignments?: number;
  campaigns?: CampaignReference[];
  challenges?: ChallengeReference[];
  events?: Event[];
  projects?: ProjectReference[];
  
  // Relationships & Collaborations
  stakeholders?: Stakeholder[];
  partners?: SystemPartner[];
  experts?: Expert[];
  team_members?: TeamMemberExtended[];
  
  // Timeline & History
  join_date?: string;
  last_active?: string;
  created_at?: string;
  updated_at?: string;
  
  // Skills & Expertise
  skills?: string[];
  certifications?: string[];
  experience_years?: number;
  
  // Innovation Metrics
  ideas_submitted?: number;
  ideas_approved?: number;
  innovation_score?: number;
  collaboration_score?: number;
  
  [key: string]: any; // For additional custom fields
}

export interface CoreTeamCardAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
}

interface CoreTeamCardProps {
  data: CoreTeamMemberData;
  actions?: CoreTeamCardAction[];
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  showMetrics?: boolean;
  showStatus?: boolean;
  showWorkload?: boolean;
  showAssignments?: boolean;
  customFields?: Array<{
    label: string;
    value: string | ReactNode;
    icon?: ReactNode;
  }>;
  className?: string;
}

export function CoreTeamCard({
  data,
  actions = [],
  onClick,
  variant = 'default',
  showMetrics = true,
  showStatus = true,
  showWorkload = true,
  showAssignments = true,
  customFields = [],
  className = ""
}: CoreTeamCardProps) {
  const displayName = data.name || data.name_ar || 'مستخدم غير معروف';
  const displayEmail = data.email || 'غير محدد';
  const avatarFallback = displayName.charAt(0) || 'U';

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'busy': return 'destructive';
      case 'leave': return 'secondary';
      case 'inactive': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'busy': return <Clock className="h-3 w-3 mr-1" />;
      case 'leave': return <Calendar className="h-3 w-3 mr-1" />;
      case 'inactive': return <AlertTriangle className="h-3 w-3 mr-1" />;
      default: return <AlertTriangle className="h-3 w-3 mr-1" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'busy': return 'مشغول';
      case 'leave': return 'في إجازة';
      case 'inactive': return 'غير نشط';
      default: return 'غير محدد';
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const renderCompactView = () => (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={data.profile_image_url} />
          <AvatarFallback className="text-sm">{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium text-sm">{displayName}</h4>
          <p className="text-xs text-muted-foreground">{data.cic_role || data.role}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {showStatus && data.status && (
          <Badge variant={getStatusColor(data.status)} className="text-xs">
            {getStatusIcon(data.status)}
            {getStatusText(data.status)}
          </Badge>
        )}
        
        {showWorkload && data.current_workload !== undefined && (
          <div className="text-xs text-muted-foreground">
            {data.current_workload}%
          </div>
        )}
      </div>
    </div>
  );

  const renderDefaultView = () => (
    <>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12">
                <AvatarImage src={data.profile_image_url} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              {data.cic_role === 'leader' && (
                <Crown className="absolute -top-1 -right-1 h-4 w-4 text-warning" />
              )}
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {displayName}
                {data.performance_score && data.performance_score >= 90 && (
                  <Star className="h-4 w-4 text-warning" />
                )}
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
                    disabled={action.disabled}
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
        {/* Role and Department */}
        <div className="grid grid-cols-2 gap-3">
          {(data.cic_role || data.role) && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">الدور</span>
              <Badge variant="outline" className="text-xs">
                {data.cic_role || data.role}
              </Badge>
            </div>
          )}
          
          {data.department && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">القسم</span>
              <span className="text-xs text-muted-foreground">{data.department}</span>
            </div>
          )}
        </div>
        
        {/* Specialization */}
        {data.specialization && (
          <div className="space-y-1">
            <span className="text-sm font-medium">التخصص</span>
            <div className="flex flex-wrap gap-1">
              {Array.isArray(data.specialization) ? (
                data.specialization.slice(0, 2).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className="text-xs">
                  {data.specialization}
                </Badge>
              )}
              {Array.isArray(data.specialization) && data.specialization.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{data.specialization.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}
        
        {/* Workload Progress */}
        {showWorkload && data.current_workload !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                عبء العمل
              </span>
              <span className="font-medium">{data.current_workload}%</span>
            </div>
            <Progress 
              value={data.current_workload} 
              className="h-2"
              // Add color coding based on workload level
            />
          </div>
        )}
        
        {/* Performance Metrics */}
        {showMetrics && (
          <div className="grid grid-cols-2 gap-3">
            {showAssignments && data.activeAssignments !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  المهام
                </span>
                <span className="font-medium">{data.activeAssignments}</span>
              </div>
            )}
            
            {data.performance_score !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  الأداء
                </span>
                <span className="font-medium">{data.performance_score}%</span>
              </div>
            )}
          </div>
        )}
        
        {/* Innovation Metrics */}
        {(data.ideas_submitted !== undefined || data.innovation_score !== undefined) && (
          <div className="grid grid-cols-2 gap-3">
            {data.ideas_submitted !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  الأفكار
                </span>
                <span className="font-medium">{data.ideas_submitted}</span>
              </div>
            )}
            
            {data.innovation_score !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  الابتكار
                </span>
                <span className="font-medium">{data.innovation_score}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Custom Fields */}
        {customFields.map((field, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              {field.icon}
              {field.label}
            </span>
            <span>{field.value}</span>
          </div>
        ))}
        
        {/* Status */}
        {showStatus && data.status && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">الحالة</span>
            <Badge variant={getStatusColor(data.status)}>
              {getStatusIcon(data.status)}
              {getStatusText(data.status)}
            </Badge>
          </div>
        )}
      </CardContent>
    </>
  );

  if (variant === 'compact') {
    return (
      <Card 
        className={`relative transition-all duration-200 hover:shadow-md ${
          onClick ? 'cursor-pointer hover:bg-accent/50' : ''
        } ${className}`}
        onClick={handleCardClick}
      >
        {renderCompactView()}
      </Card>
    );
  }

  return (
    <Card 
      className={`relative transition-all duration-200 hover:shadow-md ${
        onClick ? 'cursor-pointer hover:bg-accent/50' : ''
      } ${className}`}
      onClick={handleCardClick}
    >
      {renderDefaultView()}
    </Card>
  );
}