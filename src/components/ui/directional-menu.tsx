import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useDirection } from './direction-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuLabel,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from './context-menu';
import { Button } from './button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
  onClick?: () => void;
  disabled?: boolean;
  separator?: boolean;
  children?: MenuItem[];
  shortcut?: string;
}

interface DirectionalDropdownMenuProps {
  trigger?: ReactNode;
  items: MenuItem[];
  className?: string;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

interface DirectionalContextMenuProps {
  children: ReactNode;
  items: MenuItem[];
  className?: string;
}

export function DirectionalDropdownMenu({
  trigger,
  items,
  className,
  align = 'end',
  side = 'bottom',
}: DirectionalDropdownMenuProps) {
  const { isRTL } = useDirection();

  // Adjust alignment for RTL
  const adjustedAlign = isRTL ? 
    (align === 'start' ? 'end' : align === 'end' ? 'start' : align) : 
    align;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={adjustedAlign}
        side={side}
        className={cn('min-w-[200px]', className)}
      >
        {renderMenuItems(items, isRTL)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DirectionalContextMenu({
  children,
  items,
  className,
}: DirectionalContextMenuProps) {
  const { isRTL } = useDirection();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent 
        className={cn('min-w-[200px]', className)}
      >
        {renderContextMenuItems(items, isRTL)}
      </ContextMenuContent>
    </ContextMenu>
  );
}

function renderMenuItems(items: MenuItem[], isRTL: boolean) {
  return items.map((item, index) => {
    if (item.separator) {
      return <DropdownMenuSeparator key={`separator-${index}`} />;
    }

    if (item.children && item.children.length > 0) {
      return (
        <DropdownMenuSub key={item.id}>
          <DropdownMenuSubTrigger 
            className={cn('flex items-center', isRTL && 'flex-row-reverse')}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span className={cn(isRTL ? 'mr-2' : 'ml-2')}>{item.label}</span>
            {isRTL ? (
              <ChevronLeft className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {renderMenuItems(item.children, isRTL)}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      );
    }

    return (
      <DropdownMenuItem
        key={item.id}
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn('flex items-center', isRTL && 'flex-row-reverse')}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        <span className={cn(isRTL ? 'mr-2' : 'ml-2', 'flex-1')}>{item.label}</span>
        {item.shortcut && (
          <span className={cn(
            'text-xs text-muted-foreground',
            isRTL ? 'mr-auto' : 'ml-auto'
          )}>
            {item.shortcut}
          </span>
        )}
      </DropdownMenuItem>
    );
  });
}

function renderContextMenuItems(items: MenuItem[], isRTL: boolean) {
  return items.map((item, index) => {
    if (item.separator) {
      return <ContextMenuSeparator key={`separator-${index}`} />;
    }

    if (item.children && item.children.length > 0) {
      return (
        <ContextMenuSub key={item.id}>
          <ContextMenuSubTrigger 
            className={cn('flex items-center', isRTL && 'flex-row-reverse')}
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            <span className={cn(isRTL ? 'mr-2' : 'ml-2')}>{item.label}</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {renderContextMenuItems(item.children, isRTL)}
          </ContextMenuSubContent>
        </ContextMenuSub>
      );
    }

    return (
      <ContextMenuItem
        key={item.id}
        onClick={item.onClick}
        disabled={item.disabled}
        className={cn('flex items-center', isRTL && 'flex-row-reverse')}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        <span className={cn(isRTL ? 'mr-2' : 'ml-2', 'flex-1')}>{item.label}</span>
        {item.shortcut && (
          <span className={cn(
            'text-xs text-muted-foreground',
            isRTL ? 'mr-auto' : 'ml-auto'
          )}>
            {item.shortcut}
          </span>
        )}
      </ContextMenuItem>
    );
  });
}

// Pre-built menu components for common actions
export function ActionDropdownMenu({
  onEdit,
  onDelete,
  onView,
  onDuplicate,
  disabled = false,
  className,
}: {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  onDuplicate?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  const items: MenuItem[] = [
    ...(onView ? [{ id: 'view', label: 'View', onClick: onView }] : []),
    ...(onEdit ? [{ id: 'edit', label: 'Edit', onClick: onEdit }] : []),
    ...(onDuplicate ? [{ id: 'duplicate', label: 'Duplicate', onClick: onDuplicate }] : []),
    ...(onDelete ? [
      { id: 'separator', label: '', separator: true },
      { id: 'delete', label: 'Delete', onClick: onDelete }
    ] : []),
  ];

  return (
    <DirectionalDropdownMenu
      items={items}
      className={className}
      trigger={
        <Button variant="ghost" size="sm" disabled={disabled}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      }
    />
  );
}