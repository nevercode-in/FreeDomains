"use client";

import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { CircleX, Github } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../ui/card";
import { getDeviceId } from "@/lib/device";
import TurnstileWidget from "../turnstile";

export function RegisterForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [name, setName] = React.useState("")
  const [deviceId,setDeviceId]=React.useState<string|null>(null)
  const router = useRouter();
  const [captchaVerified,setcaptchaVerified] = React.useState(false)
  const [isLoading, setIsLoading] = useState(false);
  

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


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("name is required !")
    }
    if(!deviceId?.trim()){
      return toast.error("something went wrong. contact support@admin.isroot.in")
    }
    if(deviceId.length < 20){
      return toast.error("Invalid device");
    }
    setIsLoading(true)
    document.cookie = `tmp_name=${encodeURIComponent(name)}; path=/`;
    document.cookie = `deviceId=${encodeURIComponent(deviceId)}; path=/`;
    window.location.href = `/api/auth/github`
  };

  return (
    <Card className="bg-card border-border shadow-lg p-5">
      <CardContent className="pt-2 pb-2">
        <div className="flex flex-col justify-center items-center gap-2">
          {error && <div className="bg-red-400 w-3/4 p-3 border-2 flex gap-2">
            <CircleX />
            <p className="text-sm">{error}</p>
          </div>}

          <div className="w-3/4">

            <p className="text-sm">What should we call you ?</p>
            <input type="text"
              className="p-2 w-full border-2 border-black dark:border-white"
              onChange={(e) => setName(e.target.value)}
              value={name} />
          </div>

         <TurnstileWidget onVerify={(token) => { 
                   handleCaptchaCheck(token)}
                   } />


          <button
            onClick={handleSignup}
            disabled={!captchaVerified || isLoading}
            className="flex text-white bg-amber-700 p-4 hover:bg-amber-800 disabled:opacity-50 hover:cursor-pointer"
          >
            <Github className="mr-1" />
            <span>
              {isLoading ? "Redirecting..." : "Signup with GitHub"}
            </span>
          </button>
        </div>
      </CardContent>
    </Card>

  );
}
