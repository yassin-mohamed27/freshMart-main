"use server"

import { authOptions } from "@/auth"
import { getServerSession } from "next-auth/next"
import { ShippingAddress } from "@/app/Interfaces/CartInterfaces"

const API = "https://ecommerce.routemisr.com/api/v1"

export async function cashOrderAction(cartId: string, shippingAddress: ShippingAddress) {
    const session = await getServerSession(authOptions)
    const token = (session as any)?.tokenRes as string | undefined
    if (!token) return null

    const res = await fetch(`${API}/orders/${cartId}`, {
        method: "POST",
        headers: {
            token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ shippingAddress }),
        cache: "no-store",
    })

    const data = await res.json()
    return data
}