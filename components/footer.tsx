import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold tracking-tight">isroot.in</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free DNS management for developers, students, and indie hackers worldwide.
            </p>

            <div className="pt-2 space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Verified Emails</p>
              <p>support@nevercode.in</p>
              <p>reportabuse@nevercode.in</p>
              <p>creator@nevercode.in</p>
              <p>no-reply@nevercode.in</p>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-foreground">Legal</h4>
            <ul className="space-y-3">
              {[
                { name: "Terms", href: "/docs/terms" },
                { name: "Privacy", href: "/docs/privacy" },
                { name: "Usage Policy", href: "/docs/usage-policy" },
                { name: "Report Abuse", href: "mailto:reportabuse@nevercode.in" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-foreground">Connect</h4>
            <ul className="space-y-3">
              {[
                { name: "GitHub", href: "https://github.com/nevercode-in/FreeDomains" },
                { name: "Twitter / X", href: "https://x.com/nevercode_in" },
                { name: "Contact", href: "mailto:support@nevercode.in" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Extra / Status */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-foreground">Status</h4>
            <p className="text-sm text-muted-foreground">
              All systems operational. DNS updates propagate instantly.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            Made for developers, by developers. Open-source & community-driven.
          </p>
          <p>© 2025 isroot.in. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
