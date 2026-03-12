"use server"
import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
const API = "https://ecommerce.routemisr.com/api/v1"

export async function deleteProductAction(cartItemId: string) {
    const session = await getServerSession(authOptions)
    const token = (session as any)?.tokenRes as string | undefined
    if (!token) return null
    const response = await fetch(`${API}/cart/${cartItemId}`, {
        method: "DELETE",
        headers: { token },
    })
    const data = await response.json()
    return data
}

export async function updateProductAction(cartItemId: string, count: number) {
    const session = await getServerSession(authOptions)
    const token = (session as any)?.tokenRes as string | undefined
    if (!token) return null
    const response = await fetch(`${API}/cart/${cartItemId}`, {
        method: "PUT",
        headers: {
            token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ count }),
    })
    const data = await response.json()
    return data
}

export async function clearCartAction() {
    const session = await getServerSession(authOptions)
    const token = (session as any)?.tokenRes as string | undefined
    if (!token) return null
    const response = await fetch(`${API}/cart`, {
        method: "DELETE",
        headers: { token },
    })
    const data = await response.json()
    return data
}
