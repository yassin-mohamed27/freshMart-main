import React from "react";
import BrandsGrid, { Brand } from "@/components/BrandsGrid/BrandsGrid";

type BrandsResponse = {
  data: Brand[];
};

export default async function BrandsPage() {
  const res = await fetch("https://ecommerce.routemisr.com/api/v1/brands/", {
    cache: "no-store",
  });

  const json: BrandsResponse = await res.json();
  const brands = json?.data ?? [];

  return (
   <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
  <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
    {/* الخلفيات الملونة */}
    <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />

    <div className="relative text-center space-y-3">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
        Explore{" "}
        <span className="bg-linear-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
          Brands
        </span>
      </h1>

      <p className="text-sm text-zinc-600">
        Click a brand to view details.
      </p>

      <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-linear-to-r from-green-600 to-green-400" />
    </div>
  </div>

  <div className="mt-6 sm:mt-8">
    {brands.length ? (
      <BrandsGrid brands={brands} />
    ) : (
      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8 text-center">
        <p className="text-zinc-700 font-semibold">No brands found</p>
        <p className="text-sm text-zinc-500 mt-2">
          The API returned an empty list.
        </p>
      </div>
    )}
  </div>
</div>
  );
}
