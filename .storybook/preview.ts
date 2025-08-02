import type { Preview } from '@storybook/react'
import { ThemeProvider } from '../src/components/ui/theme-provider'
import { DirectionProvider } from '../src/components/ui/direction-provider'
import '../src/index.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <DirectionProvider>
        <ThemeProvider defaultTheme="light" storageKey="storybook-theme">
          <div className="p-4">
            <Story />
          </div>
        </ThemeProvider>
      </DirectionProvider>
    ),
  ],
}

export default preview