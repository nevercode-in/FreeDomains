"use client"

import {toast} from "sonner"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/lib/debounce"
import { useState,useEffect} from "react"
import { CircleX,CircleCheck } from "lucide-react"
import TurnstileWidget from "./turnstile"

type Status = "idle" | "loading" | "available" | "taken" | "error"

export function HeroSection() {
  const [search, setSearch] = useState("")
  const debouncedQuery = useDebounce(search, 500)
  
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [captchaVerified, setcaptchaVerified] = useState(false);

  
  const handleCaptchaCheck = async (token: string | null) => {

    if (!token) {
      return toast.error("Please complete the CAPTCHA")
    }
    

    const res = await fetch("/api/verify-captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        captchaToken: token
      }),
    });

    if (res.ok) {
      setcaptchaVerified(true);
      return
      
    }
    setcaptchaVerified(false)
    return toast.error("Captcha verification failed");
    
  }



  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setStatus("idle")
      setError("")
      return
    }

    const controller = new AbortController()

    async function checkDomain() {
      try {
        setStatus("loading")

        const res = await fetch(`/api/domain/${debouncedQuery}`, {
          signal: controller.signal,
        })

        const body = await res.json()
        if (!res.ok) throw body

        setStatus(body.exists ? "taken" : "available")
      } catch (err: any) {
        if (err.name === "AbortError") return
        setError(
          Array.isArray(err?.errors)
            ? err.errors[0].message
            : err.message
        )
        setStatus("error")
      }
    }

    checkDomain()
    return () => controller.abort()
  }, [debouncedQuery])


  return (
    <section className="relative py-10 px-6 md:py-15 lg:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-background to-background pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center space-y-12 md:space-y-16 relative z-10">
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-xs font-semibold text-accent tracking-wider animate-in fade-in slide-in-from-top-2 duration-500 fill-mode-both">
              FOR DEVELOPERS, BY DEVELOPERS
            </div>
            <h1 className="text-3xl md:text-7xl font-bold leading-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-100">
              Your free <span className="gradient-text">yourname.isroot.in</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-200">
              DNS management that doesn't suck. Built for students, developers, and indie hackers who value their time.
            </p>
          </div>

          <div className="flex justify-center">
         <TurnstileWidget onVerify={(token) => { 
          handleCaptchaCheck(token)}
          } />
          </div>

          <div className="flex flex-row sm:flex-row gap-3 max-w-xl mx-auto pt-4 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-300">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="yourname"
                disabled={!captchaVerified}
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                className="w-full px-5 py-4 border border-border bg-background rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md hover:border-accent/50"
              />
            </div>
            <span className="flex items-center px-4 py-4 text-foreground font-semibold whitespace-nowrap">
              .isroot.in
            </span>
          
          </div>
          {status=="taken" && <div className="flex gap-2 justify-center items-center">
            <CircleX className="text-red-500/100"/>
              <span className="text-red-500/100">
                  
                Subdomain already taken
            </span>
          </div>}
          {status=="available" && <div className="flex gap-2 justify-center items-center">
            <CircleCheck className="text-green-500/100"/>
              <span className="text-green-500/100">
                  
                {search}.isroot.in is available
            </span>
          </div>}
          {error && <div className="flex gap-2 justify-center items-center">
            <CircleX className="text-red-500/100"/>
              <span className="text-red-500/100">
                  
                {error}
            </span>
          </div>}
           
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-1 md:pt-1 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both delay-400">
            
            
            <Button
              
              disabled={!captchaVerified}
              onClick={(e)=>{window.location.href='/register'}}
              size="lg"
              className="text-white bg-accent hover:bg-accent-dark shadow-lg shadow-accent/30 text-base font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-1 active:translate-y-0.5 active:shadow-md disabled:opacity-50 py-6"
            >{status=="available" ? "Register to claim" : "Check Availability"}
              {/* <Link href="/register">{status=="available" ? "Register to claim" : "Check Availability"}</Link> */}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
