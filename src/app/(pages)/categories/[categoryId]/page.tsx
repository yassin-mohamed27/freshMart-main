import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard/ProductCard";

type Category = {
  _id: string;
  name: string;
  image: string;
  slug?: string;
};

type Product = {
  _id: string;
  title: string;
  imageCover: string;
  price: number;
  priceAfterDiscount?: number;
  category?: Category;
};

async function fetchJson(url: string) {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  return { res, json };
}

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  // 1) category details
  const { res: catRes, json: catJson } = await fetchJson(
    `https://ecommerce.routemisr.com/api/v1/categories/${encodeURIComponent(categoryId)}`
  );
  const category: Category | undefined = catJson?.data;

  if (!catRes.ok || !category?._id) {
    return (
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-10">
        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-7 text-center shadow-sm">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

          <h1 className="relative text-xl font-extrabold text-zinc-900">Category not found</h1>
          <p className="relative mt-2 text-sm text-zinc-600">This category ID might be invalid.</p>

          <Link
            href="/categories"
            className="relative mt-5 inline-flex items-center justify-center rounded-xl border border-zinc-200
            bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-100 transition"
          >
            Back to categories
          </Link>
        </div>
      </div>
    );
  }

  // 2) products by category (fallback [in])
  let products: Product[] = [];

  const url1 = `https://ecommerce.routemisr.com/api/v1/products?category=${encodeURIComponent(categoryId)}`;
  let p1 = await fetchJson(url1);
  products = p1.json?.data ?? [];

  if (p1.res.ok && products.length === 0) {
    const url2 = `https://ecommerce.routemisr.com/api/v1/products?category[in]=${encodeURIComponent(categoryId)}`;
    const p2 = await fetchJson(url2);
    products = p2.json?.data ?? [];
  }

  const formatEGP = (n: number) => new Intl.NumberFormat("en-EG").format(n);

  return (
   <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
  {/* Header */}
  <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
    {/* الخلفيات الملونة */}
    <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />

    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 min-w-0">
        {category?.image ? (
          <div className="relative h-12 w-28 rounded-2xl border border-zinc-200 bg-zinc-50 p-2 shadow-sm">
            <Image
              src={category.image}
              alt={category.name}
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
              {category.name}
            </span>{" "}
            Products
          </h1>

          <p className="text-sm text-zinc-600">
            Discover deals and best picks from this category.
          </p>
        </div>
      </div>

      <Link
        href="/categories"
        className="shrink-0 inline-flex items-center justify-center rounded-xl border border-zinc-200
        bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 transition"
      >
        Back to categories
      </Link>
    </div>
  </div>

  {/* Products */}
  {!products.length ? (
    <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 text-center">
      <p className="text-zinc-900 font-extrabold">No products for this category</p>
      <p className="mt-2 text-sm text-zinc-600">
        This category might have no products.
      </p>
    </div>
  ) : (
    <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p: any) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )}
</div>
  );
}
