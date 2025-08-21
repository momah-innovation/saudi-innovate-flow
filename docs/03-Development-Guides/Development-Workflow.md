# 🔄 Development Workflow Guide

## 📋 **DAILY DEVELOPMENT PROCESS**

### **Morning Routine (10 minutes)**
```bash
# 1. Sync with latest changes
git checkout main
git pull origin main

# 2. Update dependencies if needed
npm install  # Only if package.json changed

# 3. Start development environment
npm run dev  # Terminal 1

# 4. Health check
npm run type-check  # Terminal 2
npm run lint        # Verify code quality
```

### **Environment Verification**
```bash
# Verify all systems are working
✅ Development server: http://localhost:5173
✅ TypeScript compilation: No errors
✅ Linting: No warnings/errors  
✅ Supabase connection: Database accessible
✅ Hot reload: Changes reflect immediately
```

---

## 🌟 **FEATURE DEVELOPMENT LIFECYCLE**

### **1. Planning Phase**
```bash
# Before starting any feature:
1. Review feature requirements and acceptance criteria
2. Check existing codebase for similar implementations
3. Identify affected components and files
4. Plan testing approach
5. Estimate development time
```

### **2. Branch Creation**
```bash
# Create feature branch following naming convention
git checkout -b feature/challenge-evaluation-system
git checkout -b fix/dashboard-performance-issue
git checkout -b docs/api-documentation-update

# Push empty branch to establish tracking
git push -u origin feature/challenge-evaluation-system
```

### **3. Development Cycle**
```bash
# Iterative development process
while [[ "$feature_complete" != "true" ]]; do
    # Make focused changes
    code src/components/challenges/EvaluationForm.tsx
    
    # Test changes immediately
    npm run test -- --watch EvaluationForm
    
    # Verify type safety
    npm run type-check
    
    # Stage and commit incremental progress
    git add .
    git commit -m "feat: add evaluation criteria validation"
    
    # Push regularly for backup
    git push origin feature/challenge-evaluation-system
done
```

### **4. Quality Gates**
```bash
# Before pushing final changes
npm run lint:fix          # Auto-fix linting issues
npm run type-check        # Ensure type safety
npm run test              # All tests pass
npm run build             # Verify production build
npm run test:e2e          # End-to-end tests (if applicable)
```

---

## 📦 **COMPONENT DEVELOPMENT PATTERN**

### **Component Creation Template**
```typescript
// src/components/challenges/EvaluationCriteria.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EvaluationCriteriaProps {
  challengeId: string;
  criteria: CriteriaItem[];
  onUpdate: (criteria: CriteriaItem[]) => void;
}

export const EvaluationCriteria: React.FC<EvaluationCriteriaProps> = ({
  challengeId,
  criteria,
  onUpdate
}) => {
  const { t } = useTranslation('challenges');
  
  // Component logic here
  
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};

export default EvaluationCriteria;
```

### **Hook Development Pattern**
```typescript
// src/hooks/useEvaluationCriteria.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEvaluationCriteria = (challengeId: string) => {
  const queryClient = useQueryClient();
  
  // Fetch criteria
  const { data: criteria, isLoading, error } = useQuery({
    queryKey: ['evaluation-criteria', challengeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('evaluation_criteria')
        .select('*')
        .eq('challenge_id', challengeId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!challengeId
  });
  
  // Update criteria mutation
  const updateCriteria = useMutation({
    mutationFn: async (newCriteria: CriteriaItem[]) => {
      const { error } = await supabase
        .from('evaluation_criteria')
        .upsert(newCriteria);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['evaluation-criteria', challengeId]);
    }
  });
  
  return {
    criteria,
    isLoading,
    error,
    updateCriteria: updateCriteria.mutate,
    isUpdating: updateCriteria.isPending
  };
};
```

---

## 🧪 **TESTING WORKFLOW**

### **Unit Testing Approach**
```typescript
// src/components/challenges/__tests__/EvaluationCriteria.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EvaluationCriteria } from '../EvaluationCriteria';

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

describe('EvaluationCriteria', () => {
  let queryClient: QueryClient;
  
  beforeEach(() => {
    queryClient = createTestQueryClient();
  });
  
  it('renders criteria list correctly', async () => {
    const mockCriteria = [
      { id: '1', name: 'Innovation', weight: 30 },
      { id: '2', name: 'Feasibility', weight: 25 }
    ];
    
    render(
      <QueryClientProvider client={queryClient}>
        <EvaluationCriteria
          challengeId="challenge-1"
          criteria={mockCriteria}
          onUpdate={jest.fn()}
        />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('Innovation')).toBeInTheDocument();
    expect(screen.getByText('Feasibility')).toBeInTheDocument();
  });
  
  it('handles criteria updates correctly', async () => {
    const mockOnUpdate = jest.fn();
    
    render(
      <QueryClientProvider client={queryClient}>
        <EvaluationCriteria
          challengeId="challenge-1"
          criteria={[]}
          onUpdate={mockOnUpdate}
        />
      </QueryClientProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add criteria/i });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });
});
```

### **Integration Testing**
```typescript
// src/hooks/__tests__/useEvaluationCriteria.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEvaluationCriteria } from '../useEvaluationCriteria';
import { createTestWrapper } from '@/test/utils';

describe('useEvaluationCriteria', () => {
  it('fetches criteria successfully', async () => {
    const { result } = renderHook(
      () => useEvaluationCriteria('challenge-1'),
      { wrapper: createTestWrapper() }
    );
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.criteria).toBeDefined();
    expect(result.current.error).toBeNull();
  });
});
```

---

## 🎯 **GIT WORKFLOW & BEST PRACTICES**

### **Commit Message Convention**
```bash
# Format: type(scope): description
# 
# Types:
feat(challenges): add evaluation criteria management
fix(dashboard): resolve performance issue with large datasets  
docs(api): update authentication documentation
style(ui): improve button hover states
refactor(hooks): optimize database query patterns
test(components): add unit tests for idea submission
chore(deps): update dependencies to latest versions

# Examples:
git commit -m "feat(evaluation): implement weighted scoring system"
git commit -m "fix(auth): handle expired token refresh correctly"
git commit -m "docs(setup): add troubleshooting section"
```

### **Branch Management**
```bash
# Main branch protection
main              # Protected, requires PR + reviews
├── develop       # Integration branch (if used)
├── feature/*     # Feature development branches  
├── fix/*         # Bug fix branches
├── hotfix/*      # Emergency production fixes
└── docs/*        # Documentation updates

# Branch naming conventions
feature/challenge-evaluation-system
feature/ai-powered-idea-analysis
fix/dashboard-performance-issue
fix/authentication-token-refresh
docs/api-documentation-update
docs/component-usage-guide
```

### **Pull Request Process**
```bash
# 1. Ensure branch is up to date
git checkout main
git pull origin main
git checkout feature/your-feature-name
git rebase main  # Resolve conflicts if any

# 2. Final quality check
npm run lint:fix
npm run type-check  
npm run test
npm run build

# 3. Push and create PR
git push origin feature/your-feature-name

# 4. Create PR with template
# Title: Clear, descriptive summary
# Description: 
# - What changes were made
# - Why they were needed  
# - How to test the changes
# - Screenshots if UI changes
# - Breaking changes if any
```

---

## 🔍 **CODE REVIEW PROCESS**

### **Review Checklist for Authors**
```bash
# Before requesting review:
☐ All tests pass locally
☐ TypeScript compilation succeeds
☐ ESLint rules followed
☐ No console.log statements in production code
☐ Translation keys added for new text
☐ Components follow established patterns
☐ Proper error handling implemented
☐ Performance considerations addressed
☐ Accessibility standards met
☐ Documentation updated if needed
```

### **Review Checklist for Reviewers**
```bash
# Code Quality:
☐ Code is readable and well-structured
☐ Logic is sound and efficient
☐ Error handling is appropriate
☐ Security considerations addressed
☐ No code duplication

# Architecture & Patterns:
☐ Follows established component patterns
☐ Proper separation of concerns
☐ Consistent with existing codebase
☐ Appropriate abstraction level

# Testing & Documentation:
☐ Adequate test coverage
☐ Tests are meaningful and correct
☐ Documentation updated if needed
☐ Comments explain complex logic

# UI/UX (if applicable):
☐ Responsive design implemented
☐ Accessibility standards met
☐ Consistent with design system
☐ Good user experience
```

---

## 🚀 **DEPLOYMENT WORKFLOW**

### **Environment Progression**
```bash
# Development → Staging → Production
Development:
- Local development environment
- Feature branches
- Rapid iteration and testing

Staging:  
- Integration testing environment
- Feature branch deployment
- Client review and feedback

Production:
- Live user environment  
- Main branch deployment
- Monitoring and rollback capability
```

### **Deployment Commands**
```bash
# Development deployment (automatic)
git push origin feature/branch-name
# Triggers: Automated deployment to feature environment

# Staging deployment  
git push origin staging
# Triggers: 
# 1. Run full test suite
# 2. Build production bundle
# 3. Deploy to staging environment
# 4. Run smoke tests

# Production deployment
git push origin main  
# Triggers:
# 1. Final security scan
# 2. Performance benchmark
# 3. Database migration (if needed)
# 4. Zero-downtime deployment
# 5. Health checks
# 6. Rollback preparation
```

---

## 📊 **PERFORMANCE MONITORING**

### **Development Performance**
```bash
# Bundle analysis
npm run analyze
# Review: Bundle size, code splitting, dependency analysis

# Performance profiling  
npm run dev -- --profile
# Use: React DevTools Profiler for component performance

# Memory leak detection
# Browser DevTools → Performance → Record user interactions
```

### **Build Performance**
```bash
# Build time optimization
time npm run build

# Type checking performance  
time npm run type-check

# Test execution time
time npm run test
```

---

## 🔧 **DEBUGGING WORKFLOW**

### **Development Debugging**
```typescript
// 1. React DevTools
// Install: React Developer Tools browser extension
// Use: Component inspection, props/state analysis

// 2. TypeScript Debugging
// VS Code: Set breakpoints in .tsx files
// Browser: Source maps enable debugging

// 3. Network Debugging  
// Browser DevTools → Network tab
// Monitor: API calls, response times, error status codes

// 4. Database Debugging
// Supabase Dashboard → SQL Editor
// Monitor: Query performance, RLS policy testing
```

### **Production Debugging**
```bash
# Error tracking
# Use: Browser error console, Supabase logs

# Performance monitoring
# Use: Lighthouse, Web Vitals, React DevTools Profiler

# User issue reproduction
# Steps: Replicate user actions in staging environment
```

---

## 🎯 **WORKFLOW EFFICIENCY TIPS**

### **Development Speed**
```bash
# Hot reload optimization
# Use: Vite's fast HMR for instant updates

# Type checking
# Use: VS Code TypeScript integration for real-time feedback

# Testing efficiency  
# Use: Jest watch mode for continuous testing
npm run test:watch

# Code generation
# Use: VS Code snippets for common patterns
# Use: Component templates for consistency
```

### **Automation Tools**
```bash
# Git hooks (automated)
pre-commit: lint-staged, type-check
pre-push: full test suite

# VS Code tasks (manual)
Cmd+Shift+P → "Tasks: Run Task"
- Build and analyze bundle
- Run specific test file
- Format all files
- Generate component template
```

---

## 📋 **WORKFLOW CHECKLISTS**

### **New Feature Checklist**
```bash
☐ Feature branch created from main
☐ Requirements and acceptance criteria reviewed
☐ Component interfaces designed
☐ Implementation completed
☐ Unit tests written and passing
☐ Integration tests added
☐ Error handling implemented
☐ Loading states handled
☐ Translations added (Arabic/English)
☐ Responsive design verified
☐ Accessibility tested
☐ Performance impact assessed
☐ Documentation updated
☐ Code review completed
☐ PR approved and merged
```

### **Bug Fix Checklist**
```bash
☐ Issue reproduced and understood
☐ Root cause identified
☐ Fix implemented and tested
☐ Regression tests added
☐ Related areas tested for side effects
☐ Performance impact verified
☐ Code review completed
☐ Fix deployed and verified
☐ Issue closed with resolution notes
```

---

This development workflow ensures consistent, high-quality code development while maintaining team productivity and code maintainability. Following these processes results in reliable software delivery and smooth team collaboration.

*For specific coding standards and component patterns, see [Component Standards](./Component-Standards.md).*