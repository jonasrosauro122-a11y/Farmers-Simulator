# Deployment

## Netlify

1. Upload or connect this project folder to Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`

`netlify.toml` already includes the SPA fallback redirect so direct page refreshes work correctly.

## Local Preview

```bash
npm install
npm run build
npm run preview
```
