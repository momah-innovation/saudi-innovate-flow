import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
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

  it('shows loading state when auth is loading', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: true,
      hasRole: vi.fn(),
    });

    renderProtectedRoute({ requireAuth: true });
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('redirects to /auth when requireAuth and no user', async () => {
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
      hasRole: vi.fn(),
    });

    renderProtectedRoute({ requireAuth: true });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth');
    });
  });

  it('shows content when user is authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      userProfile: { id: '123', profile_completion_percentage: 80 },
      loading: false,
      hasRole: vi.fn(),
    });

    renderProtectedRoute({ requireAuth: true });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('checks required roles correctly', async () => {
    const mockHasRole = vi.fn().mockReturnValue(false);
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      userProfile: { id: '123', profile_completion_percentage: 80 },
      loading: false,
      hasRole: mockHasRole,
    });

    renderProtectedRoute({ 
      requireAuth: true, 
      requiredRoles: ['admin'] 
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/access-denied');
    });
    expect(mockHasRole).toHaveBeenCalledWith('admin');
  });

  it('allows access with correct role', () => {
    const mockHasRole = vi.fn().mockReturnValue(true);
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      userProfile: { id: '123', profile_completion_percentage: 80 },
      loading: false,
      hasRole: mockHasRole,
    });

    renderProtectedRoute({ 
      requireAuth: true, 
      requiredRoles: ['admin'] 
    });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(mockHasRole).toHaveBeenCalledWith('admin');
  });

  it('redirects to profile completion when profile incomplete', async () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      userProfile: { id: '123', profile_completion_percentage: 30 },
      loading: false,
      hasRole: vi.fn(),
    });

    renderProtectedRoute({ 
      requireAuth: true, 
      requireCompleteProfile: true 
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/profile/complete');
    });
  });

  it('shows custom unauthorized component', () => {
    const CustomUnauthorized = () => <div>Custom Unauthorized</div>;
    
    (useAuth as any).mockReturnValue({
      user: null,
      userProfile: null,
      loading: false,
      hasRole: vi.fn(),
    });

    renderProtectedRoute({ 
      requireAuth: true,
      unauthorizedComponent: <CustomUnauthorized />
    });
    
    expect(screen.getByText('Custom Unauthorized')).toBeInTheDocument();
  });
});