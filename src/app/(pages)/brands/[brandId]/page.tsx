import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard/ProductCard";

type Brand = { _id: string; name: string; image: string; slug?: string };
type Product = {
    _id: string;
    title: string;
    imageCover: string;
    price: number;
    priceAfterDiscount?: number;
    brand?: Brand;
};

async function fetchJson(url: string) {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    return { res, json };
}

export default async function BrandProductsPage({
    params,
}: {
    params: Promise<{ brandId: string }>;
}) {
    // ✅ أهم سطر: لازم await
    const { brandId } = await params;

    // 1) brand details
    const { res: brandRes, json: brandJson } = await fetchJson(
        `https://ecommerce.routemisr.com/api/v1/brands/${encodeURIComponent(brandId)}`
    );
    const brand: Brand | undefined = brandJson?.data;

    // 2) products by brand (with fallback)
    let products: Product[] = [];
    let p1 = await fetchJson(
        `https://ecommerce.routemisr.com/api/v1/products?brand=${encodeURIComponent(brandId)}`
    );
    products = p1.json?.data ?? [];

    if (p1.res.ok && products.length === 0) {
        const p2 = await fetchJson(
            `https://ecommerce.routemisr.com/api/v1/products?brand[in]=${encodeURIComponent(brandId)}`
        );
        products = p2.json?.data ?? [];
    }

    const formatEGP = (n: number) => new Intl.NumberFormat("en-EG").format(n);

    // نفس UI بتاعك لو مفيش منتجات
    if (!products.length) {
        return (
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-10">
                <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 text-center shadow-sm">
                    <h1 className="relative text-xl font-extrabold text-zinc-900">
                        No products for this brand
                    </h1>
                    <p className="relative mt-2 text-sm text-zinc-600">
                        This brand might have no products or the ID is invalid.
                    </p>
                    <Link
                        href="/brands"
                        className="relative mt-5 inline-flex items-center justify-center rounded-xl border border-zinc-200 
            bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition"
                    >
                        Back to brands
                    </Link>
                </div>
            </div>
        );
    }

    return (
   <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
        {/* الخلفيات الملونة */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
                {brand?.image ? (
                    <div className="relative h-12 w-28 rounded-2xl border border-zinc-200 bg-zinc-50 p-2 shadow-sm">
                        <Image
                            src={brand.image}
                            alt={brand.name}
                            fill
                            className="object-contain p-2"
                            sizes="112px"
                        />
                    </div>
                ) : (
                    <div className="h-12 w-28 rounded-2xl border border-zinc-200 bg-zinc-50" />
                )}

                <div className="min-w-0">
                    <div className="inline-flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium text-zinc-600">
                            {products.length} items
                        </span>
                    </div>

                    <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 line-clamp-1">
                        <span className="bg-linear-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                            {brand?.name ?? "Brand"}
                        </span>{" "}
                        Products
                    </h1>

                    <p className="text-sm text-zinc-600">
                        Discover deals and best picks from this brand.
                    </p>
                </div>
            </div>

            <Link
                href="/brands"
                className="shrink-0 inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition"
            >
                Back to brands
            </Link>
        </div>
    </div>

    {/* Products grid */}
    <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p: any) => (
            <ProductCard key={p._id} product={p} />
        ))}
    </div>
</div>
    );
}
