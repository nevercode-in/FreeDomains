import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function FeaturesSection() {
  const features = [
    {
      title: "Simple DNS Records",
      description: "Add A, CNAME, MX records without the complexity. Intuitive interface that just works.",
      icon: "🧬",
      gradient: "from-orange-500/20 to-transparent",
      border: "border-orange-200 dark:border-orange-900",
    },
    {
      title: "Nameserver Management",
      description: "Point your domain to custom nameservers easily. No technical jargon required.",
      icon: "🌐",
      gradient: "from-orange-500/20 to-transparent",
      border: "border-orange-200 dark:border-orange-900",
    },
    {
      title: "Real-time Updates",
      description: "Changes take effect instantly. Monitor your DNS settings in real-time with live status.",
      icon: "⚡",
      gradient: "from-orange-500/20 to-transparent",
      border: "border-orange-200 dark:border-orange-900",
    },
    {
      title: "Built for Developers",
      description: "Everything you need, nothing you don't. Designed by developers, for developers.",
      icon: "💻",
      gradient: "from-orange-500/20 to-transparent",
      border: "border-orange-200 dark:border-orange-900",
    },
    {
      title: "Community Driven",
      description: "Join thousands of students and indie hackers building amazing projects.",
      icon: "👥",
      gradient: "from-orange-500/20 to-transparent",
      border: "border-orange-200 dark:border-orange-900",
    },
    {
      title: "Free Forever",
      description: "No credit card. No hidden fees. Just open source community vibes.",
      icon: "🎉",
      gradient: "from-orange-500/20 to-transparent",
      border: "border-orange-200 dark:border-orange-900",
    },
  ]

  return (
    <section id="features" className="relative py-24 px-6 bg-background">
      <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-background to-background pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-5xl md:text-6xl font-bold text-balance leading-tight">Everything you need</h2>
          <p className="text-lg text-muted-foreground">
            Built for simplicity. Designed for developers. Powered by community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card
              key={idx}
              className="group relative bg-card p-5 border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <CardHeader className="relative">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <CardTitle className="text-foreground text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
