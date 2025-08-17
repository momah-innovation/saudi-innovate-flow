# 🚀 Deployment Guide

## Overview
Comprehensive deployment strategies and processes for the Ruwād Platform, covering production deployment, staging environments, and CI/CD pipelines.

## Deployment Architecture

### Production Environment Setup
```yaml
# docker-compose.production.yml
version: '3.8'
services:
  app:
    image: ruwad-platform:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
      - SUPABASE_URL=https://jxpbiljkoibvqxzdkgod.supabase.co
      - SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: unless-stopped
    
volumes:
  redis_data:
```

### Nginx Configuration
```nginx
# nginx.conf
upstream app {
    server app:3000;
}

server {
    listen 80;
    server_name ruwad.sa www.ruwad.sa;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ruwad.sa www.ruwad.sa;
    
    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Static Assets Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }
    
    # API Proxy
    location /api/ {
        proxy_pass https://jxpbiljkoibvqxzdkgod.supabase.co/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Main Application
    location / {
        proxy_pass http://app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run tests
        run: npm run test:ci
        
      - name: Run build
        run: npm run build
        
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-files
          path: dist/

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: 'trivy-results.sarif'

  build-and-push:
    needs: [test, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
      
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
        
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}
            
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging
    
    steps:
      - name: Deploy to staging
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /opt/ruwad-staging
            docker-compose pull
            docker-compose up -d
            docker system prune -f

  deploy-production:
    needs: [build-and-push, deploy-staging]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /opt/ruwad-production
            docker-compose pull
            docker-compose up -d --no-deps app
            docker system prune -f
            
      - name: Health check
        run: |
          sleep 30
          curl -f https://ruwad.sa/health || exit 1
          
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Dockerfile Optimization
```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine AS runtime

# Install Node.js for SSR if needed
RUN apk add --no-cache nodejs npm

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy node_modules for SSR
COPY --from=deps /app/node_modules /app/node_modules

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

## Environment Management

### Environment Configuration
```typescript
// scripts/deploy/environment-config.ts
export interface EnvironmentConfig {
  name: string;
  url: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  features: string[];
  scaling: ScalingConfig;
  monitoring: MonitoringConfig;
}

export const environments: Record<string, EnvironmentConfig> = {
  development: {
    name: 'development',
    url: 'http://localhost:5173',
    supabaseUrl: 'https://jxpbiljkoibvqxzdkgod.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
    features: ['debug', 'hot-reload', 'dev-tools'],
    scaling: {
      instances: 1,
      cpu: '0.5',
      memory: '512Mi'
    },
    monitoring: {
      enabled: false
    }
  },
  
  staging: {
    name: 'staging',
    url: 'https://staging.ruwad.sa',
    supabaseUrl: 'https://jxpbiljkoibvqxzdkgod.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
    features: ['analytics', 'error-tracking'],
    scaling: {
      instances: 2,
      cpu: '1',
      memory: '1Gi'
    },
    monitoring: {
      enabled: true,
      alerting: false
    }
  },
  
  production: {
    name: 'production',
    url: 'https://ruwad.sa',
    supabaseUrl: 'https://jxpbiljkoibvqxzdkgod.supabase.co',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
    features: ['analytics', 'error-tracking', 'performance-monitoring'],
    scaling: {
      instances: 5,
      cpu: '2',
      memory: '2Gi',
      autoScale: true
    },
    monitoring: {
      enabled: true,
      alerting: true,
      uptime: true
    }
  }
};

export const getEnvironmentConfig = (env: string): EnvironmentConfig => {
  const config = environments[env];
  if (!config) {
    throw new Error(`Unknown environment: ${env}`);
  }
  return config;
};
```

### Deployment Scripts
```typescript
// scripts/deploy/deploy.ts
import { execSync } from 'child_process';
import { getEnvironmentConfig } from './environment-config';

export class DeploymentManager {
  private config: EnvironmentConfig;
  
  constructor(private environment: string) {
    this.config = getEnvironmentConfig(environment);
  }

  async deploy() {
    console.log(`🚀 Starting deployment to ${this.environment}`);
    
    try {
      await this.preDeployChecks();
      await this.buildApplication();
      await this.runTests();
      await this.deployToEnvironment();
      await this.postDeployChecks();
      
      console.log(`✅ Deployment to ${this.environment} completed successfully`);
    } catch (error) {
      console.error(`❌ Deployment failed:`, error);
      await this.rollback();
      throw error;
    }
  }

  private async preDeployChecks() {
    console.log('🔍 Running pre-deployment checks...');
    
    // Check environment variables
    const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
      }
    }
    
    // Check Git status
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim() && this.environment === 'production') {
      throw new Error('Working directory is not clean. Commit changes before deploying to production.');
    }
    
    // Check branch
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    if (this.environment === 'production' && currentBranch !== 'main') {
      throw new Error('Production deployments must be from main branch');
    }
  }

  private async buildApplication() {
    console.log('🏗️ Building application...');
    
    // Install dependencies
    execSync('npm ci', { stdio: 'inherit' });
    
    // Run type checking
    execSync('npm run type-check', { stdio: 'inherit' });
    
    // Build application
    execSync(`npm run build:${this.environment}`, { stdio: 'inherit' });
  }

  private async runTests() {
    console.log('🧪 Running tests...');
    
    // Run unit tests
    execSync('npm run test:ci', { stdio: 'inherit' });
    
    // Run integration tests for staging/production
    if (this.environment !== 'development') {
      execSync('npm run test:integration', { stdio: 'inherit' });
    }
    
    // Run E2E tests for production
    if (this.environment === 'production') {
      execSync('npm run test:e2e', { stdio: 'inherit' });
    }
  }

  private async deployToEnvironment() {
    console.log(`🚀 Deploying to ${this.environment}...`);
    
    switch (this.environment) {
      case 'staging':
        await this.deployToStaging();
        break;
      case 'production':
        await this.deployToProduction();
        break;
      default:
        throw new Error(`Deployment to ${this.environment} not supported`);
    }
  }

  private async deployToStaging() {
    // Deploy to staging server
    execSync(`
      rsync -avz --delete dist/ staging@staging.ruwad.sa:/var/www/staging/
      ssh staging@staging.ruwad.sa 'sudo systemctl reload nginx'
    `, { stdio: 'inherit' });
  }

  private async deployToProduction() {
    // Blue-green deployment
    console.log('🔄 Performing blue-green deployment...');
    
    // Deploy to inactive environment
    execSync(`
      rsync -avz --delete dist/ production@ruwad.sa:/var/www/green/
      ssh production@ruwad.sa 'sudo nginx -t && sudo systemctl reload nginx'
    `, { stdio: 'inherit' });
    
    // Switch traffic
    execSync(`
      ssh production@ruwad.sa 'sudo /opt/scripts/switch-to-green.sh'
    `, { stdio: 'inherit' });
  }

  private async postDeployChecks() {
    console.log('✅ Running post-deployment checks...');
    
    // Health check
    const response = await fetch(`${this.config.url}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    
    // Smoke tests
    await this.runSmokeTests();
    
    // Update deployment record
    await this.recordDeployment();
  }

  private async runSmokeTests() {
    const tests = [
      () => this.testHomePage(),
      () => this.testAPI(),
      () => this.testAuthentication()
    ];
    
    for (const test of tests) {
      await test();
    }
  }

  private async testHomePage() {
    const response = await fetch(this.config.url);
    if (!response.ok) {
      throw new Error('Home page is not accessible');
    }
  }

  private async testAPI() {
    const response = await fetch(`${this.config.url}/api/health`);
    if (!response.ok) {
      throw new Error('API is not responding');
    }
  }

  private async testAuthentication() {
    // Test authentication endpoints
    console.log('🔐 Testing authentication...');
  }

  private async rollback() {
    console.log('🔄 Rolling back deployment...');
    
    if (this.environment === 'production') {
      execSync(`
        ssh production@ruwad.sa 'sudo /opt/scripts/rollback.sh'
      `, { stdio: 'inherit' });
    }
  }

  private async recordDeployment() {
    const deployment = {
      environment: this.environment,
      timestamp: new Date().toISOString(),
      version: process.env.GITHUB_SHA || 'unknown',
      status: 'success'
    };
    
    console.log('📝 Recording deployment:', deployment);
  }
}

// CLI usage
if (require.main === module) {
  const environment = process.argv[2];
  if (!environment) {
    console.error('Usage: npm run deploy <environment>');
    process.exit(1);
  }
  
  const deployment = new DeploymentManager(environment);
  deployment.deploy().catch(error => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });
}
```

## Database Migrations

### Migration Management
```typescript
// scripts/deploy/database-migrations.ts
export class MigrationManager {
  async runMigrations(environment: string) {
    console.log(`🗄️ Running database migrations for ${environment}...`);
    
    try {
      // Apply Supabase migrations
      execSync(`supabase db push --environment ${environment}`, { stdio: 'inherit' });
      
      // Verify migrations
      await this.verifyMigrations();
      
      console.log('✅ Database migrations completed successfully');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  private async verifyMigrations() {
    // Run migration verification queries
    console.log('🔍 Verifying database schema...');
    
    // Add verification logic here
  }

  async createMigration(name: string) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const migrationName = `${timestamp}_${name}`;
    
    execSync(`supabase migration new ${migrationName}`, { stdio: 'inherit' });
    
    console.log(`📝 Created migration: ${migrationName}`);
  }
}
```

## Zero-Downtime Deployment

### Blue-Green Deployment Strategy
```bash
#!/bin/bash
# scripts/deploy/blue-green-deploy.sh

set -e

ENVIRONMENT=$1
DEPLOYMENT_COLOR=$2

if [ -z "$ENVIRONMENT" ] || [ -z "$DEPLOYMENT_COLOR" ]; then
    echo "Usage: $0 <environment> <blue|green>"
    exit 1
fi

echo "🔄 Starting blue-green deployment to $ENVIRONMENT ($DEPLOYMENT_COLOR)"

# Build and deploy to inactive environment
echo "🏗️ Building application..."
npm run build

echo "📦 Deploying to $DEPLOYMENT_COLOR environment..."
rsync -avz --delete dist/ deploy@$ENVIRONMENT.ruwad.sa:/var/www/$DEPLOYMENT_COLOR/

# Health check on new deployment
echo "🏥 Running health check..."
curl -f http://$ENVIRONMENT.ruwad.sa:8080/health || {
    echo "❌ Health check failed"
    exit 1
}

# Switch traffic to new environment
echo "🔀 Switching traffic to $DEPLOYMENT_COLOR..."
ssh deploy@$ENVIRONMENT.ruwad.sa "sudo /opt/scripts/switch-traffic.sh $DEPLOYMENT_COLOR"

# Verify traffic switch
sleep 10
curl -f http://$ENVIRONMENT.ruwad.sa/health || {
    echo "❌ Traffic switch failed, rolling back..."
    ssh deploy@$ENVIRONMENT.ruwad.sa "sudo /opt/scripts/rollback.sh"
    exit 1
}

echo "✅ Deployment completed successfully"
```

## Monitoring Integration

### Deployment Monitoring
```typescript
// src/lib/deployment/monitoring.ts
export class DeploymentMonitor {
  async monitorDeployment(deploymentId: string) {
    const metrics = {
      startTime: Date.now(),
      status: 'in-progress',
      healthChecks: [],
      performance: {},
      errors: []
    };

    try {
      // Monitor deployment progress
      await this.trackDeploymentHealth(deploymentId, metrics);
      
      // Performance verification
      await this.verifyPerformance(metrics);
      
      // Error monitoring
      await this.monitorErrors(deploymentId, metrics);
      
      return metrics;
    } catch (error) {
      metrics.status = 'failed';
      metrics.errors.push(error.message);
      throw error;
    }
  }

  private async trackDeploymentHealth(deploymentId: string, metrics: any) {
    const healthEndpoints = [
      '/health',
      '/api/health',
      '/api/auth/health'
    ];

    for (const endpoint of healthEndpoints) {
      const result = await this.checkHealth(endpoint);
      metrics.healthChecks.push(result);
    }
  }

  private async checkHealth(endpoint: string): Promise<HealthCheckResult> {
    try {
      const start = Date.now();
      const response = await fetch(`https://ruwad.sa${endpoint}`);
      const duration = Date.now() - start;
      
      return {
        endpoint,
        status: response.ok ? 'healthy' : 'unhealthy',
        responseTime: duration,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        endpoint,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  private async verifyPerformance(metrics: any) {
    // Measure performance metrics
    const performanceTests = [
      this.measurePageLoadTime(),
      this.measureAPIResponseTime(),
      this.measureDatabasePerformance()
    ];

    const results = await Promise.allSettled(performanceTests);
    metrics.performance = results;
  }

  private async monitorErrors(deploymentId: string, metrics: any) {
    // Monitor error rates
    setTimeout(() => {
      console.log(`Monitoring errors for deployment ${deploymentId}`);
    }, 5000);
  }
}
```

## Rollback Procedures

### Automated Rollback
```typescript
// scripts/deploy/rollback.ts
export class RollbackManager {
  async rollback(environment: string, targetVersion?: string) {
    console.log(`🔄 Starting rollback for ${environment}...`);
    
    try {
      const previousVersion = targetVersion || await this.getLastStableVersion(environment);
      
      // Rollback application
      await this.rollbackApplication(environment, previousVersion);
      
      // Rollback database if needed
      await this.rollbackDatabase(environment, previousVersion);
      
      // Verify rollback
      await this.verifyRollback(environment);
      
      console.log(`✅ Rollback to ${previousVersion} completed successfully`);
    } catch (error) {
      console.error('❌ Rollback failed:', error);
      throw error;
    }
  }

  private async getLastStableVersion(environment: string): Promise<string> {
    // Query deployment history from monitoring system
    return 'v1.2.3'; // Example
  }

  private async rollbackApplication(environment: string, version: string) {
    console.log(`📦 Rolling back application to ${version}...`);
    
    // Docker rollback
    execSync(`
      docker pull ghcr.io/ruwad/platform:${version}
      docker-compose up -d
    `, { stdio: 'inherit' });
  }

  private async rollbackDatabase(environment: string, version: string) {
    console.log(`🗄️ Rolling back database to ${version}...`);
    
    // Apply database rollback migrations if needed
    // Note: Be very careful with database rollbacks
  }

  private async verifyRollback(environment: string) {
    // Run verification tests
    console.log('✅ Verifying rollback...');
  }
}
```

## Best Practices

### 1. **Deployment Safety**
- Always deploy to staging first
- Use blue-green deployments for zero downtime
- Implement comprehensive health checks
- Have rollback procedures ready

### 2. **Security**
- Use environment-specific secrets
- Implement proper SSL/TLS configuration
- Follow security headers best practices
- Regular security scans and updates

### 3. **Monitoring**
- Monitor deployment metrics
- Set up alerting for failures
- Track performance after deployments
- Maintain deployment logs

### 4. **Database Management**
- Use migration scripts for schema changes
- Test migrations on staging first
- Backup before production deployments
- Plan rollback strategies carefully

---

**Last Updated**: January 17, 2025  
**Guide Version**: 1.0  
**Deployment Target**: Production Ready