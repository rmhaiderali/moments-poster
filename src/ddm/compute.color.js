export default function (color) {
  const el = document.createElement("div")
  el.style.backgroundColor = color
  document.body.appendChild(el)
  const value = window.getComputedStyle(el).backgroundColor
  el.remove()
  return value
}
