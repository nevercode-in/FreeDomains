"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NotificationInbox } from "@/components/notification"

export function DashboardHeader() {
  const router = useRouter()

  const handleLogout = async() => {
      await fetch("/api/auth/logout", { method: "POST" })
        router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/
        " className="flex items-center gap-2 font-bold text-lg">
          <span>isroot.in</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition">
            Dashboard
          </Link>
          <Link href="https://docs.isroot.in" className="text-muted-foreground hover:text-foreground transition">
            Docs
          </Link>
          <Link href="/dashboard/settings" className="text-muted-foreground hover:text-foreground transition">
            Settings
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <NotificationInbox />
        <Button variant="outline" onClick={handleLogout} 
        className="border-border bg-transparent hover:cursor-pointer hidden md:block">
          Logout
        </Button>
        </div>
        <Button variant="outline" onClick={(e)=>{window.location.href='/dashboard'}} 
        className="border-border bg-transparent hover:cursor-pointer block md:hidden">
          Dashboard
        </Button>
      </div>
    </header>
  )
}
