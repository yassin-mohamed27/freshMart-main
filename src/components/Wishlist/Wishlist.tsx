"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, Heart } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard/ProductCard";
import { removeFromWishlistAction } from "@/actions/wishlistActions";

type WishlistRes = {
    status?: string;
    count?: number;
    data: any[]; // products
};

export default function Wishlist({ wishlistData }: { wishlistData: WishlistRes | null }) {
    const [wish, setWish] = useState<WishlistRes | null>(wishlistData);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    async function removeItem(productId: string) {
        setLoadingId(productId);
        try {
            const res = await removeFromWishlistAction(productId);

            // بعد الـ delete: الأفضل نحدّث UI محليًا (زي الكارت)
            setWish((prev) => {
                if (!prev) return prev;
                const next = prev.data.filter((p: any) => p._id !== productId);
                return next.length ? { ...prev, data: next, count: next.length } : null;
            });

            toast.success("Removed from wishlist");
        } catch (e) {
            toast.error("Failed to remove");
        } finally {
            setLoadingId(null);
        }
    }

    return (
        <>
            {wish ? (
                <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
                    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

                        <div className="relative p-5 sm:p-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                                        Wishlist
                                    </h1>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        {wish.data.length} {wish.data.length === 1 ? "item" : "items"} saved
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link href={"/products"}>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl border-zinc-200 bg-white hover:bg-zinc-50"
                                        >
                                            Browse Products
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* نفس Grid بتاع الموقع */}
                            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {wish.data.map((p: any) => (
                                    <div key={p._id} className="relative">
                                        {/* Overlay loading زي cart */}
                                        {loadingId === p._id && (
                                            <div className="absolute inset-0 z-20 rounded-2xl bg-white/60 flex items-center justify-center">
                                                <Loader2 className="animate-spin" />
                                            </div>
                                        )}

                                        {/* كارت المنتج بتاعك الموحد */}
                                        <ProductCard product={p} />

                                        {/* زرار remove تحت الكارت شبه cart */}
                                        {/* <div className="mt-3">
                                            <button
                                                onClick={() => removeItem(p._id)}
                                                className="w-full inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 
                        text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98]"
                                            >
                                                Remove
                                            </button>
                                        </div> */}
                                    </div>
                                ))}
                            </div>

                            <p className="mt-6 text-xs text-zinc-500">
                                Tip: Click the heart icon on any product to save it here.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mx-auto max-w-3xl px-3 sm:px-6 py-14 sm:py-16">
                    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm p-10 text-center">
                        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

                        <div className="relative">
                            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-zinc-50 border border-zinc-200">
                                <Heart className="size-6 text-zinc-800" />
                            </div>

                            <h2 className="text-2xl font-extrabold text-zinc-900">
                                Your wishlist is empty
                            </h2>
                            <p className="text-sm text-zinc-500 mt-2">
                                Save products by clicking the heart icon.
                            </p>

                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center mt-6 h-11 px-6 
                rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition active:scale-[0.98]"
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
