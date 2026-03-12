"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
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
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Key, Loader2, Lock, Mail } from "lucide-react"
import Link from "next/link"
const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
})
type FormData = z.infer<typeof formSchema>
export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const redirectURL = searchParams.get('url');
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })
  const router = useRouter()
  async function onSubmit(data: FormData) {
    setIsLoading(true)
    const response = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: redirectURL ? redirectURL : "/",
    })
    if (response?.ok) {
      toast.success("Success Login")
    } else {
      // toast.error(response?.error!)
    }
    setIsLoading(false)
  }
  return (
    <div className="min-h-[calc(100dvh-220px)] flex items-center justify-center bg-zinc-50 px-4 py-10">
      <Card className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
        {/* Background blur circles */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-green-500/10 blur-3xl" />

        <CardHeader className="relative text-center">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900 flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight text-zinc-900 hover:text-emerald-500 transition-colors">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-600 text-sm">
            Sign in to continue shopping on{" "}
            <span className="font-semibold bg-linear-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              NovaMart
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="relative pt-0">
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="relative">
                    <FieldLabel>Email Address</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type="email"
                        className="h-12 pl-10 rounded-xl border border-zinc-200 bg-zinc-50
                      focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 placeholder:text-zinc-400 transition"
                        placeholder="Enter your email"
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                        <Mail className="w-5 h-5" />
                      </div>
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="relative">
                    <FieldLabel>Password</FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        type="password"
                        className="h-12 pl-10 rounded-xl border border-zinc-200 bg-zinc-50 
                      focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500 placeholder:text-zinc-400 transition"
                        placeholder="Enter your password"
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

            <div className="text-right mt-1 mb-4">
              <Link
                href="/forgot"
                className="text-sm text-zinc-600 hover:text-emerald-500 underline underline-offset-4 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
        </CardContent>

        <CardFooter className="relative flex flex-col gap-3 pb-6 pt-0">
          <Button
            disabled={isLoading}
            type="submit"
            form="form-rhf-demo"
            className="w-full h-12 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-500
          shadow-sm transition active:scale-[0.98] flex justify-center items-center gap-2"
          >
            {isLoading ? "Authenticating..." : "Login"}
            {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
          </Button>

          <p className="text-center text-sm text-zinc-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-emerald-600 hover:underline transition-colors">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
