import { NextResponse } from "next/server"
export async function GET() {
    const user = {
        id: 1,
        name: 'ahmed ali',
        email: 'ahmed@gmail.com'
    }
    return NextResponse.json(user)

}