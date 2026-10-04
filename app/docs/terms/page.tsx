export const metadata = {
  title: "Terms of Service - isroot.in",
  description: "Terms and conditions for using the isroot.in subdomain and DNS management platform",
}

export default function TermsPage() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Terms of Service
        </h1>
        <p className="text-muted-foreground">
          Last updated: January 2025
        </p>
      </div>

      {/* Intro */}
      <section className="space-y-4">
        <p className="text-foreground leading-relaxed">
          Welcome to <strong>isroot.in</strong>. These Terms of Service explain
          how you can use our free subdomain and DNS management platform(coming soon). By
          accessing or using our services, you agree to these terms. If you do
          not agree, please do not use the platform.
        </p>
      </section>

      {/* 1 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">1. Eligibility & Acceptance</h2>
        <p className="text-foreground leading-relaxed">
          By using isroot.in, you confirm that you are legally allowed to use
          online services in your country and that you agree to follow all
          applicable laws and regulations.
        </p>
      </section>

      {/* 2 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">2. Use of the Service</h2>
        <p className="text-foreground leading-relaxed">
          isroot.in provides free subdomains and DNS management tools for
          personal, educational, and non-commercial use.
        </p>

        <ul className="list-disc list-inside space-y-2 text-foreground">
          <li>You may use the service for learning, development, and projects</li>
          <li>You must not use the service for illegal, abusive, or malicious activities</li>
          <li>You must not attempt to disrupt, exploit, or reverse-engineer our systems</li>
          <li>You must not resell or misuse subdomains provided by us</li>
        </ul>
      </section>

      {/* 3 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">3. Subdomains & DNS</h2>
        <p className="text-foreground leading-relaxed">
          Subdomains are provided on a free basis and remain the property of
          isroot.in. We reserve the right to suspend or delete any subdomain
          that violates our policies, is inactive, or is used for abuse.
        </p>
      </section>

      {/* 4 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">4. Availability & Reliability</h2>
        <p className="text-foreground leading-relaxed">
          We aim to keep the service stable and available, but we do not
          guarantee uninterrupted uptime. Maintenance, outages, or technical
          issues may occur from time to time.
        </p>
      </section>

      {/* 5 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">5. Disclaimer</h2>
        <p className="text-foreground leading-relaxed">
          The service is provided <strong>"as is"</strong> and <strong>"as
          available"</strong>. We make no warranties regarding accuracy,
          reliability, or fitness for a particular purpose.
        </p>
      </section>

      {/* 6 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">6. Limitation of Liability</h2>
        <p className="text-foreground leading-relaxed">
          isroot.in will not be liable for any direct or indirect damages,
          including loss of data, service interruption, or project failure
          resulting from the use or inability to use the platform.
        </p>
      </section>

      {/* 7 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">7. External Links</h2>
        <p className="text-foreground leading-relaxed">
          Our website may contain links to third-party websites. We are not
          responsible for the content, security, or practices of those sites.
          Visiting them is at your own risk.
        </p>
      </section>

      {/* 8 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">8. Changes to These Terms</h2>
        <p className="text-foreground leading-relaxed">
          We may update these terms from time to time. Continued use of the
          service after changes means you accept the updated terms.
        </p>
      </section>

      {/* 9 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">9. Governing Law</h2>
        <p className="text-foreground leading-relaxed">
          These terms are governed by the laws of India. Any disputes will fall
          under the jurisdiction of Indian courts.
        </p>
      </section>

      {/* Contact */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">10. Contact</h2>
        <p className="text-foreground leading-relaxed">
          If you have any questions about these terms, please contact us at{" "}
          <strong>support@nevercode.in</strong>.
        </p>
      </section>
    </div>
  )
}
