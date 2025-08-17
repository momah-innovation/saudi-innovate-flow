import React from 'react';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface WorkspaceBreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface WorkspaceBreadcrumbProps {
  items: WorkspaceBreadcrumbItem[];
  className?: string;
}

export function WorkspaceBreadcrumb({
  items,
  className
}: WorkspaceBreadcrumbProps) {
  const { isRTL } = useUnifiedTranslation();

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center space-x-1 text-sm", className)}
    >
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight 
                className={cn(
                  "h-4 w-4 text-muted-foreground mx-1",
                  isRTL && "rotate-180"
                )} 
              />
            )}
            
            {item.current ? (
              <span 
                className="font-medium text-foreground"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {index === 0 && (
                  <Home className="h-4 w-4 inline mr-1" />
                )}
                {item.label}
              </Link>
            ) : (
              <span className="text-muted-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}