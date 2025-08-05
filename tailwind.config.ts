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
				// 🏛️ Government Semantic Colors
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				
				// Core semantic tokens
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				
				// Extended semantic colors
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
				
				// Card and popover
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				
				// 🇸🇦 Saudi Vision 2030 Brand Colors
				"saudi-green": "hsl(var(--saudi-green))",
				"saudi-gold": "hsl(var(--saudi-gold))",
				"saudi-navy": "hsl(var(--saudi-navy))",
				"saudi-sand": "hsl(var(--saudi-sand))",
				"saudi-pearl": "hsl(var(--saudi-pearl))",
				
				// Government hierarchy colors
				executive: {
					primary: "hsl(var(--executive-primary))",
					secondary: "hsl(var(--executive-secondary))",
				},
				operational: {
					primary: "hsl(var(--operational-primary))", 
					secondary: "hsl(var(--operational-secondary))",
				},
				citizen: {
					primary: "hsl(var(--citizen-primary))",
					secondary: "hsl(var(--citizen-secondary))",
				},
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-warning': 'var(--gradient-warning)',
				'gradient-info': 'var(--gradient-info)',
				'gradient-subtle': 'var(--gradient-subtle)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-glass-light': 'var(--gradient-glass-light)',
				'gradient-glass-dark': 'var(--gradient-glass-dark)',
				// Advanced gradients
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-overlay': 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.1))',
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
				xl: "calc(var(--radius) + 4px)",
				"2xl": "calc(var(--radius) + 8px)",
				"3xl": "calc(var(--radius) + 12px)",
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem',
				'144': '36rem',
				'0.5': '0.125rem',
				'1.5': '0.375rem',
				'2.5': '0.625rem',
				'3.5': '0.875rem',
				'4.5': '1.125rem',
				'5.5': '1.375rem',
				'6.5': '1.625rem',
				'7.5': '1.875rem',
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.75rem' }],
				'3xl': ['1.875rem', { lineHeight: '2.25rem' }],
				'4xl': ['2.25rem', { lineHeight: '2.5rem' }],
				'5xl': ['3rem', { lineHeight: '1.2' }],
				'6xl': ['3.75rem', { lineHeight: '1.1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
				'fluid-sm': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.5' }],
				'fluid-base': ['clamp(1rem, 2.5vw, 1.125rem)', { lineHeight: '1.6' }],
				'fluid-lg': ['clamp(1.125rem, 3vw, 1.25rem)', { lineHeight: '1.6' }],
				'fluid-xl': ['clamp(1.25rem, 3.5vw, 1.5rem)', { lineHeight: '1.4' }],
				'fluid-2xl': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.3' }],
				'fluid-3xl': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.2' }],
				'fluid-4xl': ['clamp(2.5rem, 6vw, 4rem)', { lineHeight: '1.1' }],
			},
			zIndex: {
				'60': '60',
				'70': '70',
				'80': '80',
				'90': '90',
				'100': '100',
				'999': '999',
				'9999': '9999',
			},
			screens: {
				'xs': '475px',
				'3xl': '1600px',
				'4xl': '1920px',
			},
			maxWidth: {
				'8xl': '88rem',
				'9xl': '96rem',
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
				"fade-out": {
					"0%": { 
						opacity: "1", 
						transform: "translateY(0)" 
					},
					"100%": { 
						opacity: "0", 
						transform: "translateY(-20px)" 
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
				"scale-out": {
					"0%": { 
						opacity: "1", 
						transform: "scale(1)" 
					},
					"100%": { 
						opacity: "0", 
						transform: "scale(0.95)" 
					},
				},
				"slide-down": {
					"0%": { transform: "translateY(-100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"slide-up": {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
				"slide-left": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-right": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-in-right": {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-out-right": {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(100%)" },
				},
				"slide-in-left": {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				"slide-out-left": {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-100%)" },
				},
				"fade-in": {
					"0%": { 
						opacity: "0", 
						transform: "translateY(10px)" 
					},
					"100%": { 
						opacity: "1", 
						transform: "translateY(0)" 
					},
				},
				"bounce-in": {
					"0%": { 
						opacity: "0", 
						transform: "scale(0.3)" 
					},
					"50%": { 
						opacity: "1", 
						transform: "scale(1.05)" 
					},
					"70%": { 
						transform: "scale(0.9)" 
					},
					"100%": { 
						opacity: "1", 
						transform: "scale(1)" 
					},
				},
				"rotate-in": {
					"0%": { 
						opacity: "0", 
						transform: "rotate(-200deg)" 
					},
					"100%": { 
						opacity: "1", 
						transform: "rotate(0deg)" 
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
				"fade-out": "fade-out 0.5s ease-out",
				"scale-in": "scale-in 0.3s ease-out",
				"scale-out": "scale-out 0.3s ease-out",
				"slide-down": "slide-down 0.3s ease-out",
				"slide-up": "slide-up 0.3s ease-out",
				"slide-left": "slide-left 0.3s ease-out",
				"slide-right": "slide-right 0.3s ease-out",
				"slide-in-right": "slide-in-right 0.3s ease-out",
				"slide-out-right": "slide-out-right 0.3s ease-out",
				"slide-in-left": "slide-in-left 0.3s ease-out",
				"slide-out-left": "slide-out-left 0.3s ease-out",
				"fade-in": "fade-in 0.3s ease-out",
				"bounce-in": "bounce-in 0.6s ease-out",
				"rotate-in": "rotate-in 0.6s ease-out",
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
				'glass-sm': '0 4px 16px 0 rgba(31, 38, 135, 0.25)',
				'glass-lg': '0 12px 48px 0 rgba(31, 38, 135, 0.45)',
				'glow': 'var(--shadow-glow)',
				'glow-sm': '0 0 10px rgba(255, 255, 255, 0.08)',
				'glow-lg': '0 0 40px rgba(255, 255, 255, 0.15)',
				'glow-xl': '0 0 60px rgba(255, 255, 255, 0.2)',
				'glow-primary': '0 0 30px hsl(var(--primary) / 0.3)',
				'glow-success': '0 0 30px hsl(var(--success) / 0.3)',
				'glow-warning': '0 0 30px hsl(var(--warning) / 0.3)',
				'glow-info': '0 0 30px hsl(var(--info) / 0.3)',
				'elegant': 'var(--shadow-elegant)',
				'elegant-sm': '0 5px 15px -5px rgba(0, 0, 0, 0.2)',
				'elegant-lg': '0 20px 60px -20px rgba(0, 0, 0, 0.4)',
				'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
				'raised': '0 4px 12px rgba(0, 0, 0, 0.15)',
				'floating': '0 8px 24px rgba(0, 0, 0, 0.12)',
				'depth': '0 10px 30px rgba(0, 0, 0, 0.2)',
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
