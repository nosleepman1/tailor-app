const QUEUE_KEY = 'offline_queue'

export const offlineQueue = {
  push(item) {
    const queue = this.getAll()
    queue.push({ ...item, timestamp: Date.now() })
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  },

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []
    } catch {
      return []
    }
  },

  clear() {
    localStorage.removeItem(QUEUE_KEY)
  },

  remove(index) {
    const queue = this.getAll()
    queue.splice(index, 1)
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  },

  isEmpty() {
    return this.getAll().length === 0
  },

  size() {
    return this.getAll().length
  },
}
