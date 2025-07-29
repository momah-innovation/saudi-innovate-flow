import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ProfileCardAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: 'default' | 'destructive';
}

export interface ProfileCardMetric {
  label: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  type?: 'text' | 'badge' | 'progress' | 'badge-with-icon';
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  progressValue?: number;
}

export interface ProfileCardProps {
  id: string;
  name: string;
  subtitle: string;
  avatarUrl?: string;
  avatarFallback?: string;
  primaryMetrics?: ProfileCardMetric[];
  detailMetrics?: ProfileCardMetric[];
  actions?: ProfileCardAction[];
  onClick?: () => void;
  className?: string;
  clickable?: boolean;
  defaultExpanded?: boolean;
}

export function ProfileCard({
  id,
  name,
  subtitle,
  avatarUrl,
  avatarFallback,
  primaryMetrics = [],
  detailMetrics = [],
  actions = [],
  onClick,
  className,
  clickable = true,
  defaultExpanded = false,
}: ProfileCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleCardClick = () => {
    if (clickable && onClick) {
      onClick();
    } else if (clickable) {
      setIsExpanded(!isExpanded);
    }
  };

  const renderMetric = (metric: ProfileCardMetric, index: number) => {
    const { label, value, icon: Icon, type = 'text', variant = 'default', progressValue } = metric;

    switch (type) {
      case 'badge':
        return (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <Badge variant={variant as any} className="text-xs">
              {value}
            </Badge>
          </div>
        );
      
      case 'badge-with-icon':
        return (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm font-medium">{label}</span>
            <Badge variant={variant as any}>
              {Icon && <Icon className="h-3 w-3 mr-1" />}
              {value}
            </Badge>
          </div>
        );
      
      case 'progress':
        return (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <Progress value={progressValue || 0} className="h-2" />
          </div>
        );
      
      default:
        return (
          <div key={index} className="flex items-center justify-between text-sm">
            <span>{label}</span>
            <span className="flex items-center gap-1">
              {Icon && <Icon className="h-3 w-3" />}
              {value}
            </span>
          </div>
        );
    }
  };

  return (
    <Card 
      className={cn(
        "relative transition-all duration-200",
        clickable && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {avatarFallback || name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {name}
              </CardTitle>
              <CardDescription className="text-sm">
                {subtitle}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Expand/Collapse Button */}
            {detailMetrics.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
            
            {/* Actions Menu */}
            {actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                      <action.icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Primary Metrics - Always Visible */}
        {primaryMetrics.map(renderMetric)}
        
        {/* Detail Metrics - Collapsible */}
        {detailMetrics.length > 0 && (
          <Collapsible open={isExpanded}>
            <CollapsibleContent className="space-y-3">
              {detailMetrics.map(renderMetric)}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}