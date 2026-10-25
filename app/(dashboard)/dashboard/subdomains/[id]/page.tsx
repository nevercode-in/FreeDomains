import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export async function generateStaticParams() {
  return [{ id: "1" }]
}

export default function SubdomainDetailPage() {
  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <div className="relative">
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20">
              <div className="w-12 h-12 rounded-full border-2 border-accent border-t-accent/30 animate-spin"></div>
            </div>
            <h3 className="text-2xl font-bold text-foreground">Coming Soon</h3>
            <p className="text-muted-foreground max-w-sm">
              Subdomain Management is under development. We're working hard to bring this feature to you soon.
            </p>
            <div className="flex justify-center gap-2 pt-4">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-130"></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-210"></div>
            </div>
          </div>
        </div>

        {/* Original Content - Blurred Behind */}
        <div className="blur-sm pointer-events-none space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Subdomain Details</h1>
            <p className="text-muted-foreground">View detailed subdomain configuration</p>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
