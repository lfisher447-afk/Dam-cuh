import { createClient } from "@/lib/supabase/server"

export async function GET() {
    const supabase = await createClient()

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    if(error) {
        return Response.json({
            connected: true,
            user: null,
            error: error.message,
        })
    }

    return Response.json({
        connnected: true,
        user,
    })
}