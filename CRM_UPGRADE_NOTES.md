# LAVA Insurance CRM Simulator — CRM Upgrade Notes

This pass focused on making the simulator behave like a working CRM rather than a set
of static pages: persisted records, shared workflows, interactive alerts, and no dead
buttons. The existing design, theme, layout, and navigation were preserved — this is an
improvement on the current project, not a rebuild.

All data remains dummy/training-safe. No real Farmers branding, real policy numbers,
real customer names, or real account numbers are used.

## Summary of changes

**Service Requests are now real, persisted, and shared.**
Previously the Service Requests list was static and the Service Ops "Create" form wrote
to throwaway local state, so nothing persisted and the two pages didn't agree. Service
requests are now a first-class collection in app state:
- Create from either the Service Requests page (new modal) or Service Ops — both write to
  the same shared collection.
- Change status (Open / In Process / Closed), assign an owner, and add timestamped notes.
- Create a follow-up task from a request; link out to Customer Info or Policies.
- Everything persists across refresh (localStorage, or Supabase when configured).

**Alerts are fully interactive.**
- Quick filters: All, Unread, New, In Process, Completed, Critical, Personal Lines,
  Commercial Lines, Billing — plus free-text search and the category filter from the URL.
- Click an alert to open a detail panel with an explicit status workflow
  (New / In Process / Completed), assign-to dropdown, and link-to-customer / link-to-billing.
- Create a task from an alert; mark one or all read. Seeded with several dummy alerts
  across lines and categories so the workflows are visible immediately.

**Agency News & Resources cards are clickable with real detail content.**
Every update, rate/rule, and resource card now opens a detail panel with dummy training
content (overview, bullet workflow, escalation reminder, and a link to the related page),
instead of firing a generic toast. Added Personal Lines, Commercial Lines, Training,
Underwriting, and Manuals/Product-Guide resource libraries.

**Personal & Commercial Lines portals** already supported policy detail, coverages,
endorsement/change requests (address, driver, vehicle, COI, additional insured, waiver of
subrogation, etc.), document creation, activity logging, billing links, and the
non-licensed-VA compliance reminder — these were verified and left intact.

**Persistence + Supabase.** The new `serviceRequests` collection was added to the storage
layer's key map, so it syncs to Supabase (shared `app_state`) when configured and falls
back to localStorage otherwise. Local preview mode is unaffected; Supabase is not required
to run the app.

**Build hygiene.** Removed stray junk files that shipped in the upload (`download`,
`download (1)`, duplicate `script/` dir, `.github/git`, `supabase/dfd`, stale `dist`/`docs`).
Added `vercel.json` for SPA routing. `npm run build` and `npm run lint` both pass with no
errors.

## Files changed

Added:
- `vercel.json` — SPA rewrites + build config for Vercel.
- `.env.example` — copy of `env.example` with the conventional dotfile name.
- `CRM_UPGRADE_NOTES.md` — this file.

Modified:
- `src/App.jsx` — added `serviceRequests` state, persistence, and handlers
  (`addServiceRequest`, `updateServiceRequest`, `addServiceRequestNote`); added
  `updateAlert` and an assignee list; enriched `createTrainingAlert`; wired new props into
  Service Requests, Service Ops, and Alerts; reset includes service requests.
- `src/utils/storage.js` — registered `apexCrm3.serviceRequests` as a shared key.
- `src/data/alerts.js` — added status/line/account/assignedTo/linkedTo fields and several
  dummy alerts; exported `ALERT_STATUSES`.
- `src/pages/ServiceRequestsPage.jsx` — rewritten to use the shared collection with create
  modal, status/owner controls, notes, task creation, and customer/policy links.
- `src/pages/ServiceOpsPage.jsx` — now reads/writes the shared service-request collection.
- `src/pages/AlertsPage.jsx` — quick filters, status workflow, assign, link, task creation.
- `src/pages/AgencyResourcesPage.jsx` — clickable cards open detail panels with dummy content.
- `src/styles.css` — styles for service-request notes, alert row/status states, clickable
  resource cards.

Removed: `download`, `download (1)`, `public/download`, `dist/`, `docs/`, `script/`,
`.github/git`, `supabase/dfd`.

## Setup steps — Vercel

1. Push this project to a Git repo (GitHub/GitLab/Bitbucket) and import it in Vercel,
   or run `vercel` from the project root with the Vercel CLI.
2. Framework preset: **Vite**. Build command `npm run build`, output directory `dist`
   (already set in `vercel.json`, which also adds the SPA rewrite so deep links like
   `/service-requests` work on refresh).
3. To enable real auth + shared cloud data, add Environment Variables in
   **Project → Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   Redeploy after adding them. Without these, the app runs in local-preview mode.

## Setup steps — Supabase

1. Create a Supabase project.
2. In **SQL Editor**, run the contents of `supabase/schema.sql`. It creates the shared
   `app_state` table and the per-user `user_state` table with Row Level Security for
   authenticated users. The new service-requests data is stored as a key in `app_state`,
   so no schema change is needed for it.
3. In **Settings → API**, copy the Project URL and the `anon` public key into a local
   `.env` (see `.env.example`) and/or your Vercel env vars.
4. Recommended for training: **Authentication → Providers → Email →** turn off
   "Confirm email" so trainees can sign in immediately after signup.
5. Only the `anon` key is used in the frontend. Do not put the service-role key in the
   client.

See `SUPABASE_SETUP.md` for the full walkthrough.

## Run / test

```
npm install      # or npm ci
npm run build    # passes
npm run lint     # passes (0 errors)
npm run dev      # local dev
npm run preview  # serve the production build
```

## Remaining limitations

- **Storage model is JSON-document (Option A), not normalized tables.** Collections are
  stored as JSON in `app_state` / `user_state`, which mirrors how the app saves whole
  collections and was the lowest-risk way to add persistence without rewriting every page.
  The normalized `crm_*` tables option is not implemented; it can be added later if you
  want per-record SQL querying/reporting inside Supabase.
- **Simulated actions.** Document open/download, "send billing reminder", COI issuance,
  payments, and similar carrier actions are simulated and surface a toast — by design, this
  is a training sandbox with no live carrier or payment integration.
- **Shared dataset.** When Supabase is configured, CRM records are shared across all
  signed-in trainees (per the chosen model). Per-trainee progress (training, scores, sticky
  note, layout) stays private.
- **Real-time sync** between simultaneously-open sessions isn't enabled; a refresh picks up
  other trainees' changes. Supabase Realtime could be added later.
- **Some secondary nav destinations** (Opportunities, Claims, Calendar, Workable Lists,
  Account Tags, Preference Center) remain intentional placeholder pages, kept clickable so
  there are no broken routes.
- Personal/Commercial Lines policy detail uses whatever dummy policies exist on each
  account; accounts created mid-session start with a single training policy.
