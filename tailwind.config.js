/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          green: "#39ff88",
          blue: "#35d9ff",
          purple: "#a855f7",
          pink: "#ff4ecd",
        },
      },
      boxShadow: {
        "neon-green": "0 0 12px #39ff88, 0 0 30px #39ff8840",
        "neon-blue": "0 0 12px #35d9ff, 0 0 30px #35d9ff40",
        "neon-purple": "0 0 12px #a855f7, 0 0 30px #a855f740",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".65" },
        },
      },
    },
  },
  plugins: [],
};
