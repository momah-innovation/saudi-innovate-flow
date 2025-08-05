import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				// === COMPREHENSIVE SEMANTIC COLOR SYSTEM ===
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
					light: "hsl(var(--success-light))",
					border: "hsl(var(--success-border))",
					muted: "hsl(var(--success-muted))",
				},
				warning: {
					DEFAULT: "hsl(var(--warning))",
					foreground: "hsl(var(--warning-foreground))",
					light: "hsl(var(--warning-light))",
					border: "hsl(var(--warning-border))",
					muted: "hsl(var(--warning-muted))",
				},
				info: {
					DEFAULT: "hsl(var(--info))",
					foreground: "hsl(var(--info-foreground))",
					hover: "hsl(var(--info-hover))",
					light: "hsl(var(--info-light))",
					border: "hsl(var(--info-border))",
					muted: "hsl(var(--info-muted))",
				},
				complete: {
					DEFAULT: "hsl(var(--complete))",
					foreground: "hsl(var(--complete-foreground))",
					light: "hsl(var(--complete-light))",
					border: "hsl(var(--complete-border))",
				},
				scheduled: {
					DEFAULT: "hsl(var(--scheduled))",
					foreground: "hsl(var(--scheduled-foreground))",
					light: "hsl(var(--scheduled-light))",
					border: "hsl(var(--scheduled-border))",
				},
				active: {
					DEFAULT: "hsl(var(--active))",
					foreground: "hsl(var(--active-foreground))",
					light: "hsl(var(--active-light))",
					border: "hsl(var(--active-border))",
				},
				inactive: {
					DEFAULT: "hsl(var(--inactive))",
					foreground: "hsl(var(--inactive-foreground))",
					light: "hsl(var(--inactive-light))",
					border: "hsl(var(--inactive-border))",
				},
				pending: {
					DEFAULT: "hsl(var(--pending))",
					foreground: "hsl(var(--pending-foreground))",
					light: "hsl(var(--pending-light))",
					border: "hsl(var(--pending-border))",
				},
				// Priority system
				priority: {
					high: "hsl(var(--priority-high))",
					"high-foreground": "hsl(var(--priority-high-foreground))",
					"high-light": "hsl(var(--priority-high-light))",
					"high-border": "hsl(var(--priority-high-border))",
					medium: "hsl(var(--priority-medium))",
					"medium-foreground": "hsl(var(--priority-medium-foreground))",
					"medium-light": "hsl(var(--priority-medium-light))",
					"medium-border": "hsl(var(--priority-medium-border))",
					low: "hsl(var(--priority-low))",
					"low-foreground": "hsl(var(--priority-low-foreground))",
					"low-light": "hsl(var(--priority-low-light))",
					"low-border": "hsl(var(--priority-low-border))",
				},
				// Trend indicators
				trend: {
					up: "hsl(var(--trend-up))",
					"up-foreground": "hsl(var(--trend-up-foreground))",
					down: "hsl(var(--trend-down))",
					"down-foreground": "hsl(var(--trend-down-foreground))",
					stable: "hsl(var(--trend-stable))",
					"stable-foreground": "hsl(var(--trend-stable-foreground))",
				},
				// Innovation categories
				innovation: {
					DEFAULT: "hsl(var(--innovation))",
					foreground: "hsl(var(--innovation-foreground))",
					light: "hsl(var(--innovation-light))",
					border: "hsl(var(--innovation-border))",
				},
				technology: {
					DEFAULT: "hsl(var(--technology))",
					foreground: "hsl(var(--technology-foreground))",
					light: "hsl(var(--technology-light))",
					border: "hsl(var(--technology-border))",
				},
				sustainability: {
					DEFAULT: "hsl(var(--sustainability))",
					foreground: "hsl(var(--sustainability-foreground))",
					light: "hsl(var(--sustainability-light))",
					border: "hsl(var(--sustainability-border))",
				},
				social: {
					DEFAULT: "hsl(var(--social))",
					foreground: "hsl(var(--social-foreground))",
					light: "hsl(var(--social-light))",
					border: "hsl(var(--social-border))",
				},
				// Role-based colors
				partner: {
					DEFAULT: "hsl(var(--partner))",
					foreground: "hsl(var(--partner-foreground))",
					light: "hsl(var(--partner-light))",
					border: "hsl(var(--partner-border))",
				},
				stakeholder: {
					DEFAULT: "hsl(var(--stakeholder))",
					foreground: "hsl(var(--stakeholder-foreground))",
					light: "hsl(var(--stakeholder-light))",
					border: "hsl(var(--stakeholder-border))",
				},
				expert: {
					DEFAULT: "hsl(var(--expert))",
					foreground: "hsl(var(--expert-foreground))",
					light: "hsl(var(--expert-light))",
					border: "hsl(var(--expert-border))",
				},
				// Overlay system for modals, tooltips, etc.
				overlay: {
					background: "hsl(var(--overlay-background))",
					foreground: "hsl(var(--overlay-foreground))",
					light: "hsl(var(--overlay-light))",
					dark: "hsl(var(--overlay-dark))",
					text: "hsl(var(--overlay-text))",
					"text-muted": "hsl(var(--overlay-text-muted))",
					button: "hsl(var(--overlay-button))",
					"button-hover": "hsl(var(--overlay-button-hover))",
				},
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-warning': 'var(--gradient-warning)',
				'gradient-info': 'var(--gradient-info)',
				'gradient-subtle': 'var(--gradient-subtle)',
			},
			spacing: {
				'3xs': 'var(--space-3xs)',
				'2xs': 'var(--space-2xs)',
				'xs': 'var(--space-xs)',
				'sm': 'var(--space-sm)',
				'md': 'var(--space-md)',
				'lg': 'var(--space-lg)',
				'xl': 'var(--space-xl)',
				'2xl': 'var(--space-2xl)',
				'3xl': 'var(--space-3xl)',
				'4xl': 'var(--space-4xl)',
				'5xl': 'var(--space-5xl)',
			},
			boxShadow: {
				'subtle': 'var(--shadow-subtle)',
				'medium': 'var(--shadow-medium)',
				'large': 'var(--shadow-large)',
				'glow': 'var(--shadow-glow)',
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				"scale-in": {
					"0%": { transform: "scale(0.95)", opacity: "0" },
					"100%": { transform: "scale(1)", opacity: "1" }
				},
				"slide-up": {
					"0%": { transform: "translateY(20px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" }
				},
				"fade-in-up": {
					"0%": { transform: "translateY(30px)", opacity: "0" },
					"100%": { transform: "translateY(0)", opacity: "1" }
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"scale-in": "scale-in 0.2s ease-out",
				"slide-up": "slide-up 0.3s ease-out",
				"fade-in-up": "fade-in-up 0.4s ease-out",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
