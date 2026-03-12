import React from "react";
import { getWishlistAction } from "@/actions/wishlistActions";
import Wishlist from "@/components/Wishlist/Wishlist";

export default async function WishlistPage() {
    const data = await getWishlistAction();

    // لو مفيش session أو الداتا فاضية هنبعت null عشان يطلع Empty State
    const products = data?.data ?? [];

    return <Wishlist wishlistData={products.length ? data : null} />;
}
