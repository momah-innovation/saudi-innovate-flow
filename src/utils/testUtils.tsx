import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock user profile for testing
export const mockUserProfile = {
  id: '123',
  email: 'test@example.com',
  name: 'Test User',
  profile_completion_percentage: 80,
  user_roles: [{ role: 'innovator', is_active: true }],
  basic_access: true,
};

// Mock authenticated user
export const mockAuthenticatedUser = {
  user: { id: '123', email: 'test@example.com' },
  userProfile: mockUserProfile,
  loading: false,
  hasRole: (role: string) => role === 'innovator',
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
  updateProfile: async () => ({ error: null }),
  session: null,
};

// Mock unauthenticated user
export const mockUnauthenticatedUser = {
  user: null,
  userProfile: null,
  loading: false,
  hasRole: () => false,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
  updateProfile: async () => ({ error: null }),
  session: null,
};