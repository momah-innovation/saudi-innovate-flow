/**
 * Icon Optimization Utilities
 * Implements lucide-react v3 best practices for optimal bundle size
 */

import { icons } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

/**
 * Static icon imports - for frequently used icons
 * These will be included in the main bundle
 */
export const staticIcons = {
  // Navigation icons
  home: () => import('lucide-react').then(mod => mod.Home),
  search: () => import('lucide-react').then(mod => mod.Search),
  user: () => import('lucide-react').then(mod => mod.User),
  settings: () => import('lucide-react').then(mod => mod.Settings),
  
  // Action icons
  plus: () => import('lucide-react').then(mod => mod.Plus),
  edit: () => import('lucide-react').then(mod => mod.Edit),
  trash: () => import('lucide-react').then(mod => mod.Trash2),
  save: () => import('lucide-react').then(mod => mod.Save),
  
  // Status icons
  check: () => import('lucide-react').then(mod => mod.Check),
  x: () => import('lucide-react').then(mod => mod.X),
  alert: () => import('lucide-react').then(mod => mod.AlertCircle),
  info: () => import('lucide-react').then(mod => mod.Info),
  
  // Arrow icons
  chevronDown: () => import('lucide-react').then(mod => mod.ChevronDown),
  chevronUp: () => import('lucide-react').then(mod => mod.ChevronUp),
  chevronLeft: () => import('lucide-react').then(mod => mod.ChevronLeft),
  chevronRight: () => import('lucide-react').then(mod => mod.ChevronRight),
} as const;

/**
 * Generic icon component for dynamic loading
 * Use this for less frequently used icons
 */
export type IconName = keyof typeof icons;
export type DynamicIconName = keyof typeof dynamicIconImports;

/**
 * Icon usage analytics to optimize bundle
 */
export const iconUsageTracker = {
  usage: new Map<string, number>(),
  
  track: (iconName: string) => {
    const current = iconUsageTracker.usage.get(iconName) || 0;
    iconUsageTracker.usage.set(iconName, current + 1);
  },
  
  getTopIcons: (limit: number = 20) => {
    return Array.from(iconUsageTracker.usage.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([name]) => name);
  },
  
  shouldBeStatic: (iconName: string, threshold: number = 10) => {
    return (iconUsageTracker.usage.get(iconName) || 0) >= threshold;
  }
};

/**
 * Icon optimization recommendations
 */
export const iconOptimizations = {
  // Recommendations for moving icons to static imports
  getStaticRecommendations: () => {
    const frequentIcons = iconUsageTracker.getTopIcons(10);
    return frequentIcons.filter(icon => 
      !Object.keys(staticIcons).includes(icon)
    );
  },
  
  // Recommendations for removing unused static imports
  getRemovalRecommendations: () => {
    return Object.keys(staticIcons).filter(icon =>
      !iconUsageTracker.shouldBeStatic(icon, 5)
    );
  },
  
  // Calculate potential savings
  calculateSavings: () => {
    const totalIcons = Object.keys(icons).length;
    const usedIcons = iconUsageTracker.usage.size;
    const unusedIcons = totalIcons - usedIcons;
    
    // Rough estimate: each icon is ~1-2KB
    const potentialSavingsKB = unusedIcons * 1.5;
    
    return {
      totalIcons,
      usedIcons,
      unusedIcons,
      potentialSavingsKB: Math.round(potentialSavingsKB)
    };
  }
};

/**
 * Bundle size impact of different icon loading strategies
 */
export const iconBundleStrategies = {
  // Strategy 1: All static imports (largest bundle, fastest runtime)
  allStatic: {
    bundleSize: 'Large (~200KB+)',
    runtime: 'Fastest',
    useCase: 'Icon-heavy applications'
  },
  
  // Strategy 2: Mixed (balanced)
  mixed: {
    bundleSize: 'Medium (~50-100KB)',
    runtime: 'Fast',
    useCase: 'Most applications (recommended)'
  },
  
  // Strategy 3: All dynamic (smallest bundle, slower runtime)
  allDynamic: {
    bundleSize: 'Small (~10KB)',
    runtime: 'Slower (lazy loading)',
    useCase: 'Bundle size critical applications'
  }
};

export default {
  staticIcons,
  iconUsageTracker,
  iconOptimizations,
  iconBundleStrategies
};