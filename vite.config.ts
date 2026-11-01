import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// "preview"-modus bouwt alles in één HTML-bestand (voor een deelbare voorvertoning).
export default defineConfig(({ mode }) => ({
  plugins: mode === "preview" ? [react(), viteSingleFile()] : [react()],
  base: mode === "preview" ? "./" : "/",
  build: { assetsInlineLimit: mode === "preview" ? 10_000_000 : 4096, outDir: mode === "preview" ? "dist-preview" : "dist" },
}));
