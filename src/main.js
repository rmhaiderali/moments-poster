import { createApp } from "vue";
import App from "./App.vue";
import "./App.scss";

createApp(App).mount("#app");

window.onfocus = () => document.documentElement.classList.add("focused");
window.onblur = () => document.documentElement.classList.remove("focused");
function change({target: {files: [file]}}) {
  console.log(file);
}
