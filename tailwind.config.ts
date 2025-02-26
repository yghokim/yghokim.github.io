import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '976px',
      xl: '1120',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pointed: "#1e9da7",
        ink: '#575757',
        naver: '#66C36F'
      },
      fontSize: {
        'paragraph': '13.5pt',
      },
      lineHeight: {
        'paragraph': '1.85rem'
      },
      spacing:{
        'sidebar': '322px',
      }
    },
  },
  plugins: [],
} satisfies Config;
