/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // custom spacing
      spacing: {
        13: "52px", // for aligning content with avatar (40px + 12px gap)
      },

      // custom color scheme for twitter-like dark theme
      colors: {
        // background colors
        "bg-primary": "#000000", // main background (black)
        "bg-secondary": "#16181c", // secondary background (dark gray)
        "bg-hover": "rgba(255, 255, 255, 0.03)", // hover state

        // border colors
        "border-primary": "#2f3336", // main borders

        // text colors
        "text-primary": "#ffffff", // main text (white)
        "text-secondary": "#71767b", // secondary text (gray)

        // brand colors
        "twitter-blue": "#1d9bf0", // twitter blue
        "twitter-blue-hover": "#1a8cd8", // darker blue for hover
        "twitter-blue-disabled": "#0f3460", // disabled state

        // action colors
        "reply-blue": "#1d9bf0",
        "retweet-green": "#00ba7c",
        "like-pink": "#f91880",

        // action hover backgrounds
        "reply-blue-bg": "rgba(29, 155, 240, 0.1)",
        "retweet-green-bg": "rgba(0, 186, 124, 0.1)",
        "like-pink-bg": "rgba(249, 24, 128, 0.1)",
      },

      // custom font family
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },

      // custom backdrop blur
      backdropBlur: {
        twitter: "12px",
      },
    },
  },
  plugins: [],
};
