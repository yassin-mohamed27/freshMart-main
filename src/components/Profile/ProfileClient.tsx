"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Phone, Shield, LockKeyhole, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { changePasswordAction } from "@/actions/profile.actions";
import { addAddressAction, removeAddressAction } from "@/actions/address.actions";

type UserShape = {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
};

type Address = {
    _id: string;
    name: string;
    details: string;
    phone: string;
    city: string;
};

export default function ProfileClient({
    user,
    addressesRes,
}: {
    user: UserShape | null;
    addressesRes: any | null;
}) {
    const initial = useMemo(() => {
        const fullName = user?.name?.trim?.() || user?.email?.split?.("@")?.[0] || "User";
        return (fullName?.[0] || "U").toUpperCase();
    }, [user]);

    //  العناوين
    const [addresses, setAddresses] = useState<Address[]>(
        (addressesRes?.data as Address[]) || []
    );

    const [addr, setAddr] = useState({
        name: "Home",
        details: "",
        phone: "",
        city: "",
    });

    const [savingAddr, setSavingAddr] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    //  تغيير الباسورد
    const [pwd, setPwd] = useState({
        currentPassword: "",
        password: "",
        rePassword: "",
    });

    const [savingPwd, setSavingPwd] = useState(false);

    async function onAddAddress() {
        if (!addr.name.trim()) return toast.error("Address name is required");
        if (!addr.details.trim()) return toast.error("Address details is required");
        if (!addr.city.trim()) return toast.error("City is required");
        if (!addr.phone.trim()) return toast.error("Phone is required");

        setSavingAddr(true);
        try {
            const res = await addAddressAction(addr);
            if (!res.ok) {
                toast.error(res.message);
                return;
            }

            const newItem = res?.data?.data; 
            const list = res?.data?.data; 

            if (Array.isArray(list)) {
                setAddresses(list);
            } else if (newItem?._id) {
                setAddresses((p) => [newItem, ...p]);
            } else {
                // fallback: لو API رجع حاجة مختلفة
                toast.success("Saved, refresh if not visible");
            }

            setAddr({ name: "Home", details: "", phone: "", city: "" });
            toast.success(res.message);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSavingAddr(false);
        }
    }

    async function onRemoveAddress(id: string) {
        setDeletingId(id);
        try {
            const res = await removeAddressAction(id);
            if (!res.ok) {
                toast.error(res.message);
                return;
            }

            setAddresses((p) => p.filter((a) => a._id !== id));
            toast.success(res.message);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeletingId(null);
        }
    }

    async function onChangePassword() {
        if (!pwd.currentPassword || !pwd.password || !pwd.rePassword)
            return toast.error("Fill all password fields");
        if (pwd.password !== pwd.rePassword) return toast.error("Passwords do not match");
        if (pwd.password.length < 6) return toast.error("Password too short");

        setSavingPwd(true);
        try {
            const res = await changePasswordAction(pwd);
            if (!res.ok) {
                toast.error(res.message);
                return;
            }
            toast.success(res.message);
            setPwd({ currentPassword: "", password: "", rePassword: "" });
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSavingPwd(false);
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative p-5 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
                                Profile
                            </h1>
                            <p className="text-sm text-zinc-500 mt-1">
                                Manage your addresses and security.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="grid size-12 place-items-center rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-900 font-extrabold">
                                {initial}
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-extrabold text-zinc-900 line-clamp-1">
                                    {user?.name || "User"}
                                </div>
                                <div className="text-xs text-zinc-500 line-clamp-1">
                                    {user?.email || ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-7 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-start">
                        {/* Left: Overview */}
                        <div className="lg:col-span-1">
                            <div className="rounded-3xl border border-zinc-200 bg-linear-to-b from-zinc-50 to-white p-5 sm:p-6">
                                <div className="flex items-center gap-2 text-zinc-900 font-extrabold">
                                    <Shield className="size-5" />
                                    Account overview
                                </div>

                                <div className="mt-5 space-y-3 text-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-zinc-500 inline-flex items-center gap-2">
                                            <User className="size-4" /> Name
                                        </span>
                                        <span className="font-semibold text-zinc-900 truncate">{user?.name || "-"}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-zinc-500 inline-flex items-center gap-2">
                                            <Mail className="size-4" /> Email
                                        </span>
                                        <span className="font-semibold text-zinc-900 truncate">{user?.email || "-"}</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-zinc-500 inline-flex items-center gap-2">
                                            <Phone className="size-4" /> Phone
                                        </span>
                                        <span className="font-semibold text-zinc-900 truncate">{user?.phone || "-"}</span>
                                    </div>

                                    <div className="my-4 h-px bg-zinc-200/80" />
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-zinc-500">Role</span>
                                        <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                                            {(user as any)?.role || "user"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Addresses + Security */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Addresses */}
                            <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <MapPin className="size-5" />
                                    <div>
                                        <div className="text-lg font-extrabold">Shipping addresses</div>
                                        <div className="text-sm text-zinc-500 mt-1">Add and manage your delivery addresses.</div>
                                    </div>
                                </div>

                                {/* Add address form */}
                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-xs font-semibold text-zinc-700">Address name</label>
                                        <input
                                            value={addr.name}
                                            onChange={(e) => setAddr((p) => ({ ...p, name: e.target.value }))}
                                            className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900
                      shadow-sm outline-none focus:ring-2 focus:ring-violet-300/60"
                                            placeholder="Home / Work"
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-xs font-semibold text-zinc-700">Details</label>
                                        <input
                                            value={addr.details}
                                            onChange={(e) => setAddr((p) => ({ ...p, details: e.target.value }))}
                                            className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900
                      shadow-sm outline-none focus:ring-2 focus:ring-violet-300/60"
                                            placeholder="Street, building, apartment..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-700">City</label>
                                        <input
                                            value={addr.city}
                                            onChange={(e) => setAddr((p) => ({ ...p, city: e.target.value }))}
                                            className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900
                      shadow-sm outline-none focus:ring-2 focus:ring-violet-300/60"
                                            placeholder="Giza"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-700">Phone</label>
                                        <input
                                            value={addr.phone}
                                            onChange={(e) => setAddr((p) => ({ ...p, phone: e.target.value }))}
                                            className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900
                      shadow-sm outline-none focus:ring-2 focus:ring-violet-300/60"
                                            placeholder="010..."
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    <Button
                                        onClick={onAddAddress}
                                        disabled={savingAddr}
                                        className="h-11 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                                    >
                                        {savingAddr ? (
                                            <span className="inline-flex items-center gap-2">
                                                <Loader2 className="size-4 animate-spin" />
                                                Saving...
                                            </span>
                                        ) : (
                                            "Save address"
                                        )}
                                    </Button>
                                </div>

                                {/* Address list */}
                                <div className="mt-6 grid grid-cols-1 gap-3">
                                    {addresses?.length ? (
                                        addresses.map((a) => (
                                            <div
                                                key={a._id}
                                                className="rounded-3xl border border-zinc-200 bg-linear-to-b from-zinc-50 to-white p-4 sm:p-5"
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700">
                                                                {a.name}
                                                            </span>
                                                            <span className="text-sm font-extrabold text-zinc-900 line-clamp-1">
                                                                {a.city}
                                                            </span>
                                                        </div>
                                                        <div className="mt-2 text-sm text-zinc-700">{a.details}</div>
                                                        <div className="mt-2 text-xs text-zinc-500">{a.phone}</div>
                                                    </div>

                                                    <button
                                                        onClick={() => onRemoveAddress(a._id)}
                                                        disabled={deletingId === a._id}
                                                        className="shrink-0 inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 
                            text-sm font-semibold text-red-600 transition hover:bg-red-100 active:scale-[0.98] disabled:opacity-70"
                                                    >
                                                        {deletingId === a._id ? <Loader2 className="size-4 animate-spin" /> : "Remove"}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
                                            No saved addresses yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Security */}
                            <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm">
                                <div className="flex items-center gap-2 text-zinc-900">
                                    <LockKeyhole className="size-5" />
                                    <div>
                                        <div className="text-lg font-extrabold">Security</div>
                                        <div className="text-sm text-zinc-500 mt-1">Change your password.</div>
                                    </div>
                                </div>

                                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-xs font-semibold text-zinc-700">Current password</label>
                                        <input
                                            type="password"
                                            value={pwd.currentPassword}
                                            onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
                                            className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900
                      shadow-sm outline-none focus:ring-2 focus:ring-violet-300/60"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-700">New password</label>
                                        <input
                                            type="password"
                                            value={pwd.password}
                                            onChange={(e) => setPwd((p) => ({ ...p, password: e.target.value }))}
                                            className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900
                      shadow-sm outline-none focus:ring-2 focus:ring-violet-300/60"
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-zinc-700">Confirm password</label>
                                        <input
                                            type="password"
                                            value={pwd.rePassword}
                                            onChange={(e) => setPwd((p) => ({ ...p, rePassword: e.target.value }))}
                                            className="h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900
                      shadow-sm outline-none focus:ring-2 focus:ring-violet-300/60"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    <Button
                                        onClick={onChangePassword}
                                        disabled={savingPwd}
                                        className="h-11 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800"
                                    >
                                        {savingPwd ? (
                                            <span className="inline-flex items-center gap-2">
                                                <Loader2 className="size-4 animate-spin" />
                                                Updating...
                                            </span>
                                        ) : (
                                            "Update password"
                                        )}
                                    </Button>
                                </div>

                                <p className="mt-3 text-xs text-zinc-500">
                                    Use a strong password and don’t reuse it on other sites.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
