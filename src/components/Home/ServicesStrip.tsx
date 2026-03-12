"use client";

import { Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function ServicesStrip() {
  const items = [
    { t: "Fast delivery", d: "Quick shipping with reliable couriers.", Icon: Truck },
    { t: "Secure checkout", d: "Protected payments and trusted methods.", Icon: ShieldCheck },
    { t: "Easy returns", d: "Hassle-free returns on eligible items.", Icon: RefreshCcw },
  ];

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
bg-linear-to-r from-green-200/60 via-green-300/60 to-green-400/60 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-10 sm:py-12 relative">

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-3"
        >

          {items.map(({ t, d, Icon }) => (

            <motion.div
              key={t}
              variants={item}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
            >

              {/* hover overlay */}

              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 
group-hover:opacity-100 bg-linear-to-b from-green-500/10 via-green-400/10 to-transparent" />

              <div className="relative flex items-start gap-4">

                <motion.div
                  whileHover={{ rotate: 8, scale: 1.1 }}
                  className="grid size-12 place-items-center rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm"
                >

                  <Icon className="size-5 text-zinc-800" />

                </motion.div>

                <div className="min-w-0">

                  <div className="text-lg font-extrabold text-zinc-900">
                    {t}
                  </div>

                  <div className="mt-1 text-sm text-zinc-600">
                    {d}
                  </div>

                  <div className="mt-4 h-px w-full bg-zinc-200/80" />

                  <div className="mt-3 text-xs text-zinc-500">
                    Premium experience • Trusted service
                  </div>

                </div>

              </div>

            </motion.div>

          ))}

        </motion.div>

      </div>

    </motion.section>
  );
}