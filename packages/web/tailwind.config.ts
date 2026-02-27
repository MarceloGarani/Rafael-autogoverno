import type { Config } from "tailwindcss";
import { tailwindTokens } from "../ui/tokens/tokens.tailwind";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "../ui/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      ...tailwindTokens,
    },
  },
  plugins: [],
};

export default config;
