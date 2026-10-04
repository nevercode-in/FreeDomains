import { Suspense } from "react"
import SubdomainClient from "./subdomain-client"

export default function SubdomainPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubdomainClient/>
    </Suspense>
  )
}
