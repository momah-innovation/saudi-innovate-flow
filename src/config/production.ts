/**
 * Environment Configuration for Production
 * 
 * CRITICAL: These values must be set in production environment
 * DO NOT commit actual production values to version control
 */

// Production environment template
export const productionConfig = {
  // Supabase Configuration (REQUIRED)
  SUPABASE_URL: 'https://your-project-id.supabase.co',
  SUPABASE_ANON_KEY: 'your-production-anon-key',
  
  // Application Configuration
  APP_ENV: 'production',
  APP_URL: 'https://your-domain.com',
  
  // Security Configuration
  SESSION_TIMEOUT: '24h',
  MAX_FILE_SIZE: '10MB',
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  
  // Performance Configuration
  BUNDLE_SIZE_LIMIT: '1MB',
  API_TIMEOUT: '30s',
  
  // Monitoring Configuration
  SENTRY_DSN: 'your-sentry-dsn',
  GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
}

// Environment validation
export const validateEnvironment = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ]
  
  const missing = required.filter(key => !import.meta.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Security headers configuration
export const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  
  // HSTS (if using HTTPS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
}

// File upload validation
export const fileValidation = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'image/jpeg',
    'image/png', 
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  
  validate: (file: File) => {
    if (file.size > fileValidation.maxSize) {
      throw new Error(`File size exceeds ${fileValidation.maxSize / (1024 * 1024)}MB limit`)
    }
    
    if (!fileValidation.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} not allowed`)
    }
    
    return true
  }
}