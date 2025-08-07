/**
 * Phase 8: Performance Optimization - Bundle Analysis & Optimization
 * Tools and utilities for analyzing and optimizing bundle size
 */

import { logger } from './logger';

// Bundle analysis script that can be run to identify optimization opportunities
export interface BundleAnalysisResult {
  totalSize: number;
  chunks: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
  heavyDependencies: Array<{
    name: string;
    size: number;
    imports: string[];
  }>;
  recommendations: string[];
}

/**
 * Identifies heavy imports that can be optimized
 */
export const heavyImportOptimizations = {
  // Recharts - Import only needed components
  recharts: {
    before: `import { BarChart, LineChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts'`,
    after: [
      `import { BarChart } from 'recharts/es6/chart/BarChart'`,
      `import { LineChart } from 'recharts/es6/chart/LineChart'`,
      `import { PieChart } from 'recharts/es6/chart/PieChart'`,
      `import { XAxis } from 'recharts/es6/cartesian/XAxis'`,
      `import { YAxis } from 'recharts/es6/cartesian/YAxis'`,
      `import { CartesianGrid } from 'recharts/es6/cartesian/CartesianGrid'`,
      `import { Tooltip } from 'recharts/es6/component/Tooltip'`,
      `import { Legend } from 'recharts/es6/component/Legend'`,
      `import { Cell } from 'recharts/es6/component/Cell'`
    ],
    savingsKB: 150
  },
  
  // Lucide React - Already tree-shakeable, but ensure proper usage
  lucideReact: {
    before: `import * as Icons from 'lucide-react'`,
    after: `import { SpecificIcon } from 'lucide-react'`,
    savingsKB: 200
  },
  
  // Date-fns - Import only needed functions
  dateFns: {
    before: `import * as dateFns from 'date-fns'`,
    after: [
      `import { format } from 'date-fns'`,
      `import { parseISO } from 'date-fns'`,
      `import { startOfDay } from 'date-fns'`
    ],
    savingsKB: 80
  }
};

/**
 * Bundle optimization recommendations
 */
export const bundleOptimizations = {
  // Vendor chunk splitting
  vendorChunks: {
    react: ['react', 'react-dom'],
    ui: ['@radix-ui/*'],
    charts: ['recharts'],
    utils: ['date-fns', 'clsx', 'tailwind-merge'],
    supabase: ['@supabase/supabase-js'],
    forms: ['react-hook-form', '@hookform/resolvers', 'zod']
  },
  
  // Dynamic imports for heavy features
  dynamicImports: [
    'StorageAnalyticsDashboard',
    'EventAnalyticsDashboard', 
    'TeamWorkspaceContent',
    'ChallengeWizardV2'
  ],
  
  // Preload priorities
  preloadPriorities: {
    high: ['ChallengeManagement', 'IdeasManagement'],
    medium: ['EventsManagement', 'PartnersManagement'],
    low: ['StorageAnalytics', 'TeamWorkspace']
  }
};

/**
 * Performance monitoring utilities
 */
export const performanceMetrics = {
  // Track component render times
  measureComponentRender: (componentName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    logger.performance(`${componentName} render`, end - start);
  },
  
  // Track bundle loading times
  measureBundleLoad: async (bundleName: string, loadFn: () => Promise<any>) => {
    const start = performance.now();
    await loadFn();
    const end = performance.now();
    logger.performance(`${bundleName} load`, end - start);
  },
  
  // Core Web Vitals tracking
  trackCoreWebVitals: () => {
    // LCP (Largest Contentful Paint)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      logger.debug('LCP measured', { startTime: lastEntry.startTime });
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // FID (First Input Delay) 
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        logger.debug('FID measured', { delay: entry.processingStart - entry.startTime });
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // CLS (Cumulative Layout Shift)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          logger.debug('CLS measured', { value: entry.value });
        }
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

/**
 * Image optimization utilities
 */
export const imageOptimizations = {
  // Lazy loading implementation
  createIntersectionObserver: () => {
    return new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
        }
      });
    });
  },
  
  // WebP fallback
  supportsWebP: (): boolean => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  },
  
  // Responsive image sizes
  generateSrcSet: (baseUrl: string, sizes: number[]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ');
  }
};

export default {
  heavyImportOptimizations,
  bundleOptimizations,
  performanceMetrics,
  imageOptimizations
};