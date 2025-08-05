import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, XCircle, Pause, Play } from "lucide-react";

export type StatusType = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' | 'planning' | 'scheduled' | 'ongoing' | 'postponed' | 'draft' | 'published';

interface StatusBadgeProps {
  status: StatusType;
  customLabel?: string;
  showIcon?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const statusConfig = {
  active: { color: 'bg-success-light text-success border-success-border', icon: CheckCircle },
  inactive: { color: 'bg-muted text-muted-foreground border-border', icon: Pause },
  pending: { color: 'bg-warning-light text-warning border-warning-border', icon: Clock },
  completed: { color: 'bg-complete-light text-complete border-complete-border', icon: CheckCircle },
  cancelled: { color: 'bg-destructive/10 text-destructive border-destructive/20', icon: XCircle },
  planning: { color: 'bg-secondary text-secondary-foreground border-border', icon: Clock },
  scheduled: { color: 'bg-scheduled-light text-scheduled border-scheduled-border', icon: Clock },
  ongoing: { color: 'bg-success-light text-success border-success-border', icon: Play },
  postponed: { color: 'bg-warning-light text-warning border-warning-border', icon: Pause },
  draft: { color: 'bg-muted text-muted-foreground border-border', icon: Clock },
  published: { color: 'bg-success-light text-success border-success-border', icon: CheckCircle },
};

export function StatusBadge({ status, customLabel, showIcon = true, size = 'default' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.inactive;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    default: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  return (
    <Badge className={`${config.color} ${sizeClasses[size]} flex items-center gap-1 border`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {customLabel || status.replace('_', ' ')}
    </Badge>
  );
}