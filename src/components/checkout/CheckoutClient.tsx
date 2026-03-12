"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import Image from "next/image"

import { checkOutAction } from "@/actions/addtoCart.action"
import { cashOrderAction } from "@/actions/order.action"
import { addAddressAction, getUserAddressesAction } from "@/actions/address.actions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Field, FieldGroup } from "@/components/ui/field"

import {
    Banknote,
    CreditCard,
    Loader2,
    MapPin,
    Phone,
    Home,
    Bookmark,
    ShieldCheck,
    ShoppingBag,
} from "lucide-react"

type Address = {
    _id: string
    name: string
    details: string
    phone: string
    city: string
}

type CartProduct = {
    count: number
    price: number
    product: {
        _id: string
        title: string
        imageCover: string
    }
}

type CartRes = {
    status: string
    numOfCartItems?: number
    data?: {
        _id: string
        totalPrice: number
        products: CartProduct[]
    }
}

type ShippingAddress = {
    city: string
    details: string
    phone: string
}

export default function CheckoutClient() {
    const router = useRouter()

    // ===== Cart =====
    const [cartLoading, setCartLoading] = useState(true)
    const [cart, setCart] = useState<CartRes["data"] | null>(null)

    // ===== Addresses =====
    const [addrLoading, setAddrLoading] = useState(false)
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedId, setSelectedId] = useState<string>("")
    const [savingAddress, setSavingAddress] = useState(false)

    // ===== Payment =====
    const [payMode, setPayMode] = useState<"cash" | "card">("cash")
    const [loadingType, setLoadingType] = useState<"card" | "cash" | null>(null)
    const isLoading = loadingType !== null

    // ===== Refs (uncontrolled inputs) =====
    const city = useRef<HTMLInputElement | null>(null)
    const details = useRef<HTMLInputElement | null>(null)
    const phone = useRef<HTMLInputElement | null>(null)

    const selectedAddress = useMemo(
        () => addresses.find((a) => a._id === selectedId) || null,
        [addresses, selectedId]
    )

    const buildAddress = (): ShippingAddress => ({
        city: (city.current?.value || "").trim(),
        details: (details.current?.value || "").trim(),
        phone: (phone.current?.value || "").trim(),
    })

    const validate = (a: ShippingAddress) => {
        if (!a.city || !a.details || !a.phone) return "Please fill all address fields."
        if (a.phone.length < 10) return "Phone number looks too short."
        return null
    }

    function applySelected(a: Address) {
        setSelectedId(a._id)
        if (city.current) city.current.value = a.city || ""
        if (details.current) details.current.value = a.details || ""
        if (phone.current) phone.current.value = a.phone || ""
    }

    function startNewAddress() {
        setSelectedId("")
        if (city.current) city.current.value = ""
        if (details.current) details.current.value = ""
        if (phone.current) phone.current.value = ""
    }

    // ===== Load Cart =====
    useEffect(() => {
        let mounted = true

            ; (async () => {
                setCartLoading(true)
                try {
                    const token =
                        localStorage.getItem("token") ||
                        localStorage.getItem("userToken") ||
                        localStorage.getItem("tokenRes") ||
                        ""

                    if (!token) {
                        toast.error("Please login first.")
                        router.push("/login")
                        return
                    }

                    const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
                        headers: {
                            "Content-Type": "application/json",
                            // ✅ most common for this API:
                            token,
                            // fallback if you store it as bearer (won’t hurt if backend ignores)
                            Authorization: `Bearer ${token}`,
                        },
                        cache: "no-store",
                    })

                    const data: CartRes = await res.json()
                    if (!mounted) return

                    if (!res.ok) {
                        toast.error(data?.status ? String(data.status) : "Failed to load cart.")
                        setCart(null)
                        return
                    }

                    setCart(data.data || null)
                } catch {
                    toast.error("Failed to load cart.")
                    if (mounted) setCart(null)
                } finally {
                    if (mounted) setCartLoading(false)
                }
            })()

        return () => {
            mounted = false
        }
    }, [router])

    // ===== Load Addresses (once) + clear inputs initially =====
    useEffect(() => {
        let mounted = true

            ; (async () => {
                setAddrLoading(true)
                try {
                    const res = await getUserAddressesAction()
                    const list: Address[] = (res?.data as Address[]) || []
                    if (!mounted) return
                    setAddresses(list)

                    // ✅ inputs empty by default
                    setSelectedId("")
                    setTimeout(() => {
                        if (city.current) city.current.value = ""
                        if (details.current) details.current.value = ""
                        if (phone.current) phone.current.value = ""
                    }, 0)
                } catch {
                    // ignore
                } finally {
                    if (mounted) setAddrLoading(false)
                }
            })()

        return () => {
            mounted = false
        }
    }, [])

    async function saveThisAddress() {
        const a = buildAddress()
        const err = validate(a)
        if (err) return toast.error(err)

        setSavingAddress(true)
        try {
            const res = await addAddressAction({
                name: "Saved",
                city: a.city,
                details: a.details,
                phone: a.phone,
            })

            if (!res.ok) {
                toast.error(res.message)
                return
            }

            const ref = await getUserAddressesAction()
            const list: Address[] = (ref?.data as Address[]) || []
            setAddresses(list)

            const matched =
                list.find((x) => x.city === a.city && x.details === a.details && x.phone === a.phone) ||
                list[0]

            if (matched) applySelected(matched)
            toast.success("Address saved")
        } catch {
            toast.error("Something went wrong.")
        } finally {
            setSavingAddress(false)
        }
    }

    async function placeOrder() {
        if (!cart?._id) return toast.error("Cart not loaded.")
        const address = buildAddress()
        const err = validate(address)
        if (err) return toast.error(err)

        if (payMode === "cash") {
            setLoadingType("cash")
            try {
                const response = await cashOrderAction(cart._id, address)
                if (response?.status === "success") {
                    toast.success("Order created successfully ✅")
                    window.dispatchEvent(new CustomEvent("cartUpdate", { detail: 0 }))
                    router.push("/allorders")
                    return
                }
                toast.error(response?.message || "Failed to place cash order.")
            } catch {
                toast.error("Something went wrong.")
            } finally {
                setLoadingType(null)
            }
        } else {
            setLoadingType("card")
            try {
                const response = await checkOutAction(cart._id, address)
                if (response?.status === "success" && response?.session?.url) {
                    location.href = response.session.url
                    return
                }
                toast.error(response?.message || "Failed to start card checkout.")
            } catch {
                toast.error("Something went wrong.")
            } finally {
                setLoadingType(null)
            }
        }
    }

    const total = cart?.totalPrice ?? 0
    const itemsCount = cart?.products?.reduce((acc, p) => acc + (p.count || 0), 0) ?? 0

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ===== Top Bar ===== */}
            <div className="border-b bg-white">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Checkout</h1>
                        <p className="text-sm text-slate-500">Complete your details to place your order securely.</p>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-sm text-emerald-700">
                        <ShieldCheck className="size-4" />
                        Secure payment & encrypted checkout
                    </div>
                </div>
            </div>

            {/* ===== Content ===== */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
                <div className="grid gap-6 lg:grid-cols-12">
                    {/* ===== Left ===== */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Saved addresses */}
                        <div className="rounded-2xl border bg-white p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="font-extrabold text-slate-900">Saved addresses</div>
                                    <div className="text-sm text-slate-500">Pick one to autofill, or add a new address.</div>
                                </div>

                                <button
                                    type="button"
                                    onClick={startNewAddress}
                                    disabled={isLoading || savingAddress}
                                    className="rounded-xl border px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    + New
                                </button>
                            </div>

                            <div className="mt-4">
                                {addrLoading ? (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Loader2 className="size-4 animate-spin" />
                                        Loading addresses...
                                    </div>
                                ) : addresses.length ? (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {addresses.map((a) => (
                                            <button
                                                key={a._id}
                                                type="button"
                                                onClick={() => applySelected(a)}
                                                className={[
                                                    "rounded-2xl border p-4 text-left transition",
                                                    selectedId === a._id
                                                        ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                                                ].join(" ")}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={[
                                                            "size-4 rounded-full border grid place-items-center",
                                                            selectedId === a._id ? "border-emerald-500" : "border-slate-300",
                                                        ].join(" ")}
                                                    >
                                                        <span
                                                            className={[
                                                                "size-2 rounded-full",
                                                                selectedId === a._id ? "bg-emerald-500" : "bg-transparent",
                                                            ].join(" ")}
                                                        />
                                                    </span>

                                                    <div className="font-bold text-slate-900 line-clamp-1">{a.name || "Address"}</div>
                                                    <span className="ml-auto text-[11px] font-bold text-slate-500">{a.city}</span>
                                                </div>

                                                <div className="mt-1 text-sm text-slate-600 line-clamp-1">{a.details}</div>
                                                <div className="mt-1 text-xs text-slate-500">{a.phone}</div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-500">
                                        No saved addresses yet. Use <b>+ New</b> and fill the form.
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={saveThisAddress}
                                    disabled={savingAddress || isLoading}
                                    className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    {savingAddress ? <Loader2 className="size-4 animate-spin" /> : <Bookmark className="size-4" />}
                                    Save current
                                </button>
                            </div>
                        </div>

                        {/* Shipping form */}
                        <div className="rounded-2xl border bg-white p-5">
                            <div className="flex items-center gap-2">
                                <Home className="size-5 text-emerald-600" />
                                <div>
                                    <div className="font-extrabold text-slate-900">Shipping address</div>
                                    <div className="text-sm text-slate-500">
                                        {selectedId ? "Using a saved address (you can still edit)." : "Enter a new address."}
                                    </div>
                                </div>
                            </div>

                            <FieldGroup className="mt-5 gap-4 sm:gap-5">
                                <Field>
                                    <Label htmlFor="city" className="text-slate-700">City</Label>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                        <Input
                                            ref={city}
                                            id="city"
                                            name="city"
                                            defaultValue={selectedAddress?.city || ""}
                                            placeholder="Cairo"
                                            className="h-12 rounded-xl pl-10"
                                        />
                                    </div>
                                </Field>

                                <Field>
                                    <Label htmlFor="details" className="text-slate-700">Street / Details</Label>
                                    <div className="relative">
                                        <Home className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                        <Input
                                            ref={details}
                                            id="details"
                                            name="details"
                                            defaultValue={selectedAddress?.details || ""}
                                            placeholder="Maadi, street, building..."
                                            className="h-12 rounded-xl pl-10"
                                        />
                                    </div>
                                </Field>

                                <Field>
                                    <Label htmlFor="phone" className="text-slate-700">Phone</Label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                                        <Input
                                            ref={phone}
                                            id="phone"
                                            name="phone"
                                            defaultValue={selectedAddress?.phone || ""}
                                            placeholder="01xxxxxxxxx"
                                            className="h-12 rounded-xl pl-10"
                                        />
                                    </div>
                                </Field>
                            </FieldGroup>
                        </div>

                        {/* Payment method */}
                        <div className="rounded-2xl border bg-white p-5">
                            <div className="flex items-center gap-2">
                                <CreditCard className="size-5 text-emerald-600" />
                                <div>
                                    <div className="font-extrabold text-slate-900">Payment method</div>
                                    <div className="text-sm text-slate-500">Choose how you’d like to pay for your order.</div>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {/* Cash */}
                                <button
                                    type="button"
                                    onClick={() => setPayMode("cash")}
                                    disabled={isLoading}
                                    className={[
                                        "rounded-2xl border p-4 text-left transition",
                                        payMode === "cash"
                                            ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={[
                                                "mt-1 size-4 rounded-full border grid place-items-center",
                                                payMode === "cash" ? "border-emerald-500" : "border-slate-300",
                                            ].join(" ")}
                                        >
                                            <span className={["size-2 rounded-full", payMode === "cash" ? "bg-emerald-500" : "bg-transparent"].join(" ")} />
                                        </span>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-extrabold text-slate-900">Cash on delivery</div>
                                                <Banknote className="size-5 text-emerald-600" />
                                            </div>
                                            <div className="mt-1 text-sm text-slate-600">Pay in cash when your order arrives.</div>
                                            <div className="mt-2 text-xs text-slate-500">Available for most locations</div>
                                        </div>
                                    </div>
                                </button>

                                {/* Card */}
                                <button
                                    type="button"
                                    onClick={() => setPayMode("card")}
                                    disabled={isLoading}
                                    className={[
                                        "rounded-2xl border p-4 text-left transition",
                                        payMode === "card"
                                            ? "border-emerald-500 ring-2 ring-emerald-500/20"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                                    ].join(" ")}
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={[
                                                "mt-1 size-4 rounded-full border grid place-items-center",
                                                payMode === "card" ? "border-emerald-500" : "border-slate-300",
                                            ].join(" ")}
                                        >
                                            <span className={["size-2 rounded-full", payMode === "card" ? "bg-emerald-500" : "bg-transparent"].join(" ")} />
                                        </span>

                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-extrabold text-slate-900">Credit / Debit card</div>
                                                <CreditCard className="size-5 text-emerald-600" />
                                            </div>
                                            <div className="mt-1 text-sm text-slate-600">Pay securely with Visa / Mastercard.</div>
                                            <div className="mt-2 text-xs text-slate-500">Processed via encrypted checkout</div>
                                        </div>
                                    </div>
                                </button>
                            </div>

                            {/* Place order */}
                            <div className="mt-6">
                                <Button
                                    onClick={placeOrder}
                                    disabled={isLoading || cartLoading || !cart?._id}
                                    className="h-12 w-full rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700"
                                >
                                    {isLoading ? (
                                        <span className="inline-flex items-center gap-2">
                                            <Loader2 className="size-4 animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        "Place order"
                                    )}
                                </Button>

                                <p className="mt-3 text-center text-[11px] text-slate-500">
                                    By placing your order, you agree to our Terms & Conditions and Privacy Policy.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ===== Right ===== */}
                    <div className="lg:col-span-4">
                        <div className="rounded-2xl border bg-white p-5 sticky top-6">
                            <div className="flex items-center justify-between">
                                <div className="font-extrabold text-slate-900">Order summary</div>
                                <div className="text-xs text-slate-500">{itemsCount} item{itemsCount === 1 ? "" : "s"}</div>
                            </div>

                            <div className="mt-4">
                                {cartLoading ? (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Loader2 className="size-4 animate-spin" />
                                        Loading cart...
                                    </div>
                                ) : !cart ? (
                                    <div className="text-sm text-slate-500">
                                        Cart is empty or failed to load.
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {cart.products.map((p) => (
                                            <div key={p.product._id} className="flex items-center gap-3">
                                                <div className="size-12 rounded-xl border bg-slate-50 overflow-hidden grid place-items-center">
                                                    {p.product.imageCover ? (
                                                        <Image
                                                            src={p.product.imageCover}
                                                            alt={p.product.title}
                                                            width={48}
                                                            height={48}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <ShoppingBag className="size-5 text-slate-400" />
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-bold text-slate-900 line-clamp-1">
                                                        {p.product.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500">Qty: {p.count}</div>
                                                </div>

                                                <div className="text-sm font-extrabold text-slate-900">
                                                    EGP {Number(p.price * p.count).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="my-4 h-px bg-slate-200" />

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-900">EGP {Number(total).toFixed(2)}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span className="text-slate-500">Calculated at delivery</span>
                                </div>

                                <div className="pt-2 flex items-center justify-between">
                                    <span className="text-xs font-bold tracking-widest text-slate-500">TOTAL</span>
                                    <span className="text-lg font-extrabold text-slate-900">EGP {Number(total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 sm:hidden flex items-center gap-2 text-sm text-emerald-700">
                            <ShieldCheck className="size-4" />
                            Secure payment & encrypted checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
