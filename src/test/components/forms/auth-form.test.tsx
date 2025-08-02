import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { vi } from 'vitest'

// Mock the auth context
const mockSignIn = vi.fn()
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    loading: false,
    error: null
  })
}))

// Simple auth form component for testing
const LoginForm = () => {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <Input id="email" type="email" placeholder="Enter your email" />
      
      <label htmlFor="password">Password</label>
      <Input id="password" type="password" placeholder="Enter your password" />
      
      <Button type="submit">Sign In</Button>
    </form>
  )
}

describe('LoginForm Component', () => {
  beforeEach(() => {
    mockSignIn.mockClear()
  })

  it('renders login form fields', () => {
    render(<LoginForm />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('displays email and password inputs', () => {
    render(<LoginForm />)
    
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    
    expect(emailInput).toBeInTheDocument()
    expect(passwordInput).toBeInTheDocument()
  })

  it('has proper form structure', () => {
    render(<LoginForm />)
    
    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()
  })
})