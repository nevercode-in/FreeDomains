"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubdomainForm } from "@/components/dashboard/subdomain-form";
import { SubdomainListItem } from "@/components/dashboard/subdomain-list-item";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  DomainLimitNotice,
  type DomainEntitlement,
} from "@/components/dashboard/domain-limit-notice";
interface Subdomain {
  _id: string;
  domainName: string;
  fqdn: string;
  ownerId: string;
  status: "active" | "suspended" | "expired" | "pending";
  abuseScore: number;

  registeredAt: string;
  expiresAt: string;
  graceExpiresAt: string;

  createdAt: string;
  updatedAt: string;

  __v: number;
}

export default function SubdomainsPage() {
  const router = useRouter();
   const  searchParams  = useSearchParams()
  const create=searchParams.get("create")

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState(false);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [domainEntitlement, setDomainEntitlement] =
    useState<DomainEntitlement | null>(null);
   async function getData() {
      try {
        const [res, meRes] = await Promise.all([
          fetch("/api/my/domains", { credentials: "include" }),
          fetch("/api/me", { credentials: "include" }),
        ]);
        if (!res.ok || !meRes.ok) {
          router.push("/login?error=Authentication Required");
          return;
        }

        const data = await res.json();
        const meData = await meRes.json();
        const entitlement = meData.domainEntitlement ?? null;
        setSubdomains(data ?? []);
        setDomainEntitlement(entitlement);
        if(create && !entitlement?.limitReached){
          setShowForm(true)
        }
      } finally {
        setIsLoading(false);
      }
    }
  useEffect(() => {
    getData();
  }, [router]);

  const handleAddSubdomain = async(newSubdomain: string) => {
    try {
      setIsLoading(true)
      const res=await fetch("/api/domain/create",
        {
          method:"POST",
          credentials:"include",
           headers: {
          "Content-Type": "application/json",
          },
          body:JSON.stringify({
            "domain":newSubdomain
          })
        }
      )
      const body=await res.json()
      if(!res.ok){
        if (body?.domainEntitlement) {
          setDomainEntitlement(body.domainEntitlement);
        }
        throw body
      }
        if(res.ok){
          await getData()
          toast.success(body.message)
        }
      } catch (err:any) {
       const message =  Array.isArray(err)
    ? err[0]
    : Array.isArray(err?.errors)
      ? err.errors[0]
      : err?.message || "Failed to create subdomain"
    toast.error(message)

    }finally{

         setShowForm(false);
        setIsLoading(false)
    }
 
  };

  const handleDeleteSubdomain = (id: string) => {
    setSubdomains((prev) => prev.filter((s) => s._id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setSubdomains((prev) =>
      prev.map((s) =>
        s._id === id
          ? { ...s, status: s.status === "active" ? "suspended" : "active" }
          : s
      )
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading Subdomains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Manage Subdomains</h1>
        <p className="text-muted-foreground">
          Create, edit, and manage your subdomains.
        </p>
      </div>

      <DomainLimitNotice entitlement={domainEntitlement} />

      {!showForm && (
        <Button 
         className="hover:cursor-pointer hover:ring-1 hover:ring-gray-400"
        disabled={domainEntitlement?.limitReached}
        onClick={() => setShowForm(true)}>
          Add New Subdomain
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Subdomain</CardTitle>
          </CardHeader>
          <CardContent>
            <SubdomainForm
              onSubmit={handleAddSubdomain}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold">
          Your Subdomains ({subdomains.length})
        </h2>

        {subdomains.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">
                No subdomains created yet.
              </p>
              <Button 
              className="hover:cursor-pointer hover:ring-1 hover:ring-gray-400"
              disabled={domainEntitlement?.limitReached}
              onClick={() => setShowForm(true)}>
                Create First Subdomain
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {subdomains.map((subdomain) => (
              <SubdomainListItem
                key={subdomain._id}
                subdomain={subdomain}
                onDelete={handleDeleteSubdomain}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
