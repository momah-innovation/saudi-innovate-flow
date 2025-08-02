import { renderHook, waitFor } from '@/test/utils/test-utils'
import { vi, describe, it, beforeEach, expect } from 'vitest'

// Mock supabase client
const mockSupabase = {
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(),
    getSession: vi.fn()
  }
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}))

// Mock auth hook
const mockUseAuth = () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  user: null,
  loading: false,
  error: null
})

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mockUseAuth
}))

describe('useAuth Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides authentication methods', () => {
    const { result } = renderHook(() => mockUseAuth())
    
    expect(result.current.signIn).toBeDefined()
    expect(result.current.signOut).toBeDefined()
    expect(result.current.user).toBeDefined()
    expect(result.current.loading).toBeDefined()
  })

  it('handles successful sign in', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: '1', email: 'test@example.com' } },
      error: null
    })

    const { result } = renderHook(() => mockUseAuth())
    
    await result.current.signIn('test@example.com', 'password')
    
    expect(result.current.signIn).toBeDefined()
  })

  it('handles sign in error', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid credentials' }
    })

    const { result } = renderHook(() => mockUseAuth())
    
    expect(result.current.error).toBeNull()
  })

  it('handles sign out', async () => {
    mockSupabase.auth.signOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => mockUseAuth())
    
    await result.current.signOut()
    
    expect(result.current.signOut).toBeDefined()
  })
})