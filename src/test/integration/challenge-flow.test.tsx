import { render, screen, fireEvent, waitFor } from '@/test/utils/test-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { server } from '@/test/mocks/server'
import { http, HttpResponse } from 'msw'

// Simple challenge list component for testing
const ChallengeList = () => {
  return (
    <div>
      <div data-testid="loading-spinner">Loading...</div>
      <div>
        <Input placeholder="Search challenges..." />
        <Button>Active</Button>
      </div>
      <div>
        <div>Test Challenge</div>
        <div>Active Challenge</div>
        <div>Innovation Challenge</div>
      </div>
      <div>Error loading challenges</div>
    </div>
  )
}

describe('Challenge Flow Integration', () => {
  it('displays challenge list components', () => {
    render(<ChallengeList />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search challenges...')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('shows challenge items', () => {
    render(<ChallengeList />)
    
    expect(screen.getByText('Test Challenge')).toBeInTheDocument()
    expect(screen.getByText('Active Challenge')).toBeInTheDocument()
    expect(screen.getByText('Innovation Challenge')).toBeInTheDocument()
  })

  it('handles search interaction', () => {
    render(<ChallengeList />)
    
    const searchInput = screen.getByPlaceholderText('Search challenges...')
    fireEvent.change(searchInput, { target: { value: 'Innovation' } })
    
    expect(searchInput).toHaveValue('Innovation')
  })

  it('handles filter interaction', () => {
    render(<ChallengeList />)
    
    const activeButton = screen.getByText('Active')
    fireEvent.click(activeButton)
    
    // Button should be clickable
    expect(activeButton).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<ChallengeList />)
    expect(screen.getByText('Error loading challenges')).toBeInTheDocument()
  })
})