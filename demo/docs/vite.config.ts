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
});
