import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00BCD4', // Turkuaz
        secondary: '#0066CC', // Navy
        accent: '#B3D900', // Lime
        dark: {
          50: '#f5f5f5',
          100: '#eeeeee',
          200: '#e0e0e0',
          300: '#bdbdbd',
          400: '#9e9e9e',
          500: '#757575',
          600: '#616161',
          700: '#424242',
          800: '#212121',
          900: '#121212',
        },
      },
      backgroundColor: {
        primary: '#00BCD4',
        secondary: '#0066CC',
        accent: '#B3D900',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'gradient-primary': 'linear-gradient(135deg, #00BCD4 0%, #0066CC 100%)',
        'gradient-health': 'linear-gradient(135deg, #0066CC 0%, #00BCD4 100%)',
        'gradient-culture': 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
        'gradient-investment': 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
      },
      fontSize: {
        hero: '3.5rem',
        heading: '2.5rem',
        subheading: '1.875rem',
      },
      transitionDuration: {
        300: '300ms',
      },
    },
  },
  plugins: [],
};

export default config;