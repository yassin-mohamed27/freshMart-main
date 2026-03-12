"use server"
import { ShippingAddress } from "@/app/Interfaces/CartInterfaces";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next"

export async function addToCartAction(productId: string) {
    const session = await getServerSession(authOptions);
    if (session) {
        const response = await fetch('https://ecommerce.routemisr.com/api/v1/cart', {
            method: 'POST',
            body: JSON.stringify({ productId }),
            headers: {
                token: (session as any).tokenRes,
                "Content-Type": "application/json"
            },
        }
        );
        const data = await response.json();
        return data;
    }
    else {
        return null;
    }
}
export async function checkOutAction(cartId: string, shippingAddress: ShippingAddress) {
    const session = await getServerSession(authOptions);
    if (session) {
        const response = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`, {
            method: 'POST',
            headers: {
                token: (session as any).tokenRes,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ shippingAddress }),
        }
        );
        const data = await response.json();
        return data;
    }
    else {
        return null;
    }
}