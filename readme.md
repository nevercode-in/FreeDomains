# isroot.in

> Free subdomains for developers 🚀

**Overview**

Welcome to **isroot.in** — developer-friendly platforms that make it simple and free to publish projects on the web. Register a subdomain, point DNS records to your hosting, and deploy using any provider or your own infrastructure.

## Quick links
- Dashboard: `https://isroot.in`
- Documentation: `docs/` (this repository)

## Why isroot.in?
isroot.in exists to remove friction and cost from getting online. Whether you are a student, hobbyist, or part of an organization, you can register a free managed subdomain and focus on building.


## Built with
- **Next.js** (site and dashboard)
- JAMstack-friendly tooling and modern hosting
- GitHub OAuth for authentication
- hCaptcha / Turnstile for bot protection

## DNS & Nameservers
- Nameservers are located in **Hyderabad**.
  - Primary: `ns1.nevercode.in` (Hyderabad)
  - Secondary: `ns2.nevercode.in` (Hyderabad)

> Note: If you manage DNS externally (Cloudflare, etc.), point your domain's nameservers to your DNS provider as instructed in the dashboard.

## Free for Developers
isroot.in  offers free subdomains for developers. By default, accounts can register up to **5** subdomains. These subdomains are intended for development, learning, and small projects.

## Get started 🚀
1. Sign in with **GitHub** at `https://isroot.in`.
2. Open **Register Domain** and choose a subdomain (e.g., `yourname.isroot.in`).
3. Use **DNS → Manage DNS** in the dashboard to add A, CNAME, TXT, or other records.

## Community & Support
- Discord: Join our community — https://dsc.gg/isroot
- GitHub Issues: https://github.com/VIGGU-7/isroot.in/issues
- Support email: `support@nevercode.in` (or open an issue for tracking)

### Abuse reporting
We take abuse seriously. Report abuse to: `reportabuse@nevercode.in`

## Contributing
Found a bug or want to improve the docs? Discuss features on Discord, then open a GitHub issue or PR.

---

## Frontend source

This repository includes the Next.js pages and components for isroot.in, including
landing, login, registration, WHOIS, dashboard, and the complete `/docs` section
(privacy, terms, and usage policy). The existing Markdown documentation in `docs/`
and its VitePress configuration are retained.

### Local development

Use Node.js 22 LTS or newer, then run:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to a public site key configured for your local
host if you need to render the CAPTCHA widget. Never add secret keys or database
credentials. Open http://localhost:3000 for the Next.js frontend.

The frontend retains its real same-origin `/api/*` requests. Backend handlers are
maintained privately and are not included. This repository contains no mock data.
API-dependent features (including login, dashboard data, WHOIS, and domain search)
require the private backend and will not work in a standalone local checkout.

```bash
npm run typecheck
npm run build
npm run docs:dev
npm run docs:build
```

The `docs:*` scripts run the existing VitePress documentation separately.
Production deployment remains in the private application repository.


**Maintainer:** Vignesh — created the site using Next.js

