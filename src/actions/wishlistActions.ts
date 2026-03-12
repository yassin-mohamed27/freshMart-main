"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getWishlistAction() {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.tokenRes;

    if (!token) return null;

    const res = await fetch(`${process.env.API_URL}/wishlist`, {
        headers: { token },
        cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return null;

    return data; // غالبًا { status, count, data: Product[] }
}

export async function removeFromWishlistAction(productId: string) {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.tokenRes;

    if (!token) return null;

    const res = await fetch(`${process.env.API_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers: { token },
    });

    const data = await res.json();
    return data; // غالبًا { status, message, data }
}

export async function addToWishlistAction(productId: string) {
    const session = await getServerSession(authOptions);
    const token = (session as any)?.tokenRes;

    if (!token) return null;

    const res = await fetch(`${process.env.API_URL}/wishlist`, {
        method: "POST",
        headers: {
            token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    return data;
}
