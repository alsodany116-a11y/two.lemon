import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          bg: "#0a0a0a",
          burgundy: "#4a0010",
          rosegold: "#c9748a",
          pink: "#f5c6d0",
          card: "#141414",
          border: "#2a151b",
          lightburgundy: "#730018",
        }
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", "sans-serif"],
        tajawal: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
