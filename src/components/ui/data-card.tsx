import { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface DataCardProps<T> {
  item: T;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  description?: string;
  image?: string;
  badges?: Array<{
    label: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
    color?: string;
  }>;
  metadata?: Array<{
    icon?: ReactNode;
    label: string;
    value: string | ReactNode;
  }>;
  actions?: ReactNode;
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  onClick?: () => void;
  className?: string;
  layout?: 'default' | 'compact' | 'media';
  children?: ReactNode;
}

export function DataCard<T>({
  item,
  title,
  subtitle,
  description,
  image,
  badges,
  metadata,
  actions,
  selected,
  onSelect,
  onClick,
  className,
  layout = 'default',
  children
}: DataCardProps<T>) {
  const isClickable = !!onClick;

  return (
    <Card 
      className={`
        transition-all duration-200 
        ${isClickable ? 'cursor-pointer hover:shadow-md hover:scale-[1.02]' : ''} 
        ${selected ? 'ring-2 ring-primary' : ''} 
        ${className || ''}
      `}
      onClick={onClick}
    >
      {layout === 'media' && image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={typeof title === 'string' ? `${title}` : 'media image'} 
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <CardHeader className={layout === 'compact' ? 'pb-2' : 'pb-3'}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {onSelect && (
              <Checkbox
                checked={selected}
                onCheckedChange={onSelect}
                onClick={(e) => e.stopPropagation()}
                className="mt-1"
              />
            )}
            
            {layout === 'default' && image && (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={image} 
                  alt={typeof title === 'string' ? `${title}` : 'card image'} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold leading-6 line-clamp-2">{title}</h3>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {subtitle}
                    </p>
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
              className="flex items-center gap-1 flex-shrink-0" 
              onClick={(e) => e.stopPropagation()}
            >
              {actions}
            </div>
          )}
        </div>
      </CardHeader>

      {(description || metadata || children) && (
        <CardContent className={layout === 'compact' ? 'pt-0 pb-3' : 'pt-0'}>
          {description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
              {description}
            </p>
          )}
          
          {metadata && metadata.length > 0 && (
            <div className={`grid gap-3 text-sm mb-3 ${
              layout === 'compact' 
                ? 'grid-cols-2' 
                : 'grid-cols-2 md:grid-cols-3'
            }`}>
              {metadata.map((item, index) => (
                <div key={index} className="flex items-center gap-2 min-w-0">
                  {item.icon && (
                    <span className="text-muted-foreground flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <div className="min-w-0">
                    <span className="text-muted-foreground text-xs">{item.label}:</span>
                    <div className="truncate">{item.value}</div>
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

// Predefined card layouts for common use cases
export const UserCard = ({ user, actions, onSelect, selected }: {
  user: any;
  actions?: ReactNode;
  onSelect?: (selected: boolean) => void;
  selected?: boolean;
}) => (
  <DataCard
    item={user}
    title={user.name || user.email}
    subtitle={user.position || user.role}
    image={user.avatar_url}
    badges={[
      { label: user.status, color: user.status === 'active' ? 'bg-active-light text-active' : 'bg-inactive-light text-inactive' }
    ]}
    metadata={[
      { label: 'Email', value: user.email },
      { label: 'Joined', value: user.created_at ? new Date(user.created_at).toLocaleDateString() : '' }
    ]}
    actions={actions}
    onSelect={onSelect}
    selected={selected}
  />
);

export const ProjectCard = ({ project, actions, onSelect, selected }: {
  project: any;
  actions?: ReactNode;
  onSelect?: (selected: boolean) => void;
  selected?: boolean;
}) => (
  <DataCard
    item={project}
    title={project.title || project.name}
    description={project.description}
    badges={[
      { label: project.status, color: `bg-${project.status === 'active' ? 'green' : 'gray'}-100 text-${project.status === 'active' ? 'green' : 'gray'}-800` }
    ]}
    metadata={[
      { label: 'Start', value: project.start_date ? new Date(project.start_date).toLocaleDateString() : '' },
      { label: 'End', value: project.end_date ? new Date(project.end_date).toLocaleDateString() : '' }
    ]}
    actions={actions}
    onSelect={onSelect}
    selected={selected}
  />
);