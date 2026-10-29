# isroot Docs

Documentation site built with Next.js, Fumadocs, MDX, and Tailwind CSS.
Configured for static Firebase Hosting on the **Spark plan**.

## Local development

Use Node.js 22 or newer (an `.nvmrc` is included):

```sh
nvm use
npm ci
npm run dev
```

Open http://localhost:3000. Documentation opens directly at `/`.
Pages live in `content/docs/`, sidebar order in `content/docs/meta.json`,
and screenshots in `public/images/`.

## Build and preview

```sh
npm run types:check
npm run build
npm start
```

The build exports the entire site to `out/`. `npm start` uses the Firebase
Hosting emulator with a local demo project, so it does not deploy anything.
The Firebase CLI runs through `npx firebase-tools`; sign-in and network access
are required for deployment, but not for the Next.js build.

Search downloads the exported `/api/search` index and runs in the browser.
Markdown and Open Graph images are generated during the build. Short Markdown
URLs such as `/getting-started.md` and `/index.md` are generated after export.
Firebase serves `/docs/*` redirects and extensionless page URLs. Unknown paths
use the exported 404 page. HTML/Markdown negotiation via the `Accept` header
requires a server and is not available in this static deployment; explicit
Markdown links and **Copy Markdown** remain available.

## Deploy to Firebase Hosting (Spark)

This setup uses static **Hosting**, not **App Hosting**. No Cloud Functions,
Cloud Run backend, Firebase client SDK, or Blaze upgrade is required. Spark
Hosting storage and traffic quotas still apply.

1. Create or select your Firebase project in the
   [Firebase console](https://console.firebase.google.com/) and open **Hosting**.
2. Authenticate and select that project from this directory:

   ```sh
   npx firebase-tools login
   npx firebase-tools use --add
   ```

   Choose the project and assign the alias `default`. This creates `.firebaserc`
   with your actual project ID. No project ID is hardcoded in this repository.
   If the project has multiple Hosting sites, configure a Hosting target before
   deploying so this documentation does not replace another website.
3. Copy `.env.example` to `.env.local` and set `SITE_URL` to your public origin,
   such as `https://YOUR_PROJECT_ID.web.app` or your verified custom domain.
   This value is baked into social image URLs at build time. It is not a secret.
4. Build and deploy:

   ```sh
   npm run deploy:firebase
   ```

   Alternatively, select the project explicitly without a local alias:

   ```sh
   npm run build
   npx firebase-tools deploy --only hosting --project YOUR_PROJECT_ID
   ```

`firebase.json` already sets the public directory to `out`, clean URLs,
redirects, and static asset headers. Do not enable a catch-all SPA rewrite:
this app exports a separate HTML page for each documentation route.
If you run `firebase init hosting`, preserve the existing configuration and
choose **No** when asked to overwrite generated files.

Before switching a custom domain, test `/`, `/connect-project`, search in the
UI, `/llms.txt`, `/llms-full.txt`, `/getting-started.md`, **Copy Markdown**,
and `/docs/getting-started` (which should redirect to `/getting-started`).
Check that an unknown URL displays a 404 and social image URLs use `SITE_URL`.

Add a custom domain in **Hosting → Add custom domain**, then copy the exact
DNS records Firebase displays to your authoritative DNS provider. Wait for
verification and HTTPS. If the public origin changes, update `SITE_URL`, rebuild,
and deploy again.

To deploy from GitHub later, use the `docs` branch of
`https://github.com/nevercode-in/FreeDomains.git`. A GitHub Actions workflow needs
an authenticated Firebase deployment identity; none is included in the repo.

References: [Firebase Hosting quickstart](https://firebase.google.com/docs/hosting/quickstart),
[Hosting configuration](https://firebase.google.com/docs/hosting/full-config),
and [Fumadocs static builds](https://www.fumadocs.dev/docs/deploying/static).
