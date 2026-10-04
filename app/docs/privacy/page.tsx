export const metadata = {
  title: "Privacy Policy - isroot.in",
  description: "Privacy Policy explaining how isroot.in collects and uses your data",
}

export default function PrivacyPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">
          Last updated: January 2025
        </p>
      </div>

      {/* Intro */}
      <section className="space-y-4">
        <p className="text-foreground leading-relaxed">
          Your privacy matters to us. This Privacy Policy explains how{" "}
          <strong>isroot.in</strong> collects, uses, and protects your
          information when you use our free subdomain and DNS management
          platform.
        </p>
      </section>

      {/* What we collect */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
        <p className="text-foreground leading-relaxed">
          We collect only the information necessary to operate and improve the
          service.
        </p>

        <ul className="list-disc list-inside space-y-2 text-foreground">
          <li>
            <strong>Account Information:</strong> email address, username, and
            basic profile details you provide
          </li>
          <li>
            <strong>DNS & Subdomain Data:</strong> records, configurations, and
            settings you manage on the platform
          </li>
          <li>
            <strong>Usage Data:</strong> basic analytics such as pages visited,
            timestamps, and feature usage
          </li>
        </ul>
      </section>

      {/* How we use data */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. How We Use Your Data</h2>
        <p className="text-foreground leading-relaxed">
          We use your information to:
        </p>

        <ul className="list-disc list-inside space-y-2 text-foreground">
          <li>Provide and maintain the isroot.in service</li>
          <li>Manage subdomains and DNS records</li>
          <li>Communicate important service updates</li>
          <li>Improve performance, security, and reliability</li>
          <li>Detect abuse, fraud, or policy violations</li>
        </ul>
      </section>

      {/* What we don't do */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. What We Do NOT Do</h2>
        <ul className="list-disc list-inside space-y-2 text-foreground">
          <li>We do not sell your personal data</li>
          <li>We do not run ads or track you across websites</li>
          <li>We do not share your data with third parties for marketing</li>
        </ul>
      </section>

      {/* Data sharing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Data Sharing</h2>
        <p className="text-foreground leading-relaxed">
          We may share limited data only when required to:
        </p>

        <ul className="list-disc list-inside space-y-2 text-foreground">
          <li>Comply with legal obligations</li>
          <li>Respond to lawful requests by authorities</li>
          <li>Protect the security and integrity of the platform</li>
        </ul>
      </section>

      {/* Security */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Data Security</h2>
        <p className="text-foreground leading-relaxed">
          We take reasonable technical and organizational measures to protect
          your data. However, no system is 100% secure, and we cannot guarantee
          absolute security.
        </p>
      </section>

      {/* Retention */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Data Retention</h2>
        <p className="text-foreground leading-relaxed">
          We retain your data only as long as necessary to provide the service
          or comply with legal requirements. Inactive or suspended accounts may
          have their data removed.
        </p>
      </section>

      {/* Changes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Changes to This Policy</h2>
        <p className="text-foreground leading-relaxed">
          We may update this Privacy Policy occasionally. Any changes will be
          posted on this page, and continued use of the service means you accept
          the updated policy.
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Contact Us</h2>
        <p className="text-foreground leading-relaxed">
          If you have any questions or concerns about privacy, you can reach us
          at:
        </p>

        <div className="bg-card p-4 rounded-lg border border-border/50">
          <p className="text-foreground">
            Email:{" "}
            <span className="font-medium text-accent">
              support@nevercode.in
            </span>
          </p>
        </div>
      </section>
    </div>
  )
}
