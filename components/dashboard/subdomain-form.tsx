"use client"

import  React from "react"
 import {toast} from 'sonner'
import { useState, } from "react"
import { Button } from "@/components/ui/button"
import TurnstileWidget from "../turnstile"


interface SubdomainFormProps {
  onSubmit: (name: string) => void
  onCancel: () => void
}

export function SubdomainForm({ onSubmit, onCancel }: SubdomainFormProps) {
  const [name, setName] = useState("")
  const [captchaVerified,setcaptchaVerified] = React.useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      alert("Please enter a subdomain name")
      return
    }

    onSubmit(name)
  }

   const handleCaptchaCheck = async (token: string | null) => {



    if (!token) {
      return toast.error("Please complete the CAPTCHA")
    }
    

    const res = await fetch("/api/verify-captcha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        captchaToken: token
      }),
    });

    if (res.ok) {
      setcaptchaVerified(true);
      return
    
    }
    setcaptchaVerified(false)
      return toast.error("Captcha verification failed");
    
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Subdomain Name
        </label>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="myproject"
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase())}
            className="flex-1 px-3 py-2 border border-border bg-background rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <span className="font-medium text-foreground">.isroot.in</span>
        </div>
      </div>


      <div>
        <TurnstileWidget onVerify={(token) => { 
          handleCaptchaCheck(token)}
          } />
      </div>


      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-border bg-transparent"
        >
          Cancel
        </Button>

        <Button disabled={!captchaVerified} type="submit">
          Create Subdomain
        </Button>
      </div>
    </form>
  )
}
