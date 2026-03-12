"use client"

import React from "react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export default function Logout() {
    return (
        <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/" })}
            className="cursor-pointer rounded-xl px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500
            focus:bg-red-500/10 focus:text-red-500 transition flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
        </DropdownMenuItem>
        
    )
}
