import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts}",
  ],
  darkMode: "class",
  safelist: [
    // Topic colors - needed because they're dynamically applied
    'bg-blue-500',
    'bg-purple-500',
    'bg-cyan-500',
    'bg-green-500',
    'bg-red-500',
    'bg-amber-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-teal-500',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
