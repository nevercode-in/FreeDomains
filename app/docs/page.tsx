export const metadata = {
  title: "Documentation - isroot.in",
  description: "Complete documentation and guides for isroot.in subdomain management",
}

export default function DocumentationPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Coming Soon Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 rounded-full blur-2xl"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m0 0h6m0-6H6m0 0H0"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Documentation</h1>
          <p className="text-lg text-muted-foreground">Complete guides and API reference coming soon</p>
        </div>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed">
          We're working on comprehensive documentation including detailed guides, API references, code examples, and
          tutorials. Check back soon or join our community for updates.
        </p>

        {/* Loading Indicator */}
        <div className="flex justify-center gap-2 pt-4">
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      </div>
    </div>
  )
}
