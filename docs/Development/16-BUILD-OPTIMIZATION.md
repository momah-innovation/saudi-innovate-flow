# 🚀 Build Optimization Guide

## Overview
Comprehensive guide for optimizing build performance, bundle size, and application loading times in the Ruwād Platform.

## Build Configuration

### Vite Optimization Setup
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { splitVendorChunkPlugin } from 'vite';

export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === 'production' && 'babel-plugin-transform-remove-console'
        ].filter(Boolean)
      }
    }),
    splitVendorChunkPlugin(),
    // Bundle analyzer in development
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@lib': resolve(__dirname, './src/lib'),
      '@services': resolve(__dirname, './src/services')
    }
  },

  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        // Remove dead code
        dead_code: true,
        // Remove unused imports
        unused: true
      },
      mangle: {
        safari10: true
      },
      format: {
        // Remove comments
        comments: false
      }
    },

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Core vendor libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-utils': ['clsx', 'date-fns', 'lucide-react']
        },
        
        // Optimize chunk names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId 
            ? chunkInfo.facadeModuleId.split('/').pop() 
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').pop();
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        }
      },

      // External dependencies for CDN loading
      external: process.env.NODE_ENV === 'production' ? [
        // Can externalize large libraries for CDN loading
        // 'react',
        // 'react-dom'
      ] : []
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000
  },

  // Development optimizations
  server: {
    port: 5173,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },

  // Preview server for production builds
  preview: {
    port: 4173,
    open: true
  },

  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      '@tanstack/react-query',
      'lucide-react'
    ],
    exclude: [
      // Exclude dev dependencies
      '@storybook/react'
    ]
  }
});
```

### Environment-Specific Optimizations
```typescript
// vite.config.production.ts
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from './vite.config';
import { compressionPlugin } from 'vite-plugin-compression';

export default mergeConfig(baseConfig, defineConfig({
  plugins: [
    // Gzip compression
    compressionPlugin({
      ext: '.gz',
      algorithm: 'gzip',
      threshold: 1024
    }),
    
    // Brotli compression
    compressionPlugin({
      ext: '.br',
      algorithm: 'brotliCompress',
      threshold: 1024
    })
  ],

  build: {
    // Production-specific optimizations
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    
    rollupOptions: {
      output: {
        // More aggressive chunk splitting for production
        manualChunks: (id) => {
          // Separate node_modules
          if (id.includes('node_modules')) {
            // Large libraries get their own chunks
            if (id.includes('@radix-ui')) return 'radix-ui';
            if (id.includes('@tanstack')) return 'tanstack';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('react')) return 'react-vendor';
            return 'vendor';
          }
          
          // Feature-based chunks
          if (id.includes('/pages/')) return 'pages';
          if (id.includes('/components/')) return 'components';
          if (id.includes('/hooks/')) return 'hooks';
          if (id.includes('/lib/')) return 'lib';
        }
      }
    }
  }
}));
```

## Code Splitting Strategies

### Route-Based Code Splitting
```typescript
// src/lib/routing/lazyRoutes.ts
import { lazy } from 'react';
import { ComponentType } from 'react';

// Lazy loading utility with error boundary
export const createLazyRoute = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
) => {
  const LazyComponent = lazy(() => 
    importFn().catch(error => {
      console.error('Failed to load route component:', error);
      // Return fallback or error component
      return { 
        default: fallback || (() => (
          <div className="p-8 text-center">
            <h2>خطأ في تحميل الصفحة</h2>
            <p>يرجى إعادة تحميل الصفحة</p>
          </div>
        )) as T
      };
    })
  );

  LazyComponent.displayName = `LazyRoute(${importFn.name})`;
  return LazyComponent;
};

// Route definitions with lazy loading
export const routes = {
  Dashboard: createLazyRoute(() => import('@/pages/Dashboard')),
  Challenges: createLazyRoute(() => import('@/pages/Challenges')),
  ChallengeDetail: createLazyRoute(() => import('@/pages/ChallengeDetail')),
  Ideas: createLazyRoute(() => import('@/pages/Ideas')),
  Events: createLazyRoute(() => import('@/pages/Events')),
  Profile: createLazyRoute(() => import('@/pages/Profile')),
  Admin: createLazyRoute(() => import('@/pages/Admin')),
  Analytics: createLazyRoute(() => import('@/pages/Analytics'))
};

// Preload routes for better UX
export const preloadRoute = (routeName: keyof typeof routes) => {
  const component = routes[routeName];
  if (component && '_payload' in component) {
    // Trigger preload
    (component as any)._payload._result;
  }
};
```

### Component-Level Code Splitting
```typescript
// src/components/lazy/LazyComponents.ts
export const LazyComponents = {
  // Heavy chart components
  AnalyticsChart: lazy(() => import('@/components/charts/AnalyticsChart')),
  DataVisualization: lazy(() => import('@/components/charts/DataVisualization')),
  
  // Complex forms
  ChallengeForm: lazy(() => import('@/components/forms/ChallengeForm')),
  IdeaSubmissionForm: lazy(() => import('@/components/forms/IdeaSubmissionForm')),
  
  // Feature-specific components
  AIContentGenerator: lazy(() => import('@/components/ai/AIContentGenerator')),
  FileUploader: lazy(() => import('@/components/upload/FileUploader')),
  RichTextEditor: lazy(() => import('@/components/editor/RichTextEditor')),
  
  // Modal dialogs
  ChallengeModal: lazy(() => import('@/components/modals/ChallengeModal')),
  ProfileEditModal: lazy(() => import('@/components/modals/ProfileEditModal'))
};

// Conditional loading utility
export const ConditionalLazyLoader = ({ 
  condition, 
  component: Component, 
  fallback, 
  ...props 
}: ConditionalLazyProps) => {
  if (!condition) {
    return fallback || null;
  }

  return (
    <Suspense fallback={<ComponentSkeleton />}>
      <Component {...props} />
    </Suspense>
  );
};

// Usage example
export const DashboardPage = () => {
  const { hasRole } = useRole();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1>لوحة التحكم</h1>
      
      {/* Only load analytics for admins */}
      <ConditionalLazyLoader
        condition={hasRole('admin')}
        component={LazyComponents.AnalyticsChart}
        fallback={<SimpleStatsCard />}
      />
      
      {/* Only load AI features for premium users */}
      <ConditionalLazyLoader
        condition={user?.subscription?.plan === 'premium'}
        component={LazyComponents.AIContentGenerator}
      />
    </div>
  );
};
```

## Bundle Size Optimization

### Tree Shaking Configuration
```typescript
// src/lib/optimization/treeShaking.ts

// Import only what you need
// ❌ Bad: Imports entire library
import * as lodash from 'lodash';

// ✅ Good: Import specific functions
import { debounce, throttle } from 'lodash';

// Even better: Use tree-shakable alternatives
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

// Optimize icon imports
// ❌ Bad: Imports all icons
import * as Icons from 'lucide-react';

// ✅ Good: Import specific icons
import { Search, Filter, Download } from 'lucide-react';

// Create utility for dynamic icon loading
export const createIconLoader = () => {
  const iconCache = new Map();
  
  return async (iconName: string) => {
    if (iconCache.has(iconName)) {
      return iconCache.get(iconName);
    }
    
    try {
      const icon = await import(`lucide-react/dist/esm/icons/${iconName}.js`);
      iconCache.set(iconName, icon.default);
      return icon.default;
    } catch (error) {
      console.warn(`Icon ${iconName} not found`);
      return null;
    }
  };
};
```

### Dependency Analysis
```typescript
// scripts/analyze-bundle.ts
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  dependencies: DependencyInfo[];
}

export const analyzeBundleSize = async (): Promise<BundleAnalysis> => {
  // Build with bundle analyzer
  execSync('npm run build -- --analyze', { stdio: 'inherit' });
  
  // Parse build stats
  const statsFile = 'dist/stats.json';
  const stats = JSON.parse(readFileSync(statsFile, 'utf-8'));
  
  const analysis: BundleAnalysis = {
    totalSize: calculateTotalSize(stats),
    gzippedSize: calculateGzippedSize(stats),
    chunks: analyzeChunks(stats),
    dependencies: analyzeDependencies(stats)
  };
  
  // Generate report
  generateOptimizationReport(analysis);
  
  return analysis;
};

const generateOptimizationReport = (analysis: BundleAnalysis) => {
  const report = `
# Bundle Size Report

## Summary
- Total Size: ${formatSize(analysis.totalSize)}
- Gzipped Size: ${formatSize(analysis.gzippedSize)}
- Number of Chunks: ${analysis.chunks.length}

## Largest Dependencies
${analysis.dependencies
  .sort((a, b) => b.size - a.size)
  .slice(0, 10)
  .map(dep => `- ${dep.name}: ${formatSize(dep.size)}`)
  .join('\n')}

## Optimization Recommendations
${generateRecommendations(analysis)}
  `;
  
  writeFileSync('bundle-report.md', report);
  console.log('Bundle analysis complete. See bundle-report.md for details.');
};

const generateRecommendations = (analysis: BundleAnalysis) => {
  const recommendations = [];
  
  // Check for large chunks
  const largeChunks = analysis.chunks.filter(chunk => chunk.size > 500000);
  if (largeChunks.length > 0) {
    recommendations.push('- Consider splitting large chunks further');
  }
  
  // Check for duplicate dependencies
  const duplicates = findDuplicateDependencies(analysis.dependencies);
  if (duplicates.length > 0) {
    recommendations.push('- Remove duplicate dependencies');
  }
  
  // Check for unused dependencies
  recommendations.push('- Run `npx depcheck` to find unused dependencies');
  
  return recommendations.join('\n');
};
```

## Asset Optimization

### Image Optimization
```typescript
// src/lib/optimization/imageOptimization.ts
export class ImageOptimizer {
  private cache = new Map<string, string>();

  async optimizeImage(
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<File> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'webp'
    } = options;

    // Check cache
    const cacheKey = `${file.name}-${maxWidth}-${maxHeight}-${quality}`;
    if (this.cache.has(cacheKey)) {
      return this.createFileFromDataUrl(this.cache.get(cacheKey)!, file.name);
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate dimensions
        const { width, height } = this.calculateDimensions(
          img.width,
          img.height,
          maxWidth,
          maxHeight
        );

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        const optimizedDataUrl = canvas.toBlob((blob) => {
          const optimizedFile = new File([blob!], file.name, {
            type: `image/${format}`,
            lastModified: Date.now()
          });

          // Cache result
          const dataUrl = canvas.toDataURL(`image/${format}`, quality);
          this.cache.set(cacheKey, dataUrl);

          resolve(optimizedFile);
        }, `image/${format}`, quality);
      };

      img.src = URL.createObjectURL(file);
    });
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ) {
    let { width, height } = { width: originalWidth, height: originalHeight };

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  private createFileFromDataUrl(dataUrl: string, fileName: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  // Progressive image loading
  createProgressiveImage(src: string, placeholder: string) {
    return {
      src: placeholder, // Low-quality placeholder
      onLoad: () => {
        // Load high-quality image
        const img = new Image();
        img.onload = () => {
          // Replace with high-quality version
        };
        img.src = src;
      }
    };
  }
}

export const imageOptimizer = new ImageOptimizer();
```

### CSS Optimization
```css
/* src/styles/optimization.css */

/* Critical CSS inlining - above the fold styles */
:root {
  /* Essential design tokens only */
  --primary: 220 14% 20%;
  --background: 0 0% 100%;
  --foreground: 220 14% 20%;
}

/* Optimize font loading */
@font-face {
  font-family: 'Cairo';
  font-style: normal;
  font-weight: 400;
  font-display: swap; /* Improves loading performance */
  src: url('/fonts/cairo-regular.woff2') format('woff2');
}

/* Reduce unused CSS with purging */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90;
}

/* Optimize animations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Container queries for better performance */
@container card (min-width: 300px) {
  .card-content {
    padding: 1.5rem;
  }
}
```

## Loading Performance

### Resource Hints and Preloading
```html
<!-- index.html optimizations -->
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://jxpbiljkoibvqxzdkgod.supabase.co">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- DNS prefetch for better performance -->
  <link rel="dns-prefetch" href="//api.openai.com">
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/cairo-regular.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/icons/logo.svg" as="image">
  
  <!-- Optimize CSS loading -->
  <link rel="stylesheet" href="/src/styles/critical.css" media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="/src/styles/critical.css"></noscript>
  
  <!-- Prefetch likely next pages -->
  <link rel="prefetch" href="/challenges">
  <link rel="prefetch" href="/ideas">
  
  <title>منصة رواد الابتكار</title>
</head>
<body>
  <div id="root"></div>
  
  <!-- Module preload for better loading -->
  <link rel="modulepreload" href="/src/main.tsx">
  
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### Progressive Loading Strategy
```typescript
// src/lib/optimization/progressiveLoading.ts
export class ProgressiveLoader {
  private intersectionObserver?: IntersectionObserver;
  private loadedComponents = new Set<string>();

  constructor() {
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const componentId = entry.target.getAttribute('data-component-id');
            if (componentId && !this.loadedComponents.has(componentId)) {
              this.loadComponent(componentId);
            }
          }
        });
      },
      {
        rootMargin: '50px 0px', // Load when 50px before entering viewport
        threshold: 0.1
      }
    );
  }

  private async loadComponent(componentId: string) {
    this.loadedComponents.add(componentId);
    
    try {
      switch (componentId) {
        case 'analytics-chart':
          await import('@/components/charts/AnalyticsChart');
          break;
        case 'file-uploader':
          await import('@/components/upload/FileUploader');
          break;
        case 'rich-editor':
          await import('@/components/editor/RichTextEditor');
          break;
        default:
          console.warn(`Unknown component ID: ${componentId}`);
      }
    } catch (error) {
      console.error(`Failed to load component ${componentId}:`, error);
      this.loadedComponents.delete(componentId); // Allow retry
    }
  }

  observeComponent(element: HTMLElement, componentId: string) {
    if (this.intersectionObserver) {
      element.setAttribute('data-component-id', componentId);
      this.intersectionObserver.observe(element);
    }
  }

  disconnect() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }
}

export const progressiveLoader = new ProgressiveLoader();

// React hook for progressive loading
export const useProgressiveLoading = (componentId: string) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (element) {
      progressiveLoader.observeComponent(element, componentId);
    }

    return () => {
      if (element) {
        progressiveLoader.disconnect();
      }
    };
  }, [componentId]);

  return elementRef;
};
```

## Performance Monitoring

### Build Performance Metrics
```typescript
// scripts/performance-monitor.ts
import { performance } from 'perf_hooks';

export class BuildPerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private startTimes: Map<string, number> = new Map();

  startTimer(label: string) {
    this.startTimes.set(label, performance.now());
  }

  endTimer(label: string) {
    const startTime = this.startTimes.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.set(label, duration);
      this.startTimes.delete(label);
      console.log(`${label}: ${duration.toFixed(2)}ms`);
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: Object.fromEntries(this.metrics),
      recommendations: this.generateRecommendations()
    };

    return report;
  }

  private generateRecommendations(): string[] {
    const recommendations = [];
    
    const buildTime = this.metrics.get('total-build-time');
    if (buildTime && buildTime > 30000) {
      recommendations.push('Consider enabling parallel builds');
    }

    const bundleTime = this.metrics.get('bundle-time');
    if (bundleTime && bundleTime > 10000) {
      recommendations.push('Optimize bundle splitting configuration');
    }

    return recommendations;
  }
}

// Usage in build scripts
const monitor = new BuildPerformanceMonitor();

monitor.startTimer('total-build-time');
// ... build process
monitor.endTimer('total-build-time');

console.log(monitor.generateReport());
```

## Best Practices

### 1. **Code Splitting**
- Implement route-based splitting for better caching
- Use dynamic imports for heavy components
- Split vendor libraries appropriately

### 2. **Asset Optimization**
- Compress images and use modern formats (WebP, AVIF)
- Implement lazy loading for non-critical assets
- Use resource hints for better loading

### 3. **Bundle Analysis**
- Regularly analyze bundle size and dependencies
- Remove unused code and dependencies
- Monitor performance metrics over time

### 4. **Caching Strategy**
- Use proper file naming for long-term caching
- Implement service worker for offline functionality
- Cache API responses appropriately

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Build Tool**: Vite 5.x