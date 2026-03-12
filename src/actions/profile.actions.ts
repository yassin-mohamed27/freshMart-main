"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { revalidatePath } from "next/cache";

const API = process.env.API_URL;

type UpdateProfilePayload = {
    name: string;
    email: string;
    phone: string;
};

type ChangePasswordPayload = {
    currentPassword: string;
    password: string;
    rePassword: string;
};

function getToken(session: any) {
    return session?.tokenRes;
}

export async function updateProfileAction(payload: UpdateProfilePayload) {
    const session = await getServerSession(authOptions);
    const token = getToken(session);

    if (!token) return { ok: false, message: "Unauthorized" };

    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/users/updateMe/`, {
        method: "PUT",
        headers: {
            token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        return { ok: false, message: data?.message || "Failed to update profile", data };
    }

    // غالبًا بيرجع user جوه data
    // هنرجع أي حاجة مفيدة
    revalidatePath("/profile");
    return { ok: true, message: data?.message || "Profile updated", data };
}

export async function changePasswordAction(payload: ChangePasswordPayload) {
    const session = await getServerSession(authOptions);
    const token = getToken(session);

    if (!token) return { ok: false, message: "Unauthorized" };

    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/users/changeMyPassword`, {
        method: "PUT",
        headers: {
            token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
        return { ok: false, message: data?.message || "Failed to change password", data };
    }
    revalidatePath("/profile");
    return { ok: true, message: data?.message || "Password updated", data };
}
