"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Category = {
  _id: string;
  name: string;
  image?: string;
  slug?: string;
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 35 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default async function CategoriesGrid() {
  const res = await fetch(
    "https://ecommerce.routemisr.com/api/v1/categories?limit=12",
    { cache: "no-store" }
  );
  const json = await res.json();
  const categories: Category[] = json?.data ?? [];

  if (!categories.length) return null;

  return (
    <section className="bg-white text-zinc-900">
      <div className="container mx-auto px-6 pb-14">
        {/* عنوان القسم */}
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xs text-zinc-500"
            >
              Browse faster
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-1 text-xl sm:text-2xl font-extrabold text-green-600"
            >
              Shop by{" "}
              <span className="bg-linear-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
                category
              </span>
            </motion.h3>
          </div>

          <Link
            href="/categories"
            className="text-sm font-semibold text-zinc-800 hover:text-green-600 transition"
          >
            All categories →
          </Link>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {categories.map((c) => (
            <motion.div
              key={c._id}
              variants={item}
              whileHover={{ scale: 1.05, rotateX: 4, rotateY: -4 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group"
            >
              <Link href={`/categories/${c._id}`} className="block">
                <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  
                  {/* overlay on hover */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-linear-to-b from-green-200/10 via-green-300/10 to-transparent" />

                  {/* image */}
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.06]"
                      />
                    ) : (
                      <div className="h-full w-full bg-zinc-100" />
                    )}
                  </div>

                  {/* title */}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-sm font-extrabold text-green-600 line-clamp-1 group-hover:text-green-700 transition">
                      {c.name}
                    </span>
                    <span className="text-xs font-semibold text-zinc-500 group-hover:text-green-600 transition">
                      View →
                    </span>
                  </div>

                  <div className="mt-1 text-[11px] text-zinc-500">
                    Browse products & offers
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}