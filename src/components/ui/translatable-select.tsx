/**
 * A select component that displays translated values but stores standardized keys
 * This replaces hardcoded dropdowns with a key-based system
 */

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedTranslation } from '@/hooks/useUnifiedTranslation';
import { VALUE_KEY_MAPPINGS, getCategoryKeys, valueToKey, keyToValue } from '@/utils/valueKeys';

interface TranslatableSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  category: keyof typeof VALUE_KEY_MAPPINGS;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  includeAll?: boolean;
  allLabel?: string;
}

export function TranslatableSelect({
  value,
  onValueChange,
  category,
  placeholder,
  className,
  disabled = false,
  includeAll = false,
  allLabel
}: TranslatableSelectProps) {
  const { t } = useUnifiedTranslation();
  
  // Get all available translation keys for this category
  const availableKeys = getCategoryKeys(category);
  
  // Convert current value to key if it's a raw value
  const selectedKey = value ? valueToKey(value, category) : '';
  
  const handleValueChange = (newKey: string) => {
    if (newKey === 'all') {
      onValueChange('');
      return;
    }
    
    // Convert key back to standard value for database storage
    const standardValue = keyToValue(newKey, category);
    onValueChange(standardValue);
  };

  return (
    <Select 
      value={selectedKey} 
      onValueChange={handleValueChange} 
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && (
          <SelectItem value="all">
            {allLabel || t('common.all', 'All')}
          </SelectItem>
        )}
        {availableKeys.map((key) => (
          <SelectItem key={key} value={key}>
            {t(key, key.split('.')[1])}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Hook to get options for a specific category (useful for custom dropdowns)
 */
export function useTranslatableOptions(category: keyof typeof VALUE_KEY_MAPPINGS) {
  const { t } = useUnifiedTranslation();
  const availableKeys = getCategoryKeys(category);
  
  return availableKeys.map(key => ({
    value: keyToValue(key, category), // Standard database value
    key: key, // Translation key
    label: t(key, key.split('.')[1]), // Translated label
    displayValue: key.split('.')[1] // Fallback display value
  }));
}

/**
 * Simple badge component for displaying translated status/priority/type values
 */
interface TranslatableBadgeProps {
  value: string;
  category: keyof typeof VALUE_KEY_MAPPINGS;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
}

export function TranslatableBadge({ 
  value, 
  category, 
  variant = 'default', 
  className = '' 
}: TranslatableBadgeProps) {
  const { t } = useUnifiedTranslation();
  
  if (!value) return null;
  
  const key = valueToKey(value, category);
  const translatedValue = key.includes('.') ? t(key, value) : value;
  
  // Dynamic variant based on value
  const getVariant = () => {
    if (category === 'status') {
      if (['active', 'published', 'approved', 'completed'].includes(value)) return 'default';
      if (['draft', 'pending', 'planning'].includes(value)) return 'secondary';
      if (['cancelled', 'rejected', 'archived'].includes(value)) return 'destructive';
      return 'outline';
    }
    
    if (category === 'priority') {
      if (['critical', 'urgent', 'high'].includes(value)) return 'destructive';
      if (value === 'medium') return 'default';
      return 'secondary';
    }
    
    return variant;
  };
  
  const badgeClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-input bg-background text-foreground'
  };
  
  const selectedVariant = getVariant();
  
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${badgeClasses[selectedVariant]} ${className}`}>
      {translatedValue}
    </span>
  );
}