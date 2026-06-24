# Connecting the LAVA Insurance CRM Simulator to Supabase

The app now uses **real Supabase Auth** for login and stores its data in Supabase.
The model you chose:

- **One shared training dataset** (leads, accounts, tasks, alerts, customers,
  policies, quote intakes, campaigns) that every signed-in trainee sees and edits.
- **Per-trainee progress** (training checklist, scenario scores, sticky note,
  dashboard layout) scoped privately to each account.

If no Supabase keys are present, the app still runs in a **local preview mode**
(data stays in the browser) so you can demo it before wiring up the backend.

## 1. Create a Supabase project
1. Go to https://supabase.com, sign in, and create a new project.
2. Wait for it to finish provisioning.

## 2. Create the tables
1. In your project, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
   This creates `app_state` (shared) and `user_state` (per-user) with the right
   Row Level Security policies.

## 3. Add your keys
1. In Supabase go to **Settings → API** and copy:
   - **Project URL**
   - **anon public** key
2. In the project root, copy `.env.example` to `.env` and fill them in:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Restart the dev server (`npm run dev`) so Vite picks up the new variables.

The `anon` key is meant to be used in the browser; access is controlled by the
RLS policies, not by hiding the key. Your `.env` file is git-ignored.

## 4. Auth settings (recommended for training)
By default Supabase requires email confirmation before a new account can sign in.
For a fast training setup you can turn that off:

- **Authentication → Providers → Email →** turn **Confirm email** off.

With it off, creating an account signs the trainee straight in. With it on,
trainees get a confirmation email first (you'll need an email provider configured
under **Authentication → Emails** for delivery), and the password-reset link works too.

## 5. Deploy (Netlify)
Set the same two variables in **Site settings → Environment variables**:
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Build command `npm run build`,
publish directory `dist` (already in `netlify.toml`).

## How it works under the hood
- `src/lib/supabaseClient.js` creates the client from the env vars (or returns
  `null`, which triggers local preview mode).
- `src/utils/storage.js` keeps the app's synchronous `loadLocal` / `saveLocal`
  API but mirrors every change to Supabase: shared keys go to `app_state`,
  per-user keys go to `user_state`. On boot it hydrates an in-memory cache from
  Supabase before the workspace mounts.
- `src/App.jsx` holds the auth gate: it resolves the Supabase session, hydrates,
  then mounts the workspace. Sign-out and profile edits go through Supabase Auth.

### Note on the data shape
Each collection is stored as a JSON document (one row per collection), which
mirrors how the app already saves whole collections at once. If you later want
per-record SQL querying or reporting inside Supabase, the collections can be
normalized into dedicated tables — say the word and that can be added.
