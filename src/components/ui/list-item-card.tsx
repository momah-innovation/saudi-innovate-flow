import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface ListItemCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    color?: string;
  }>;
  metadata?: Array<{
    icon?: ReactNode;
    label: string;
    value: string;
  }>;
  actions?: ReactNode;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export function ListItemCard({
  id,
  title,
  subtitle,
  description,
  badges,
  metadata,
  actions,
  selected,
  onSelect,
  onClick,
  children,
  className
}: ListItemCardProps) {
  return (
    <Card 
      className={`hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''} ${className || ''}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {onSelect && (
              <Checkbox
                id={`select-${id}`}
                checked={selected}
                onCheckedChange={onSelect}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-6">{title}</CardTitle>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
                  )}
                </div>
                {badges && badges.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {badges.map((badge, index) => (
                      <Badge 
                        key={index} 
                        variant={badge.variant || 'default'}
                        className={badge.color}
                      >
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {actions && (
            <div 
              className="flex items-center gap-1" 
              onClick={(e) => e.stopPropagation()}
            >
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      
      {(description || metadata || children) && (
        <CardContent className="pt-0">
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {description}
            </p>
          )}
          
          {metadata && metadata.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
              {metadata.map((item, index) => (
                <div key={index} className="flex items-center gap-2 min-w-0">
                  {item.icon && (
                    <span className="text-muted-foreground flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    <span className="text-muted-foreground">{item.label}:</span>
                    <span className="ml-1 truncate">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {children}
        </CardContent>
      )}
    </Card>
  );
}