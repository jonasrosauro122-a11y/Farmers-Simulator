export function loadLocal(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local storage may be disabled in private browsing. The app still works in memory.
  }
}

export function nextId(prefix, collection) {
  const max = collection.reduce((highest, item) => {
    const numeric = Number(String(item.id || '').replace(/[^0-9]/g, ''));
    return Number.isFinite(numeric) ? Math.max(highest, numeric) : highest;
  }, 0);
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
}
