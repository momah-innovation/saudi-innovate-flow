import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Settings } from "lucide-react";

interface BadgeConfig {
  label: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

interface MetadataItem {
  icon?: ReactNode;
  label: string;
  value: string;
}

interface ActionConfig {
  type: 'view' | 'edit' | 'delete' | 'settings' | 'custom';
  label?: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showInList?: boolean;
}

interface ManagementCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badges?: BadgeConfig[];
  metadata?: MetadataItem[];
  actions: ActionConfig[];
  onClick?: () => void;
  className?: string;
  viewMode?: 'cards' | 'list' | 'grid';
}

const defaultIcons = {
  view: <Eye className="h-4 w-4" />,
  edit: <Edit className="h-4 w-4" />,
  delete: <Trash2 className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />
};

export function ManagementCard({
  id,
  title,
  subtitle,
  description,
  badges = [],
  metadata = [],
  actions,
  onClick,
  className = "",
  viewMode = 'cards'
}: ManagementCardProps) {
  
  const renderActions = (compact = false) => {
    if (compact) {
      // Compact view for list mode - only icons
      return (
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          {actions.map((action, index) => {
            const icon = action.icon || defaultIcons[action.type as keyof typeof defaultIcons];
            return (
              <Button
                key={index}
                variant={action.variant || 'outline'}
                size="sm"
                onClick={action.onClick}
                className={`h-8 w-8 p-0 ${action.className || ''} ${
                  action.type === 'delete' ? 'text-destructive hover:text-destructive' : ''
                }`}
              >
                {icon}
              </Button>
            );
          })}
        </div>
      );
    }

    // Full view for cards/grid mode - now icon-only for consistency
    return (
      <div className="flex gap-2">
        {actions.map((action, index) => {
          const icon = action.icon || defaultIcons[action.type as keyof typeof defaultIcons];
          
          return (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              className={`h-8 w-8 p-0 ${action.className || ''} ${
                action.type === 'delete' ? 'text-destructive hover:text-destructive hover:bg-destructive/10' : ''
              }`}
              title={action.label || action.type}
            >
              {icon}
            </Button>
          );
        })}
      </div>
    );
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <Card 
        className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg truncate">{title}</h3>
                {badges.slice(0, 2).map((badge, index) => (
                  <Badge 
                    key={index} 
                    variant={badge.variant || 'outline'}
                    className={`text-xs ${badge.className || ''}`}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
              
              {subtitle && (
                <p className="text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
              )}
              
              {metadata.length > 0 && (
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {metadata.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                      {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {renderActions(true)}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Cards/Grid view layout
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className} ${
        viewMode === 'grid' ? 'min-w-0 w-full' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className={viewMode === 'grid' ? 'p-3 pb-2' : 'pb-3'}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className={viewMode === 'grid' ? 'text-sm leading-4 font-medium' : 'text-lg leading-6'}>{title}</CardTitle>
            {subtitle && viewMode !== 'grid' && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
            
            {badges.length > 0 && (
              <div className={`flex gap-1 flex-wrap ${viewMode === 'grid' ? 'mt-1' : 'mt-2'}`}>
                {(viewMode === 'grid' ? badges.slice(0, 2) : badges).map((badge, index) => (
                  <Badge 
                    key={index} 
                    variant={badge.variant || 'outline'}
                    className={`${badge.className} ${viewMode === 'grid' ? 'text-xs px-1.5 py-0.5' : ''}`}
                  >
                    {badge.label}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={viewMode === 'grid' ? 'p-3 pt-0' : 'pt-0'}>
        {description && viewMode !== 'grid' && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}
        
        {metadata.length > 0 && (
          <div className={`${viewMode === 'grid' ? 'space-y-1' : 'space-y-2'} text-sm mb-4`}>
            {(viewMode === 'grid' ? metadata.slice(0, 2) : metadata).map((item, index) => (
              <div key={index} className="flex items-start gap-2 min-w-0">
                {item.icon && (
                  <span className={`text-muted-foreground flex-shrink-0 ${viewMode === 'grid' ? 'mt-0' : 'mt-0.5'}`}>
                    {item.icon}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <span className={`text-muted-foreground ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}`}>{item.label}:</span>
                  <span className={`text-foreground break-words ml-1 ${viewMode === 'grid' ? 'text-xs' : 'text-sm'}`}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div onClick={(e) => e.stopPropagation()}>
          {renderActions()}
        </div>
      </CardContent>
    </Card>
  );
}