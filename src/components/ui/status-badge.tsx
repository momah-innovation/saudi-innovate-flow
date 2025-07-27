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
  active: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
  inactive: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Pause },
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
  completed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
  planning: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Clock },
  scheduled: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
  ongoing: { color: 'bg-green-100 text-green-800 border-green-200', icon: Play },
  postponed: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Pause },
  draft: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Clock },
  published: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
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