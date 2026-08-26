//TTl version (time to live)

const cache = new Map<string, { value: any; expiry: number }>()

export function getCache(key: string) {
    const data = cache.get(key)
    if (!data) return null

    if(Date.now() > data.expiry) {
        cache.delete(key)
        return null
    }
    return data.value
}

export function setCache(key: string, value: any, ttlMs = 1000 * 60 * 60) { // valid till 1 hour
    cache.set(key, {
        value,
        expiry: Date.now() + ttlMs
    })
}