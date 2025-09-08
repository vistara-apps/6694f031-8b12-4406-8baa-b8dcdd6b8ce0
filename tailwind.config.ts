import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand colors
        primary: {
          DEFAULT: 'hsl(220, 88%, 50%)',
          50: 'hsl(220, 88%, 95%)',
          100: 'hsl(220, 88%, 90%)',
          200: 'hsl(220, 88%, 80%)',
          300: 'hsl(220, 88%, 70%)',
          400: 'hsl(220, 88%, 60%)',
          500: 'hsl(220, 88%, 50%)',
          600: 'hsl(220, 88%, 45%)',
          700: 'hsl(220, 88%, 40%)',
          800: 'hsl(220, 88%, 35%)',
          900: 'hsl(220, 88%, 25%)',
          950: 'hsl(220, 88%, 15%)',
        },
        accent: {
          DEFAULT: 'hsl(170, 70%, 45%)',
          50: 'hsl(170, 70%, 95%)',
          100: 'hsl(170, 70%, 90%)',
          200: 'hsl(170, 70%, 80%)',
          300: 'hsl(170, 70%, 70%)',
          400: 'hsl(170, 70%, 60%)',
          500: 'hsl(170, 70%, 45%)',
          600: 'hsl(170, 70%, 40%)',
          700: 'hsl(170, 70%, 35%)',
          800: 'hsl(170, 70%, 30%)',
          900: 'hsl(170, 70%, 20%)',
          950: 'hsl(170, 70%, 10%)',
        },
        // Semantic colors
        success: {
          DEFAULT: 'hsl(142, 76%, 36%)',
          50: 'hsl(142, 76%, 95%)',
          100: 'hsl(142, 76%, 90%)',
          500: 'hsl(142, 76%, 36%)',
          600: 'hsl(142, 76%, 30%)',
        },
        warning: {
          DEFAULT: 'hsl(38, 92%, 50%)',
          50: 'hsl(38, 92%, 95%)',
          100: 'hsl(38, 92%, 90%)',
          500: 'hsl(38, 92%, 50%)',
          600: 'hsl(38, 92%, 45%)',
        },
        error: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          50: 'hsl(0, 84%, 95%)',
          100: 'hsl(0, 84%, 90%)',
          500: 'hsl(0, 84%, 60%)',
          600: 'hsl(0, 84%, 55%)',
        },
        // Background and surface colors
        bg: 'hsl(225, 7%, 95%)',
        surface: 'hsl(0, 0%, 100%)',
        'surface-elevated': 'hsl(0, 0%, 98%)',
        // Text colors
        'text-primary': 'hsl(220, 10%, 15%)',
        'text-secondary': 'hsl(220, 5%, 45%)',
        'text-tertiary': 'hsl(220, 5%, 65%)',
        // Border and divider colors
        border: 'hsl(220, 13%, 91%)',
        'border-strong': 'hsl(220, 13%, 80%)',
        // Legacy support
        background: 'hsl(225, 7%, 95%)',
        foreground: 'hsl(220, 10%, 15%)',
        muted: {
          DEFAULT: 'hsl(220, 5%, 96%)',
          foreground: 'hsl(220, 5%, 45%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          foreground: 'hsl(0, 0%, 100%)',
        },
        input: 'hsl(220, 13%, 91%)',
        ring: 'hsl(220, 88%, 50%)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
        'xl': '32px',
        '2xl': '48px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(220, 40%, 10%, 0.12)',
        'card-hover': '0 12px 32px hsla(220, 40%, 10%, 0.16)',
        'glass': '0 8px 32px hsla(220, 40%, 10%, 0.08)',
        'button': '0 4px 12px hsla(220, 88%, 50%, 0.24)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.22,1,0.36,1)',
        'bounce-gentle': 'bounceGentle 0.6s cubic-bezier(0.22,1,0.36,1)',
        'pulse-gentle': 'pulseGentle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
    },
  },
  plugins: [],
};
export default config;
