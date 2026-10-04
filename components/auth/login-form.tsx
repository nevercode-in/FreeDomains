"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { useEffect,useState } from "react"
import { Button } from "@/components/ui/button"
import { getDeviceId } from "@/lib/device"
import { Card, CardContent } from "@/components/ui/card"
import { CircleX,Github } from "lucide-react"
import TurnstileWidget from "../turnstile"
import {toast} from 'sonner'


export function LoginForm() {
  const searchParams=useSearchParams()
  const error=searchParams.get("error")
  const [captchaVerified,setcaptchaVerified] = React.useState<Boolean>(false)
  const [deviceId,setDeviceId]=React.useState<string|null>(null)
    useEffect(()=>{
          getDeviceId().then(setDeviceId)
    },[])
  
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
    <Card className="bg-card border-border shadow-lg">
      <CardContent className="pt-8 pb-8 flex flex-col justify-center gap-2">
         {error && <div className="bg-red-400 w-full h-5 p-5 border-2 flex items-center gap-2">
              <CircleX className="size-5"/>
               <p className="text-sm">{error}</p> 
              </div>}

               <div className="flex justify-center">
            <TurnstileWidget onVerify={(token) => { 
                      handleCaptchaCheck(token)}
                      } />
          </div>
       <button
        onClick={
          ()=> {
            document.cookie = `deviceId=${encodeURIComponent(deviceId!)}; path=/`;
            window.location.href="/api/auth/github"
          }
        }
        disabled={!captchaVerified}
        className="flex gap-2 justify-center text-white bg-amber-700 p-7 h-8 items-center hover:bg-amber-800 disabled:opacity-50 hover:cursor-pointer"
      >
        <Github className="mr-1" />
        <span>
         Signin with GitHub
        </span>
      </button>
      </CardContent>
    </Card>
  )
}
