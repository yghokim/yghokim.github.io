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
      xl: '1120px',
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pointed: "#1e9da7",
        ink: {
          light: '#575757',
          dark: '#252525'
        },
        highlight: '#fff8cd',
        naver: '#66C36F',
        award: {
          recognition: 'rgb(219, 86, 150)',
          honorable: '#b57129',
          best: '#dda84c',
        },
        tag: {
          default: '#e0bd66',
          doi: '#4f99cc',
          bibtex: '#69a66a',
          pdf: '#ea4b4b',
          icon: '#e7e7e7'
        }
      },
      fontSize: {
        'paragraph': '13.5pt',
      },
      lineHeight: {
        'paragraph': '1.85rem'
      },
      spacing:{
        'sidebar': '322px',
      },

      animation: {
        slideUpAndFade: "slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade: "slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideDownAndFade: "slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade: "slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        slideUpAndFade: {
          "from": { opacity: "0", transform: "translateY(2px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          "from": { opacity: "0", transform: "translateX(-2px)" },
          "to": { opacity: "1", transform: "translateX(0)" },
        },
        slideDownAndFade: {
          "from": { opacity: "0", transform: "translateY(-2px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          "from": { opacity: "0", transform: "translateX(2px)" },
          "to": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
