import Link from "next/link"
import { ArrowLeft, Home, SearchX } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-[calc(100dvh-220px)] flex items-center justify-center bg-zinc-50 px-4">
            <div className="text-center max-w-md">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-lg">
                    <SearchX className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
                    Page not found
                </h1>
                <p className="mt-2 text-sm text-zinc-600">
                    Sorry, the page you are looking for doesn’t exist or has been moved.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-slate-900 
                        text-white font-semibold hover:bg-slate-800 transition active:scale-[0.98]">
                        <Home className="h-4 w-4" />
                        Back to home
                    </Link>
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl 
                        border border-zinc-300bg-white text-zinc-700 font-semibold hover:bg-zinc-100 transition active:scale-[0.98]">
                        <ArrowLeft className="h-4 w-4" />
                        Browse products
                    </Link>
                </div>
                <p className="mt-6 text-xs text-zinc-500">
                    NovaMart © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    )
}
