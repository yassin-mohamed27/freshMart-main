"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  const tabs = ["Products", "Brands", "Categories"];

  // منع سكرول الخلفية
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // قفل بالـ ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Burger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden grid size-10 place-items-center rounded-2xl 
        bg-slate-900 ring-1 ring-slate-800
        transition-all duration-300 hover:bg-slate-800/80 hover:ring-slate-700 active:scale-[0.95]"
      >
        <Menu className="w-5 h-5 text-slate-200" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Blur Background */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Slide Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-72 
          bg-slate-950 border-r border-slate-800
          shadow-2xl transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <span className="text-lg font-bold text-emerald-500">
              Menu
            </span>

            <button
              onClick={() => setOpen(false)}
              className="grid size-9 place-items-center rounded-xl 
              bg-slate-900 ring-1 ring-slate-800
              hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4 text-slate-300" />
            </button>
          </div>

          {/* Tabs */}
          <div className="p-4 space-y-2">
            {tabs.map((tab) => (
              <Link
                key={tab}
                href={`/${tab.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between 
                rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300
                transition-all duration-300 hover:bg-emerald-900/50 hover:text-emerald-400"
              >
                <span>{tab}</span>

                <span
                  className="h-1 w-0 rounded-full bg-emerald-500
                  transition-all duration-300 group-hover:w-6"
                />
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-800 mx-4 my-3" />

          {/* Extra Links */}
          <div className="p-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-2xl px-4 py-3 text-sm text-slate-400 
              hover:bg-emerald-900/50 hover:text-emerald-400 transition"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}