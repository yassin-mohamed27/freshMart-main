"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Key, Loader2, Lock, Mail, Phone, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import React from "react"

// -----------------
// Schema
// -----------------
const formSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/, "Invalid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rePassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((v) => v.password === v.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  })

type FormData = z.infer<typeof formSchema>

// -----------------
// Component
// -----------------
export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      rePassword: "",
    },
  })

  // -----------------
  // Submit
  // -----------------
  async function onSubmit(values: FormData) {
    setIsLoading(true)
    try {
      // Trim values
      const trimmedValues = {
        ...values,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trimmedValues),
      })

      const json = await res.json()

      if (res.ok) {
        toast.success(json?.message || "Account created successfully")
        router.push("/login")
      } else {
        const msg =
          json?.message ||
          (json?.errors
            ? Array.isArray(json.errors)
              ? json.errors[0]?.msg
              : json.errors.msg
            : "Signup failed")
        toast.error(msg)
      }
    } catch (e) {
      toast.error("Network error, try again")
    } finally {
      setIsLoading(false)
    }
  }

  // -----------------
  // Render
  // -----------------
  return (
    <div className="bg-zinc-50 px-4">
  <div className="min-h-[calc(100dvh-220px)] flex items-center justify-center py-10">
    <Card className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
      {/* Background Blurs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

      {/* Header */}
      <CardHeader className="relative text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-900 flex items-center justify-center shadow-md">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-extrabold tracking-tight text-zinc-900 hover:text-emerald-500 transition-colors">
          Create account
        </CardTitle>
        <CardDescription className="text-zinc-600 text-sm">
          Join{" "}
          <span className="font-semibold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            NovaMart
          </span>{" "}
          and start shopping
        </CardDescription>
      </CardHeader>

      {/* Form */}
      <CardContent className="relative pt-0">
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/** Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Full name</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter your name"
                      disabled={isLoading}
                      className="h-12 pl-10 rounded-xl border border-zinc-200 bg-zinc-50
                        focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500
                        placeholder:text-zinc-400 transition"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/** Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className="h-12 pl-10 rounded-xl border border-zinc-200 bg-zinc-50
                        focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500
                        placeholder:text-zinc-400 transition"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Mail className="w-5 h-5" />
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/** Phone */}
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="e.g. 01xxxxxxxxx"
                      disabled={isLoading}
                      className="h-12 pl-10 rounded-xl border border-zinc-200 bg-zinc-50
                        focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500
                        placeholder:text-zinc-400 transition"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Phone className="w-5 h-5" />
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/** Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type="password"
                      placeholder="Create password"
                      disabled={isLoading}
                      className="h-12 pl-10 rounded-xl border border-zinc-200 bg-zinc-50
                        focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500
                        placeholder:text-zinc-400 transition"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Key className="w-5 h-5" />
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/** Confirm Password */}
            <Controller
              name="rePassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Confirm password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type="password"
                      placeholder="Repeat password"
                      disabled={isLoading}
                      className="h-12 pl-10 rounded-xl border border-zinc-200 bg-zinc-50
                        focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500
                        placeholder:text-zinc-400 transition"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                      <Key className="w-5 h-5" />
                    </div>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      {/* Footer */}
      <CardFooter className="relative flex flex-col gap-3 pb-6 pt-0">
        <Button
          disabled={isLoading}
          type="submit"
          form="register-form"
          className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500
          shadow-sm transition active:scale-[0.98] flex justify-center items-center gap-2
          disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create account"}
          {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
        </Button>
        <p className="text-center text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-emerald-600 hover:underline transition-colors">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  </div>
</div>
  )
}