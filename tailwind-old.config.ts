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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Egyptian Pharaonic Palette
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
        muted: {
          DEFAULT: '#9F9F9F',
          foreground: '#5F5F5F',
        },
        accent: {
          DEFAULT: '#0E7490', // Nile Teal
          foreground: '#FFFFFF',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        card: {
          DEFAULT: '#FEFCF7',
          foreground: '#0E0E10',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#0E0E10',
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
        'obsidian': {
          DEFAULT: '#0E0E10',
          50: '#F7F7F8',
          100: '#EFEFEF',
          200: '#DFDFDF',
          300: '#CFCFCF',
          400: '#BFBFBF',
          500: '#9F9F9F',
          600: '#7F7F7F',
          700: '#5F5F5F',
          800: '#3F3F3F',
          900: '#0E0E10',
        },
        primary: {
          DEFAULT: '#1E3A8A', // Lapis Blue
          foreground: '#FFFFFF',
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
        secondary: {
          DEFAULT: '#EBD5A7', // Desert Sand
          foreground: '#0E0E10',
          50: '#FEFCF7',
          100: '#FDF9EF',
          200: '#F8F0D7',
          300: '#F3E7BF',
          400: '#EFDEA7',
          500: '#EBD5A7',
          600: "hsl(30 40% 45%)",
          700: "hsl(30 40% 35%)",
          800: "hsl(30 40% 25%)",
          900: "hsl(30 40% 15%)",
        },
        destructive: {
          DEFAULT: "hsl(15 85% 60%)", // Desert sunset red
          foreground: "hsl(30 15% 95%)",
        },
        muted: {
          DEFAULT: "hsl(35 25% 88%)", // Pale sand
          foreground: "hsl(30 15% 45%)",
        },
        accent: {
          DEFAULT: "hsl(45 50% 75%)", // Warm sand accent
          foreground: "hsl(30 30% 15%)",
        },
        popover: {
          DEFAULT: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Egyptian temple and gamification colors
        pharaoh: {
          DEFAULT: "hsl(40 100% 50%)", // Pure gold
          dark: "hsl(35 100% 40%)", // Darker gold
          light: "hsl(45 100% 60%)", // Light gold
        },
        hieroglyph: {
          DEFAULT: "hsl(25 60% 35%)", // Ancient stone color
          light: "hsl(25 40% 55%)", // Lighter stone
        },
        oasis: {
          DEFAULT: "hsl(200 85% 45%)", // Desert oasis blue
          light: "hsl(200 65% 65%)", // Light oasis
        },
        pyramid: {
          DEFAULT: "hsl(35 45% 60%)", // Limestone
          shadow: "hsl(30 35% 40%)", // Pyramid shadows
        },
        papyrus: {
          DEFAULT: "hsl(45 35% 85%)", // Ancient paper
          aged: "hsl(40 25% 75%)", // Aged papyrus
        },
        // Enhanced Pharaonic Brand - Prompt Teme Made in Egypt
        sand: { 
          50: '#FBF7E9', 
          200: '#F4E7C3', 
          400: '#E2C690',
          500: '#D4B886',
          600: '#C5A572' 
        },
        stone: { 
          500: '#A08B6F',
          600: '#8A7A5C',
          700: '#756751' 
        },
        umber: { 
          600: '#6B4E3A',
          700: '#5C4033',
          800: '#4D352B' 
        },
        basalt: { 
          800: '#3A342E',
          900: '#2F2A24',
          950: '#252018' 
        },
        sun: '#FF8C42',    // Karnak sun-disk accent
        nile: '#1D3557',   // Deep blue for contrast/links
        success: {
          DEFAULT: "hsl(142 76% 36%)",
          foreground: "hsl(30 15% 95%)",
          light: "hsl(142 76% 46%)",
        },
        warning: {
          DEFAULT: "hsl(38 92% 50%)",
          foreground: "hsl(30 15% 95%)",
          light: "hsl(38 92% 60%)",
        },
        experience: {
          DEFAULT: "hsl(40 85% 55%)", // Golden experience
          foreground: "hsl(30 30% 15%)",
          light: "hsl(40 85% 65%)",
        },
        achievement: {
          DEFAULT: "hsl(40 100% 50%)", // Pure gold achievement
          foreground: "hsl(30 30% 15%)",
          light: "hsl(45 100% 60%)",
        },
        // Level colors for progression inspired by Egyptian materials
        level: {
          copper: "hsl(25 80% 45%)", // Ancient copper
          bronze: "hsl(30 100% 50%)", // Egyptian bronze
          silver: "hsl(0 0% 75%)", // Silver
          gold: "hsl(45 100% 51%)", // Egyptian gold
          platinum: "hsl(200 20% 85%)", // Platinum like limestone
          pharaoh: "hsl(40 100% 50%)", // Pharaoh level - pure gold
        }
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        ui: ['Cairo', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Cairo', 'Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        cartouche: "1.25rem", // Egyptian cartouche style
        pharaoh: "2rem"       // Extra rounded for premium elements
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
        // Gamification animations
        "level-up": {
          "0%": { transform: "scale(1) rotate(0deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(180deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "1" },
        },
        "achievement-unlock": {
          "0%": { transform: "scale(0) translateY(50px)", opacity: "0" },
          "50%": { transform: "scale(1.1) translateY(-10px)", opacity: "1" },
          "100%": { transform: "scale(1) translateY(0px)", opacity: "1" },
        },
        "points-earn": {
          "0%": { transform: "translateY(0px) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-30px) scale(1.2)", opacity: "0" },
        },
        "progress-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-width)" },
        },
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 15px hsl(var(--primary))" 
          },
          "50%": { 
            boxShadow: "0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))" 
          },
        },
        "streak-fire": {
          "0%, 100%": { transform: "scale(1)", filter: "hue-rotate(0deg)" },
          "50%": { transform: "scale(1.05)", filter: "hue-rotate(20deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "level-up": "level-up 1s ease-in-out",
        "achievement-unlock": "achievement-unlock 0.6s ease-out",
        "points-earn": "points-earn 1s ease-out forwards",
        "progress-fill": "progress-fill 0.8s ease-out",
        "pulse-glow": "pulse-glow 2s infinite",
        "streak-fire": "streak-fire 1.5s infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        'glow': '0 0 15px -3px hsl(var(--primary))',
        'glow-lg': '0 0 25px -3px hsl(var(--primary))',
        'achievement': '0 0 30px -3px hsl(var(--achievement))',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'game-pattern': 'linear-gradient(45deg, transparent 65%, hsl(var(--primary) / 0.03) 65%, hsl(var(--primary) / 0.03) 75%, transparent 75%)',
      },
    },
  },
  plugins: [
    tailwindcssAnimate,
    // Custom plugin for Egyptian temple themed utilities
    function({ addUtilities }: { addUtilities: (utilities: Record<string, Record<string, string>>) => void }) {
      const newUtilities = {
        '.text-glow': {
          textShadow: '0 0 10px currentColor',
        },
        '.text-glow-lg': {
          textShadow: '0 0 20px currentColor, 0 0 30px currentColor',
        },
        '.text-hieroglyph': {
          textShadow: '2px 2px 4px hsl(25 60% 35%)',
          fontWeight: '600',
        },
        '.border-glow': {
          borderColor: 'hsl(var(--primary))',
          boxShadow: '0 0 10px -2px hsl(var(--primary))',
        },
        '.border-pharaoh': {
          borderColor: 'hsl(40 100% 50%)',
          boxShadow: '0 0 15px -3px hsl(40 100% 50%)',
        },
        '.temple-card': {
          background: 'linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(var(--card) / 0.7))',
          backdropFilter: 'blur(10px)',
          border: '1px solid hsl(35 45% 75%)',
          boxShadow: '0 4px 20px -4px hsl(35 45% 60% / 0.3)',
        },
        '.pyramid-shadow': {
          boxShadow: '0 8px 32px -8px hsl(30 35% 40% / 0.4), inset 0 1px 0 hsl(45 35% 85% / 0.2)',
        },
        '.pharaoh-badge': {
          background: 'linear-gradient(135deg, hsl(40 100% 50%), hsl(40 100% 50%) 50%, hsl(35 100% 40%))',
          boxShadow: '0 0 20px -3px hsl(40 100% 50%)',
          border: '2px solid hsl(45 100% 60%)',
        },
        '.oasis-glow': {
          boxShadow: '0 0 25px -5px hsl(200 85% 45%)',
        },
        '.sandstone-texture': {
          background: 'linear-gradient(45deg, hsl(35 45% 60%) 0%, hsl(30 40% 65%) 25%, hsl(35 45% 60%) 50%, hsl(30 40% 65%) 75%, hsl(35 45% 60%) 100%)',
          backgroundSize: '20px 20px',
        },
      };
      addUtilities(newUtilities);
    }
  ],
};

export default config;