import parse_css_color from "parse-css-color"

export default function (color1, color2, weight = 50, isWeightFor2nd = false) {
  // https://drafts.csswg.org/css-color-5/#color-mix-with-alpha
  // alternative: https://github.com/noeldelgado/mix-css-color

  if (isWeightFor2nd) [color1, color2] = [color2, color1]

  const c1 = parse_css_color(color1) || {}
  const c2 = parse_css_color(color2) || {}

  if (c1.type !== "rgb") throw new Error("Invaild Format: " + color1)
  if (c2.type !== "rgb") throw new Error("Invaild Format: " + color2)

  if (c1.alpha == undefined) c1.alpha = 1
  if (c2.alpha == undefined) c2.alpha = 1

  const w1 = Math.min(Math.max(0, weight), 100) / 100.0
  const w2 = 1 - w1

  for (let i = 0; i < 3; i++) {
    c1.values[i] = (c1.values[i] / 255) * c1.alpha
    c2.values[i] = (c2.values[i] / 255) * c2.alpha
  }

  const a = parseFloat((c1.alpha * w1 + c2.alpha * w2).toFixed(8))
  const [r, g, b] = c1.values.map((c, i) =>
    Math.round(((c1.values[i] * w1 + c2.values[i] * w2) / (a || 1)) * 255)
  )

  return [r, g, b, a]
}
