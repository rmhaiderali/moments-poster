import color from "color"
import compute_color from "./compute.color.js"
import srgb_color_mix from "./srgb.color.mix.js"

String.prototype.format = function () {
  return this.replace(/{(\d+)}/g, (match, number) => {
    return typeof arguments[number] !== "undefined" ? arguments[number] : match
  })
}

function colorMix(color1, color2, weight = 50) {
  /* prettier-ignore */
  return CSS.supports("color: color-mix(in srgb, black, white)")
    ? "color-mix(in srgb, {0}, {1} {2}%)".format(color1, color2, weight)
    : color(srgb_color_mix(compute_color(color1), compute_color(color2), weight, true)).string()
}

document.body.style.setProperty("--theme", color("#ea580c").string())

document.body.style.setProperty(
  "--theme-t50",
  colorMix("var(--theme)", "transparent", 50)
)

document.body.style.setProperty(
  "--theme-t80",
  colorMix("var(--theme)", "transparent", 80)
)
