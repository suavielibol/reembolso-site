import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem", // Default padding for container
      screens: {
        sm: "640px",
        md: "768px",
        lg: "960px",
        xl: "960px", // Max width for the main content area
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#FFFFFF",
        foreground: "#1C1E21",

        "facebook-blue": "#1877F2",
        "facebook-blue-hover": "#166FE5",
        "facebook-dark-blue": "#0866FF",
        "facebook-header-blue": "#1A3E8C",
        "facebook-gray-bg": "#F0F2F5",
        "facebook-gray-border": "#CED0D4",
        "facebook-gray-text": "#606770",
        "facebook-gray-icon": "#65676B",
        "facebook-green": "#31A24C",
        "facebook-red": "#FA383E",
        "button-action-red": "#ff5a5f", // Previous CTA color
        "button-action-red-hover": "#f04a4f",
        "button-cta-orange": "#F97316", // New eye-catching orange (Tailwind orange-500)
        "button-cta-orange-hover": "#EA580C", // Tailwind orange-600

        primary: {
          DEFAULT: "#1877F2",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E4E6EB",
          foreground: "#050505",
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
          DEFAULT: "#FFFFFF",
          foreground: "#1C1E21",
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
        xl: "12px", // Used for main card
      },
      boxShadow: {
        "fb-subtle": "0 1px 2px rgba(0, 0, 0, 0.1)",
        "fb-card": "0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
