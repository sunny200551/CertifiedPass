import type { Config } from "tailwindcss";
import designTokenPreset from "@certifiedpass/design-tokens/tailwind-preset";

const config: Config = {
  presets: [designTokenPreset],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // App-specific overrides go here.
      // All base tokens come from the design-tokens preset.
    },
  },
  plugins: [],
};

export default config;
