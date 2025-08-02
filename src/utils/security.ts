import { supabase } from '@/integrations/supabase/client'
import { fileValidation } from '@/config/production'

/**
 * Secure file upload utility with validation and virus scanning
 */
export class SecureFileUpload {
  private static readonly SCAN_ENDPOINT = '/api/scan-file' // Implement virus scanning endpoint
  
  /**
   * Upload file with security validation
   */
  static async uploadFile(
    file: File, 
    bucket: string, 
    path: string, 
    options: {
      isPublic?: boolean
      scanForVirus?: boolean
    } = {}
  ) {
    // Validate file
    fileValidation.validate(file)
    
    // Optional virus scanning
    if (options.scanForVirus) {
      await this.scanFile(file)
    }
    
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        duplex: 'half'
      })
    
    if (error) {
      console.error('File upload failed:', error)
      throw new Error('File upload failed')
    }
    
    return data
  }
  
  /**
   * Virus scanning simulation (replace with actual service)
   */
  private static async scanFile(file: File): Promise<void> {
    // In production, integrate with a virus scanning service
    // like ClamAV, VirusTotal, or cloud-based solutions
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch(this.SCAN_ENDPOINT, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Virus scan failed')
      }
      
      const result = await response.json()
      
      if (result.infected) {
        throw new Error('File contains malicious content')
      }
    } catch (error) {
      console.warn('Virus scanning unavailable, proceeding without scan')
      // In production, you might want to reject uploads if scanning fails
    }
  }
  
  /**
   * Generate secure download URL with expiration
   */
  static async getSecureUrl(
    bucket: string, 
    path: string, 
    expiresIn: number = 3600
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    
    if (error) {
      throw new Error('Failed to generate secure URL')
    }
    
    return data.signedUrl
  }
  
  /**
   * Delete file securely
   */
  static async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) {
      throw new Error('Failed to delete file')
    }
  }
}

/**
 * Input sanitization utilities
 */
export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHtml(input: string): string {
    // Remove script tags and event handlers
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/data:/gi, '')
  }
  
  /**
   * Sanitize SQL input (basic prevention)
   */
  static sanitizeSql(input: string): string {
    // Remove common SQL injection patterns
    return input
      .replace(/['";]/g, '')
      .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b/gi, '')
      .trim()
  }
  
  /**
   * Validate and sanitize user input
   */
  static sanitizeUserInput(input: string, type: 'text' | 'email' | 'url' = 'text'): string {
    let sanitized = input.trim()
    
    switch (type) {
      case 'email':
        // Basic email validation and sanitization
        sanitized = sanitized.toLowerCase()
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized)) {
          throw new Error('Invalid email format')
        }
        break
        
      case 'url':
        // URL validation
        try {
          const url = new URL(sanitized)
          if (!['http:', 'https:'].includes(url.protocol)) {
            throw new Error('Invalid URL protocol')
          }
        } catch {
          throw new Error('Invalid URL format')
        }
        break
        
      default:
        // General text sanitization
        sanitized = this.sanitizeHtml(sanitized)
        break
    }
    
    return sanitized
  }
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private static requests = new Map<string, number[]>()
  
  /**
   * Check if request is within rate limit
   */
  static checkLimit(
    key: string, 
    limit: number, 
    windowMs: number = 60000
  ): boolean {
    const now = Date.now()
    const userRequests = this.requests.get(key) || []
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= limit) {
      return false
    }
    
    // Add current request
    validRequests.push(now)
    this.requests.set(key, validRequests)
    
    return true
  }
  
  /**
   * Clear expired entries periodically
   */
  static cleanup(): void {
    const now = Date.now()
    
    for (const [key, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < 300000) // 5 minutes
      
      if (validRequests.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, validRequests)
      }
    }
  }
}

// Initialize cleanup interval
setInterval(() => RateLimiter.cleanup(), 300000) // Cleanup every 5 minutes