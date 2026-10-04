"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Globe,
  ArrowLeft,
  Clock,
  Settings,
  Trash2,
  X,
} from "lucide-react"
import { toast } from "sonner"


function isValidNameserver(ns: string): boolean {
  const value = ns.trim().replace(/\.$/, "")

  if (!value) return false
  if (/^https?:\/\//i.test(value)) return false
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return false

  const hostnameRegex =
    /^(?=.{1,253}$)(?!-)[A-Za-z0-9-]{1,63}(?<!-)(\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*$/

  return hostnameRegex.test(value)
}

const normalizeNs = (ns: string) =>
  ns.trim().toLowerCase().replace(/\.$/, "")



interface Domain {
  _id: string
  fqdn: string
  status: "active" | "suspended" | "expired" | "pending"
  registeredAt: string
  expiresAt: string
}

interface Ns {
  ns1: string
  ns2: string
}

interface ApiResponse {
  domain: Domain
  ns: Ns | null
}



export default function SubdomainDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  const [showNsModal, setShowNsModal] = useState(false)
  const [nsForm, setNsForm] = useState<Ns>({ ns1: "", ns2: "" })
  const [nsErrors, setNsErrors] = useState<{ ns1?: string; ns2?: string }>({})


  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteText, setDeleteText] = useState("")
  const [deleting, setDeleting] = useState(false)


  useEffect(() => {
    if (!id) return

    async function fetchData() {
      try {
        const res = await fetch(`/api/domain/details/${id}`, {
          credentials: "include",
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.message || "Failed to fetch domain")
        }

        const json: ApiResponse = await res.json()
        setData(json)
        
        if (json.ns) {
          setNsForm(json.ns)
        }
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])


  const handleSaveNameservers = async () => {
    const payload:Ns = {
      ns1: normalizeNs(nsForm.ns1),
      ns2: normalizeNs(nsForm.ns2),
    }
    try {
      setLoading(true)
      const res=await fetch("/api/my/domains",{
        method:"POST",
        credentials:"include",
         headers: {
          "Content-Type": "application/json",
          },
        body:JSON.stringify({
          domainId:id,
          ns1:payload.ns1,
          ns2:payload.ns2
        })
      })
      const body=await res.json()
      if (res.ok) {
       console.log(body)
      if (!data) {
      router.push("/dashboard?error=Something went wrong please contact support@nevercode.in")
        return
      }
        setData({
        ...data,
        domain: data.domain,
        ns: payload,
      })
      toast.success(body.message)
      }
      if(!res.ok){
        throw body
      }
    } catch (err:any) {
      const message =
      Array.isArray(err?.errors)
        ? err.errors[0]
        : err?.message || "Something went wrong"

      toast.error(message || "An error occured while updating the name servers")
    }finally{
      setLoading(false)
    }
    setShowNsModal(false)
  }
  const handleRenew=async()=>{
    try {
        const res=await fetch(`/api/my/domains/renew/${id}`,{
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
  const handleDeleteDomain = async () => {
    try {
      setDeleting(true)

      const res = await fetch(`/api/my/domains/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Delete failed")
      }

      router.push("/dashboard/subdomains")
    } catch (e: any) {
      toast.error(e.message || "Something went wrong")
    } finally {
      setDeleting(false)
    }
  }



  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading domain…</p>
        </div>
      </div>
    )
  }

  if (!data || error) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-destructive font-medium">
              {error || "Unable to load domain"}
            </p>
            <Button className="mt-4 hover:cursor-pointer" onClick={() => router.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { domain, ns } = data

  const daysLeft = Math.ceil(
    (new Date(domain.expiresAt).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
  )

  const statusColor = {
    active: "text-emerald-500",
    suspended: "text-yellow-500",
    expired: "text-red-500",
    pending: "text-blue-500",
  }[domain.status]
  const hasNsChanged = !data.ns ||
  normalizeNs(nsForm.ns1) !== normalizeNs(data.ns.ns1) ||
  normalizeNs(nsForm.ns2) !== normalizeNs(data.ns.ns2)
  const saveDisabled =
    !nsForm.ns1 ||
    !nsForm.ns2 ||
    !!nsErrors.ns1 ||
    !!nsErrors.ns2 ||
    !hasNsChanged


  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">

      {/* HEADER */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="px-0 hover:text-accent"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to domains
      </Button>

      <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
        <Globe className="w-6 h-6 text-muted-foreground" />
        {domain.fqdn}
      </h1>

      {/* STATUS */}
      <div className="flex gap-6">
        <div>
          <p className="text-xs uppercase text-muted-foreground">Status</p>
          <p className={`font-medium ${statusColor}`}>
            {domain.status.toUpperCase()}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase text-muted-foreground">Expires</p>
          <p className="font-medium">
            {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 hover:cursor-pointer">
        <Button 
        onClick={handleRenew}
        className="gap-2 hover:cursor-pointer">
          <Clock className="w-4 h-4" />
          Renew Domain
        </Button>

        <Button
          variant="outline"
          className="gap-2 hover:cursor-pointer"
          onClick={() => setShowNsModal(true)}
        >
          <Settings className="w-4 h-4" />
          Edit Nameservers
        </Button>
      </div>

      {/* DNS */}
      <Card className="p-6 space-y-4">
        <h2 className="font-semibold">Nameservers</h2>

        {ns ? (
          <div className="grid md:grid-cols-2 gap-4 font-mono">
            <div className="border rounded p-3">{ns.ns1}</div>
            <div className="border rounded p-3">{ns.ns2}</div>
          </div>
        ) : (
          <p className="text-muted-foreground">No nameservers configured</p>
        )}

        <div className="rounded-md border border-accent/30 bg-accent/10 p-4 text-sm">
          ⏳ DNS propagation can take <strong>24–48 hours</strong> globally.
        </div>
      </Card>

      {/* DANGER */}
      <Card className="p-6 border-destructive/40 bg-destructive/5">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-destructive">Delete Domain</p>
            <p className="text-sm text-muted-foreground">
              This action is permanent.
            </p>
          </div>

          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </Card>

      {/* EDIT NS MODAL */}
      {showNsModal && (
        <Modal title="Edit Nameservers" onClose={() => setShowNsModal(false)}>
          <Input
            label="NS1"
            value={nsForm.ns1}
            error={nsErrors.ns1}
            onChange={(v:any) => { //any 
              setNsForm({ ...nsForm, ns1: v })
              setNsErrors((e) => ({
                ...e,
                ns1: isValidNameserver(v)
                  ? undefined
                  : "Invalid nameserver hostname",
              }))
            }}
          />

          <Input
            label="NS2"
            value={nsForm.ns2}
            error={nsErrors.ns2}
            onChange={(v:any) => { //any
              setNsForm({ ...nsForm, ns2: v })
              setNsErrors((e) => ({
                ...e,
                ns2:
                  v === nsForm.ns1
                    ? "NS1 and NS2 cannot be the same"
                    : isValidNameserver(v)
                    ? undefined
                    : "Invalid nameserver hostname",
              }))
            }}
          />

          <p className="text-xs text-muted-foreground">
            DNS changes may take <strong>24–48 hours</strong> to propagate.
          </p>

          <ModalActions
            onCancel={() => setShowNsModal(false)}
            onConfirm={handleSaveNameservers}
            confirmText="Save Changes"
            disabled={saveDisabled}
          />
        </Modal>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <Modal title="Delete Domain" destructive onClose={() => setShowDeleteModal(false)}>
          <p className="text-sm">
            Type <strong>DELETE</strong> to confirm deletion of:
          </p>

          <p className="font-mono bg-muted/40 p-2 rounded">
            {domain.fqdn}
          </p>

          <input
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="DELETE"
            className="w-full px-3 py-2 border rounded bg-background"
          />

          <ModalActions
            destructive
            disabled={deleteText !== "DELETE" || deleting}
            confirmText={deleting ? "Deleting…" : "Delete"}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteDomain}
          />
        </Modal>
      )}
    </div>
  )
}

/* ================= UI HELPERS ================= */

function Modal({ title, children, onClose, destructive }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className={destructive ? "text-destructive" : ""}>
            {title}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </div>
  )
}

function Input({ label, value, onChange, error }: any) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full mt-1 px-3 py-2 border rounded bg-background
          ${error ? "border-destructive" : ""}`}
      />
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}

function ModalActions({
  onCancel,
  onConfirm,
  confirmText,
  destructive,
  disabled,
}: any) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button
        variant={destructive ? "destructive" : "default"}
        className="hover:cursor-pointer"
        onClick={onConfirm}
        disabled={disabled}
      >
        {confirmText}
      </Button>
    </div>
  )
}
