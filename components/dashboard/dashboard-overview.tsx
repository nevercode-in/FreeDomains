"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";
import {
  DomainLimitNotice,
  type DomainEntitlement,
} from "@/components/dashboard/domain-limit-notice";
interface DashboardOverviewProps {
  userName: String
  subdomainCount: number
  expiryCount:number
  domainEntitlement?: DomainEntitlement | null
}

export function DashboardOverview({ userName, subdomainCount,expiryCount,domainEntitlement }: DashboardOverviewProps) {
  const searchParams=useSearchParams()
  const error=searchParams?.get("error")
  return (
  
    <div className="space-y-4">
       {error && <div className="bg-red-700 h-8 flex items-center w-full p-5"> 
        <Info className="size-5 mr-2"/>
       <p className="text-l font-semibold">{error}</p>
      </div>}
      <DomainLimitNotice entitlement={domainEntitlement} />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">Manage your subdomains and DNS records with ease.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subdomains</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{subdomainCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{expiryCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border rounded-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium text-green-600">All Good</div>
            <p className="text-xs text-muted-foreground">No issues detected</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
