/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        flame: {
          DEFAULT: "#EF5322",
          100: "#330f04",
          200: "#661e08",
          300: "#9a2d0c",
          400: "#cd3c0f",
          500: "#ef5322",
          600: "#f27650",
          700: "#f5987c",
          800: "#f8bba8",
          900: "#fcddd3",
        },
        robin_egg_blue: {
          DEFAULT: "#63C7C3",
          100: "#102b2b",
          200: "#1f5755",
          300: "#2f8280",
          400: "#3faeaa",
          500: "#63c7c3",
          600: "#81d2cf",
          700: "#a1dddb",
          800: "#c0e8e7",
          900: "#e0f4f3",
        },
        jonquil: {
          DEFAULT: "#F8C825",
          100: "#372b02",
          200: "#6f5603",
          300: "#a68105",
          400: "#deac07",
          500: "#f8c825",
          600: "#fad251",
          700: "#fbdd7c",
          800: "#fce9a8",
          900: "#fef4d3",
        },
        black: {
          DEFAULT: "#000001",
          100: "#000000",
          200: "#000000",
          300: "#000000",
          400: "#000000",
          500: "#000001",
          600: "#000066",
          700: "#0000cc",
          800: "#3333ff",
          900: "#9999ff",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      textStroke: {
        white: "1px white",
      },
    },
  },
  plugins: [require("tailwindcss-animate", "tailwindcss-textstroke")],
};
