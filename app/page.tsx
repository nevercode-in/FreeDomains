"use client"

import { useEffect, useState } from "react"
import { LandingHeader } from "@/components/landing-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"
import { Faq } from "@/components/faq"
interface User {
  id: string
  name?: string
  email?: string
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
 
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "include",
        })

        if (!res.ok) {
          setUser(null)
          return null;
        }

        const data = await res.json()
        setUser(data.user ?? null)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
    
      <LandingHeader user={user} loading={loading} />
       
      <HeroSection />
      <FeaturesSection />
      <Faq/>
      <CTASection />
      <Footer />
    </div>
  )
}
