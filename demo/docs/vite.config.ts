import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    SearchPlugin({
      placeholder: "Procure por algo!",
      buttonLabel: "Procurar",
      previewLength: 10,
    }),
  ],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ["../.."],
    },
  },
});
