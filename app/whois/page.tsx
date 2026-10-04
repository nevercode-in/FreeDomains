"use client";
import { useState } from "react";
import { WhoisLookup } from "@/components/whois-lookup"
import { LandingHeader } from "@/components/landing-header"
import { useEffect } from "react"
interface User {
  id: string
  name?: string
  email?: string
}

export default function WhoisPage() {
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
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
  return <div>
     <LandingHeader user={user} loading={loading} />
    <WhoisLookup />
    </div>
}