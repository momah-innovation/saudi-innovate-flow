import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useAppTranslation';

interface DynamicSelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

interface DynamicSelectProps {
  options: DynamicSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export function DynamicSelect({
  options,
  value,
  onValueChange,
  placeholder,
  loading = false,
  emptyMessage,
  className,
  disabled = false,
  showAllOption = false,
  allOptionLabel
}: DynamicSelectProps) {
  const { t, isRTL } = useTranslation();

  const defaultEmptyMessage = emptyMessage || t('no_options_available');
  const defaultAllLabel = allOptionLabel || t('all');

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-arabic' : 'font-english'}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled || loading}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg z-50">
          {loading ? (
            <SelectItem value="loading" disabled>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('loading')}
              </div>
            </SelectItem>
          ) : options.length === 0 ? (
            <SelectItem value="empty" disabled>
              {defaultEmptyMessage}
            </SelectItem>
          ) : (
            <>
              {showAllOption && (
                <SelectItem value="all">
                  {defaultAllLabel}
                </SelectItem>
              )}
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2 w-full">
                    <span className="flex-1">{option.label}</span>
                    {option.badge && (
                      <Badge 
                        variant={option.badgeVariant || 'secondary'}
                        className="text-xs"
                      >
                        {option.badge}
                      </Badge>
                    )}
                  </div>
                  {option.sublabel && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.sublabel}
                    </div>
                  )}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

// Utility functions to transform data for the DynamicSelect component

export const transformDepartments = (departments: any[], isRTL: boolean): DynamicSelectOption[] => {
  return departments.map(dept => ({
    value: dept.id,
    label: isRTL ? (dept.name_ar || dept.name) : dept.name,
    sublabel: dept.department_head,
    badge: isRTL ? 'قسم' : 'Dept'
  }));
};

export const transformDeputies = (deputies: any[], isRTL: boolean): DynamicSelectOption[] => {
  return deputies.map(deputy => ({
    value: deputy.id,
    label: isRTL ? (deputy.name_ar || deputy.name) : deputy.name,
    sublabel: deputy.deputy_minister,
    badge: isRTL ? 'نائب' : 'Deputy'
  }));
};

export const transformSectors = (sectors: any[], isRTL: boolean): DynamicSelectOption[] => {
  return sectors.map(sector => ({
    value: sector.id,
    label: isRTL ? (sector.name_ar || sector.name) : sector.name,
    badge: isRTL ? 'قطاع' : 'Sector'
  }));
};

export const transformCampaigns = (campaigns: any[], isRTL: boolean): DynamicSelectOption[] => {
  return campaigns.map(campaign => ({
    value: campaign.id,
    label: campaign.title_ar,
    badge: campaign.status,
    badgeVariant: campaign.status === 'active' ? 'default' : 'secondary'
  }));
};

export const transformChallenges = (challenges: any[], isRTL: boolean): DynamicSelectOption[] => {
  return challenges.map(challenge => ({
    value: challenge.id,
    label: challenge.title_ar,
    badge: challenge.status,
    badgeVariant: challenge.status === 'published' ? 'default' : 
                  challenge.status === 'active' ? 'default' : 'secondary'
  }));
};

export const transformTeamMembers = (members: any[], isRTL: boolean): DynamicSelectOption[] => {
  return members.map(member => ({
    value: member.id,
    label: member.email || member.user_id,
    sublabel: member.specialization,
    badge: isRTL ? 'عضو' : 'Member'
  }));
};