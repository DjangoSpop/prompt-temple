/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pharaonic Design Tokens mapped to CSS variables
        background: 'hsl(var(--bg))',
        'bg-elev': 'hsl(var(--bg-elev))',
        foreground: 'hsl(var(--fg))',
        'muted-foreground': 'hsl(var(--muted))',
        papyrus: 'hsl(var(--secondary))',
        'card-bg': 'hsl(var(--card))',
        'card-fg': 'hsl(var(--card-fg))',
        'gold-accent': 'hsl(var(--accent))',
        'pharaoh-gold': 'hsl(var(--pharaoh-gold))',
        lapis: 'hsl(var(--lapis-blue))',
        nile: 'hsl(var(--nile-teal))',
        obsidian: 'hsl(var(--obsidian))',
        basalt: '#0B0C10',
        'papyrus-light': 'hsl(var(--desert-sand))',
        border: 'hsl(var(--border))',
        'temple-shadow': 'hsl(var(--temple-shadow))',
      },
      fontFamily: {
        sans: ['Inter', 'Whitney', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'elevation-low': '0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05)',
        'elevation-medium': '0 4px 4px rgba(0,0,0,0.16)',
        'elevation-high': '0 8px 16px rgba(0,0,0,0.24)',
      },
    },
  },
  plugins: [],
};
