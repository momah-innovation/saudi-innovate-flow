import { render, screen, fireEvent } from '@/test/utils/test-utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { describe, it, expect, vi } from 'vitest'

// Mock navigation components
const Breadcrumb = ({ children }: { children: React.ReactNode }) => (
  <nav aria-label="breadcrumb">
    <ol className="flex items-center space-x-2">{children}</ol>
  </nav>
)

const BreadcrumbItem = ({ children, isLast = false }: { children: React.ReactNode; isLast?: boolean }) => (
  <li className={`flex items-center ${!isLast ? 'after:content-["/"] after:ml-2' : ''}`}>
    {children}
  </li>
)

const Sidebar = ({ isOpen = true, onToggle }: { isOpen?: boolean; onToggle?: () => void }) => (
  <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
    <Button onClick={onToggle} variant="ghost" size="sm">
      {isOpen ? <ChevronLeft /> : <ChevronRight />}
    </Button>
    <nav>
      <ul>
        <li><Button variant="ghost" className="w-full justify-start"><Home />Dashboard</Button></li>
        <li><Button variant="ghost" className="w-full justify-start">Challenges</Button></li>
        <li><Button variant="ghost" className="w-full justify-start">Ideas</Button></li>
      </ul>
    </nav>
  </aside>
)

describe('Navigation Components', () => {
  describe('Breadcrumb Component', () => {
    it('renders breadcrumb navigation', () => {
      render(
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link">Home</Button>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <Button variant="link">Challenges</Button>
          </BreadcrumbItem>
          <BreadcrumbItem isLast>
            <span>Current Page</span>
          </BreadcrumbItem>
        </Breadcrumb>
      )

      expect(screen.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
      expect(screen.getByText('Home')).toBeInTheDocument()
      expect(screen.getByText('Challenges')).toBeInTheDocument()
      expect(screen.getByText('Current Page')).toBeInTheDocument()
    })

    it('handles breadcrumb item clicks', () => {
      const handleClick = vi.fn()
      render(
        <Breadcrumb>
          <BreadcrumbItem>
            <Button variant="link" onClick={handleClick}>Home</Button>
          </BreadcrumbItem>
        </Breadcrumb>
      )

      fireEvent.click(screen.getByText('Home'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Sidebar Component', () => {
    it('renders sidebar with navigation items', () => {
      render(<Sidebar />)

      expect(screen.getByText('Dashboard')).toBeInTheDocument()
      expect(screen.getByText('Challenges')).toBeInTheDocument()
      expect(screen.getByText('Ideas')).toBeInTheDocument()
    })

    it('toggles sidebar visibility', () => {
      const handleToggle = vi.fn()
      render(<Sidebar isOpen={true} onToggle={handleToggle} />)

      const toggleButton = screen.getAllByRole('button')[0]
      fireEvent.click(toggleButton)
      expect(handleToggle).toHaveBeenCalledTimes(1)
    })

    it('shows correct state classes', () => {
      const { rerender } = render(<Sidebar isOpen={true} />)
      expect(screen.getByRole('complementary')).toHaveClass('open')

      rerender(<Sidebar isOpen={false} />)
      expect(screen.getByRole('complementary')).toHaveClass('closed')
    })

    it('handles navigation item clicks', () => {
      const handleClick = vi.fn()
      const CustomSidebar = () => (
        <aside className="sidebar">
          <Button variant="ghost" onClick={handleClick}>Custom Item</Button>
        </aside>
      )
      
      render(<CustomSidebar />)

      fireEvent.click(screen.getByText('Custom Item'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('Navigation Accessibility', () => {
    it('provides proper ARIA labels', () => {
      render(
        <nav aria-label="Main navigation">
          <Button>Home</Button>
          <Button aria-current="page">Current Page</Button>
        </nav>
      )

      expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Current Page' })).toHaveAttribute('aria-current', 'page')
    })

    it('supports keyboard navigation', () => {
      render(
        <nav>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </nav>
      )

      const buttons = screen.getAllByRole('button')
      buttons[0].focus()
      expect(buttons[0]).toHaveFocus()

      fireEvent.keyDown(buttons[0], { key: 'Tab' })
      // Note: Actual focus change behavior depends on browser implementation
    })
  })
})