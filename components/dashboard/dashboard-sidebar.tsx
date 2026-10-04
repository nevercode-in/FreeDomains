"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard,Globe,Settings,Book,Logs} from "lucide-react"
export function DashboardSidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/dashboard/subdomains", label: "Subdomains", icon: <Globe/> },
    { href: "/dashboard/dns", label: "DNS Records", icon: <Settings/> },
    { href: "https://docs.isroot.in", label: "Docs", icon: <Book/> },
    { href: "/dashboard/auditlog", label: "audit Logs", icon: <Logs/> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings/> },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card hidden md:block min-h-screen">
      <nav className="p-6 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
