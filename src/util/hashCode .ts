export const hashCode = (str: string): string => {
  let hash = 0
  if (typeof str !== 'string' || str.length === 0) {
    return String(hash)
  }
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  hash = hash >>> 0

  return Number(hash).toString(32).toUpperCase()
}
