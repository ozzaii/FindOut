/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neon Orange Theme - Ultra Modern
        neon: {
          orange: '#FF6600',
          'orange-bright': '#FF8800',
          'orange-glow': '#FFAA00',
          'orange-electric': '#FF4400',
          'orange-soft': '#FF9966'
        },
        // Dark Theme Base
        void: '#000000',
        obsidian: '#0A0A0A',
        carbon: '#1A1A1A',
        graphite: '#2A2A2A',
        charcoal: '#333333',
        slate: '#444444',
        // Glass Effects
        glass: {
          white: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
          glow: 'rgba(255, 102, 0, 0.2)',
          bright: 'rgba(255, 136, 0, 0.1)'
        },
        // Accent Colors
        electric: {
          blue: '#00D4FF',
          purple: '#9D00FF',
          green: '#39FF14',
          pink: '#FF10F0'
        }
      },
      fontFamily: {
        'display': ['Orbitron', 'Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      fontSize: {
        'xs': ['clamp(0.75rem, 2vw, 0.875rem)', { lineHeight: '1.4' }],
        'sm': ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.5' }],
        'base': ['clamp(1rem, 3vw, 1.125rem)', { lineHeight: '1.6' }],
        'lg': ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '1.4' }],
        'xl': ['clamp(1.5rem, 5vw, 2rem)', { lineHeight: '1.3' }],
        '2xl': ['clamp(2rem, 6vw, 3rem)', { lineHeight: '1.2' }],
        '3xl': ['clamp(3rem, 8vw, 4rem)', { lineHeight: '1.1' }],
        'hero': ['clamp(4rem, 10vw, 6rem)', { lineHeight: '1' }]
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-neon': 'pulseNeon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'gradient': 'gradient 6s ease infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 20px #FF6600, 0 0 40px #FF6600, 0 0 60px #FF6600'
          },
          '100%': { 
            boxShadow: '0 0 10px #FF6600, 0 0 20px #FF6600, 0 0 30px #FF6600'
          }
        },
        pulseNeon: {
          '0%, 100%': { 
            opacity: 1,
            boxShadow: '0 0 20px #FF6600'
          },
          '50%': { 
            opacity: 0.8,
            boxShadow: '0 0 40px #FF6600, 0 0 60px #FFAA00'
          }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-10%)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      backdropBlur: {
        'xs': '2px',
        'xl': '24px',
        '2xl': '32px',
        '3xl': '48px'
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #FF6600, #FF8800, #FFAA00)',
        'aurora': 'linear-gradient(135deg, #FF6600, #00D4FF, #9D00FF)',
        'sunset': 'linear-gradient(135deg, #FF4400, #FF6600, #FF8800)',
        'holographic': 'linear-gradient(135deg, #FFAA00, #FF6600, #FF4400)',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
        'hero-bg': 'radial-gradient(ellipse at center, #FF660020, #00000000), url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23FF6600" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
      },
      boxShadow: {
        'neon': '0 0 20px #FF6600, 0 0 40px #FF6600',
        'neon-lg': '0 0 30px #FF6600, 0 0 60px #FF8800',
        'neon-xl': '0 0 40px #FF6600, 0 0 80px #FF8800, 0 0 120px #FFAA00',
        'glass': '0 8px 32px rgba(255, 102, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'glass-lg': '0 20px 60px rgba(255, 102, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'inner-glow': 'inset 0 2px 10px rgba(255, 102, 0, 0.2)'
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
        '144': '36rem'
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}