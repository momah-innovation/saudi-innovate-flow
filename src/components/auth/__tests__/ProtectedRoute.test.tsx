import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

// Mock the auth hook
vi.mock('@/contexts/AuthContext');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const TestComponent = () => <div>Protected Content</div>;

const renderProtectedRoute = (props = {}) => {
  return render(
    <BrowserRouter>
      <ProtectedRoute {...props}>
        <TestComponent />
      </ProtectedRoute>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading when auth is loading', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: true,
      hasRole: vi.fn().mockReturnValue(false),
    });

    renderProtectedRoute({ requireAuth: true });
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to /auth when requireAuth and no user', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
      hasRole: vi.fn().mockReturnValue(false),
    });

    renderProtectedRoute({ requireAuth: true });
    
    // Should redirect to auth instead of showing content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /profile/setup when profile completion < 80%', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      userProfile: { profile_completion_percentage: 50 },
      loading: false,
      hasRole: vi.fn().mockReturnValue(false),
    });

    renderProtectedRoute({ requireAuth: true, requireProfile: true });
    
    // Should redirect to profile setup instead of showing content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to /dashboard when required role not satisfied', () => {
    const mockHasRole = vi.fn().mockReturnValue(false);
    
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      userProfile: { 
        profile_completion_percentage: 90,
        user_roles: [{ role: 'innovator', is_active: true }]
      },
      loading: false,
      hasRole: mockHasRole,
    });

    renderProtectedRoute({ 
      requireAuth: true, 
      requiredRole: 'admin' 
    });
    
    expect(mockHasRole).toHaveBeenCalledWith('admin');
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders content when all requirements met', () => {
    const mockHasRole = vi.fn().mockReturnValue(true);
    
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      userProfile: { 
        profile_completion_percentage: 90,
        user_roles: [{ role: 'admin', is_active: true }]
      },
      loading: false,
      hasRole: mockHasRole,
    });

    renderProtectedRoute({ 
      requireAuth: true, 
      requireProfile: true,
      requiredRole: 'admin' 
    });
    
    expect(mockHasRole).toHaveBeenCalledWith('admin');
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders content when no special requirements', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      userProfile: { profile_completion_percentage: 90 },
      loading: false,
      hasRole: vi.fn().mockReturnValue(false),
    });

    renderProtectedRoute({ requireAuth: false });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('handles array of required roles', () => {
    const mockHasRole = vi.fn()
      .mockReturnValueOnce(false) // First role check fails
      .mockReturnValueOnce(true);  // Second role check passes
    
    (useAuth as any).mockReturnValue({
      user: { id: '123' },
      userProfile: { 
        profile_completion_percentage: 90,
        user_roles: [{ role: 'team_member', is_active: true }]
      },
      loading: false,
      hasRole: mockHasRole,
    });

    renderProtectedRoute({ 
      requireAuth: true,
      requiredRole: ['admin', 'team_member'] 
    });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});