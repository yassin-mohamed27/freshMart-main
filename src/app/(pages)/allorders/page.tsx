"use client"
import React, { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
    Loader2, Package, ShoppingBag, RefreshCcw, Copy,
    CreditCard, MapPin, Truck, BadgeCheck, BadgeAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/Helpers/foramtCurrency"
type Order = {
    _id: string
    totalOrderPrice: number
    paymentMethodType?: string
    isPaid?: boolean
    isDelivered?: boolean
    paidAt?: string
    createdAt?: string
    shippingPrice?: number
    taxPrice?: number
    shippingAddress?: {
        details?: string
        city?: string
        phone?: string
    }
    cartItems?: Array<{
        _id: string
        count: number
        price: number
        product?: { title?: string; imageCover?: string }
    }>
}

export default function Page() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [uid, setUid] = useState<string | null>(null)
    const [q, setQ] = useState("")

    async function getOrders(userId: string) {
        try {
            setLoading(true)
            setError(null)
            const res = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`, {
                cache: "no-store",
            })
            const data = await res.json()
            const list: Order[] = Array.isArray(data)
                ? data
                : Array.isArray(data?.data)
                    ? data.data
                    : []
            const sorted = [...list].sort((a, b) => {
                const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
                const db = b.createdAt ? new Date(b.createdAt).getTime() : 0
                return db - da
            })
            setOrders(sorted)
        } catch {
            setError("Something went wrong while loading orders.")
            setOrders([])
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        const userId = localStorage.getItem("userId")
        setUid(userId)
        if (!userId) {
            setError("User ID missing — login again.")
            setLoading(false)
            return
        }
        getOrders(userId)
    }, [])
    const refresh = () => {
        const userId = uid || localStorage.getItem("userId")
        if (!userId) {
            setError("User ID missing — login again.")
            return
        }
        getOrders(userId)
    }
    const filteredOrders = useMemo(() => {
        const needle = q.trim().toLowerCase()
        if (!needle) return orders
        return orders.filter((o) => o._id?.toLowerCase().includes(needle))
    }, [orders, q])
    const prettyDate = (d?: string) => {
        if (!d) return "—"
        try {
            return new Date(d).toLocaleString()
        } catch {
            return "—"
        }
    }
    return (
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="relative p-5 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                                My Orders
                            </h1>
                            <p className="text-sm text-zinc-500 mt-1">
                                Track your purchases, payment, delivery and shipping details.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="relative">
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search by Order ID..."
                                    className="h-11 w-full sm:w-[320px] rounded-2xl border border-zinc-200 bg-white px-4 pr-10 text-sm
                                    outline-none transition focus:ring-2 focus:ring-violet-400/40"/>
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">
                                    {filteredOrders.length}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                onClick={refresh}
                                className="h-11 rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50"
                                disabled={loading}>
                                {loading ? (
                                    <span className="inline-flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        Loading...
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-2">
                                        <RefreshCcw className="size-4" />
                                        Refresh
                                    </span>
                                )}
                            </Button>
                            <Link href="/products">
                                <Button className="h-11 rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {loading ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="grid size-14 place-items-center rounded-2xl bg-zinc-50 border border-zinc-200">
                                <Loader2 className="animate-spin" />
                            </div>
                            <p className="mt-4 text-sm text-zinc-500">Fetching your orders...</p>
                        </div>
                    ) : error ? (
                        <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-6">
                            <div className="flex items-start gap-3">
                                <div className="grid size-10 place-items-center rounded-2xl bg-white border border-red-200">
                                    ⚠️
                                </div>
                                <div className="flex-1">
                                    <div className="font-extrabold text-red-700">Couldn’t load orders</div>
                                    <div className="text-sm text-red-700/80 mt-1">{error}</div>
                                    <div className="mt-4 flex gap-2">
                                        <Button onClick={refresh} className="rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
                                            Try again
                                        </Button>
                                        <Link href="/login">
                                            <Button variant="outline" className="rounded-2xl border-red-200 text-red-700 hover:bg-red-100">
                                                Login
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="py-16 text-center">
                            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-zinc-50 border border-zinc-200">
                                <ShoppingBag className="size-6 text-zinc-700" />
                            </div>
                            <h2 className="text-2xl font-extrabold text-zinc-900">No orders yet</h2>
                            <p className="text-sm text-zinc-500 mt-2">Once you place an order, it will appear here.</p>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center mt-6 h-11 px-6 rounded-2xl bg-slate-900 
                                text-white font-semibold hover:bg-slate-800 transition active:scale-[0.98]">
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="mt-7 grid grid-cols-1 gap-5 sm:gap-6">
                            {filteredOrders.map((o, idx) => {
                                const itemsCount = o.cartItems?.reduce((sum, it) => sum + (it.count ?? 0), 0) ?? 0
                                const paid = Boolean(o.isPaid)
                                const delivered = Boolean(o.isDelivered)
                                const orderNumber = filteredOrders.length - idx
                                const shortId = o._id?.slice(-8) || "—"
                                const paymentLabel = paid ? "Paid" : "Unpaid"
                                const deliveryLabel = delivered ? "Delivered" : "In progress"
                                const shipCity = o.shippingAddress?.city || "—"
                                const shipDetails = o.shippingAddress?.details || ""
                                const shipPhone = o.shippingAddress?.phone || ""
                                return (
                                    <div
                                        key={o._id}
                                        className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                                        <div className="p-5 sm:p-6 bg-linear-to-b from-zinc-50 to-white border-b border-zinc-200">
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                <div className="min-w-0">
                                                    <div className="flex items-start gap-3">
                                                        <div className="shrink-0">
                                                            <div className="grid size-12 place-items-center rounded-2xl bg-slate-900 text-white font-extrabold">
                                                                {orderNumber}
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="inline-flex items-center gap-2 text-xs text-zinc-600">
                                                                <span className="grid size-6 place-items-center rounded-xl bg-white border border-zinc-200">
                                                                    <Package className="size-4" />
                                                                </span>
                                                                <span className="font-semibold">Order ID</span>
                                                                <span className="text-zinc-400">•</span>
                                                                <span className="font-mono text-zinc-600">{shortId}</span>
                                                            </div>
                                                            <div className="mt-3 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                                                                <div className="text-2xl sm:text-3xl font-extrabold text-zinc-900">
                                                                    {formatCurrency(o.totalOrderPrice)} EGP
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold 
                                                                    text-zinc-700 inline-flex items-center gap-2">
                                                                        <CreditCard className="size-4 text-zinc-500" />
                                                                        {o.paymentMethodType || "—"}
                                                                    </span>
                                                                    <span
                                                                        className={[
                                                                            "rounded-full px-3 py-1 text-xs font-extrabold border inline-flex items-center gap-2",
                                                                            paid
                                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                                : "bg-amber-50 text-amber-800 border-amber-200",
                                                                        ].join(" ")}>
                                                                        {paid ? <BadgeCheck className="size-4" /> : <BadgeAlert className="size-4" />}
                                                                        {paymentLabel}
                                                                    </span>
                                                                    <span
                                                                        className={[
                                                                            "rounded-full px-3 py-1 text-xs font-extrabold border inline-flex items-center gap-2",
                                                                            delivered
                                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                                : "bg-blue-50 text-blue-700 border-blue-200",
                                                                        ].join(" ")}>
                                                                        <Truck className="size-4" />
                                                                        {deliveryLabel}
                                                                    </span>
                                                                    <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-bold text-zinc-700">
                                                                        Items: <span className="text-zinc-900 font-extrabold">{itemsCount}</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3 text-xs text-zinc-500">
                                                                Created: <span className="font-semibold text-zinc-700">{prettyDate(o.createdAt)}</span>
                                                                {o.paidAt ? (
                                                                    <>
                                                                        <span className="text-zinc-400"> • </span>
                                                                        Paid at: <span className="font-semibold text-zinc-700">{prettyDate(o.paidAt)}</span>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="lg:w-90">
                                                    <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <div className="text-xs font-extrabold text-zinc-700 inline-flex items-center gap-2">
                                                                    <span className="grid size-8 place-items-center rounded-2xl bg-zinc-50 border border-zinc-200">
                                                                        <MapPin className="size-4 text-zinc-700" />
                                                                    </span>
                                                                    Shipping Address
                                                                </div>
                                                                <div className="mt-3 text-sm font-extrabold text-zinc-900">
                                                                    {shipCity}
                                                                </div>
                                                                {shipDetails ? (
                                                                    <div className="mt-1 text-sm text-zinc-600">
                                                                        {shipDetails}
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-1 text-sm text-zinc-500">No details provided</div>
                                                                )}
                                                                {shipPhone ? (
                                                                    <div className="mt-2 text-xs text-zinc-500">
                                                                        Phone: <span className="font-semibold text-zinc-700">{shipPhone}</span>
                                                                    </div>
                                                                ) : null}
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                className="rounded-2xl border-zinc-200 bg-white hover:bg-zinc-50"
                                                                onClick={() => navigator.clipboard?.writeText?.(o._id)}>
                                                                <span className="inline-flex items-center gap-2">
                                                                    <Copy className="size-4" />
                                                                    Copy ID
                                                                </span>
                                                            </Button>
                                                        </div>
                                                        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                                                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                                                                <div className="text-zinc-500 font-semibold">Tax</div>
                                                                <div className="mt-1 font-extrabold text-zinc-900">
                                                                    {formatCurrency(o.taxPrice ?? 0)}
                                                                </div>
                                                            </div>
                                                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                                                                <div className="text-zinc-500 font-semibold">Shipping</div>
                                                                <div className="mt-1 font-extrabold text-zinc-900">
                                                                    {formatCurrency(o.shippingPrice ?? 0)}
                                                                </div>
                                                            </div>
                                                            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                                                                <div className="text-zinc-500 font-semibold">Total</div>
                                                                <div className="mt-1 font-extrabold text-zinc-900">
                                                                    {formatCurrency(o.totalOrderPrice)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 sm:p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-extrabold text-zinc-900">Order Items</div>
                                                <div className="text-xs text-zinc-500">
                                                    {o.cartItems?.length ? `${o.cartItems.length} products` : "—"}
                                                </div>
                                            </div>
                                            <div className="mt-4 overflow-hidden rounded-3xl border border-zinc-200 bg-white">
                                                <div className="hidden sm:grid grid-cols-[1.4fr_.5fr_.6fr_.7fr] gap-3 px-4 py-3 bg-zinc-50 border-b 
                                                border-zinc-200 text-[11px] font-extrabold text-zinc-600">
                                                    <div>Product</div>
                                                    <div className="text-center">Qty</div>
                                                    <div className="text-right">Unit</div>
                                                    <div className="text-right">Total</div>
                                                </div>
                                                <div className="divide-y divide-zinc-200">
                                                    {o.cartItems?.length ? (
                                                        o.cartItems.map((it) => {
                                                            const lineTotal = (it.price ?? 0) * (it.count ?? 0)
                                                            return (
                                                                <div
                                                                    key={it._id}
                                                                    className="grid grid-cols-1 sm:grid-cols-[1.4fr_.5fr_.6fr_.7fr] gap-3 
                                                                    px-4 py-4 hover:bg-zinc-50/60 transition">
                                                                    <div className="flex items-center gap-3 min-w-0">
                                                                        <div className="size-14 shrink-0 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50">
                                                                            {it.product?.imageCover ? (
                                                                                <img
                                                                                    src={it.product.imageCover}
                                                                                    alt={it.product?.title || "Product"}
                                                                                    className="h-full w-full object-cover" />
                                                                            ) : null}
                                                                        </div>
                                                                        <div className="min-w-0">
                                                                            <div className="text-sm font-extrabold text-zinc-900 line-clamp-2">
                                                                                {it.product?.title || "Product"}
                                                                            </div>
                                                                            <div className="sm:hidden mt-1 text-xs text-zinc-600">
                                                                                Qty: <span className="font-extrabold text-zinc-900">{it.count}</span>
                                                                                <span className="text-zinc-400"> • </span>
                                                                                Unit: <span className="font-semibold">{formatCurrency(it.price)} EGP</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="hidden sm:flex items-center justify-center">
                                                                        <span className="inline-flex min-w-10 justify-center rounded-xl border border-zinc-200 bg-white px-3 py-1 text-sm font-extrabold text-zinc-900">
                                                                            {it.count}
                                                                        </span>
                                                                    </div>
                                                                    <div className="hidden sm:flex items-center justify-end text-sm font-semibold text-zinc-700">
                                                                        {formatCurrency(it.price)} EGP
                                                                    </div>
                                                                    <div className="flex items-center justify-end">
                                                                        <div className="text-right">
                                                                            <div className="text-[11px] font-bold text-zinc-500 sm:hidden">Line Total</div>
                                                                            <div className="text-sm font-extrabold text-zinc-900">
                                                                                {formatCurrency(lineTotal)} EGP
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    ) : (
                                                        <div className="p-4 text-sm text-zinc-600 bg-zinc-50">
                                                            No products found for this order.
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="px-4 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
                                                    <span className="text-xs text-zinc-600 font-semibold">
                                                        Total items: <span className="text-zinc-900 font-extrabold">{itemsCount}</span>
                                                    </span>
                                                    <span className="text-base font-extrabold text-zinc-900">
                                                        {formatCurrency(o.totalOrderPrice)} EGP
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
