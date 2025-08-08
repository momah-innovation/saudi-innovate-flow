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
        component: 'A highly customizable button component with multiple variants, sizes, and accessibility features. Built with Radix UI primitives and styled with Tailwind CSS. Supports icon integration, loading states, and comprehensive interaction patterns.',
      },
    },
  },
  tags: ['autodocs', 'design-system', 'interactive'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default', 'primary', 'secondary', 'outline', 'ghost', 'link',
        'destructive', 'success', 'warning', 'info',
        'destructive-subtle', 'success-subtle', 'warning-subtle', 'info-subtle',
        'overlay-primary', 'overlay-secondary', 'overlay-ghost',
        'gradient-primary', 'gradient-success', 'gradient-info',
        'cta', 'elevated', 'glass'
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'lg', 'xl', 'icon', 'icon-sm', 'icon-lg'],
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

export const PrimaryVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button variant="default">Default</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
}

export const StatusVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button variant="destructive">Destructive</Button>
        <Button variant="success">Success</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="info">Info</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="destructive-subtle">Destructive Subtle</Button>
        <Button variant="success-subtle">Success Subtle</Button>
        <Button variant="warning-subtle">Warning Subtle</Button>
        <Button variant="info-subtle">Info Subtle</Button>
      </div>
    </div>
  ),
}

export const OverlayVariants: Story = {
  render: () => (
    <div className="p-8 bg-gradient-to-r from-primary via-primary-hover to-primary rounded-lg">
      <div className="flex gap-2 flex-wrap">
        <Button variant="overlay-primary">Overlay Primary</Button>
        <Button variant="overlay-secondary">Overlay Secondary</Button>
        <Button variant="overlay-ghost">Overlay Ghost</Button>
      </div>
    </div>
  ),
}

export const GradientVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button variant="gradient-primary">Gradient Primary</Button>
      <Button variant="gradient-success">Gradient Success</Button>
      <Button variant="gradient-info">Gradient Info</Button>
    </div>
  ),
}

export const SpecialVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Button variant="cta">Call to Action</Button>
      <Button variant="elevated">Elevated</Button>
      <Button variant="glass">Glass Effect</Button>
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