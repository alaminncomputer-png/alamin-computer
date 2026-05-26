import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#04080f",
        blue: "#1a6bff",
        cyan: "#00d4ff",
        text: "#e8f0ff",
        muted: "#7a90b8",
        green: "#00c77a",
      },
      fontFamily: {
        head: ["Rajdhani", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
