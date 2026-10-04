import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaDiscord } from "react-icons/fa";
export function CTASection() {
  return (
    <section id="community" className="relative py-24 px-6 bg-background border-t border-border/50">
      <div className="absolute inset-0 bg-linear-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-semibold text-accent tracking-wider">
                JOIN THE COMMUNITY
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Join developers building projects
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From hobby projects to production apps, isroot.in powers developers worldwide. Get your free subdomain
                in under 2 minutes and start building.
              </p>
            </div>

            <ul className="space-y-3">
              <li className="flex gap-3 items-start hover:translate-x-1 transition-transform duration-200">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">Free custom subdomain on isroot.in</span>
              </li>
              <li className="flex gap-3 items-start hover:translate-x-1 transition-transform duration-200">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">Simple DNS and nameserver management</span>
              </li>
              <li className="flex gap-3 items-start hover:translate-x-1 transition-transform duration-200">
                <span className="text-accent mt-1">✓</span>
                <span className="text-foreground">Community support and documentation</span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="font-semibold flex items-center gap-2 border-2 border-white p-3 bg-transparent transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-1 active:shadow-md"
              >
                <FaDiscord/>
                <Link href="https://dsc.gg/isroot">Join Discord</Link>
              </button>
            </div>
          </div>

          <div className="hidden md:flex justify-center animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <div className="relative w-full h-80 bg-linear-to-br from-accent/10 to-accent/5 rounded-2xl border border-accent/20 flex items-center justify-center overflow-hidden hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-grid-pattern opacity-5" />
              <div className="relative text-center space-y-4 px-8 hover:scale-105 transition-transform duration-300">
                <div className="text-6xl animate-bounce">🚀</div>
                <p className="text-muted-foreground font-medium">Free. Forever. No limits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
