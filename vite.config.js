import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

const stringer = (target) =>
  typeof target === "string" ? "\"" + target + "\"" : target

const base = "/moments_poster/"

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [vue()],
  build: { target: "es6" },
  define: { BASE: stringer(base) }
})
