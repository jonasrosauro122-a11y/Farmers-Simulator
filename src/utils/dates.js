// Small date helpers so mock data always feels "current" relative to the trainee's real day.

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatLongDate(date = new Date()) {
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function isOverdue(isoDate) {
  return Boolean(isoDate) && isoDate < todayISO();
}

export function isDueToday(isoDate) {
  return isoDate === todayISO();
}

// Whole days from today until isoDate. Returns null for non-date values like '—'.
export function daysUntil(isoDate) {
  if (!isoDate || !/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
  const ms = new Date(`${isoDate}T00:00:00`) - new Date(`${todayISO()}T00:00:00`);
  return Math.round(ms / 86400000);
}
