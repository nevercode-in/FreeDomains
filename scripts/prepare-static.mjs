import { copyFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

// Keep short Markdown URLs without a request-time Next.js proxy.
const contentRoot = path.resolve('out/llms.mdx/docs');

async function copyMarkdown(directory, slugs = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await copyMarkdown(file, [...slugs, entry.name]);
    } else if (entry.name === 'content.md') {
      const target = path.resolve('out', `${slugs.length ? slugs.join('/') : 'index'}.md`);
      await copyFile(file, target);
    }
  }
}

await copyMarkdown(contentRoot);
for (const file of ['out/index.html', 'out/404.html', 'out/api/search', 'out/llms.txt', 'out/llms-full.txt']) {
  if (!(await stat(file)).isFile()) throw new Error(`Missing static output: ${file}`);
}
console.log('Firebase Hosting output ready in out/ (including search and Markdown).');
