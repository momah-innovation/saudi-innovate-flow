import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce, useThrottle } from '@/hooks/performance/use-debounce-throttle'

describe('Performance Hooks', () => {
  describe('useDebounce', () => {
    it('should debounce values correctly', async () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        {
          initialProps: { value: 'initial', delay: 100 }
        }
      )

      expect(result.current).toBe('initial')

      // Update value multiple times quickly
      rerender({ value: 'updated1', delay: 100 })
      rerender({ value: 'updated2', delay: 100 })
      rerender({ value: 'final', delay: 100 })

      // Should still be initial value immediately
      expect(result.current).toBe('initial')

      // Wait for debounce delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150))
      })

      expect(result.current).toBe('final')
    })
  })

  describe('useThrottle', () => {
    it('should throttle function calls', () => {
      const mockFn = vi.fn()
      const { result } = renderHook(() => useThrottle(mockFn, 100))

      // Call multiple times quickly
      act(() => {
        result.current('call1')
        result.current('call2')
        result.current('call3')
      })

      // Should only be called once due to throttling
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('call1')
    })
  })
})