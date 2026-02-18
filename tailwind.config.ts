import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "pdt-dark": "#1a3a2a",
        "green-mid": "#2d5a3f",
        "green-accent": "#3d7a56",
        "green-light": "#e8f0eb",
        "green-badge": "#d4e8db",
        cream: "#f7f5f0",
        "text-primary": "#1a1a1a",
        "text-secondary": "#555555",
        "text-muted": "#888888",
        pdt: {
          900: "#1a3a2a",
          700: "#2d5a3f",
          500: "#3d7a56",
          200: "#d8d8d8",
          100: "#e8f0eb",
          50: "#f7f5f0",
        },
        ink: "#1a1a1a",
        "pdt-body": "#555555",
        "pdt-subtle": "#888888",
        "pdt-rule": "#e0e0e0",
        "pdt-surface": "#ffffff",
        "pdt-bg": "#ffffff",
        "card-bg": "#e8f0eb",
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        "serif-pdt": ["'DM Serif Display'", "serif"],
        "mono-pdt": ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        "pdt": "12px",
        "pdt-sm": "8px",
        "pdt-lg": "16px",
      },
    },
  },
  plugins: [],
};
export default config;
