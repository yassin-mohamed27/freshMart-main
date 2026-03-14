"use client"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-emerald-800 text-white">

      {/* background animation */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-3xl w-[600px] h-[600px]" />
      </motion.div>

      <div className="container mx-auto px-6 min-h-[calc(100vh-72px)] grid place-items-center py-10 relative">
        <div className="mx-auto max-w-4xl text-center space-y-8">

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-700 bg-emerald-900/60 px-4 py-1.5 text-sm text-emerald-200 shadow-sm"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-lime-400 animate-pulse" />
            Weekly deals • New arrivals • Fast delivery
          </motion.div>

          {/* heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight"
          >
            Experience luxury in every choice with{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              FreshMart
            </span>
          </motion.h1>

          {/* description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto max-w-2xl text-base sm:text-lg text-emerald-100/80"
          >
            Discover top-quality tech, fashion, and lifestyle essentials handpicked for you.
            Safe payments, quick delivery, and reliable customer care everything you need in one destination.
          </motion.p>

          {/* buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3 text-sm font-semibold shadow-lg transition hover:scale-105"
            >
              Shop Now
            </Link>

            <Link
              href="/categories"
              className="inline-flex items-center justify-center rounded-2xl border border-emerald-700 bg-emerald-900/40 px-8 py-3 text-sm font-semibold text-emerald-200 transition hover:scale-105"
            >
              Browse Categories
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  )
}