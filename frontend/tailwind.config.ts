import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#04080f",
          2: "#080f1c",
          3: "#0b1527",
          4: "#0f1d35",
        },
        blue: {
          DEFAULT: "#1a6bff",
          2: "#0d4fd4",
          3: "#0a3aab",
          glow: "rgba(26,107,255,0.15)",
        },
        cyan: {
          DEFAULT: "#00d4ff",
          dim: "rgba(0,212,255,0.12)",
        },
        border: {
          DEFAULT: "rgba(26,107,255,0.18)",
          2: "rgba(26,107,255,0.4)",
          3: "rgba(0,212,255,0.35)",
        },
        muted: {
          DEFAULT: "#7a90b8",
          2: "#4a5f82",
        },
        text: "#e8f0ff",
        green: "#00c77a",
        orange: "#ff8c00",
        danger: "#ff3b3b",
      },
      fontFamily: {
        head: ["Rajdhani", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(26,107,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,107,255,0.04) 1px,transparent 1px)",
      },
      backgroundSize: {
        grid: "60px 60px",
      },
    },
  },
  plugins: [],
};
export default config;
