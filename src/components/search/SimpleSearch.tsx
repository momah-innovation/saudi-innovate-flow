import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDirection } from '@/components/ui/direction-provider';
import { cn } from '@/lib/utils';

interface SimpleSearchProps {
  placeholder?: string;
  className?: string;
}

export function SimpleSearch({ placeholder, className }: SimpleSearchProps) {
  const [query, setQuery] = useState('');
  const { isRTL } = useDirection();

  const clearSearch = () => {
    setQuery('');
  };

  return (
    <div className={cn("relative flex-1 max-w-md", className)}>
      <div className="relative">
        <Search className={cn(
          "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4",
          isRTL ? "right-3" : "left-3"
        )} />
        <Input
          placeholder={placeholder || (isRTL ? 'البحث في النظام...' : 'Search system...')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            console.log('Search query:', e.target.value); // Debug log
          }}
          className={cn(
            "bg-background/10 border-background/20 text-primary-foreground placeholder:text-primary-foreground/60",
            isRTL ? "pr-10 pl-8 text-right" : "pl-10 pr-8"
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground",
              isRTL ? "left-2" : "right-2"
            )}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      {/* Debug info */}
      {query && (
        <div className="absolute top-full mt-1 p-2 bg-background border rounded shadow text-sm">
          Search for: {query}
        </div>
      )}
    </div>
  );
}