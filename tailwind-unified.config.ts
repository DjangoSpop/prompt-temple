import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
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
        // Core design system tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--bg))",
        foreground: "hsl(var(--fg))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-fg))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-fg))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-fg))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-fg))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-fg))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-fg))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-fg))",
        },
        
        // Pharaonic heritage colors (preserved for brand consistency)
        'pharaoh-gold': 'hsl(var(--pharaoh-gold))',
        'hieroglyph-stone': 'hsl(var(--hieroglyph-stone))',
        'oasis-blue': 'hsl(var(--oasis-blue))',
        'pyramid-limestone': 'hsl(var(--pyramid-limestone))',

        // Extended Egyptian palette (legacy support)
        'lapis-blue': {
          DEFAULT: '#1E3A8A',
          50: '#EBF0FF',
          100: '#D6E2FF',
          200: '#B3CCFF',
          300: '#80B0FF',
          400: '#4D8AFF',
          500: '#1E3A8A',
          600: '#1A3078',
          700: '#152666',
          800: '#111C54',
          900: '#0D1342',
        },
        'nile-teal': {
          DEFAULT: '#0E7490',
          50: '#E6F7F9',
          100: '#CCF0F3',
          200: '#99E1E7',
          300: '#66D2DB',
          400: '#33C3CF',
          500: '#0E7490',
          600: '#0B5D73',
          700: '#084656',
          800: '#062F39',
          900: '#03171C',
        },
        'desert-sand': {
          DEFAULT: '#EBD5A7',
          50: '#FEFCF7',
          100: '#FDF9EF',
          200: '#F8F0D7',
          300: '#F3E7BF',
          400: '#EFDEA7',
          500: '#EBD5A7',
          600: '#E0C68A',
          700: '#D5B76D',
          800: '#CAA850',
          900: '#BF9933',
        },
        'royal-gold': {
          DEFAULT: '#CBA135',
          50: '#FBF8ED',
          100: '#F7F1DB',
          200: '#EFE3B7',
          300: '#E7D593',
          400: '#DFC76F',
          500: '#CBA135',
          600: '#B8912F',
          700: '#A58129',
          800: '#927123',
          900: '#7F611D',
        },
      },
      fontFamily: {
        'display': ['Cairo', 'Manrope', 'sans-serif'],
        'body': ['Inter', 'Cairo', 'sans-serif'],
        'sans': ['Inter', 'Cairo', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'display': '700',
        'display-bold': '800',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'temple': '16px',
        'pyramid': '24px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pyramid-glow": "pyramid-glow 3s ease-in-out infinite alternate",
        "papyrus-shimmer": "papyrus-shimmer 2s ease-in-out infinite",
        "nefertiti-draw": "nefertiti-draw 1.2s ease-out forwards",
        "sun-arc": "sun-arc 20s linear infinite",
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
        "pyramid-glow": {
          "0%": { boxShadow: "0 0 20px rgba(203, 161, 53, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(203, 161, 53, 0.6)" },
        },
        "papyrus-shimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "nefertiti-draw": {
          "0%": { strokeDasharray: "0 1000" },
          "100%": { strokeDasharray: "1000 0" },
        },
        "sun-arc": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'hsl(var(--fg))',
            maxWidth: 'none',
            '[class~="lead"]': {
              color: 'hsl(var(--muted-fg))',
            },
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary))',
              },
            },
            strong: {
              color: 'hsl(var(--fg))',
            },
            'ol > li::marker': {
              color: 'hsl(var(--muted-fg))',
            },
            'ul > li::marker': {
              color: 'hsl(var(--muted-fg))',
            },
            hr: {
              borderColor: 'hsl(var(--border))',
            },
            blockquote: {
              color: 'hsl(var(--fg))',
              borderLeftColor: 'hsl(var(--border))',
            },
            h1: {
              color: 'hsl(var(--fg))',
            },
            h2: {
              color: 'hsl(var(--fg))',
            },
            h3: {
              color: 'hsl(var(--fg))',
            },
            h4: {
              color: 'hsl(var(--fg))',
            },
            'figure figcaption': {
              color: 'hsl(var(--muted-fg))',
            },
            code: {
              color: 'hsl(var(--fg))',
            },
            'a code': {
              color: 'hsl(var(--primary))',
            },
            pre: {
              color: 'hsl(var(--fg))',
              backgroundColor: 'hsl(var(--muted))',
            },
            thead: {
              color: 'hsl(var(--fg))',
              borderBottomColor: 'hsl(var(--border))',
            },
            'tbody tr': {
              borderBottomColor: 'hsl(var(--border))',
            },
          },
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
