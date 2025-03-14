/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)", // Primary brand color
        secondary: "var(--secondary-color)", // Secondary brand color
        accent: "var(--accent-color)", // Accent or highlight color
        background: "var(--background-color)", // Background
        text: "var(--text-color)", // Primary text
        border: "var(--border-color)", // Borders
        error: {
          bg: "var(--error-bg-color)", // Error background
          border: "var(--error-border-color)", // Error border
          info: "var(--error-info-color)", // Error informational messages
        },
        success: {
          bg: "var(--success-bg-color)", // Success background
          border: "var(--success-border-color)", // Success border
          info: "var(--success-info-color)", // Success informational messages
        },
        warning: "var(--warning-color)", // Warning
      },
      screens: {
        xs: "480px", // 3x large screens
      },
    },
  },
  plugins: [],
};
