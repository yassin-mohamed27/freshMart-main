"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const BASE = "https://ecommerce.routemisr.com/api/v1";

async function getToken() {
    const session = await getServerSession(authOptions);
    return (session as any)?.tokenRes as string | undefined;
}

export async function getUserAddressesAction() {
    const token = await getToken();
    if (!token) return null;

    const res = await fetch(`${BASE}/addresses`, {
        headers: { token },
        cache: "no-store",
    });

    const data = await res.json();
    if (!res.ok) return null;

    // غالبًا: {status, results, data: Address[]}
    return data;
}

export async function addAddressAction(payload: {
    name: string;
    details: string;
    phone: string;
    city: string;
}) {
    const token = await getToken();
    if (!token) return { ok: false, message: "Not authenticated" };

    const res = await fetch(`${BASE}/addresses`, {
        method: "POST",
        headers: {
            token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) return { ok: false, message: data?.message || "Failed", data };

    return { ok: true, message: "Address saved", data };
}

export async function removeAddressAction(addressId: string) {
    const token = await getToken();
    if (!token) return { ok: false, message: "Not authenticated" };

    const res = await fetch(`${BASE}/addresses/${addressId}`, {
        method: "DELETE",
        headers: { token },
    });

    const data = await res.json();
    if (!res.ok) return { ok: false, message: data?.message || "Failed", data };

    return { ok: true, message: "Address removed", data };
}
