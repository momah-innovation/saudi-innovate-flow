import { render, screen, fireEvent } from '@/test/utils/test-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { describe, it, expect } from 'vitest'

describe('Data Display Components', () => {
  describe('Card Component', () => {
    it('renders card with all sections', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test Content</p>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('applies hover effects correctly', () => {
      render(
        <Card className="cursor-pointer hover:shadow-lg">
          <CardContent>Hoverable Card</CardContent>
        </Card>
      )

      const card = screen.getByText('Hoverable Card').closest('div')
      expect(card).toHaveClass('cursor-pointer')
    })
  })

  describe('Badge Component', () => {
    it('renders badge with different variants', () => {
      render(
        <div>
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      )

      expect(screen.getByText('Default')).toBeInTheDocument()
      expect(screen.getByText('Secondary')).toBeInTheDocument()
      expect(screen.getByText('Destructive')).toBeInTheDocument()
      expect(screen.getByText('Outline')).toBeInTheDocument()
    })

    it('applies correct variant classes', () => {
      render(<Badge variant="destructive">Error Badge</Badge>)
      const badge = screen.getByText('Error Badge')
      expect(badge).toHaveClass('bg-destructive')
    })
  })

  describe('Progress Component', () => {
    it('renders progress with correct value', () => {
      render(<Progress value={75} aria-label="Progress" />)
      const progress = screen.getByRole('progressbar')
      expect(progress).toBeInTheDocument()
      expect(progress).toHaveAttribute('aria-valuenow', '75')
    })

    it('handles edge cases', () => {
      render(
        <div>
          <Progress value={0} aria-label="Empty" />
          <Progress value={100} aria-label="Full" />
        </div>
      )

      const emptyProgress = screen.getByLabelText('Empty')
      const fullProgress = screen.getByLabelText('Full')
      
      expect(emptyProgress).toHaveAttribute('aria-valuenow', '0')
      expect(fullProgress).toHaveAttribute('aria-valuenow', '100')
    })
  })
})