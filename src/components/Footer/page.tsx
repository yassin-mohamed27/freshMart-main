import Link from "next/link"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"

export default function Footer() {
    return (
     <footer className="relative border-t border-slate-800 bg-slate-950 text-white">
  <div className="container mx-auto px-6 py-14">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

      {/* ===== Brand Info ===== */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">
          <span className="bg-linear-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
            freshMart
          </span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Your trusted online store for tech, fashion, and lifestyle products.
          Fast shipping and premium quality guaranteed.
        </p>
        <div className="flex gap-3 pt-2">
          {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
            <div
              key={i}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition cursor-pointer"
            >
              <Icon size={16} className="text-white" />
            </div>
          ))}
        </div>
      </div>

      {/* ===== Shop Links ===== */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold">
          <span className="bg-linear-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
            Shop
          </span>
        </h3>
        <ul className="space-y-2 text-sm">
          {["All Products","Categories","Brands","Deals"].map((link, i) => (
            <li key={i}>
              <Link
                href={`/${link.toLowerCase().replace(" ","")}`}
                className="hover:text-white hover:bg-slate-800/60 rounded-xl px-2 py-1 transition-all duration-300 block"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== Company Links ===== */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold">
          <span className="bg-linear-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
            Company
          </span>
        </h3>
        <ul className="space-y-2 text-sm">
          {["About Us","Contact","Careers","Blog"].map((link, i) => (
            <li key={i}>
              <Link
                href={`/${link.toLowerCase().replace(" ","")}`}
                className="hover:text-white hover:bg-slate-800/60 rounded-xl px-2 py-1 transition-all duration-300 block"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== Support Links ===== */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold">
          <span className="bg-linear-to-r from-green-400 via-emerald-400 to-green-600 bg-clip-text text-transparent">
            Support
          </span>
        </h3>
        <ul className="space-y-2 text-sm">
          {["Help Center","Returns","Privacy Policy","Terms of Service"].map((link, i) => (
            <li key={i}>
              <Link
                href={`/${link.toLowerCase().replace(/ /g,"")}`}
                className="hover:text-white hover:bg-slate-800/60 rounded-xl px-2 py-1 transition-all duration-300 block"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>
      </div>

    </div>

    {/* ===== Bottom Footer ===== */}
    <div className="mt-14 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-300">
      <p>
        © {new Date().getFullYear()} freshMart. All rights reserved.
      </p>
      <div className="flex gap-5">
        <span>🚚 Fast Shipping</span>
        <span>🔒 Secure Payments</span>
        <span>⭐ 24/7 Support</span>
      </div>
    </div>
  </div>
</footer>
    )
}
