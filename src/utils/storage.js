// Cache-backed storage layer.
//
// The whole app reads/writes state synchronously through loadLocal / saveLocal.
// This module keeps that synchronous API but transparently mirrors data to
// Supabase when it is configured:
//   - on boot, hydrateStore() fills an in-memory cache from Supabase
//   - loadLocal() reads the cache (then localStorage, then the fallback)
//   - saveLocal() updates the cache + localStorage immediately and schedules a
//     debounced write-through to Supabase
//
// "Shared" keys live in the app_state table (one shared training dataset that
// every signed-in trainee sees). "User" keys live in user_state, scoped to the
// signed-in trainee's id. If Supabase is not configured, everything falls back
// to localStorage and the app works exactly as before.

import { getSupabase } from '../lib/supabaseClient.js';

// full localStorage key -> { scope, name (column value used in Supabase) }
const KEY_MAP = {
  'apexCrm3.leads':        { scope: 'shared', name: 'leads' },
  'apexCrm3.depot':        { scope: 'shared', name: 'depot' },
  'apexCrm3.claimed':      { scope: 'shared', name: 'claimed' },
  'apexCrm3.accounts':     { scope: 'shared', name: 'accounts' },
  'apexCrm3.tasks':        { scope: 'shared', name: 'tasks' },
  'apexCrm3.alerts':       { scope: 'shared', name: 'alerts' },
  'apexCrm3.campaigns':    { scope: 'shared', name: 'campaigns' },
  'apexCrm3.book':         { scope: 'shared', name: 'book' },
  'apexCrm3.quoteIntakes': { scope: 'shared', name: 'quoteIntakes' },
  'apexCrm3.serviceRequests': { scope: 'shared', name: 'serviceRequests' },
  'apexCrm3.widgets':        { scope: 'user', name: 'widgets' },
  'apexCrm3.recentReports':  { scope: 'user', name: 'recentReports' },
  'apexCrm3.stickyNote':     { scope: 'user', name: 'stickyNote' },
  'apexCrm3.training':       { scope: 'user', name: 'training' },
  'apexCrm3.scenarioScores': { scope: 'user', name: 'scenarioScores' }
};

const NAME_TO_KEY = {};
Object.entries(KEY_MAP).forEach(([fullKey, meta]) => {
  NAME_TO_KEY[`${meta.scope}:${meta.name}`] = fullKey;
});

const memCache = {};
const pushTimers = {};
let activeUserId = null;

export function loadLocal(key, fallback) {
  if (Object.prototype.hasOwnProperty.call(memCache, key)) return memCache[key];
  try {
    const saved = localStorage.getItem(key);
    if (saved != null) {
      const parsed = JSON.parse(saved);
      memCache[key] = parsed;
      return parsed;
    }
  } catch {
    // ignore
  }
  return fallback;
}

export function saveLocal(key, value) {
  memCache[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be disabled in private browsing; the app still works in memory.
  }
  schedulePush(key, value);
}

function schedulePush(key, value) {
  const supabase = getSupabase();
  const meta = KEY_MAP[key];
  if (!supabase || !meta) return;
  if (meta.scope === 'user' && !activeUserId) return;
  window.clearTimeout(pushTimers[key]);
  pushTimers[key] = window.setTimeout(() => {
    pushKey(value, meta).catch((error) => console.error('Supabase sync failed for', key, error));
  }, 500);
}

async function pushKey(value, meta) {
  const supabase = getSupabase();
  if (!supabase) return;
  if (meta.scope === 'shared') {
    await supabase
      .from('app_state')
      .upsert(
        { key: meta.name, data: value, updated_at: new Date().toISOString(), updated_by: activeUserId },
        { onConflict: 'key' }
      );
  } else {
    await supabase
      .from('user_state')
      .upsert(
        { user_id: activeUserId, key: meta.name, data: value, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,key' }
      );
  }
}

function setCacheFromDb(scope, name, data) {
  const fullKey = NAME_TO_KEY[`${scope}:${name}`];
  if (!fullKey) return;
  memCache[fullKey] = data;
  try {
    localStorage.setItem(fullKey, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// Pull shared + per-user state from Supabase into the cache before the app mounts.
export async function hydrateStore(userId) {
  activeUserId = userId || null;
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const { data: shared, error: sharedError } = await supabase.from('app_state').select('key,data');
    if (!sharedError && Array.isArray(shared)) {
      shared.forEach((row) => setCacheFromDb('shared', row.key, row.data));
    }
    if (activeUserId) {
      const { data: mine, error: mineError } = await supabase
        .from('user_state')
        .select('key,data')
        .eq('user_id', activeUserId);
      if (!mineError && Array.isArray(mine)) {
        mine.forEach((row) => setCacheFromDb('user', row.key, row.data));
      }
    }
  } catch (error) {
    console.error('Supabase hydrate failed; falling back to local data.', error);
  }
}

export function setActiveUser(userId) {
  activeUserId = userId || null;
}

// Used by the "reset demo data" action for keys that should be wiped rather than reseeded.
export async function clearStoreKeys(keys) {
  const supabase = getSupabase();
  for (const key of keys) {
    delete memCache[key];
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
    const meta = KEY_MAP[key];
    if (!supabase || !meta) continue;
    try {
      if (meta.scope === 'shared') {
        await supabase.from('app_state').delete().eq('key', meta.name);
      } else if (activeUserId) {
        await supabase.from('user_state').delete().eq('user_id', activeUserId).eq('key', meta.name);
      }
    } catch (error) {
      console.error('Supabase reset failed for', key, error);
    }
  }
}

export function nextId(prefix, collection) {
  const max = collection.reduce((highest, item) => {
    const numeric = Number(String(item.id || '').replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) ? Math.max(highest, numeric) : highest;
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}
