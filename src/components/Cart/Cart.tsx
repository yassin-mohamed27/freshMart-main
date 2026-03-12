"use client"
import { clearCartAction, deleteProductAction, updateProductAction } from "@/actions/cartActions"
import { CartRes } from "@/app/Interfaces/CartInterfaces"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/Helpers/foramtCurrency"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CheckOutSession from "../CheckOutSession/CheckOutSession"
export default function Cart({ cartData }: { cartData: CartRes | null }) {
    const [cart, setCart] = useState<CartRes | null>(cartData || null)
    const [loadingId, setloadingId] = useState<string | null>(null)
    const [isClearing, setIsClearing] = useState(false)
    const totalQty = (c: CartRes | null) =>
        c?.data?.products?.reduce((sum, item) => sum + (item.count ?? 0), 0) ?? 0
    useEffect(() => {
        window.dispatchEvent(new CustomEvent("cartUpdate", { detail: totalQty(cartData) }))
    }, [])
    async function updateProductcount(productId: string, count: number) {
        setloadingId(productId)
        const response: CartRes = await updateProductAction(productId, count)
        if (response?.status === "success") {
            setCart(response)
            window.dispatchEvent(
                new CustomEvent("cartUpdate", { detail: totalQty(response) })
            )
            toast.success("Product Count Updated")
        }
        setloadingId(null)
    }
    async function deleteCartProduct(productId: string) {
        setloadingId(productId)
        const response: CartRes = await deleteProductAction(productId)
        if (response?.status === "success") {
            setCart(response)
            window.dispatchEvent(
                new CustomEvent("cartUpdate", { detail: totalQty(response) })
            )
            toast.success("Product removed from cart")
        }
        setloadingId(null)
    }
    async function clearCart() {
        setIsClearing(true)
        try {
            const response = await clearCartAction()
            if (response?.status === "success" || response?.message === "success") {
                setCart(null)
                window.dispatchEvent(
                    new CustomEvent("cartUpdate", { detail: 0 })
                )
                toast.success("Cart cleared")
                return
            }
            toast.error("Failed to clear cart")
        } finally {
            setIsClearing(false)
        }
    }
    return (
        <>
            {cart ? (
                <>
                    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
                        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                            <div className="relative p-5 sm:p-8">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                                            Shopping Cart
                                        </h1>
                                        <p className="text-sm text-zinc-500 mt-1">
                                            {cart.numOfCartItems} {cart.numOfCartItems === 1 ? "item" : "items"} in your cart
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link href={"/products"}>
                                            <Button
                                                variant="outline"
                                                className="rounded-xl border-zinc-200 bg-white hover:bg-zinc-50">
                                                Continue Shopping
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
                                    <div className="lg:col-span-2">
                                        <div className="rounded-3xl border border-zinc-200 bg-linear-to-b from-zinc-50 to-white p-4 sm:p-5">
                                            {cart.data.products.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="rounded-3xl border relative border-zinc-200 bg-white p-4 sm:p-5 shadow-sm mb-4 last:mb-0">
                                                    {loadingId === item.product._id && (
                                                        <div className="absolute inset-0 bg-white/50 flex justify-center items-center">
                                                            <Loader2 className="animate-spin" />
                                                        </div>
                                                    )}
                                                    <div className="flex flex-col sm:flex-row gap-4">
                                                        <div className="relative w-full sm:w-28 sm:h-28 h-44 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 ">
                                                            <img
                                                                src={item.product.imageCover}
                                                                alt={item.product.title}
                                                                className="h-full w-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                                <div className="min-w-0">
                                                                    <h3 className="text-base sm:text-lg font-extrabold text-zinc-900 line-clamp-2">
                                                                        {item.product.title}
                                                                    </h3>
                                                                    <p className="text-sm text-zinc-500 mt-1">
                                                                        {item.product.brand.name} • {item.product.category.name}
                                                                    </p>
                                                                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                                                        <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-zinc-700">
                                                                            Unit: {formatCurrency(item.price)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="shrink-0 text-left sm:text-right">
                                                                    <div className="text-sm text-zinc-500">Price</div>
                                                                    <div className="text-xl font-extrabold text-zinc-900">
                                                                        {formatCurrency(item.price * item.count)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                                <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white p-2">
                                                                    <button
                                                                        onClick={() => updateProductcount(item.product._id, item.count - 1)}
                                                                        disabled={item.count <= 1}
                                                                        aria-label="decrease"
                                                                        className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 
                                                                        text-zinc-800 transition hover:bg-zinc-100 active:scale-[0.98]">
                                                                        -
                                                                    </button>
                                                                    <span className="w-10 text-center text-sm font-extrabold text-zinc-900">
                                                                        {item.count}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateProductcount(item.product._id, item.count + 1)}
                                                                        disabled={item.count == item.product.quantity}
                                                                        aria-label="increase"
                                                                        className="grid size-9 place-items-center rounded-xl border border-zinc-200 bg-zinc-50 
                                                                        text-zinc-800 transition hover:bg-zinc-100 active:scale-[0.98]">
                                                                        +
                                                                    </button>
                                                                </div>
                                                                <button
                                                                    onClick={() => deleteCartProduct(item.product._id)}
                                                                    aria-label="remove"
                                                                    className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 
                                                                    text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98]">
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="mt-6 flex justify-end">
                                                <Button
                                                    onClick={() => clearCart()}
                                                    disabled={isClearing}
                                                    variant="outline"
                                                    className="h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                                                    {isClearing ? (
                                                        <span className="inline-flex items-center gap-2">
                                                            <Loader2 className="size-4 animate-spin" />
                                                            Clearing...
                                                        </span>
                                                    ) : (
                                                        "Remove All Items"
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:col-span-1 lg:sticky lg:top-24">
                                        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 sm:p-6">
                                            <h2 className="text-lg font-extrabold text-zinc-900">Order Summary</h2>
                                            <div className="mt-5 space-y-3 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-zinc-500">
                                                        Subtotal ({cart.numOfCartItems} {cart.numOfCartItems === 1 ? "item" : "items"})
                                                    </span>
                                                    <span className="font-extrabold text-zinc-900">
                                                        {formatCurrency(cart.data.totalCartPrice)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-zinc-500">Shipping</span>
                                                    <span className="font-semibold text-emerald-600">Free</span>
                                                </div>
                                            </div>
                                            <div className="my-5 h-px bg-zinc-200/80" />
                                            <div className="flex items-center justify-between">
                                                <span className="text-base font-extrabold text-zinc-900">Total</span>
                                                <span className="text-base font-extrabold text-zinc-900">
                                                    {formatCurrency(cart.data.totalCartPrice)}
                                                </span>
                                            </div>
                                            <CheckOutSession cartId={(cart as any)?.data?._id ?? (cart as any)?.cartId} />
                                            <p className="mt-3 text-xs text-zinc-500">
                                                Secure checkout • Easy returns • Fast delivery
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-14 sm:py-16">
                        <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm p-10 text-center">
                            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
                            <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
                            <div className="relative">
                                <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-zinc-50 border border-zinc-200">
                                    🛒
                                </div>
                                <h2 className="text-2xl font-extrabold text-zinc-900">Your cart is empty</h2>
                                <p className="text-sm text-zinc-500 mt-2">
                                    Looks like you haven't added anything yet.
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center justify-center mt-6 h-11 px-6 
                                    rounded-xl bg-slate-900 text-white font-semiboldhover:bg-slate-800 transition active:scale-[0.98]">
                                    Browse Products
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
