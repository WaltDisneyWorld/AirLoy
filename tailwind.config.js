/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: ["Plus Jakarta Sans", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Spline Sans Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        // Primary — a cool aero teal, the AirLoy brand color.
        aero: {
          50: "#eafdfb",
          100: "#cdf7f3",
          200: "#9eeee8",
          300: "#63ddd6",
          400: "#2fc4bf",
          500: "#15a6a4",
          600: "#0d8487",
          700: "#10696c",
          800: "#125457",
          900: "#13464a",
          950: "#042a2e",
        },
        // Elite / miles accent.
        gold: {
          50: "#fffbeb",
          100: "#fff3c6",
          200: "#ffe588",
          300: "#ffd24a",
          400: "#ffc020",
          500: "#f99e07",
          600: "#dd7602",
          700: "#b75106",
          800: "#943f0c",
          900: "#7a350d",
          950: "#461a02",
        },
        // Neutrals — a deep blue-charcoal "night sky" ink.
        ink: {
          50: "#f5f7fa",
          100: "#e9edf3",
          200: "#d2dae5",
          300: "#aab8cc",
          400: "#7d90ac",
          500: "#5b6e8d",
          600: "#475873",
          700: "#3a475d",
          800: "#28323f",
          900: "#161d28",
          950: "#0b1220",
        },
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(11, 18, 32, 0.06), 0 6px 24px -8px rgba(11, 18, 32, 0.10)",
        card: "0 1px 2px rgba(11, 18, 32, 0.04), 0 8px 30px -12px rgba(11, 18, 32, 0.16)",
        lift: "0 14px 44px -14px rgba(13, 132, 135, 0.32)",
        glow: "0 0 0 4px rgba(47, 196, 191, 0.14)",
        plate: "inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 50px -20px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-fast": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.3)", opacity: "0" },
          "100%": { transform: "scale(1.3)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-fast": "fade-in-fast 0.3s ease-out both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-up": "slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2.2s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
        float: "float 5s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(91,110,141,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,110,141,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
