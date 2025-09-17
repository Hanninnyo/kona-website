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
        background: "var(--background)",
        foreground: "var(--foreground)",
        kona: {
          brown: "#b87a4b",
          espresso: "#1f1311",
          white: "#ffffff",
          taupe: "#c7bab6",
          teal: "#11c9c8",
        },
      },
      fontFamily: {
        'league-spartan': ['League Spartan', 'system-ui', 'sans-serif'],
        'mangabey': ['Mangabey', 'Rubik', 'Nunito', 'system-ui', 'sans-serif'],
        'hawaiian-script': ['var(--font-hawaiian)', 'cursive'],
      },
      animation: {
        "wave": "wave 2.5s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        wave: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        "kona-soft": "0 4px 20px rgba(184, 122, 75, 0.15)",
        "kona-medium": "0 8px 32px rgba(184, 122, 75, 0.2)",
        "teal-glow": "0 0 20px rgba(17, 201, 200, 0.3)",
      },
      borderRadius: {
        "kona": "0.75rem",
      },
    },
  },
  plugins: [],
};

export default config;