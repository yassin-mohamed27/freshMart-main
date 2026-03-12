"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

type Category = { _id: string; name: string; image?: string; slug?: string };

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function CategoriesSliderClient({ categories }: { categories: Category[] }) {
    const ref = useRef<HTMLDivElement | null>(null);

    const scrollByCards = (dir: "left" | "right") => {
        const el = ref.current;
        if (!el) return;
        el.scrollBy({ left: dir === "left" ? -Math.round(el.clientWidth * 0.85) : Math.round(el.clientWidth * 0.85), behavior: "smooth" });
    };

    if (!categories?.length) return null;

    

    return (
        <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="relative bg-white text-zinc-900">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-28 left-1/2 h-65 w-205 -translate-x-1/2 bg-linear-to-r from-gray-200/30 via-gray-300/30 to-gray-200/30 blur-3xl" />
            </div>

            <div className="container mx-auto px-6 pb-12 relative">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-100/50 px-3 py-1 text-xs font-semibold text-zinc-700">
                            ✨ Explore collections
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-green-600">
                            Shop by <span className="bg-linear-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">Category</span>
                        </h3>
                        <p className="text-sm text-zinc-600 max-w-xl">
                            Pick a category to discover curated products and offers.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={() => scrollByCards("left")} className="grid size-10 place-items-center rounded-2xl border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 transition active:scale-[0.98]"><ChevronLeft className="size-5 text-zinc-800" /></button>
                            <button onClick={() => scrollByCards("right")} className="grid size-10 place-items-center rounded-2xl border border-zinc-200 bg-white shadow-sm hover:bg-zinc-100 transition active:scale-[0.98]"><ChevronRight className="size-5 text-zinc-800" /></button>
                        </div>
                        <Link href="/categories" className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-sm hover:bg-zinc-100 transition active:scale-[0.98]">
                            All categories →
                        </Link>
                    </div>
                </div>

                <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm">
                    <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} ref={ref} className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {categories.map(c => (
                            <Link key={c._id} href={`/categories/${c._id}`} className="snap-start shrink-0 w-[62%] sm:w-[34%] md:w-[26%] lg:w-[20%]">
                                <motion.div variants={item} whileHover={{ scale: 1.05, rotateX: 4, rotateY: -4 }} transition={{ type: "spring", stiffness: 200 }} className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                                    <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-linear-to-b from-green-200/10 via-green-300/10 to-transparent" />
                                    <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50/50">
                                        {c.image ? <Image src={c.image} alt={c.name} fill sizes="(max-width: 640px) 60vw, (max-width: 1024px) 33vw, 20vw" className="object-contain p-6 transition-transform duration-300 group-hover:scale-110" /> : <div className="h-full w-full bg-zinc-100/50" />}
                                    </div>
                                    <div className="relative mt-4 flex items-center justify-between gap-3">
                                        <span className="text-sm font-extrabold text-green-600 line-clamp-1 group-hover:text-green-700 transition">{c.name}</span>
                                        <span className="text-xs font-semibold text-zinc-500 group-hover:text-green-600 transition">View →</span>
                                    </div>
                                    <div className="relative mt-1 text-[11px] text-zinc-500">Browse products & offers</div>
                                </motion.div>
                            </Link>
                        ))}
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}