import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@/components/ui/button'
import { Mail, Download, Plus } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A customizable button component with multiple variants and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button>
        <Mail className="mr-2 h-4 w-4" />
        Login with Email
      </Button>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>
      <Button size="icon" variant="ghost">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  ),
}

export const States: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button className="opacity-50">Loading...</Button>
    </div>
  ),
}

export const Accessibility: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button aria-label="Add new item">
        <Plus className="h-4 w-4" />
      </Button>
      <Button aria-describedby="help-text">
        Help
      </Button>
      <div id="help-text" className="sr-only">
        Click for additional help information
      </div>
    </div>
  ),
}