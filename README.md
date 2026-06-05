# APEX Insurance CRM Training Simulator

A React + Vite insurance CRM navigation simulator for VA/CSR training.

## Run locally

```bash
npm install
npm run dev
```

## Build for Netlify

```bash
npm install
npm run build
```

Upload/publish the `dist` folder, or connect this GitHub repo to Netlify with:

- Build command: `npm run build`
- Publish directory: `dist`

## GitHub Pages

This project is configured so the same production build works on GitHub Pages and Netlify.

Recommended GitHub Pages setup:

1. Upload/push the full source code to your repository.
2. Go to **Settings > Pages**.
3. Set Source to **GitHub Actions**.
4. Push to `main` or manually run the workflow named **Deploy APEX CRM Simulator to GitHub Pages**.

Manual GitHub Pages setup:

```bash
npm install
npm run build:github
```

Then set **Settings > Pages** to:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/docs`

## Notes

- The app uses localStorage only.
- Do not enter real client or policy information.
- The production asset base is relative (`./`) to avoid blank pages on nested GitHub Pages URLs.
