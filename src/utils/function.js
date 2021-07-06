export const hyphens2camel = (str = '') => {
  return str.replaceAll(/-([a-z])/g, g => g[1].toUpperCase())
}
