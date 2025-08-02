import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CalendarDays, MessageSquare, Users } from 'lucide-react'

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible card component for displaying content with optional header and footer sections.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area where you can place any information.</p>
      </CardContent>
    </Card>
  ),
}

export const ChallengeCard: Story = {
  render: () => (
    <Card className="w-80 hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Innovation Challenge 2024</CardTitle>
          <Badge variant="secondary">Active</Badge>
        </div>
        <CardDescription>
          Develop sustainable solutions for urban transportation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={65} className="h-2" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>24 participants</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>5 days left</span>
          </div>
        </div>
        <Button className="w-full">View Challenge</Button>
      </CardContent>
    </Card>
  ),
}

export const UserProfileCard: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base">John Doe</CardTitle>
            <CardDescription>Innovation Expert</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-2xl font-bold">12</div>
            <div className="text-xs text-muted-foreground">Challenges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">48</div>
            <div className="text-xs text-muted-foreground">Ideas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

export const StatCard: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-medium">Total Ideas</div>
          </div>
          <div className="text-2xl font-bold">1,234</div>
          <div className="text-xs text-muted-foreground">+12% from last month</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-600" />
            <div className="text-sm font-medium">Active Users</div>
          </div>
          <div className="text-2xl font-bold">856</div>
          <div className="text-xs text-muted-foreground">+8% from last month</div>
        </CardContent>
      </Card>
    </div>
  ),
}