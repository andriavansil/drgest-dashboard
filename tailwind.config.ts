import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        cianoescuro: "#008080",
        turquesaescuro: "#0097b2",
        ciano: "#27bac1",
        turquesavivido: "#009587",
        azulceleste: "#035e68",
        SkyLight: "#EDF9FD",
      },
    },
  },
  plugins: [],
};
export default config;
