import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // Change this to your GitHub repo name.
  // Example: if your URL is https://username.github.io/magpai-web/
  // then keep "/magpai-web/"
  base: "/magpai-web/" // IMPORTANT for GitHub Pages
});