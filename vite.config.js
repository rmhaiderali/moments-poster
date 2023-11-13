import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const stringer = (target) =>
  typeof target === "string" ? "\"" + target + "\"" : target

const base = ["/", "/moments_poster/"][0]

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [vue()],
  root: "./frontend",
  publicDir: "../public",
  build: { target: "es6", outDir: "../dist" },
  define: { BASE: stringer(base) }
})
