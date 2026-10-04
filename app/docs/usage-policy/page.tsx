export const metadata = {
  title: "Usage Policy - isroot.in",
  description: "Acceptable Use Policy for the isroot.in subdomain and DNS platform",
}

export default function UsagePolicyPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Acceptable Use Policy
        </h1>
        <p className="text-muted-foreground">
          Last updated: January 2025
        </p>
      </div>

      {/* Intro */}
      <section className="space-y-4">
        <p className="text-foreground leading-relaxed">
          This Acceptable Use Policy explains how you can and cannot use
          <strong> isroot.in</strong>. The goal is simple: keep the platform
          safe, legal, and useful for everyone. If this policy is violated, we
          may suspend or remove access to the service.
        </p>
      </section>

      {/* Allowed Use */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Allowed Usage</h2>
        <p className="text-foreground leading-relaxed">
          isroot.in is intended for:
        </p>
        <ul className="list-disc list-inside space-y-2 text-foreground">
          <li>Learning, education, and student projects</li>
          <li>Personal websites and portfolios</li>
          <li>Development, testing, and demo applications</li>
          <li>Non-commercial and community-driven projects</li>
        </ul>
      </section>

      {/* Prohibited */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Prohibited Activities</h2>
        <p className="text-foreground leading-relaxed">
          You must <strong>not</strong> use isroot.in for any of the following:
        </p>

        <ul className="list-disc list-inside space-y-2 text-foreground">
          <li>Malware, phishing, scams, or malicious software</li>
          <li>Spam, mass emailing, or unsolicited messages</li>
          <li>DDoS attacks, brute-force attempts, or hacking activities</li>
          <li>Illegal content or activities under applicable laws</li>
          <li>Copyright or intellectual property violations</li>
          <li>Harassment, threats, or abusive behavior</li>
          <li>Impersonation of individuals, brands, or organizations</li>
          <li>Proxy services, VPNs, botnets, or anonymization services</li>
          <li>Cryptocurrency mining or resource-heavy abuse</li>
          <li>Sharing or selling access to provided subdomains</li>
        </ul>
      </section>

      {/* Responsibility */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Your Responsibility</h2>
        <p className="text-foreground leading-relaxed">
          You are fully responsible for anything hosted or pointed to by your
          subdomain. This includes content, applications, and services running
          under it. You must ensure your usage complies with all applicable laws
          and does not harm others.
        </p>
      </section>

      {/* Abuse */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Reporting Abuse</h2>
        <p className="text-foreground leading-relaxed">
          If you notice abuse, policy violations, or suspicious activity, please
          report it immediately.
        </p>

        <div className="bg-card p-4 rounded-lg border border-border/50 space-y-2">
          <p className="text-foreground">
            Email:{" "}
            <span className="font-medium text-accent">
              reportabuse@nevercode.in
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            We review abuse reports seriously and act as quickly as possible.
          </p>
        </div>
      </section>

      {/* Enforcement */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Enforcement & Suspension</h2>
        <p className="text-foreground leading-relaxed">
          We reserve the right to suspend, disable, or permanently remove any
          subdomain or account that violates this policy. Severe or repeated
          violations may result in permanent bans and reporting to relevant
          authorities if required.
        </p>
      </section>

      {/* Limits */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Fair Use & Limitations</h2>
        <p className="text-foreground leading-relaxed">
          To ensure fair access for everyone, we may apply limits such as rate
          limiting, DNS restrictions, or other technical controls. These limits
          help keep the service stable and abuse-free.
        </p>
      </section>

      {/* Changes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. Changes to This Policy</h2>
        <p className="text-foreground leading-relaxed">
          We may update this policy from time to time. Continued use of the
          service after changes means you accept the updated policy.
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Contact</h2>
        <p className="text-foreground leading-relaxed">
          If you have questions about this policy, contact us at:
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
