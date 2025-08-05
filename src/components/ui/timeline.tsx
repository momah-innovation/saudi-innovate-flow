import React from 'react';
import { CheckCircle, Clock, AlertCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date: Date;
  status: 'completed' | 'active' | 'pending' | 'cancelled';
  icon?: React.ComponentType<{ className?: string }>;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, any>;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusConfig = {
  completed: {
    icon: CheckCircle,
    dotColor: 'bg-success border-success',
    lineColor: 'bg-success/30'
  },
  active: {
    icon: Clock,
    dotColor: 'bg-primary border-primary',
    lineColor: 'bg-primary/30'
  },
  pending: {
    icon: Circle,
    dotColor: 'bg-muted border-muted-foreground',
    lineColor: 'bg-muted'
  },
  cancelled: {
    icon: AlertCircle,
    dotColor: 'bg-destructive border-destructive',
    lineColor: 'bg-destructive/30'
  }
};

function TimelineItemComponent({ 
  item, 
  isLast 
}: { 
  item: TimelineItem; 
  isLast: boolean;
}) {
  const config = statusConfig[item.status];
  const Icon = item.icon || config.icon;

  return (
    <div className="relative flex gap-4 pb-8">
      {/* Timeline Line */}
      {!isLast && (
        <div className={cn(
          "absolute left-6 top-12 w-0.5 h-full -translate-x-1/2",
          config.lineColor
        )} />
      )}
      
      {/* Timeline Dot */}
      <div className={cn(
        "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2",
        config.dotColor
      )}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
            <p className="text-xs text-muted-foreground">
              {item.date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          <Badge variant={
            item.status === 'completed' ? 'default' :
            item.status === 'active' ? 'secondary' :
            item.status === 'cancelled' ? 'destructive' : 'outline'
          }>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
        
        {item.description && (
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {item.description}
          </p>
        )}
        
        {item.user && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {item.user.avatar ? (
              <img 
                src={item.user.avatar} 
                alt={item.user.name}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                {item.user.name.charAt(0)}
              </div>
            )}
            <span>by {item.user.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("space-y-0", className)}>
      {items.map((item, index) => (
        <TimelineItemComponent
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}

// Compact horizontal timeline for progress indication
interface HorizontalTimelineProps {
  steps: {
    id: string;
    title: string;
    status: 'completed' | 'active' | 'pending';
  }[];
  className?: string;
}

export function HorizontalTimeline({ steps, className }: HorizontalTimelineProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const config = statusConfig[step.status];
        
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium",
                config.dotColor,
                step.status === 'active' && "ring-2 ring-primary/20"
              )}>
                {step.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <span className="text-white">{index + 1}</span>
                )}
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium text-center",
                step.status === 'active' ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
            
            {!isLast && (
              <div className={cn(
                "flex-1 h-0.5 mx-4",
                step.status === 'completed' ? config.lineColor : "bg-muted"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}