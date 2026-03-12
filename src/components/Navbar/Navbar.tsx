import Link from "next/link"
import Image from "next/image"
import logo from "../../app/marketshopping.png"
import { Poppins } from "next/font/google"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
// import dynamic from "next/dynamic";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Logout from "../Logout/Logout"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { Heart } from "lucide-react"
import CartIcon from "../CartIcon/CartIcon"
import { CartRes } from "@/app/Interfaces/CartInterfaces"
import NavbarClientParts from "./NavbarClientsParts"
const poppins = Poppins({ weight: "700", subsets: ["latin"] })

// const CartIcon = dynamic(() => import("../CartIcon/CartIcon"), { ssr: false });
export default async function Navbar() {
    const session = await getServerSession(authOptions)
    let data: CartRes | null = null
    let totalQty = 0
    if (session) {
        const response = await fetch(`${process.env.API_URL}/cart`, {
            headers: {
                token: (session as any).tokenRes,
            },
            cache: "no-store",
        })
        data = await response.json()
        if (data?.data?.products?.length) {
            totalQty = data.data.products.reduce((sum, item) => sum + (item.count ?? 0), 0)
        }
    }
    return (
    <nav suppressHydrationWarning className="sticky top-0 z-50  border-b border-slate-800 bg-slate-950 shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/35 to-transparent" />
  <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/6 to-transparent" />
  <div className="container mx-auto flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
          {/* Burger on mobile */}
          <NavbarClientParts />

          {/* Logo */}
          <Link href="/" className="group">
              <div className="flex items-center gap-3 shrink-0">
                  <div className="rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-1.5 shadow-sm transition-all duration-300 group-hover:bg-slate-900/80 group-hover:ring-slate-700">
                      <Image src={logo} alt="Logo" width={45} height={45} className="rounded-3xl" />
                  </div>
                  <span
                      className={[
                          poppins.className,
                          "text-base sm:text-lg font-bold tracking-tight",
                          "bg-linear-to-r from-emerald-400 via-emerald-500 to-green-600 bg-clip-text text-transparent",
                      ].join(" ")}
                  >
                      FreshMart
                  </span>
              </div>
          </Link>
      </div>
      <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
              <NavigationMenuList className="flex flex-row items-center gap-1 rounded-2xl border border-slate-800 bg-slate-900/60 p-1">
                  {["Products", "Brands", "Categories"].map((tab) => (
                      <NavigationMenuItem key={tab}>
                          <NavigationMenuLink asChild>
                              <Link
                                  href={`/${tab.toLowerCase()}`}
                                  className="relative px-4 py-2 rounded-xl text-sm text-slate-300 
                                  transition-all duration-300 hover:text-white hover:bg-slate-800/70
                                  focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60
                                  data-[active=true]:text-white data-[active=true]:bg-slate-800/80 data-[active=true]:ring-1 data-[active=true]:ring-slate-700
                                  after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:scale-x-0 after:origin-center
                                  after:bg-linear-to-r after:from-emerald-400 after:via-emerald-500 after:to-green-600 after:transition-transform after:duration-300
                                  hover:after:scale-x-100 data-[active=true]:after:scale-x-100">
                                  {tab}
                              </Link>
                          </NavigationMenuLink>
                      </NavigationMenuItem>
                  ))}
              </NavigationMenuList>
          </NavigationMenu>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
          {session ? (
              <>
                  <Link href="/wishlist" className="outline-none">
                      <div className="relative rounded-2xl bg-slate-900 ring-1 ring-slate-800 p-2 transition-all 
                      duration-300 hover:bg-slate-800/80 hover:ring-slate-700 active:scale-[0.98]">
                          <Heart className="w-5 h-5 text-slate-300 hover:text-pink-400 transition-colors duration-300" />
                      </div>
                  </Link>
                  {data?.status === "success" && (
                      <CartIcon
                          serverCartNum={data?.status === "success" ? totalQty : 0}
                          cartId={data?.status === "success" ? data.cartId : ""}
                          userId={data?.status === "success" ? data.data?.cartOwner : ""}
                      />
                  )}
                  <DropdownMenu>
                      <DropdownMenuTrigger className="outline-none">
                          {(() => {
                              const fullName =
                                  (session as any)?.user?.name?.trim?.() ||
                                  (session as any)?.user?.email?.split?.("@")?.[0] ||
                                  "User"
                              const initial = fullName?.[0]?.toUpperCase?.() || "U"
                              return (
                                  <div className="flex items-center gap-2 rounded-2xl bg-slate-900 ring-1 ring-slate-800 px-2 py-1.5
                                  transition-all duration-300 hover:bg-slate-800/80 hover:ring-slate-700 active:scale-[0.98]">
                                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 ring-1 ring-slate-800 text-white font-extrabold">
                                          {initial}
                                      </div>
                                      <span className="hidden sm:block text-sm font-semibold text-slate-200 max-w-35 truncate">
                                          {fullName}
                                      </span>
                                  </div>
                              )
                          })()}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="min-w-56 bg-slate-950 border border-slate-800 text-slate-200 shadow-2xl rounded-2xl p-2">
                          <DropdownMenuGroup>
                              <DropdownMenuLabel className="text-xs text-slate-400 px-2 py-2">
                                  My Account
                              </DropdownMenuLabel>
                              <Link href="/profile">
                                  <DropdownMenuItem className="rounded-xl cursor-pointer px-3 py-2 text-sm hover:bg-slate-800/70 hover:text-white focus:bg-slate-800/70 focus:text-white">
                                      Profile
                                  </DropdownMenuItem>
                              </Link>
                              <Link href="/allorders">
                                  <DropdownMenuItem className="rounded-xl cursor-pointer px-3 py-2 text-sm hover:bg-slate-800/70 hover:text-white focus:bg-slate-800/70 focus:text-white">
                                      My Orders
                                  </DropdownMenuItem>
                              </Link>
                              <div className="my-2 h-px bg-slate-800" />
                              <Logout />
                          </DropdownMenuGroup>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </>
          ) : (
              <div className="flex items-center gap-2">
                  <Link
                      href="/login"
                      className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white 
                      hover:bg-slate-800/60 transition-all duration-300">
                      Login
                  </Link>
                  <Link
                      href="/register"
                      className="px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg 
                      bg-slate-900 text-white ring-1 ring-slate-800 hover:bg-slate-800 transition-all 
                      duration-300 active:scale-[0.98]">
                      Register
                  </Link>
              </div>
          )}
      </div>
  </div>
</nav>
    )
}
