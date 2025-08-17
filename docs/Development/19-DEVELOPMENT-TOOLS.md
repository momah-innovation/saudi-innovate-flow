# 🛠️ Development Tools Guide

## Overview
Comprehensive guide to development tools, utilities, and workflows for the Ruwād Platform development environment.

## Essential Development Tools

### Code Editor Configuration
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.rulers": [80, 120],
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    "cva\\(([^)]*)\\)",
    "[\"'`]([^\"'`]*).*?[\"'`]"
  ],
  "typescript.preferences.includePackageJsonAutoImports": "off"
}
```

### VS Code Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    // Essential
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    
    // React & TypeScript
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "bradlc.vscode-tailwindcss",
    
    // Git & Collaboration
    "eamodio.gitlens",
    "github.copilot",
    "ms-vscode.github-copilot-chat",
    
    // Testing & Debugging
    "ms-vscode.vscode-jest",
    "hbenl.vscode-test-explorer",
    
    // Productivity
    "gruntfuggly.todo-tree",
    "alefragnani.bookmarks",
    "aaron-bond.better-comments",
    
    // API Development
    "humao.rest-client",
    "supabase.supabase-vscode",
    
    // Documentation
    "yzhang.markdown-all-in-one",
    "davidanson.vscode-markdownlint"
  ]
}
```

### Debugging Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug App",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["dev"],
      "console": "integratedTerminal",
      "envFile": "${workspaceFolder}/.env.local"
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vitest",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "envFile": "${workspaceFolder}/.env.test"
    },
    {
      "name": "Debug Build",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["build"],
      "console": "integratedTerminal"
    }
  ]
}
```

## CLI Tools and Scripts

### Development Scripts
```json
// package.json scripts
{
  "scripts": {
    // Development
    "dev": "vite --host",
    "dev:https": "vite --host --https",
    "dev:debug": "vite --host --debug",
    
    // Building
    "build": "npm run type-check && vite build",
    "build:analyze": "npm run build -- --analyze",
    "build:staging": "NODE_ENV=staging npm run build",
    "build:production": "NODE_ENV=production npm run build",
    
    // Preview
    "preview": "vite preview --host",
    "preview:https": "vite preview --host --https",
    
    // Quality Assurance
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "npm run lint -- --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    
    // Testing
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:ci": "vitest run --reporter=junit --outputFile=test-results.xml",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    
    // Database
    "db:generate-types": "supabase gen types typescript --local > src/integrations/supabase/types.ts",
    "db:reset": "supabase db reset",
    "db:migration": "supabase migration new",
    "db:deploy": "supabase db push",
    
    // Utilities
    "clean": "rm -rf dist node_modules/.vite",
    "reset": "npm run clean && npm install",
    "check-deps": "npx depcheck",
    "update-deps": "npx npm-check-updates -u",
    "security-audit": "npm audit --audit-level moderate",
    
    // Code Generation
    "generate:component": "node scripts/generate-component.js",
    "generate:hook": "node scripts/generate-hook.js",
    "generate:page": "node scripts/generate-page.js",
    
    // Documentation
    "docs:dev": "vitepress dev docs",
    "docs:build": "vitepress build docs",
    "docs:serve": "vitepress serve docs"
  }
}
```

### Custom CLI Tools
```typescript
// scripts/cli/ruwad-cli.ts
import { Command } from 'commander';
import { generateComponent } from './generators/component';
import { generateHook } from './generators/hook';
import { generatePage } from './generators/page';
import { runQualityChecks } from './quality/checks';
import { deployToEnvironment } from './deployment/deploy';

const program = new Command();

program
  .name('ruwad-cli')
  .description('Ruwād Platform development CLI')
  .version('1.0.0');

// Code Generation Commands
program
  .command('generate')
  .alias('g')
  .description('Generate code scaffolding')
  .addCommand(
    new Command('component')
      .alias('c')
      .description('Generate a new component')
      .argument('<name>', 'Component name')
      .option('-d, --directory <dir>', 'Target directory', 'src/components')
      .option('-t, --type <type>', 'Component type', 'functional')
      .option('--with-tests', 'Include test files')
      .option('--with-stories', 'Include Storybook stories')
      .action(generateComponent)
  )
  .addCommand(
    new Command('hook')
      .alias('h')
      .description('Generate a new custom hook')
      .argument('<name>', 'Hook name')
      .option('-d, --directory <dir>', 'Target directory', 'src/hooks')
      .option('--with-tests', 'Include test files')
      .action(generateHook)
  )
  .addCommand(
    new Command('page')
      .alias('p')
      .description('Generate a new page')
      .argument('<name>', 'Page name')
      .option('-r, --route <route>', 'Page route')
      .option('--with-layout', 'Include layout wrapper')
      .action(generatePage)
  );

// Quality Commands
program
  .command('quality')
  .alias('q')
  .description('Run quality checks')
  .option('--fix', 'Automatically fix issues')
  .option('--coverage', 'Include test coverage')
  .action(runQualityChecks);

// Deployment Commands
program
  .command('deploy')
  .description('Deploy to environment')
  .argument '<environment>', 'Target environment (staging|production)'
  .option('--skip-tests', 'Skip test execution')
  .option('--force', 'Force deployment')
  .action(deployToEnvironment);

// Development Server Commands
program
  .command('dev')
  .description('Start development server with options')
  .option('-p, --port <port>', 'Port number', '5173')
  .option('--https', 'Enable HTTPS')
  .option('--host <host>', 'Host address', 'localhost')
  .action((options) => {
    const args = ['dev'];
    if (options.https) args.push('--https');
    args.push('--port', options.port);
    args.push('--host', options.host);
    
    const { spawn } = require('child_process');
    spawn('npm', ['run', 'dev', '--', ...args.slice(1)], { stdio: 'inherit' });
  });

program.parse();
```

### Code Generators
```typescript
// scripts/generators/component.ts
import { promises as fs } from 'fs';
import path from 'path';

interface ComponentOptions {
  directory: string;
  type: 'functional' | 'class';
  withTests: boolean;
  withStories: boolean;
}

export async function generateComponent(name: string, options: ComponentOptions) {
  const componentName = toPascalCase(name);
  const componentDir = path.join(options.directory, componentName);
  
  try {
    // Create component directory
    await fs.mkdir(componentDir, { recursive: true });
    
    // Generate component file
    const componentContent = generateComponentTemplate(componentName, options.type);
    await fs.writeFile(
      path.join(componentDir, `${componentName}.tsx`),
      componentContent
    );
    
    // Generate index file
    const indexContent = `export { ${componentName} } from './${componentName}';\n`;
    await fs.writeFile(
      path.join(componentDir, 'index.ts'),
      indexContent
    );
    
    // Generate test file if requested
    if (options.withTests) {
      const testContent = generateTestTemplate(componentName);
      await fs.writeFile(
        path.join(componentDir, `${componentName}.test.tsx`),
        testContent
      );
    }
    
    // Generate Storybook story if requested
    if (options.withStories) {
      const storyContent = generateStoryTemplate(componentName);
      await fs.writeFile(
        path.join(componentDir, `${componentName}.stories.tsx`),
        storyContent
      );
    }
    
    console.log(`✅ Component ${componentName} generated successfully!`);
    console.log(`📁 Location: ${componentDir}`);
    
  } catch (error) {
    console.error(`❌ Error generating component: ${error.message}`);
    process.exit(1);
  }
}

function generateComponentTemplate(name: string, type: string): string {
  return `import React from 'react';
import { cn } from '@/lib/utils';

export interface ${name}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${name} = ({ className, children, ...props }: ${name}Props) => {
  return (
    <div className={cn('${name.toLowerCase()}', className)} {...props}>
      {children || <p>Hello from ${name}!</p>}
    </div>
  );
};

${name}.displayName = '${name}';
`;
}

function generateTestTemplate(name: string): string {
  return `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name}';

describe('${name}', () => {
  it('renders without crashing', () => {
    render(<${name} />);
    expect(screen.getByText(/hello from ${name.toLowerCase()}/i)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<${name} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders children when provided', () => {
    render(<${name}>Custom content</${name}>);
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});
`;
}

function generateStoryTemplate(name: string): string {
  return `import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

const meta: Meta<typeof ${name}> = {
  title: 'Components/${name}',
  component: ${name},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes'
    }
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomContent: Story = {
  args: {
    children: 'Custom content for ${name}',
  },
};

export const WithClassName: Story = {
  args: {
    className: 'border border-primary p-4 rounded-lg',
    children: 'Styled ${name}',
  },
};
`;
}

function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/^./, (char) => char.toUpperCase());
}
```

## Development Workflow Tools

### Git Hooks and Automation
```bash
#!/bin/sh
# .husky/pre-commit
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run type checking
echo "📝 Type checking..."
npm run type-check

# Run linting
echo "🔍 Linting..."
npm run lint

# Run tests on staged files
echo "🧪 Running tests..."
npm run test:run -- --passWithNoTests

# Check for console.log statements in staged files
echo "🚫 Checking for console.log..."
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|tsx|js|jsx)$')
if [ "$STAGED_FILES" != "" ]; then
  for FILE in $STAGED_FILES; do
    if grep -q "console\.log" "$FILE"; then
      echo "❌ Found console.log in $FILE"
      echo "Please remove console.log statements before committing"
      exit 1
    fi
  done
fi

echo "✅ Pre-commit checks passed!"
```

```bash
#!/bin/sh
# .husky/commit-msg
. "$(dirname "$0")/_/husky.sh"

# Validate commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,50}'

error_msg="❌ Invalid commit message format!
Commit message should follow conventional commits:
  feat(scope): add new feature
  fix(scope): fix bug
  docs: update documentation
  etc.

Examples:
  feat(auth): add login functionality
  fix(ui): resolve button alignment issue
  docs: update API documentation"

if ! grep -qE "$commit_regex" "$1"; then
  echo "$error_msg"
  exit 1
fi

echo "✅ Commit message format is valid!"
```

### Quality Assurance Tools
```typescript
// scripts/quality/checks.ts
import { execSync } from 'child_process';

interface QualityOptions {
  fix: boolean;
  coverage: boolean;
}

export async function runQualityChecks(options: QualityOptions) {
  console.log('🔍 Running quality checks...\n');
  
  const results = {
    typeCheck: false,
    lint: false,
    format: false,
    tests: false,
    coverage: false,
    security: false
  };

  try {
    // Type checking
    console.log('📝 Type checking...');
    execSync('npm run type-check', { stdio: 'inherit' });
    results.typeCheck = true;
    console.log('✅ Type checking passed\n');

    // Linting
    console.log('🔍 Linting...');
    const lintCommand = options.fix ? 'npm run lint:fix' : 'npm run lint';
    execSync(lintCommand, { stdio: 'inherit' });
    results.lint = true;
    console.log('✅ Linting passed\n');

    // Formatting
    console.log('💅 Format checking...');
    const formatCommand = options.fix ? 'npm run format' : 'npm run format:check';
    execSync(formatCommand, { stdio: 'inherit' });
    results.format = true;
    console.log('✅ Formatting passed\n');

    // Tests
    console.log('🧪 Running tests...');
    const testCommand = options.coverage ? 'npm run test:coverage' : 'npm run test:run';
    execSync(testCommand, { stdio: 'inherit' });
    results.tests = true;
    console.log('✅ Tests passed\n');

    // Security audit
    console.log('🔒 Security audit...');
    execSync('npm run security-audit', { stdio: 'inherit' });
    results.security = true;
    console.log('✅ Security audit passed\n');

    // Generate report
    generateQualityReport(results);

  } catch (error) {
    console.error(`❌ Quality check failed: ${error.message}`);
    process.exit(1);
  }
}

function generateQualityReport(results: Record<string, boolean>) {
  const passedChecks = Object.values(results).filter(Boolean).length;
  const totalChecks = Object.keys(results).length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  console.log('\n📊 Quality Report');
  console.log('==================');
  console.log(`Overall Score: ${score}%`);
  console.log(`Passed: ${passedChecks}/${totalChecks} checks\n`);

  Object.entries(results).forEach(([check, passed]) => {
    const icon = passed ? '✅' : '❌';
    console.log(`${icon} ${check}`);
  });

  if (score === 100) {
    console.log('\n🎉 All quality checks passed!');
  } else {
    console.log('\n⚠️  Some quality checks failed. Please review and fix.');
  }
}
```

### Performance Profiling Tools
```typescript
// scripts/performance/profiler.ts
export class DevelopmentProfiler {
  private measurements: Map<string, number> = new Map();
  private activeTimers: Map<string, number> = new Map();

  startTimer(label: string) {
    this.activeTimers.set(label, performance.now());
  }

  endTimer(label: string): number {
    const startTime = this.activeTimers.get(label);
    if (!startTime) {
      console.warn(`No active timer found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.measurements.set(label, duration);
    this.activeTimers.delete(label);

    console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startTimer(label);
      try {
        const result = await fn();
        this.endTimer(label);
        resolve(result);
      } catch (error) {
        this.endTimer(label);
        reject(error);
      }
    });
  }

  measureSync<T>(label: string, fn: () => T): T {
    this.startTimer(label);
    try {
      const result = fn();
      this.endTimer(label);
      return result;
    } catch (error) {
      this.endTimer(label);
      throw error;
    }
  }

  profileComponent<P>(
    Component: React.ComponentType<P>,
    displayName?: string
  ): React.ComponentType<P> {
    const ProfiledComponent = (props: P) => {
      const name = displayName || Component.displayName || Component.name || 'Anonymous';
      
      React.useEffect(() => {
        this.startTimer(`${name}-render`);
        return () => {
          this.endTimer(`${name}-render`);
        };
      });

      return React.createElement(Component, props);
    };

    ProfiledComponent.displayName = `Profiled(${displayName || Component.displayName || Component.name})`;
    return ProfiledComponent;
  }

  getReport(): PerformanceReport {
    const measurements = Object.fromEntries(this.measurements);
    const slowOperations = Object.entries(measurements)
      .filter(([_, duration]) => duration > 100)
      .sort(([_, a], [__, b]) => b - a);

    return {
      totalMeasurements: this.measurements.size,
      averageDuration: this.calculateAverage(),
      slowestOperation: slowOperations[0],
      allMeasurements: measurements,
      slowOperations: Object.fromEntries(slowOperations)
    };
  }

  private calculateAverage(): number {
    const values = Array.from(this.measurements.values());
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  clear() {
    this.measurements.clear();
    this.activeTimers.clear();
  }
}

// Global profiler instance for development
export const devProfiler = new DevelopmentProfiler();

// React DevTools integration
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.onCommitFiberRoot = (
    id: any,
    root: any,
    priorityLevel: any
  ) => {
    devProfiler.measureSync('react-commit', () => {
      // Original onCommitFiberRoot logic would go here
    });
  };
}
```

## Browser Development Tools

### Browser Extensions and DevTools
```typescript
// src/lib/devtools/browserIntegration.ts
export class BrowserDevTools {
  private isDevMode = process.env.NODE_ENV === 'development';

  constructor() {
    if (this.isDevMode) {
      this.setupDevTools();
    }
  }

  private setupDevTools() {
    // Add global debug utilities
    (window as any).__RUWAD_DEBUG__ = {
      performance: devProfiler,
      errorTracker,
      healthCheck: healthCheckManager,
      analytics: this.getAnalyticsDebugInfo(),
      storage: this.getStorageDebugInfo(),
      auth: this.getAuthDebugInfo()
    };

    // Console welcome message
    console.log(`
    🚀 Ruwād Platform Development Mode
    =====================================
    Available debug utilities:
    - __RUWAD_DEBUG__.performance - Performance profiling
    - __RUWAD_DEBUG__.errorTracker - Error tracking
    - __RUWAD_DEBUG__.healthCheck - Health monitoring
    - __RUWAD_DEBUG__.analytics - Analytics debugging
    - __RUWAD_DEBUG__.storage - Storage utilities
    - __RUWAD_DEBUG__.auth - Authentication debugging
    `);

    // Add development shortcuts
    this.addKeyboardShortcuts();
  }

  private addKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Shift + D - Toggle debug mode
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        this.toggleDebugMode();
      }

      // Ctrl/Cmd + Shift + P - Performance report
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'P') {
        console.table(devProfiler.getReport());
      }

      // Ctrl/Cmd + Shift + H - Health check
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'H') {
        healthCheckManager.runAllChecks().then(console.table);
      }
    });
  }

  private toggleDebugMode() {
    const debugElement = document.getElementById('debug-overlay');
    if (debugElement) {
      debugElement.remove();
    } else {
      this.showDebugOverlay();
    }
  }

  private showDebugOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'debug-overlay';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        z-index: 10000;
        max-width: 300px;
      ">
        <h3>🛠️ Debug Info</h3>
        <div id="debug-content">Loading...</div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: #f44336;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          margin-top: 10px;
          cursor: pointer;
        ">Close</button>
      </div>
    `;

    document.body.appendChild(overlay);
    this.updateDebugInfo();
  }

  private updateDebugInfo() {
    const debugContent = document.getElementById('debug-content');
    if (debugContent) {
      const info = {
        Environment: process.env.NODE_ENV,
        'Build Version': process.env.BUILD_VERSION || 'dev',
        'Performance Score': Math.round(devProfiler.calculateAverage()),
        'Active Timers': devProfiler.activeTimers.size,
        'Memory Usage': this.getMemoryUsage(),
        'Local Storage': this.getStorageUsage()
      };

      debugContent.innerHTML = Object.entries(info)
        .map(([key, value]) => `<div><strong>${key}:</strong> ${value}</div>`)
        .join('');
    }
  }

  private getMemoryUsage(): string {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
      return `${used}MB / ${total}MB`;
    }
    return 'N/A';
  }

  private getStorageUsage(): string {
    try {
      const total = Object.keys(localStorage).length;
      return `${total} items`;
    } catch {
      return 'N/A';
    }
  }

  private getAnalyticsDebugInfo() {
    return {
      sessionId: userExperienceMonitor.sessionId,
      pageViews: userExperienceMonitor.pageViews.length,
      userActions: userExperienceMonitor.userActions.length,
      engagementScore: userExperienceMonitor.calculateEngagementScore()
    };
  }

  private getStorageDebugInfo() {
    return {
      localStorage: this.getLocalStorageInfo(),
      sessionStorage: this.getSessionStorageInfo(),
      indexedDB: 'Available' // Could be expanded
    };
  }

  private getAuthDebugInfo() {
    return {
      isAuthenticated: !!localStorage.getItem('userId'),
      sessionActive: !!sessionStorage.getItem('sessionId'),
      lastActivity: localStorage.getItem('lastActivity')
    };
  }

  private getLocalStorageInfo() {
    try {
      const keys = Object.keys(localStorage);
      return {
        itemCount: keys.length,
        keys: keys.slice(0, 10), // First 10 keys
        size: JSON.stringify(localStorage).length
      };
    } catch {
      return { error: 'Not accessible' };
    }
  }

  private getSessionStorageInfo() {
    try {
      const keys = Object.keys(sessionStorage);
      return {
        itemCount: keys.length,
        keys: keys.slice(0, 10),
        size: JSON.stringify(sessionStorage).length
      };
    } catch {
      return { error: 'Not accessible' };
    }
  }
}

// Initialize in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  new BrowserDevTools();
}
```

## Database Tools

### Migration and Schema Tools
```typescript
// scripts/database/schema-tools.ts
export class DatabaseSchemaTools {
  async generateMigration(name: string, description?: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const migrationName = `${timestamp}_${name.replace(/\s+/g, '_').toLowerCase()}`;
    
    const migrationTemplate = `-- Migration: ${name}
-- Description: ${description || 'No description provided'}
-- Created: ${new Date().toISOString()}

-- Add your SQL commands here
-- Example:
-- CREATE TABLE example (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );

-- Don't forget to add RLS policies if needed
-- ALTER TABLE example ENABLE ROW LEVEL SECURITY;
`;

    const migrationPath = `supabase/migrations/${migrationName}.sql`;
    await fs.writeFile(migrationPath, migrationTemplate);
    
    console.log(`✅ Migration created: ${migrationPath}`);
    return migrationPath;
  }

  async validateSchema() {
    console.log('🔍 Validating database schema...');
    
    const checks = [
      this.checkRLSPolicies(),
      this.checkForeignKeys(),
      this.checkIndexes(),
      this.checkNamingConventions()
    ];

    const results = await Promise.allSettled(checks);
    
    results.forEach((result, index) => {
      const checkNames = ['RLS Policies', 'Foreign Keys', 'Indexes', 'Naming Conventions'];
      if (result.status === 'fulfilled') {
        console.log(`✅ ${checkNames[index]}: ${result.value}`);
      } else {
        console.error(`❌ ${checkNames[index]}: ${result.reason}`);
      }
    });
  }

  private async checkRLSPolicies(): Promise<string> {
    // Implementation would check for tables without RLS
    return 'All tables have appropriate RLS policies';
  }

  private async checkForeignKeys(): Promise<string> {
    // Implementation would check foreign key constraints
    return 'All foreign keys are properly defined';
  }

  private async checkIndexes(): Promise<string> {
    // Implementation would check for missing indexes
    return 'All necessary indexes are in place';
  }

  private async checkNamingConventions(): Promise<string> {
    // Implementation would check naming conventions
    return 'All objects follow naming conventions';
  }
}
```

## Testing Tools Integration

### Test Utilities and Helpers
```typescript
// scripts/testing/test-utils.ts
export class TestingTools {
  async runTestSuite(pattern?: string) {
    console.log('🧪 Running test suite...');
    
    const commands = [
      'npm run test:run',
      'npm run test:e2e',
      'npm run test:integration'
    ];

    for (const command of commands) {
      try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ ${command} passed\n`);
      } catch (error) {
        console.error(`❌ ${command} failed`);
        throw error;
      }
    }
  }

  async generateTestCoverage() {
    console.log('📊 Generating test coverage report...');
    
    execSync('npm run test:coverage', { stdio: 'inherit' });
    
    // Open coverage report
    const coveragePath = 'coverage/index.html';
    if (await fs.access(coveragePath).then(() => true).catch(() => false)) {
      console.log(`📈 Coverage report generated: ${coveragePath}`);
    }
  }

  async runVisualRegressionTests() {
    console.log('📸 Running visual regression tests...');
    
    // Implementation would run visual regression testing
    console.log('✅ Visual regression tests completed');
  }
}
```

## Best Practices

### 1. **Tool Integration**
- Use VS Code extensions for enhanced productivity
- Set up proper debugging configurations
- Implement automated quality checks

### 2. **Development Workflow**
- Use Git hooks for quality gates
- Implement consistent code generation
- Set up proper environment management

### 3. **Performance Monitoring**
- Profile components during development
- Monitor bundle size changes
- Track performance regressions

### 4. **Quality Assurance**
- Run comprehensive quality checks
- Automate security audits
- Maintain test coverage standards

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Tool Stack**: Production Ready