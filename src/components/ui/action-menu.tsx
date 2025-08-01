import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, Trash2, Copy, Download, Share } from "lucide-react";
import { useTranslation } from "@/hooks/useAppTranslation";

export interface ActionItem {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  separator?: boolean;
}

interface ActionMenuProps {
  actions: ActionItem[];
  trigger?: ReactNode;
  size?: 'sm' | 'default' | 'lg';
}

export function ActionMenu({ actions, trigger, size = 'sm' }: ActionMenuProps) {
  const defaultTrigger = (
    <Button variant="ghost" size={size} className="h-8 w-8 p-0">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.map((action, index) => (
          <div key={action.id}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={action.onClick}
              className={action.variant === 'destructive' ? 'text-destructive focus:text-destructive' : ''}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Common action sets for reuse
export const getViewEditDeleteActions = (
  onView: () => void,
  onEdit: () => void,
  onDelete: () => void
): ActionItem[] => {
  const { t } = useTranslation();
  
  return [
    {
      id: 'view',
      label: t('viewDetails'),
      icon: <Eye className="w-4 h-4" />,
      onClick: onView
    },
    {
      id: 'edit',
      label: t('edit'),
      icon: <Edit className="w-4 h-4" />,
      onClick: onEdit
    },
    {
      id: 'delete',
      label: t('delete'),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      variant: 'destructive',
      separator: true
    }
  ];
};

export const getExtendedActions = (
  onView: () => void,
  onEdit: () => void,
  onDelete: () => void,
  onDuplicate?: () => void,
  onDownload?: () => void,
  onShare?: () => void
): ActionItem[] => {
  const { t } = useTranslation();
  
  return [
    {
      id: 'view',
      label: t('viewDetails'),
      icon: <Eye className="w-4 h-4" />,
      onClick: onView
    },
    {
      id: 'edit',
      label: t('edit'),
      icon: <Edit className="w-4 h-4" />,
      onClick: onEdit
    },
    ...(onDuplicate ? [{
      id: 'duplicate',
      label: t('duplicate'),
      icon: <Copy className="w-4 h-4" />,
      onClick: onDuplicate,
      separator: true
    }] : []),
    ...(onDownload ? [{
      id: 'download',
      label: t('download'),
      icon: <Download className="w-4 h-4" />,
      onClick: onDownload
    }] : []),
    ...(onShare ? [{
      id: 'share',
      label: t('share'),
      icon: <Share className="w-4 h-4" />,
      onClick: onShare
    }] : []),
    {
      id: 'delete',
      label: t('delete'),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      variant: 'destructive',
      separator: true
    }
  ];
};