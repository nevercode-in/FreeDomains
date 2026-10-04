"use client";
import type React from "react"
import Link from "next/link"
import { LandingHeader } from "@/components/landing-header"
import { Footer } from "@/components/footer"
import { useState,useEffect } from "react"
interface User {
  id: string
  name?: string
  email?: string
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
    
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
    <div className="min-h-screen bg-background flex flex-col">
      <LandingHeader user={user} loading={loading} />
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-12">
            <Link
              href="/"
              className="text-accent hover:text-accent/80 transition-colors text-sm font-medium inline-flex items-center gap-2"
            >
              ← Back to Home
            </Link>
          </div>
          <article className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-a:text-accent hover:prose-a:text-accent/80">
            {children}
          </article>
        </div>
      </div>
      <Footer />
    </div>
  )
}
