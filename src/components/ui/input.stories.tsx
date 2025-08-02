import type { Meta, StoryObj } from '@storybook/react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Search, Mail, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component for forms and user input.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const Types: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label htmlFor="text">Text Input</Label>
        <Input id="text" type="text" placeholder="Enter text" />
      </div>
      <div>
        <Label htmlFor="email">Email Input</Label>
        <Input id="email" type="email" placeholder="Enter email" />
      </div>
      <div>
        <Label htmlFor="password">Password Input</Label>
        <Input id="password" type="password" placeholder="Enter password" />
      </div>
      <div>
        <Label htmlFor="number">Number Input</Label>
        <Input id="number" type="number" placeholder="Enter number" />
      </div>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10" placeholder="Search..." />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10" type="email" placeholder="Email address" />
      </div>
    </div>
  ),
}

const PasswordInput = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-80">
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder="Enter password"
        className="pr-10"
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Eye className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  )
}

export const PasswordToggle: Story = {
  render: () => <PasswordInput />,
}

export const States: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label htmlFor="normal">Normal</Label>
        <Input id="normal" placeholder="Normal input" />
      </div>
      <div>
        <Label htmlFor="disabled">Disabled</Label>
        <Input id="disabled" placeholder="Disabled input" disabled />
      </div>
      <div>
        <Label htmlFor="error">Error State</Label>
        <Input
          id="error"
          placeholder="Error input"
          className="border-red-500 focus:ring-red-500"
        />
      </div>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input className="h-8 text-sm" placeholder="Small input" />
      <Input placeholder="Default input" />
      <Input className="h-12 text-lg" placeholder="Large input" />
    </div>
  ),
}