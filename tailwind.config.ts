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
				// Semantic status colors
				success: {
					DEFAULT: "hsl(var(--success))",
					foreground: "hsl(var(--success-foreground))",
				},
				warning: {
					DEFAULT: "hsl(var(--warning))",
					foreground: "hsl(var(--warning-foreground))",
				},
				info: {
					DEFAULT: "hsl(var(--info))",
					foreground: "hsl(var(--info-foreground))",
				},
				// Glass morphism colors
				glass: {
					50: "rgba(255, 255, 255, 0.05)",
					100: "rgba(255, 255, 255, 0.10)",
					200: "rgba(255, 255, 255, 0.20)",
					300: "rgba(255, 255, 255, 0.30)",
					400: "rgba(255, 255, 255, 0.40)",
					500: "rgba(255, 255, 255, 0.50)",
					"border-50": "rgba(255, 255, 255, 0.10)",
					"border-100": "rgba(255, 255, 255, 0.20)",
					"border-200": "rgba(255, 255, 255, 0.30)",
				},
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-warning': 'var(--gradient-warning)',
				'gradient-info': 'var(--gradient-info)',
				'gradient-subtle': 'var(--gradient-subtle)',
				// Advanced gradients
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-overlay': 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.1))',
				'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
				'gradient-glow': 'radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 70%)',
			},
			backdropBlur: {
				xs: '2px',
				'4xl': '72px',
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
				// Beautiful animations from events hero
				"float": {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-20px)" },
				},
				"glow": {
					"0%, 100%": { opacity: "0.5" },
					"50%": { opacity: "1" },
				},
				"shimmer": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(100%)" },
				},
				"fade-in-up": {
					"0%": { 
						opacity: "0", 
						transform: "translateY(20px)" 
					},
					"100%": { 
						opacity: "1", 
						transform: "translateY(0)" 
					},
				},
				"scale-in": {
					"0%": { 
						opacity: "0", 
						transform: "scale(0.95)" 
					},
					"100%": { 
						opacity: "1", 
						transform: "scale(1)" 
					},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				// Beautiful animations
				"float": "float 6s ease-in-out infinite",
				"glow": "glow 2s ease-in-out infinite",
				"shimmer": "shimmer 2s linear infinite",
				"fade-in-up": "fade-in-up 0.5s ease-out",
				"scale-in": "scale-in 0.3s ease-out",
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'glow': '0 0 20px rgba(255, 255, 255, 0.1)',
				'glow-lg': '0 0 40px rgba(255, 255, 255, 0.15)',
				'elegant': '0 10px 30px -10px rgba(0, 0, 0, 0.3)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
