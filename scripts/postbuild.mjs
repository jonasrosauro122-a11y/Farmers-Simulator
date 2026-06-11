import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const index = join(dist, 'index.html');
const notFound = join(dist, '404.html');

if (existsSync(index)) {
  copyFileSync(index, notFound);
}

// Netlify SPA fallback. netlify.toml also handles this; this file makes drag-and-drop deploys safer.
writeFileSync(join(dist, '_redirects'), '/* /index.html 200\n');

// Prevent GitHub Pages from processing files with Jekyll.
writeFileSync(join(dist, '.nojekyll'), '');
