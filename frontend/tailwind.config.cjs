/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        ink: {
          950: "#090B0F",
          900: "#10161D",
          800: "#171F28",
          700: "#202A35",
          600: "#2C3947",
        },

        parchment: {
          DEFAULT: "#F8FAFC",
          muted: "#CBD5E1",
          dim: "#94A3B8",
        },

        emerald: {
          DEFAULT: "#22C55E",
          light: "#4ADE80",
          dark: "#15803D",
        },

        gold: {
          DEFAULT: "#D4AF37",
          light: "#E7C65A",
          dark: "#9B7A19",
        },

        danger: {
          DEFAULT: "#EF4444",
        },
      },

      fontFamily: {
        display: ['"Source Serif 4"', "Georgia", "serif"],
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },

      boxShadow: {
        panel: "0 30px 90px rgba(0,0,0,.55)",

        glow: "0 0 35px rgba(34,197,94,.08)",

        card: "0 10px 30px rgba(0,0,0,.35)",
      },

      borderRadius: {
        xl: "18px",
        "2xl": "24px",
        "3xl": "30px",
      },

      backgroundImage: {
        grid:
          "linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)",

        radial:
          "radial-gradient(circle at top, rgba(34,197,94,.06), transparent 60%)",
      },

      animation: {
        "fade-up": "fadeUp .45s ease-out forwards",

        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",

        float: "floating 5s ease-in-out infinite",
      },

      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(12px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        pulseSoft: {
          "0%,100%": {
            opacity: ".55",
          },

          "50%": {
            opacity: "1",
          },
        },

        floating: {
          "0%,100%": {
            transform: "translateY(0px)",
          },

          "50%": {
            transform: "translateY(-5px)",
          },
        },
      },
    },
  },

  plugins: [],
};