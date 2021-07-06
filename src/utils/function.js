export const hyphens2camel = (str = '') => {
  return str.replaceAll(/-([a-z])/g, g => g[1].toUpperCase())
}
export const capitalize = (str = '') => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
