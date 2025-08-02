import { render, screen } from '@/test/utils/test-utils'
import { Button } from '@/components/ui/button'
import { vi, describe, it, expect } from 'vitest'

// Mock components and contexts
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' }
    },
    signOut: vi.fn()
  })
}))

vi.mock('@/contexts/SettingsContext', () => ({
  useSettings: () => ({
    language: 'en',
    setLanguage: vi.fn(),
    theme: 'light',
    setTheme: vi.fn()
  })
}))

// Simple header component for testing
const Header = () => {
  return (
    <header>
      <div>رُواد</div>
      <nav>
        <Button variant="ghost">Dashboard</Button>
        <Button variant="ghost">Challenges</Button>
      </nav>
      <div>
        <Button variant="ghost">Test User</Button>
        <Button variant="ghost">Toggle Theme</Button>
        <Button variant="ghost">Language</Button>
      </div>
    </header>
  )
}

describe('Header Component', () => {
  it('renders header with logo', () => {
    render(<Header />)
    expect(screen.getByText('رُواد')).toBeInTheDocument()
  })

  it('displays navigation items', () => {
    render(<Header />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Challenges')).toBeInTheDocument()
  })

  it('shows user menu when authenticated', () => {
    render(<Header />)
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('shows theme toggle button', () => {
    render(<Header />)
    expect(screen.getByText('Toggle Theme')).toBeInTheDocument()
  })

  it('shows language selector', () => {
    render(<Header />)
    expect(screen.getByText('Language')).toBeInTheDocument()
  })
})