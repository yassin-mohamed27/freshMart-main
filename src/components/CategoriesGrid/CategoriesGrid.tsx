import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export type Category = {
    _id: string;
    name: string;
    image: string;
    slug?: string;
};

export default function CategoriesGrid({ categories }: { categories: Category[] }) {
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {categories.map((cat) => (
    <Link key={cat._id} href={`/categories/${cat._id}`} className="block">
      <Card
        className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6
          shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
          focus-within:ring-2 focus-within:ring-green-200"
      >
        {/* خلفية hover */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300
            group-hover:opacity-100 bg-linear-to-b from-green-500/10 via-green-400/10 to-transparent"
        />

        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
          <Image
            src={cat.image}
            alt={cat.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.06]"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-bold text-zinc-900 line-clamp-1">{cat.name}</span>
          <span className="text-xs font-semibold text-zinc-600 group-hover:text-green-600 transition">
            View →
          </span>
        </div>

        <div className="mt-1 text-[11px] text-zinc-500">
          Browse category products & offers
        </div>
      </Card>
    </Link>
  ))}
</div>
    );
}
