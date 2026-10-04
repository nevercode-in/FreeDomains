"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Globe, Clock, Settings, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
interface NsRecords {
  ns1: string
  ns2: string
}

interface Subdomain {
  _id: string
  fqdn: string
  status: "active" | "suspended" | "expired" | "pending"
  expiresAt: string
  nsrecords?: NsRecords | null
}

interface Props {
  subdomain: Subdomain
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

export function SubdomainListItem({
  subdomain,
  onDelete,
  onToggleStatus,
}: Props) {
  async function handleRenew(domainId:string){
    try {
        const res=await fetch(`/api/my/domains/renew/${domainId}`,{
            method:"POST",
            credentials:"include",
         headers: {
          "Content-Type": "application/json",
          },
        })
        const body=await res.json()
        if(res.ok){
           toast.success(body.message)
        }
        if (!res.ok) {
      throw body
        }
       
    } catch (err:any) {
       const message =
      Array.isArray(err?.errors)
        ? err.errors[0]
        : err?.message || "Something went wrong"

        toast.error(message)
    }
  }
  const statusStyles = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    suspended:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
    pending:
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  }[subdomain.status]

  return (
    <Card className="rounded-xl border border-border p-5">
      {/* TABLE HEADERS (desktop only) */}
      <div className="hidden md:grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-3">
        <div className="col-span-4">Domain Information</div>
        <div className="col-span-4">Nameservers</div>
        <div className="col-span-4">Status / Expiry</div>
      </div>

      {/* ROW */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* DOMAIN INFO */}
        <div className="col-span-4 space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <p className="font-semibold break-all">{subdomain.fqdn}</p>
          </div>
          <p className="text-xs text-muted-foreground">
            ID: {subdomain._id}
          </p>
        </div>

        {/* NAMESERVERS */}
        <div className="col-span-4 space-y-1 font-mono text-sm">
          <p>{subdomain.nsrecords?.ns1 ?? "—"}</p>
          <p>{subdomain.nsrecords?.ns2 ?? "—"}</p>
        </div>

        {/* STATUS + ACTIONS */}
        <div className="col-span-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${statusStyles}`}
            >
              ● {subdomain.status.toUpperCase()}
            </span>

            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Expires{" "}
              {new Date(subdomain.expiresAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>

         <div className="flex flex-col flex-wrap gap-2 justify-end">
            <Button
              size="sm"
              variant="outline"
              className="gap-2 bg-green-100 text-green-700 hover:bg-green-200 hover:cursor-pointer"
              onClick={() => handleRenew(subdomain._id)}
            >
              <RefreshCcw className="w-4 h-4" />
              Renew
            </Button>

            <Button
              asChild
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Link href={`/dashboard/subdomains/${subdomain._id}`}>
                <Settings className="w-4 h-4" />
                Manage
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
