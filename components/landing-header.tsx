"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
interface User {
  id: string
  name?: string
  email?: string
}


export function LandingHeader({
  user,
  loading,
}: {
  user: User | null
  loading: boolean
}) {


 

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg hover:opacity-80 transition">
          <span className="text-foreground">isroot.in</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </a>
          <a href="/#community" className="text-sm text-muted-foreground hover:text-foreground">
            Community
          </a>
          <a href="/#faq" className="text-sm text-muted-foreground hover:text-foreground">
            FAQ
          </a>
          <a href="/whois" className="text-sm text-muted-foreground hover:text-foreground">
            Whois
          </a>
        </nav>
        {!loading && (
          <>
            {user ? (
              <Button
                asChild
                
                className="bg-accent hover:bg-accent-dark text-white text-sm shadow-lg shadow-accent/30"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild className="text-sm">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="text-white bg-accent hover:bg-accent-dark text-sm shadow-lg shadow-accent/30"
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  )
}
