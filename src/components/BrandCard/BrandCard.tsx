import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type Brand = {
    _id: string;
    name: string;
    image: string;
};

export default function BrandCard({ brand }: { brand: Brand }) {
    return (
       <Card
    className="group overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm transition-all duration-300
    hover:-translate-y-1 hover:shadow-xl"
>
    <Link href={`/brands/${brand._id}`} className="block">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-emerald-50">
            <Image
                src={brand.image}
                alt={brand.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.06]"
            />

            <div className="absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-2">
                <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-emerald-800 shadow-sm border border-emerald-200">
                    {brand.name}
                </span>

                <span className="rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-extrabold text-white shadow">
                    Brand
                </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/15 to-transparent" />
        </div>

        <div className="px-4 pt-4 pb-3">
            <div className="space-y-1">
                <h3 className="text-[15px] font-bold leading-snug line-clamp-1 text-emerald-900">
                    {brand.name}
                </h3>

                <p className="text-xs text-emerald-600">
                    Browse brand products & offers
                </p>
            </div>

            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                <span className="text-sm font-extrabold text-emerald-900">
                    View brand
                </span>
            </div>
        </div>
    </Link>

    <div className="px-4 pb-4 pt-0">
        <div className="rounded-2xl border border-emerald-200 bg-white p-2 shadow-sm">
            <Link
                href={`/brands/${brand._id}`}
                className="flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 transition"
            >
                View →
            </Link>
        </div>
    </div>
</Card>
    );
}
