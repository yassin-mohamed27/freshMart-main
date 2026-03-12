import { Product } from "@/app/Interfaces/productInterface";
import AddToCart from "@/components/AddToCart/AddToCart";
import Slider from "@/components/Slider/Slider";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/Helpers/foramtCurrency";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { Params } from "next/dist/server/request/params";

export default async function ProductDetails({ params }: { params: Params }) {
    const { productId } = await params;
    const response = await fetch(`${process.env.API_URL}/products/` + productId);
    const { data: product }: { data: Product } = await response.json();
    const rating = Math.round(product.ratingsAverage || 0);
    const discountPct =
        product.priceAfterDiscount && product.price
            ? Math.max(0, Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100))
            : 0;
    return (
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
  <Card className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
    {/* الخلفيات الملونة */}
    <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />

    <div className="relative grid grid-cols-1 lg:grid-cols-2">
      <div className="p-4 sm:p-6 lg:p-8 bg-linear-to-b from-zinc-50 to-white border-b lg:border-b-0 lg:border-r border-zinc-200">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-800 shadow-sm">
            {product.brand.name}
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-800 shadow-sm">
            {product.category.name}
          </span>
          {discountPct > 0 && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-extrabold text-white shadow">
              -{discountPct}%
            </span>
          )}
        </div>
        <div className="relative rounded-3xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm overflow-hidden">
          <Slider images={product.images} title={product.title} />
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            In stock (demo)
          </span>
          <span>SKU: {product._id?.slice?.(-8) ?? ""}</span>
        </div>
      </div>

      <div className="p-5 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600">
          <span className="font-semibold text-zinc-800">{product.brand.name}</span>
          <span className="opacity-60">/</span>
          <span>{product.category.name}</span>
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
          {product.title}
        </h1>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-5",
                  i < rating ? "text-amber-400 fill-amber-400" : "text-zinc-300"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-800">
              {Number(product.ratingsAverage || 0).toFixed(1)}
            </span>
            <span className="text-sm text-zinc-500">/ 5</span>
          </div>
        </div>
        <p className="mt-5 text-base leading-relaxed text-zinc-600">
          {product.description}
        </p>

        <div className="mt-7 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-zinc-500">Price</p>
              {product.priceAfterDiscount ? (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="text-3xl font-extrabold text-red-600">
                    {formatCurrency(product.priceAfterDiscount)} EGP
                  </span>
                  <span className="text-base line-through text-zinc-400">
                    {formatCurrency(product.price)} EGP
                  </span>
                </div>
              ) : (
                <span className="mt-2 block text-3xl font-extrabold text-zinc-900">
                  {formatCurrency(product.price)} EGP
                </span>
              )}
            </div>
            {discountPct > 0 && (
              <div className="flex flex-col sm:items-end">
                <span className="text-xs text-zinc-500">You save</span>
                <span className="mt-1 inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600 border border-red-100">
                  {discountPct}%
                </span>
              </div>
            )}
          </div>

          <div className="my-5 h-px bg-zinc-200/80" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="font-semibold text-zinc-900">Fast Delivery</div>
              <div className="text-zinc-500 text-xs mt-1">24–48 hours</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="font-semibold text-zinc-900">Secure Payment</div>
              <div className="text-zinc-500 text-xs mt-1">Visa / Cash</div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="font-semibold text-zinc-900">Easy Returns</div>
              <div className="text-zinc-500 text-xs mt-1">7 days policy</div>
            </div>
          </div>
        </div>

        <div className="mt-7">
          <AddToCart productId={product._id} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
            Original Quality
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
            Best Price
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-3 py-1">
            Support 24/7
          </span>
        </div>
      </div>
    </div>
  </Card>
</div>
    );
}
