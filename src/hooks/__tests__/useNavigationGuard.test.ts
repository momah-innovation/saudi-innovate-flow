import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useNavigationGuard } from '../useNavigationGuard';
import { useAuth } from '@/contexts/AuthContext';

// Mock dependencies
vi.mock('@/contexts/AuthContext');
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

describe('useNavigationGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides guardedNavigate function', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
      hasRole: vi.fn(),
    });

    const { result } = renderHook(() => useNavigationGuard());
    
    expect(typeof result.current.guardedNavigate).toBe('function');
    expect(typeof result.current.checkAccess).toBe('function');
  });

  it('allows access when no restrictions', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
      hasRole: vi.fn(),
    });

    const { result } = renderHook(() => useNavigationGuard());
    
    expect(result.current.checkAccess()).toBe(true);
  });

  it('blocks access when auth required but no user', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
      hasRole: vi.fn(),
    });

    const { result } = renderHook(() => useNavigationGuard());
    
    expect(result.current.checkAccess({ requireAuth: true })).toBe(false);
  });

  it('allows access when user is authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      userProfile: { id: '123', profile_completion_percentage: 80 },
      loading: false,
      hasRole: vi.fn(),
    });

    const { result } = renderHook(() => useNavigationGuard());
    
    expect(result.current.checkAccess({ requireAuth: true })).toBe(true);
  });

  it('blocks access when required role is missing', () => {
    const mockHasRole = vi.fn().mockReturnValue(false);
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      userProfile: { id: '123', profile_completion_percentage: 80 },
      loading: false,
      hasRole: mockHasRole,
    });

    const { result } = renderHook(() => useNavigationGuard());
    
    expect(result.current.checkAccess({ 
      requireAuth: true, 
      requiredRole: 'admin' 
    })).toBe(false);
    expect(mockHasRole).toHaveBeenCalledWith('admin');
  });

  it('allows access when user has required role', () => {
    const mockHasRole = vi.fn().mockReturnValue(true);
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      userProfile: { id: '123', profile_completion_percentage: 80 },
      loading: false,
      hasRole: mockHasRole,
    });

    const { result } = renderHook(() => useNavigationGuard());
    
    expect(result.current.checkAccess({ 
      requireAuth: true, 
      requiredRole: 'admin' 
    })).toBe(true);
    expect(mockHasRole).toHaveBeenCalledWith('admin');
  });

  it('blocks access when profile is incomplete', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      userProfile: { id: '123', profile_completion_percentage: 30 },
      loading: false,
      hasRole: vi.fn(),
    });

    const { result } = renderHook(() => useNavigationGuard());
    
    expect(result.current.checkAccess({ 
      requireAuth: true,
      requireProfile: true 
    })).toBe(false);
  });
});