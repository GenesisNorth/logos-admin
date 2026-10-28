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
        ink: "#2E2A24",
        sand: "#F2EAE0",
        coral: "#E8A98C",
        taupe: "#D9CFC4",
        surface: "#FAF6F0",
        examen: {
          bg: "#1E1B17",
          ink: "#F2EAE0",
          surface: "#2A2520",
          coral: "#E8A98C",
        },
      },
      fontFamily: {
        serif: ["var(--font-source-serif)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
