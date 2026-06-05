# APEX Insurance CRM Training Simulator

A Salesforce/APEX-style insurance CRM **simulator** built with React 18 + Vite, designed for
navigation and workflow training of VAs, CSRs, producers, and agency staff.

> ⚠️ Training simulator only. All names, policies, premiums, and contact details are fictional.
> Never enter real customer data. Non-licensed staff must not give coverage advice, bind coverage,
> quote without approval, or interpret policy coverage.

## Run it

```bash
npm install
npm run dev      # local dev server
npm run build    # production build (Netlify-ready, outputs to dist/)
npm run preview  # preview the production build
```

Deploys to Netlify out of the box (`netlify.toml` includes the SPA redirect and `dist` publish dir).

## Modules

- **Home** — greeting, sticky note, service alerts, tasks due today, news, birthdays, recommendations
- **Leads** — search/filter, six-stage status pipeline, add/edit, notes, assign task, convert to account
- **Lead Depot** — unassigned lead pool with LOB/state/priority/source filters, claim flow, claimed history
- **Accounts** — list + detail with Household, Policies, Billing, Claims, Documents, Activity, Tasks tabs
- **Tasks** — My / Agency / High Priority / Due Today / Overdue / Completed views with search
- **Reports Hub & Reports** — searchable catalog, recently viewed, 8 live-computed reports, CSV export
- **Alerts Hub & Alerts** — 7 categories, mark read/unread, detail modal, create task from alert
- **APEX Analytics** — KPI cards and bar charts computed live from simulator data
- **Agency Lead Import** — CSV textarea or file upload with validation and preview
- **Direct Mail** — campaign wizard (audience → template → preview) with Draft/Scheduled/Sent statuses
- **Custom Home Page** — toggle and reorder dashboard widgets, reset to default
- **Training Center** — module guide, 9 VA scenarios with saved checklists, mock assessment quiz
- **Utility bar** — Account Lookup, Report Suspicious Activity, Quick Links, Privacy Notice

## Data & persistence

All records live in `src/data/` (leads, accounts, tasks, alerts, reports, campaigns, users, content)
and persist to `localStorage` under `apexCrm2.*` keys. Use **More → Reset Demo Data** (or Settings)
to restore the default training dataset.
