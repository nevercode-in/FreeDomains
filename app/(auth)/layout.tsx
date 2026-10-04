import type React from "react"
import { LandingHeader } from "@/components/landing-header"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingHeader user={null} loading={false}/>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
