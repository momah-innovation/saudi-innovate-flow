import { describe, it, expect } from 'vitest'
import { analyzeBundleSize } from '@/utils/bundle-analyzer'

describe('Bundle Size Analysis', () => {
  it('analyzes main bundle size', async () => {
    const analysis = await analyzeBundleSize()
    
    expect(analysis).toHaveProperty('totalSize')
    expect(analysis).toHaveProperty('chunks')
    expect(analysis).toHaveProperty('heavyDependencies')
    expect(analysis).toHaveProperty('recommendations')
  })

  it('identifies heavy dependencies', async () => {
    const analysis = await analyzeBundleSize()
    
    // Check that analysis identifies potential heavy dependencies
    expect(analysis.heavyDependencies).toBeInstanceOf(Array)
    
    // Warn if bundle is too large (> 1MB)
    if (analysis.totalSize > 1024 * 1024) {
      console.warn(`Bundle size is ${analysis.totalSize} bytes, consider optimization`)
    }
  })

  it('provides optimization recommendations', async () => {
    const analysis = await analyzeBundleSize()
    
    expect(analysis.recommendations).toBeInstanceOf(Array)
    expect(analysis.recommendations.length).toBeGreaterThan(0)
  })

  it('checks for proper code splitting', async () => {
    const analysis = await analyzeBundleSize()
    
    // Should have multiple chunks indicating code splitting
    expect(analysis.chunks.length).toBeGreaterThan(1)
    
    // Main chunk should not be overwhelmingly large
    const mainChunk = analysis.chunks.find(chunk => chunk.name.includes('main'))
    if (mainChunk) {
      expect(mainChunk.size).toBeLessThan(500 * 1024) // Less than 500KB
    }
  })
})