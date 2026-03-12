"use client";
import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BadgePercent } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard/ProductCard";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 35 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function DealsSliderClient({ products }: { products: any[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const scrollByCards = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;

    const amount = Math.round(el.clientWidth * 0.9);

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (!products?.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative bg-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-65 w-205 -translate-x-1/2
        bg-linear-to-r from-green-200/30 via-emerald-200/30 to-green-300/30 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 pb-14 relative">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div className="space-y-2">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700"
            >
              <BadgePercent className="size-4" />
              Limited-time discounts
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-green-600"
            >
              Best{" "}
              <span className="bg-linear-to-r from-green-400 via-emerald-400 to-green-700 bg-clip-text text-transparent">
                Deals
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-zinc-600 max-w-xl"
            >
              Save more on discounted products — swipe to explore.
            </motion.p>

          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">

              <button
                onClick={() => scrollByCards("left")}
                className="grid size-10 place-items-center rounded-2xl border border-zinc-200 bg-white shadow-sm
                hover:bg-zinc-50 transition active:scale-[0.98]"
              >
                <ChevronLeft className="size-5 text-zinc-800" />
              </button>

              <button
                onClick={() => scrollByCards("right")}
                className="grid size-10 place-items-center rounded-2xl border border-zinc-200 bg-white shadow-sm
                hover:bg-zinc-50 transition active:scale-[0.98]"
              >
                <ChevronRight className="size-5 text-zinc-800" />
              </button>

            </div>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800
              shadow-sm hover:bg-green-50 hover:text-green-600 transition active:scale-[0.98]"
            >
              View all →
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-zinc-200 bg-linear-to-b from-zinc-50 to-white p-3 sm:p-4 shadow-sm">

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            ref={ref}
            className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
            pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >

            {products.map((p) => (
              <motion.div
                key={p._id}
                variants={item}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="snap-start shrink-0 w-[78%] sm:w-[42%] md:w-[32%] lg:w-[24%]"
              >
                <ProductCard product={p} />
              </motion.div>
            ))}

          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}