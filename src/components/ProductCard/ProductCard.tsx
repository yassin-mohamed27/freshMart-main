"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import AddToCart from "@/components/AddToCart/AddToCart";
import { motion } from "framer-motion";

export type ProductCardItem = {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
    priceAfterDiscount?: number;
    ratingsAverage?: number;
    brand: { name: string };
    category: { name: string };
};

export default function ProductCard({ product }: { product: ProductCardItem }) {
    const formatCurrency = (n: number) => new Intl.NumberFormat("en-EG").format(n);

    const rating = Math.round(Number(product.ratingsAverage || 0));

    const discountPct = product.priceAfterDiscount
        ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
        : 0;

    return (
        <motion.div
            whileHover={{ scale: 1.03, rotateX: 3, rotateY: -3 }}
            transition={{ type: "spring", stiffness: 200 }}
        >

            <Card
                className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm
transition-all duration-300 hover:shadow-xl"
            >

                {/* shine effect */}

                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                    <div className="absolute -left-full top-0 h-full w-1/2  from-transparent via-white/40 to-transparent group-hover:left-full transition-all duration-700" />
                </div>

                <Link href={"/products/" + product._id} className="block">

                    <div className="relative aspect-4/3 w-full overflow-hidden bg-zinc-50">

                        <Image
                            src={product.imageCover}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        />

                        <div className="absolute inset-x-2 sm:inset-x-3 top-2 sm:top-3 z-10 flex flex-wrap items-center justify-between gap-2">

                            <span className="max-w-[70%] truncate rounded-full bg-white/90 px-2.5 sm:px-3 py-1 text-[11px] font-semibold text-zinc-800 shadow-sm border border-zinc-200">
                                {product.brand?.name}
                            </span>

                            {product.priceAfterDiscount ? (

                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="shrink-0 rounded-full bg-red-600 px-2.5 sm:px-3 py-1 text-[11px] font-extrabold text-white shadow"
                                >

                                    -{discountPct}%

                                </motion.span>

                            ) : null}

                        </div>

                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/15 to-transparent" />

                    </div>

                    <div className="px-3 sm:px-2 pt-3 sm:pt-4 pb-3">

                        <div className="space-y-1">

                            <h3 className="text-[14px] sm:text-[15px] font-bold leading-snug line-clamp-2 sm:line-clamp-1 text-zinc-900">
                                {product.title}
                            </h3>

                            <p className="text-[11px] sm:text-xs text-zinc-600 line-clamp-1">
                                {product.brand?.name} • {product.category?.name}
                            </p>

                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">

                            <div className="flex items-center">

                                {[...Array(5)].map((_, i) => (

                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                    >

                                        <Star
                                            className={cn(
                                                "size-4",
                                                i < rating
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-zinc-300"
                                            )}
                                        />

                                    </motion.div>

                                ))}

                            </div>

                            <span className="text-[11px] sm:text-xs text-zinc-500">
                                ({Number(product.ratingsAverage || 0).toFixed(1)})
                            </span>

                        </div>

                        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3">

                            {product.priceAfterDiscount ? (

                                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">

                                    <div className="flex flex-col">

                                        <span className="text-base sm:text-lg font-extrabold text-red-600">
                                            {formatCurrency(product.priceAfterDiscount)} EGP
                                        </span>

                                        <span className="text-xs line-through text-zinc-400">
                                            {formatCurrency(product.price)} EGP
                                        </span>

                                    </div>

                                    <span className="text-[11px] font-semibold text-emerald-600">
                                        Save {formatCurrency(product.price - product.priceAfterDiscount)} EGP
                                    </span>

                                </div>

                            ) : (

                                <span className="text-base sm:text-lg font-extrabold text-zinc-900">
                                    {formatCurrency(product.price)} EGP
                                </span>

                            )}

                        </div>

                    </div>

                </Link>

                <div className="px-3 sm:px-4 pb-0 pt-0">

                    <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm">

                        <AddToCart productId={product._id} />

                    </div>

                </div>

            </Card>

        </motion.div>
    );
}