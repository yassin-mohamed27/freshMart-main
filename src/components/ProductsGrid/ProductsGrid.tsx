import Image from "next/image";

export default function ProductsGrid({ products }: any) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p: any) => (
                <div
                    key={p._id}
                    className="rounded-xl border bg-white shadow-sm overflow-hidden group"
                >
                    <div className="relative aspect-square">
                        <Image
                            src={p.imageCover}
                            alt={p.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                        />
                    </div>
                    <div className="p-3">
                        <p className="text-sm font-semibold line-clamp-1
          bg-linear-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
                            {p.title}
                        </p>
                        <p className="font-bold mt-1 text-[14px]
          bg-linear-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
                            {p.price} EGP
                        </p>
                    </div>
                </div>
            ))}
        </div>  
    );
}
