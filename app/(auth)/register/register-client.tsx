"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterClient() {
    const router=useRouter()
  useEffect(()=>{
    async function checkIsLoggedIn() {
      try {
        const res = await fetch("/api/me", { credentials: "include" })
        if (res.ok) {
          router.push("/dashboard?error=Already authenticated")
          return
        }
      }catch{
        router.push("/signup?error=something went wrong")
      }
    }
      checkIsLoggedIn()
  },[])
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-foreground">
          Create your account
        </h1>
        <p className="text-muted-foreground">
          Join the developer community on isroot.in
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-muted-foreground">
        By joining, you agree to our{" "}
        <Link href="/docs/terms" className="text-accent hover:underline font-medium">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/docs/privacy" className="text-accent hover:underline font-medium">
          Privacy Policy
        </Link>
      </p>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </div>
  )
}
