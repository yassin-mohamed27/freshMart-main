"use client";
import React, { useEffect, useState } from "react";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { HeartIcon, Loader2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { addToCartAction } from "@/actions/addtoCart.action";
import { useRouter } from "next/navigation";
import { addToWishlistAction, removeFromWishlistAction } from "@/actions/wishlistActions";

export default function AddToCart({ productId }: { productId: string }) {
  const [isLoading, setLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const router = useRouter();
  const key = "wishlist_ids_v1";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const ids: string[] = JSON.parse(raw);
      setInWishlist(ids.includes(productId));
    } catch { }
  }, [productId]);

  function updateLocal(next: boolean) {
    try {
      const raw = localStorage.getItem(key);
      const ids: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(ids);
      if (next) set.add(productId);
      else set.delete(productId);
      localStorage.setItem(key, JSON.stringify(Array.from(set)));
    } catch { }
  }

  async function addToCart(productId: string) {
    try {
      setLoading(true);
      const res = await addToCartAction(productId);
      if (res == null) {
        router.push("/login");
        return;
      }
      dispatchEvent(new CustomEvent("cartUpdate", { detail: res.numOfCartItems }));
      toast.success(res.message + "");
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function toggleWishlist() {
    try {
      setWishLoading(true);
      if (!inWishlist) {
        const res = await addToWishlistAction(productId);
        if (res == null) {
          router.push("/login");
          return;
        }
        setInWishlist(true);
        updateLocal(true);
        toast.success("Added to wishlist");
      } else {
        const res = await removeFromWishlistAction(productId);
        if (res == null) {
          router.push("/login");
          return;
        }
        setInWishlist(false);
        updateLocal(false);
        toast.success("Removed from wishlist");
      }
    } catch {
      toast.error("Wishlist failed");
    } finally {
      setWishLoading(false);
    }
  }

  return (
<CardFooter className="gap-2 p-0 mt-0">
  <Button
    disabled={isLoading}
    onClick={() => addToCart(productId)}
    className="flex-1 h-11 rounded-xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2
    shadow-sm transition-all duration-300 hover:bg-emerald-500 hover:shadow-md active:scale-[0.98]
    disabled:opacity-70 disabled:cursor-not-allowed border border-emerald-700 hover:ring-2 hover:ring-emerald-500/30">
    {isLoading ? (
      <Loader2 className="size-4 animate-spin" />
    ) : (
      <span className="grid size-7 place-items-center rounded-lg bg-white/20">
        <ShoppingCart className="size-4" />
      </span>
    )}
    <span className="text-sm">Add to cart</span>
  </Button>

  <button
    type="button"
    disabled={wishLoading}
    onClick={toggleWishlist}
    className="grid size-11 place-items-center rounded-xl border border-emerald-200 bg-white shadow-sm
    transition-all duration-300 hover:bg-emerald-50 hover:shadow-md active:scale-[0.95]
    disabled:opacity-70 disabled:cursor-not-allowed"
    aria-label="Add to wishlist"
    title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}>
    {wishLoading ? (
      <Loader2 className="size-4 animate-spin" />
    ) : (
      <HeartIcon
        className={
          inWishlist ? "size-5 text-emerald-500 fill-emerald-500" : "size-5 text-emerald-700"
        }
      />
    )}
  </button>
</CardFooter>
  );
}
