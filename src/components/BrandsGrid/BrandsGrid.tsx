import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export type Brand = {
    _id: string;
    name: string;
    image: string;
    slug?: string;
};

export default function BrandsGrid({ brands }: { brands: Brand[] }) {
    return (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
  {brands.map((brand) => (
    <Link key={brand._id} href={`/brands/${brand._id}`} className="block">
      <Card
        className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-5 sm:p-6 
        shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
        focus-within:ring-2 focus-within:ring-emerald-200"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-300
          group-hover:opacity-100 bg-linear-to-b from-emerald-500/10 via-teal-500/10 to-transparent"
        />

        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
          <Image
            src={brand.image}
            alt={brand.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-6 transition-transform duration-300 group-hover:scale-[1.06]"
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-bold text-emerald-900 line-clamp-1">
            {brand.name}
          </span>

          <span className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-700 transition">
            View →
          </span>
        </div>

        <div className="mt-1 text-[11px] text-emerald-500">
          Browse brand details
        </div>
      </Card>
    </Link>
  ))}
</div>
    );
}
