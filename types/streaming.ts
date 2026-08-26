export type StreamingType =
    | "subscription"
    | "rent" 
    | "buy"

export type StreamingOption = {
    platform: string
    type: StreamingType
    price?: number
    quality?: string
    link?: string
}

