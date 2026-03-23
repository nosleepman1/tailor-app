export function getStorageUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  const base = new URL(import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').origin
  return `${base}/storage/${path}`
}
