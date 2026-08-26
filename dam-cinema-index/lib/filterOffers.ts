const IGNORE = ["lionsgate", "sony", "warner", "paramount"]

export function isValidPlatform(name: string) {
    const key = name.toLowerCase()
    return !IGNORE.some((x) => key.includes(x))
}