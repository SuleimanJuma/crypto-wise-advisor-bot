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
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--custom-border))',
				input: 'hsl(var(--custom-input))',
				ring: 'hsl(var(--custom-ring))',
				background: 'hsl(var(--custom-background))',
				foreground: 'hsl(var(--custom-foreground))',
				primary: {
					DEFAULT: 'hsl(var(--custom-primary))',
					foreground: 'hsl(var(--custom-primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--custom-secondary))',
					foreground: 'hsl(var(--custom-secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--custom-destructive))',
					foreground: 'hsl(var(--custom-destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--custom-muted))',
					foreground: 'hsl(var(--custom-muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--custom-accent))',
					foreground: 'hsl(var(--custom-accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--custom-popover))',
					foreground: 'hsl(var(--custom-popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--custom-card))',
					foreground: 'hsl(var(--custom-card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--custom-sidebar-background))',
					foreground: 'hsl(var(--custom-sidebar-foreground))',
					primary: 'hsl(var(--custom-sidebar-primary))',
					'primary-foreground': 'hsl(var(--custom-sidebar-primary-foreground))',
					accent: 'hsl(var(--custom-sidebar-accent))',
					'accent-foreground': 'hsl(var(--custom-sidebar-accent-foreground))',
					border: 'hsl(var(--custom-sidebar-border))',
					ring: 'hsl(var(--custom-sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--custom-radius)',
				md: 'calc(var(--custom-radius) - 2px)',
				sm: 'calc(var(--custom-radius) - 4px)'
			},
			keyframes: {
				'custom-accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--custom-radix-accordion-content-height)'
					}
				},
				'custom-accordion-up': {
					from: {
						height: 'var(--custom-radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'custom-accordion-down': 'custom-accordion-down 0.2s ease-out',
				'custom-accordion-up': 'custom-accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
