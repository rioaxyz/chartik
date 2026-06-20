import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#08120f",
        panel: "#0f1915",
        panelLight: "#18241f",
        border: "#28392f",
        bull: "#34d399",
        bear: "#f87171",
        neutral: "#facc15",
        accent: "#5eead4",
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
