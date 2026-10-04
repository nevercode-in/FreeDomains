import Link from "next/link"
import { LandingHeader } from "@/components/landing-header"
import { Footer } from "@/components/footer"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center">
      
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="w-full max-w-2xl">
          <div className="text-center space-y-8">
            {/* Animated 404 */}
            <div className="relative h-32 sm:h-40 md:h-48 flex items-center justify-center">
              <div className="absolute inset-0 bg-linear-to-r from-accent/10 to-accent/5 rounded-full blur-3xl"></div>
              <div className="relative">
                <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold bg-linear-to-r from-accent to-orange-400 bg-clip-text text-transparent animate-pulse">
                  404
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">Page Not Found</h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Oops! The page you're looking for has vanished into the digital void. It might have been moved, deleted, or never existed in the first place.
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-2 sm:gap-3 my-8">
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-accent animate-bounce delay-200"></div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/"
                className="px-6 sm:px-8 py-3 bg-accent hover:bg-accent-dark text-accent-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-accent/30 hover:-translate-y-0.5 active:translate-y-1 text-center"
              >
                Back to Home
              </Link>
            </div>

            {/* Helpful Tips */}
            <div className="mt-12 sm:mt-16 p-6 sm:p-8 bg-card border border-border rounded-lg text-left space-y-4">
              <h3 className="font-semibold text-foreground text-lg">What you can try:</h3>
              <ul className="space-y-3 text-muted-foreground text-sm">
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>Check the URL for spelling errors or typos</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>Return to the home page and navigate using the menu</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>Browse our documentation or FAQ for more information</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold">•</span>
                  <span>Contact our support team if you believe this is an error</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
