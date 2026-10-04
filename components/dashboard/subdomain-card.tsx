import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Subdomain {
  id: string
  name: string
  fqdn:string
  domain: string
  status: "active" | "inactive"
  createdAt: string
  dnsRecords: number
}

interface SubdomainCardProps {
  subdomain: Subdomain
}

export function SubdomainCard({ subdomain }: SubdomainCardProps) {
  const date = new Date(subdomain.createdAt)
  return (
    <Card className="bg-card border-border hover:border-accent transition-colors p-3">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-foreground">{subdomain.fqdn}</CardTitle>
            <p className="text-sm text-muted-foreground">Created on{
              date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                 year: "numeric",
               })
              
              }</p>
          </div>
          <div
            className={`px-3 py-1 rounded text-sm font-medium ${
              subdomain.status === "active"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
            }`}
          >
            {subdomain.status.charAt(0).toUpperCase() + subdomain.status.slice(1)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-muted-foreground">DNS Records</p>
                <p className="text-lg font-bold text-accent">{subdomain.dnsRecords}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="border-border bg-transparent">
              <Link href={`/dashboard/dns/${subdomain.id}`}>Manage DNS</Link>
            </Button>
            <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={`/dashboard/subdomains/${subdomain.id}`}>Settings</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
