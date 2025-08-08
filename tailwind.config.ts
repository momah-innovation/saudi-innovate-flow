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
					hover: "hsl(var(--primary-hover))",
					active: "hsl(var(--primary-active))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
					hover: "hsl(var(--secondary-hover))",
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
				// Live/real-time indicators
				live: {
					DEFAULT: "hsl(var(--live))",
					foreground: "hsl(var(--live-foreground))",
					background: "hsl(var(--live-background))",
					border: "hsl(var(--live-border))",
				},
				// Hot/trending indicators
				hot: {
					DEFAULT: "hsl(var(--hot))",
					foreground: "hsl(var(--hot-foreground))",
					background: "hsl(var(--hot-background))",
					border: "hsl(var(--hot-border))",
				},
				// Sector-specific colors - Complete Saudi Government Structure
				"sector-health": {
					DEFAULT: "hsl(var(--sector-health))",
					foreground: "hsl(var(--sector-health-foreground))",
					background: "hsl(var(--sector-health-background))",
					border: "hsl(var(--sector-health-border))",
				},
				"sector-education": {
					DEFAULT: "hsl(var(--sector-education))",
					foreground: "hsl(var(--sector-education-foreground))",
					background: "hsl(var(--sector-education-background))",
					border: "hsl(var(--sector-education-border))",
				},
				"sector-transport": {
					DEFAULT: "hsl(var(--sector-transport))",
					foreground: "hsl(var(--sector-transport-foreground))",
					background: "hsl(var(--sector-transport-background))",
					border: "hsl(var(--sector-transport-border))",
				},
				"sector-environment": {
					DEFAULT: "hsl(var(--sector-environment))",
					foreground: "hsl(var(--sector-environment-foreground))",
					background: "hsl(var(--sector-environment-background))",
					border: "hsl(var(--sector-environment-border))",
				},
				"sector-economy": {
					DEFAULT: "hsl(var(--sector-economy))",
					foreground: "hsl(var(--sector-economy-foreground))",
					background: "hsl(var(--sector-economy-background))",
					border: "hsl(var(--sector-economy-border))",
				},
				"sector-technology": {
					DEFAULT: "hsl(var(--sector-technology))",
					foreground: "hsl(var(--sector-technology-foreground))",
					background: "hsl(var(--sector-technology-background))",
					border: "hsl(var(--sector-technology-border))",
				},
				"sector-finance": {
					DEFAULT: "hsl(var(--sector-finance))",
					foreground: "hsl(var(--sector-finance-foreground))",
					background: "hsl(var(--sector-finance-background))",
					border: "hsl(var(--sector-finance-border))",
				},
				"sector-defense": {
					DEFAULT: "hsl(var(--sector-defense))",
					foreground: "hsl(var(--sector-defense-foreground))",
					background: "hsl(var(--sector-defense-background))",
					border: "hsl(var(--sector-defense-border))",
				},
				"sector-social": {
					DEFAULT: "hsl(var(--sector-social))",
					foreground: "hsl(var(--sector-social-foreground))",
					background: "hsl(var(--sector-social-background))",
					border: "hsl(var(--sector-social-border))",
				},
				"sector-interior": {
					DEFAULT: "hsl(var(--sector-interior))",
					foreground: "hsl(var(--sector-interior-foreground))",
					background: "hsl(var(--sector-interior-background))",
					border: "hsl(var(--sector-interior-border))",
				},
				"sector-foreign-affairs": {
					DEFAULT: "hsl(var(--sector-foreign-affairs))",
					foreground: "hsl(var(--sector-foreign-affairs-foreground))",
					background: "hsl(var(--sector-foreign-affairs-background))",
					border: "hsl(var(--sector-foreign-affairs-border))",
				},
				"sector-justice": {
					DEFAULT: "hsl(var(--sector-justice))",
					foreground: "hsl(var(--sector-justice-foreground))",
					background: "hsl(var(--sector-justice-background))",
					border: "hsl(var(--sector-justice-border))",
				},
				"sector-islamic-affairs": {
					DEFAULT: "hsl(var(--sector-islamic-affairs))",
					foreground: "hsl(var(--sector-islamic-affairs-foreground))",
					background: "hsl(var(--sector-islamic-affairs-background))",
					border: "hsl(var(--sector-islamic-affairs-border))",
				},
				"sector-agriculture": {
					DEFAULT: "hsl(var(--sector-agriculture))",
					foreground: "hsl(var(--sector-agriculture-foreground))",
					background: "hsl(var(--sector-agriculture-background))",
					border: "hsl(var(--sector-agriculture-border))",
				},
				"sector-energy": {
					DEFAULT: "hsl(var(--sector-energy))",
					foreground: "hsl(var(--sector-energy-foreground))",
					background: "hsl(var(--sector-energy-background))",
					border: "hsl(var(--sector-energy-border))",
				},
				"sector-housing": {
					DEFAULT: "hsl(var(--sector-housing))",
					foreground: "hsl(var(--sector-housing-foreground))",
					background: "hsl(var(--sector-housing-background))",
					border: "hsl(var(--sector-housing-border))",
				},
				"sector-labor": {
					DEFAULT: "hsl(var(--sector-labor))",
					foreground: "hsl(var(--sector-labor-foreground))",
					background: "hsl(var(--sector-labor-background))",
					border: "hsl(var(--sector-labor-border))",
				},
				"sector-commerce": {
					DEFAULT: "hsl(var(--sector-commerce))",
					foreground: "hsl(var(--sector-commerce-foreground))",
					background: "hsl(var(--sector-commerce-background))",
					border: "hsl(var(--sector-commerce-border))",
				},
				"sector-tourism": {
					DEFAULT: "hsl(var(--sector-tourism))",
					foreground: "hsl(var(--sector-tourism-foreground))",
					background: "hsl(var(--sector-tourism-background))",
					border: "hsl(var(--sector-tourism-border))",
				},
				"sector-culture": {
					DEFAULT: "hsl(var(--sector-culture))",
					foreground: "hsl(var(--sector-culture-foreground))",
					background: "hsl(var(--sector-culture-background))",
					border: "hsl(var(--sector-culture-border))",
				},
				"sector-sports": {
					DEFAULT: "hsl(var(--sector-sports))",
					foreground: "hsl(var(--sector-sports-foreground))",
					background: "hsl(var(--sector-sports-background))",
					border: "hsl(var(--sector-sports-border))",
				},
				"sector-media": {
					DEFAULT: "hsl(var(--sector-media))",
					foreground: "hsl(var(--sector-media-foreground))",
					background: "hsl(var(--sector-media-background))",
					border: "hsl(var(--sector-media-border))",
				},
				"sector-municipal-affairs": {
					DEFAULT: "hsl(var(--sector-municipal-affairs))",
					foreground: "hsl(var(--sector-municipal-affairs-foreground))",
					background: "hsl(var(--sector-municipal-affairs-background))",
					border: "hsl(var(--sector-municipal-affairs-border))",
				},
				"sector-water": {
					DEFAULT: "hsl(var(--sector-water))",
					foreground: "hsl(var(--sector-water-foreground))",
					background: "hsl(var(--sector-water-background))",
					border: "hsl(var(--sector-water-border))",
				},
				"sector-civil-service": {
					DEFAULT: "hsl(var(--sector-civil-service))",
					foreground: "hsl(var(--sector-civil-service-foreground))",
					background: "hsl(var(--sector-civil-service-background))",
					border: "hsl(var(--sector-civil-service-border))",
				},
				"sector-planning": {
					DEFAULT: "hsl(var(--sector-planning))",
					foreground: "hsl(var(--sector-planning-foreground))",
					background: "hsl(var(--sector-planning-background))",
					border: "hsl(var(--sector-planning-border))",
				},
				"sector-communications": {
					DEFAULT: "hsl(var(--sector-communications))",
					foreground: "hsl(var(--sector-communications-foreground))",
					background: "hsl(var(--sector-communications-background))",
					border: "hsl(var(--sector-communications-border))",
				},
				"sector-public-works": {
					DEFAULT: "hsl(var(--sector-public-works))",
					foreground: "hsl(var(--sector-public-works-foreground))",
					background: "hsl(var(--sector-public-works-background))",
					border: "hsl(var(--sector-public-works-border))",
				},
				// Rating system
				rating: {
					DEFAULT: "hsl(var(--rating))",
					foreground: "hsl(var(--rating-foreground))",
					filled: "hsl(var(--rating-filled))",
					empty: "hsl(var(--rating-empty))",
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
