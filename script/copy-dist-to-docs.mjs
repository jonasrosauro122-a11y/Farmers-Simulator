import { cpSync, existsSync, rmSync } from 'node:fs';

if (!existsSync('dist')) {
  throw new Error('dist folder not found. Run npm run build first.');
}

rmSync('docs', { recursive: true, force: true });
cpSync('dist', 'docs', { recursive: true });
console.log('Copied dist/ to docs/ for GitHub Pages manual publishing.');
