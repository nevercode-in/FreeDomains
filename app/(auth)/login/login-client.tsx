"use client";
import Link from "next/link"
import { LoginForm } from "@/components/auth/login-form"


export default function LoginClient() {



  return (
    <div className="space-y-6 p-10">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Sign in to your isroot.in account
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-accent hover:underline font-medium"
        >
          Sign up
        </Link>
      </p>
    </div>
  )
}
