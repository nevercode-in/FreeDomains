"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"
import { Plus, ChartNoAxesGantt, Settings } from "lucide-react"
import type { DomainEntitlement } from "@/components/dashboard/domain-limit-notice"

interface user {
  githubId: string
  name: string
  _id: string
  avatar: string
  isBanned: boolean
  isDuplicate:boolean
}

interface Subdomain {
  id: string
  name: string
  domain: string
  status: "active" | "inactive"
  createdAt: string
  dnsRecords: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [subdomains, setSubdomains] = useState<Subdomain[]>([])
  const [activeDomain,setActiveDomains]=useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<user | null>()
  const [expiring,setExpiring]=useState<number>()
  const [domainEntitlement,setDomainEntitlement]=useState<DomainEntitlement | null>(null)
  const handleLogout = async() => {
      await fetch("/api/auth/logout", { method: "POST" })
        router.push("/")
  }
  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch("/api/me", { credentials: "include" })
        if (!res.ok) {

          router.push("/login?error=Authentication Required")
          return
        }
        let expiryCount=0
        let activeCount=0
        const data = await res.json() 
        setUser(data.user)
        setSubdomains(data.ownedDomains)
        setDomainEntitlement(data.domainEntitlement ?? null)
        data.ownedDomains.map((d:any)=>{
          if(d.status==="active"){
            activeCount+=1;
          }
          const daysLeft = Math.ceil((new Date(d.expiresAt).getTime() - Date.now()) /(1000 * 60 * 60 * 24))
          if(daysLeft<=60){
            expiryCount+=1;
          }
        })
        setExpiring(expiryCount)
        setActiveDomains(activeCount)
      }catch{
        setUser(null)
        console.log("something went wrong")
      }
      finally {
        setIsLoading(false)
      }
    }
    getData()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
  if(!user){
     return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Something went wrong</p>
          
          <p className="bg-background rounded-md py-2 px-3 flex items-center justify-center border-2 border-border hover:ring-2 hover:ring-orange-400 hover:border-0 hover:cursor-pointer"
          onClick={handleLogout}>Logout</p>
        </div>
      </div>
    )
  }
  if(user.isBanned){
     return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">The user is banned. If you want to appeal, please contact support@admin.isroot.in</p>
          
          <p className="bg-background rounded-md py-2 px-3 flex items-center justify-center border-2 border-border hover:ring-2 hover:ring-orange-400 hover:border-0 hover:cursor-pointer"
          onClick={handleLogout}>Logout</p>
        </div>
      </div>
    )
  }
return (
    <div className="flex-1 p-6 md:p-8 lg:p-14">
      <DashboardOverview
        userName={user?.name}
        subdomainCount={activeDomain}
        expiryCount={expiring!}
        domainEntitlement={domainEntitlement}
      />

      <div className="mt-10 space-y-8">
        <h2 className="text-2xl font-bold">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Register domain */}
          <div className="bg-orange-500 rounded-md py-5 px-3 flex gap-5 items-center border-2 border-border hover:bg-amber-600 hover:cursor-pointer">
            <div className="bg-black ml-4 w-10 h-10 rounded-md flex items-center justify-center dark:bg-white">
              <Plus className="text-white dark:text-black" />
            </div>

            <div
             onClick={(e)=>window.location.href='/dashboard/subdomains?create=true'}
            >
              <p className="font-bold text-xl text-white">
                Register new domain
              </p>
              <p className="text-white">Claim a new subdomain</p>
            </div>
          </div>

          {/* Manage subdomains */}
          <div 
          onClick={(e)=>window.location.href='/dashboard/subdomains'}
          className="bg-background rounded-md py-5 px-3 flex gap-5 items-center border-2 border-border hover:ring-2 hover:ring-orange-400 hover:border-0 hover:cursor-pointer">
            <div className="ml-4 w-10 h-10 rounded-md flex items-center justify-center">
              <ChartNoAxesGantt className="text-black dark:text-white" />
            </div>

            <div>
              <p className="font-bold text-xl">Manage subdomains</p>
              <p>View and manage subdomains</p>
            </div>
          </div>

          {/* DNS configuration */}
          <div 
          onClick={(e)=>window.location.href='/dashboard/dns'}
          className="bg-background rounded-md py-5 px-3 flex gap-5 items-center border-2 border-border hover:ring-2 hover:ring-orange-400 hover:border-0 hover:cursor-pointer">
            <div className="ml-4 w-10 h-10 rounded-md flex items-center justify-center">
              <ChartNoAxesGantt className="text-black dark:text-white" />
            </div>

            <div>
              <p className="font-bold text-xl">DNS Configuration</p>
              <p>Manage DNS records and NS delegation</p>
            </div>
          </div>

          {/* Account settings */}
          <div 
          onClick={(e)=>window.location.href='/dashboard/settings'}
          className="bg-background rounded-md py-5 px-3 flex gap-5 items-center border-2 border-border hover:ring-2 hover:ring-orange-400 hover:border-0 hover:cursor-pointer">
            <div className="ml-4 w-10 h-10 rounded-md flex items-center justify-center">
              <Settings className="text-black dark:text-white" />
            </div>

            <div>
              <p className="font-bold text-xl">Account Settings</p>
              <p>Update your profile</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
