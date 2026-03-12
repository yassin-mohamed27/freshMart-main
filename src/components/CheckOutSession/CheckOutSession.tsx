"use client"

import { checkOutAction } from "@/actions/addtoCart.action"
import { cashOrderAction } from "@/actions/order.action"
import { ShippingAddress } from "@/app/Interfaces/CartInterfaces"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Banknote, CreditCard, Loader2, MapPin, Phone, Home, Bookmark } from "lucide-react"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { addAddressAction, getUserAddressesAction } from "@/actions/address.actions"

type Address = {
    _id: string
    name: string
    details: string
    phone: string
    city: string
}

export default function CheckOutSession({ cartId }: { cartId: string }) {
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [loadingType, setLoadingType] = useState<"card" | "cash" | null>(null)

    // Saved addresses
    const [addrLoading, setAddrLoading] = useState(false)
    const [addresses, setAddresses] = useState<Address[]>([])
    const [selectedId, setSelectedId] = useState<string>("")
    const [savingAddress, setSavingAddress] = useState(false)

    const city = useRef<HTMLInputElement | null>(null)
    const details = useRef<HTMLInputElement | null>(null)
    const phone = useRef<HTMLInputElement | null>(null)

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

    const isLoading = loadingType !== null

    const selectedAddress = useMemo(
        () => addresses.find((a) => a._id === selectedId) || null,
        [addresses, selectedId]
    )

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

    // Load addresses when dialog opens (✅ no auto-select + clear inputs)
    useEffect(() => {
        if (!open) return
        let mounted = true

            ; (async () => {
                setAddrLoading(true)
                try {
                    const res = await getUserAddressesAction()
                    const list: Address[] = (res?.data as Address[]) || []
                    if (!mounted) return
                    setAddresses(list)

                    // ✅ clear on open
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

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
                list.find((x) => x.city === a.city && x.details === a.details && x.phone === a.phone) || list[0]

            if (matched) applySelected(matched)
            toast.success("Address saved")
        } catch {
            toast.error("Something went wrong.")
        } finally {
            setSavingAddress(false)
        }
    }

    async function payWithCard() {
        const address = buildAddress()
        const err = validate(address)
        if (err) return toast.error(err)

        setLoadingType("card")
        try {
            const response = await checkOutAction(cartId, address)
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

    async function payCash() {
        const address = buildAddress()
        const err = validate(address)
        if (err) return toast.error(err)

        setLoadingType("cash")
        try {
            const response = await cashOrderAction(cartId, address)
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
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="mt-4 h-11 w-full rounded-2xl bg-slate-900 text-white hover:bg-slate-800">
                    Proceed to Checkout
                </Button>
            </DialogTrigger>

            <DialogContent
                className={[
                    "p-0 overflow-hidden border border-slate-800 bg-slate-950 text-slate-100",
                    "shadow-[0_40px_140px_rgba(0,0,0,0.8)]",
                    "w-[calc(100vw-16px)] rounded-3xl sm:rounded-3xl sm:max-w-5xl",
                    "sm:w-[min(980px,calc(100vw-48px))]",
                    "max-h-[calc(100dvh-16px)] sm:max-h-[calc(100dvh-48px)]",
                    "fixed left-1/2 -translate-x-1/2 bottom-2 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2",
                ].join(" ")}
            >
                {/* ===== Header ===== */}
                <div className=" top-0 z-20 bg-slate-950 border-b border-slate-800">
                    {/* Mobile drag handle */}
                    <div className="sm:hidden flex justify-center pt-3">
                        <div className="h-1 w-10 rounded-full bg-slate-800" />
                    </div>

                    <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 relative">
                        {/* Glow and background circles */}
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/7 to-transparent" />
                        <div className="pointer-events-none absolute -top-28 -right-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

                        <DialogHeader className="relative flex items-start gap-3">
                            <div className="grid size-11 place-items-center rounded-2xl bg-slate-900 ring-1 ring-slate-800">
                                <Home className="size-5 text-slate-200" />
                            </div>

                            <div className="min-w-0 flex-1">
                                <DialogTitle className="text-lg font-extrabold tracking-tight">Checkout</DialogTitle>
                                <DialogDescription className="text-slate-400">
                                    Address first, then choose a payment method.
                                </DialogDescription>
                            </div>

                            <DialogClose asChild>
                                <button
                                    className="relative inline-flex size-10 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/40
                text-slate-300 hover:bg-slate-900/70 hover:text-white transition"
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </DialogClose>
                        </DialogHeader>
                    </div>
                </div>

                {/* ===== Body (Scrollable) ===== */}
                <div className="px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto overscroll-contain
      max-h-[calc(100dvh-16px-140px-84px)] sm:max-h-[calc(100dvh-48px-140px-92px)]"
                >
                    <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
                        {/* ===== Left: Saved Addresses ===== */}
                        <div className="rounded-3xl border border-slate-800 bg-slate-900/25 p-4 sm:p-5">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <div className="text-sm font-extrabold text-slate-100">Saved</div>
                                    <div className="text-xs text-slate-400">Pick one to autofill</div>
                                </div>

                                <button
                                    type="button"
                                    onClick={startNewAddress}
                                    disabled={isLoading || savingAddress}
                                    className="rounded-2xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-[11px] font-bold
                text-slate-200 hover:bg-slate-950/70 transition disabled:opacity-60"
                                >
                                    + New
                                </button>
                            </div>

                            <div className="mt-4">
                                {addrLoading ? (
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Loader2 className="size-4 animate-spin" /> Loading...
                                    </div>
                                ) : addresses.length ? (
                                    <div className="space-y-2  overflow-y-auto pr-1">
                                        {addresses.map((a) => (
                                            <button
                                                key={a._id}
                                                type="button"
                                                onClick={() => applySelected(a)}
                                                className={[
                                                    "w-full text-left rounded-2xl border p-3 transition active:scale-[0.99]",
                                                    selectedId === a._id
                                                        ? "border-violet-500/60 bg-slate-950 ring-1 ring-violet-500/30"
                                                        : "border-slate-800 bg-slate-900/30 hover:bg-slate-900/50",
                                                ].join(" ")}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex size-4 items-center justify-center rounded-full border border-slate-700">
                                                        <span className={[
                                                            "size-2 rounded-full",
                                                            selectedId === a._id ? "bg-violet-400" : "bg-transparent",
                                                        ].join(" ")} />
                                                    </span>
                                                    <div className="text-sm font-extrabold text-slate-100 line-clamp-1">
                                                        {a.name || "Address"}
                                                    </div>
                                                    <span className="ml-auto text-[10px] font-bold text-slate-500">{a.city}</span>
                                                </div>
                                                <div className="mt-1 text-xs text-slate-400 line-clamp-1">{a.details}</div>
                                                <div className="mt-1 text-[11px] text-slate-500">{a.phone}</div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-400">
                                        No saved addresses. Click <b>+ New</b> and add one.
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={saveThisAddress}
                                disabled={savingAddress || isLoading}
                                className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-800
              bg-slate-950/40 px-3 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-950/70 transition disabled:opacity-60"
                            >
                                {savingAddress ? <Loader2 className="size-4 animate-spin" /> : <Bookmark className="size-4" />}
                                Save current
                            </button>
                        </div>

                        {/* ===== Right: Shipping + Payment ===== */}
                        <div className="space-y-4 sm:space-y-6">
                            {/* Shipping Form */}
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-4 sm:p-5">
                                {/* ...Shipping inputs (City, Details, Phone) ... */}
                            </div>

                            {/* Payment Options */}
                            <div className="rounded-3xl border border-slate-800 bg-slate-900/20 p-4 sm:p-5">
                                {/* ...Cash/Card buttons ... */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== Footer ===== */}
                <div className="sticky bottom-0 z-20 border-t border-slate-800 bg-slate-950/80 backdrop-blur px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={isLoading || savingAddress}
                                className="h-11 flex-1 rounded-2xl border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-900 hover:text-white"
                            >
                                Cancel
                            </Button>
                        </DialogClose>

                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                            <span className="inline-flex size-2 rounded-full bg-violet-400/80" />
                            Choose Cash or Card above
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
