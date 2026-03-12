import { ProductsResponse } from "@/app/Interfaces/productInterface";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

import ProductCard from "@/components/ProductCard/ProductCard";

export default async function Products() {
  const response = await fetch(`${process.env.API_URL}/products`);
  const data: ProductsResponse = await response.json();
const session = await getServerSession(authOptions);

  return (
  <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
  {/* الخلفيات المبوّرة الكبيرة */}
  <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-400/20 blur-[120px] rounded-full" />
  <div className="pointer-events-none absolute bottom-0 right-0 w-[600px] h-[400px] bg-green-500/20 blur-[120px] rounded-full" />

  <div className="relative max-w-7xl mx-auto px-6 py-10">
    <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-sm">
      {/* الخلفيات الملونة داخل الكارد */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-green-400/10 blur-3xl" />

      <div className="relative text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900">
          Explore{" "}
          <span className="bg-linear-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Products
          </span>
        </h1>

        <p className="text-sm text-zinc-600">
          Click a products to view details.
        </p>

        <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-linear-to-r from-green-600 to-green-400" />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mt-9">
      {data.data.map((product) => (
        <div
          key={product._id}
          className="group relative rounded-3xl bg-white/70 backdrop-blur-xl 
            border border-white/40 shadow-md
            hover:shadow-2xl hover:-translate-y-2 
            transition-all duration-500 overflow-hidden"
        >
          {/* خلفية gradient عند hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-400/5 
            opacity-0 group-hover:opacity-100 transition duration-500 rounded-3xl" />

          <div className="relative p-6">
            <ProductCard product={product} />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
);
}