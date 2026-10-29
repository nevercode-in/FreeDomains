# isroot Docs

Documentation site built with Next.js, Fumadocs, MDX, and Tailwind CSS.

## Local development

Use Node.js 22 or newer (an `.nvmrc` is included):

```sh
nvm use
npm install
npm run dev
```

Open http://localhost:3000. Documentation opens directly at `/`, with guides at `/getting-started` and `/dns-manage`.

## Edit documentation

Pages live in `content/docs/`. Edit MDX files and order the sidebar in
`content/docs/meta.json`. Screenshots live in `public/images/`.
The initial content was migrated from `isroot.in-public-repo/docs` and retains
its beta status; review platform limits and provider availability before publishing.

## Validate and run production

```sh
npm run types:check
npm run build
npm start
```
