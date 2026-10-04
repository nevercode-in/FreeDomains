"use client";

import { Suspense } from "react"
import LoginClient from "./login-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
export default function LoginPage() {
   const router=useRouter()
    useEffect(()=>{
      async function getData() {
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
        getData()
    },[])
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginClient />
    </Suspense>
  )
}
