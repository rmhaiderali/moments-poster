import { createApp } from "vue"
import App from "./App.vue"
import "./ddm/theme.colors.js"

createApp(App).mount("#app")

window.onfocus = () => document.documentElement.classList.add("focused")
window.onblur = () => document.documentElement.classList.remove("focused")
