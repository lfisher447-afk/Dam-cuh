import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, // type script expects string or undefined so ! tell typescript it is surely there
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
    )
}