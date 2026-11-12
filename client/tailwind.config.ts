import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Manrope"', "system-ui", "sans-serif"],
        mono: ['"DM Mono"', "monospace"],
      },
      colors: {
        canvas: "var(--canvas)",
        sidebar: "var(--sidebar)",
        panel: "var(--panel)",
        "panel-raised": "var(--panel-raised)",
        line: "var(--line)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        quiet: "var(--quiet)",
        emeraldLive: "var(--green)",
        emeraldStrong: "var(--green-strong)",
        coral: "var(--accent)",
        crimson: "var(--brand-red)",
        cyanLive: "var(--cyan)",
        amberLive: "var(--amber)",
      },
    },
  },
  plugins: [],
} satisfies Config;

