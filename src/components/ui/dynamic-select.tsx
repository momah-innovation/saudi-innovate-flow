import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { 
  DepartmentReference, 
  DeputyReference, 
  SectorReference, 
  CampaignReference, 
  ChallengeReference, 
  TeamMemberExtended 
} from '@/types/common';

export interface DynamicSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

interface DynamicSelectProps {
  options: DynamicSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  isRTL?: boolean;
  disabled?: boolean;
  className?: string;
  showBadges?: boolean;
  showSublabels?: boolean;
  enableSearch?: boolean;
  maxDisplayOptions?: number;
}

export function DynamicSelect({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  isRTL,
  disabled = false,
  className = "",
  showBadges = true,
  showSublabels = true,
  enableSearch = true,
  maxDisplayOptions = 100
}: DynamicSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { t, isRTL: isRTLFromHook } = useUnifiedTranslation();
  
  // Use isRTL from hook if not explicitly provided
  const effectiveIsRTL = isRTL !== undefined ? isRTL : isRTLFromHook;
  
  // Use default placeholders from translations if not provided
  const effectivePlaceholder = placeholder || t('ui:select.placeholder');
  const effectiveSearchPlaceholder = searchPlaceholder || t('ui:select.search_placeholder');

  const selectedOption = options.find(option => option.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (option.sublabel && option.sublabel.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, maxDisplayOptions);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          effectiveIsRTL ? "text-right" : "text-left"
        )}
      >
        <span className="block truncate">
          {selectedOption ? selectedOption.label : effectivePlaceholder}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
          {/* Search Input */}
          {enableSearch && (
            <div className="px-3 py-2 border-b">
              <input
                ref={searchRef}
                type="text"
                placeholder={effectiveSearchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-ring",
                  effectiveIsRTL ? "text-right" : "text-left"
                )}
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                {t('common:no_results')}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center px-3 py-2 text-sm outline-none",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus:bg-accent focus:text-accent-foreground",
                    option.value === value && "bg-accent text-accent-foreground",
                    effectiveIsRTL ? "text-right" : "text-left"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="block truncate font-medium">
                        {option.label}
                      </span>
                      {showBadges && option.badge && (
                        <Badge 
                          variant={option.badgeVariant || 'default'} 
                          className="text-xs ml-2"
                        >
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    {showSublabels && option.sublabel && (
                      <span className="block truncate text-xs text-muted-foreground mt-0.5">
                        {option.sublabel}
                      </span>
                    )}
                  </div>
                  {option.value === value && (
                    <Check className="h-4 w-4 ml-2 flex-shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Utility functions to transform data for the DynamicSelect component

export const transformDepartments = (departments: DepartmentReference[], isRTL: boolean, t: (key: string) => string): DynamicSelectOption[] => {
  return departments.map(dept => ({
    value: dept.id,
    label: isRTL ? (dept.name_ar || dept.name) : dept.name,
    sublabel: dept.department_head,
    badge: t('common:badges.department')
  }));
};

export const transformDeputies = (deputies: DeputyReference[], isRTL: boolean, t: (key: string) => string): DynamicSelectOption[] => {
  return deputies.map(deputy => ({
    value: deputy.id,
    label: isRTL ? (deputy.name_ar || deputy.name) : deputy.name,
    sublabel: deputy.deputy_minister,
    badge: t('common:badges.deputy')
  }));
};

export const transformSectors = (sectors: SectorReference[], isRTL: boolean, t: (key: string) => string): DynamicSelectOption[] => {
  return sectors.map(sector => ({
    value: sector.id,
    label: isRTL ? (sector.name_ar || sector.name) : sector.name,
    badge: t('common:badges.sector')
  }));
};

export const transformCampaigns = (campaigns: CampaignReference[], isRTL: boolean): DynamicSelectOption[] => {
  return campaigns.map(campaign => ({
    value: campaign.id,
    label: campaign.title_ar,
    badge: campaign.status,
    badgeVariant: campaign.status === 'active' ? 'default' : 'secondary'
  }));
};

export const transformChallenges = (challenges: ChallengeReference[], isRTL: boolean): DynamicSelectOption[] => {
  return challenges.map(challenge => ({
    value: challenge.id,
    label: challenge.title_ar,
    badge: challenge.status,
    badgeVariant: challenge.status === 'published' ? 'default' : 
                  challenge.status === 'active' ? 'default' : 'secondary'
  }));
};

export const transformTeamMembers = (members: TeamMemberExtended[], isRTL: boolean, t: (key: string) => string): DynamicSelectOption[] => {
  return members.map(member => ({
    value: member.id,
    label: member.email || member.user_id,
    sublabel: member.specialization,
    badge: t('common:badges.member')
  }));
};
