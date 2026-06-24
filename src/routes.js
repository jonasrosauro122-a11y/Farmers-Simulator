// Central mapping between the simulator's internal page ids and real browser URLs.
// The whole app navigates with internal ids ("leads", "tasks:today", "report:renewal");
// these helpers translate those ids to/from the URL so deep links and refresh work.

// Internal page id -> canonical URL path.
export const PAGE_TO_PATH = {
  home: '/dashboard',
  leads: '/leads',
  'lead-depot': '/lead-depot',
  accounts: '/accounts',
  customers: '/customers',
  tasks: '/tasks',
  reports: '/reports',
  'reports-hub': '/reports-hub',
  alerts: '/alerts',
  'alerts-hub': '/alerts-hub',
  'service-requests': '/service-requests',
  analytics: '/analytics',
  'lead-import': '/agency-lead-import',
  'direct-mail': '/direct-mail',
  'custom-home': '/custom-home-page',
  training: '/training-center',
  scenarios: '/scenarios',
  'product-learning': '/product-learning',
  'quote-center': '/quote-center',
  policies: '/policies',
  'personal-lines': '/personal-lines',
  'commercial-lines': '/commercial-lines',
  settings: '/settings',
  login: '/login',
  // Placeholder workspaces kept clickable from the nav.
  opportunities: '/opportunities',
  'insurance-policies': '/policies',
  claims: '/claims',
  calendar: '/calendar',
  'workable-lists': '/workable-lists',
  'account-tags': '/account-tags',
  'preference-center': '/preference-center'
};

// Convert an internal navigation target ("page" or "page:param") into a URL path.
export function targetToPath(target) {
  const [page, param = ''] = String(target).split(':');
  if (page === 'report') return param ? `/reports/${encodeURIComponent(param)}` : '/reports';
  if (param && page === 'tasks') return `/tasks/${encodeURIComponent(param)}`;
  if (param && page === 'alerts') return `/alerts/${encodeURIComponent(param)}`;
  if (param && page === 'reports') return `/reports/${encodeURIComponent(param)}`;
  return PAGE_TO_PATH[page] || '/dashboard';
}

// First URL segment -> resolver that returns the internal page state.
const FIRST_SEGMENT = {
  '': () => ({ page: 'home' }),
  dashboard: () => ({ page: 'home' }),
  leads: (id) => (id ? { page: 'lead-detail', leadId: id } : { page: 'leads' }),
  'lead-depot': () => ({ page: 'lead-depot' }),
  accounts: (id) => (id ? { page: 'account-detail', accountId: id } : { page: 'accounts' }),
  customers: () => ({ page: 'customers' }),
  tasks: (param) => ({ page: 'tasks', param }),
  reports: (param) => ({ page: 'reports', param }),
  'reports-hub': () => ({ page: 'reports-hub' }),
  alerts: (param) => ({ page: 'alerts', param }),
  'alerts-hub': () => ({ page: 'alerts-hub' }),
  'service-requests': () => ({ page: 'service-requests' }),
  analytics: () => ({ page: 'analytics' }),
  'agency-lead-import': () => ({ page: 'lead-import' }),
  'direct-mail': () => ({ page: 'direct-mail' }),
  'custom-home-page': () => ({ page: 'custom-home' }),
  'training-center': () => ({ page: 'training' }),
  scenarios: () => ({ page: 'scenarios' }),
  'product-learning': () => ({ page: 'product-learning' }),
  'quote-center': () => ({ page: 'quote-center' }),
  policies: () => ({ page: 'policies' }),
  'personal-lines': () => ({ page: 'personal-lines' }),
  'commercial-lines': () => ({ page: 'commercial-lines' }),
  settings: () => ({ page: 'settings' }),
  login: () => ({ page: 'login' }),
  opportunities: () => ({ page: 'opportunities' }),
  claims: () => ({ page: 'claims' }),
  calendar: () => ({ page: 'calendar' }),
  'workable-lists': () => ({ page: 'workable-lists' }),
  'account-tags': () => ({ page: 'account-tags' }),
  'preference-center': () => ({ page: 'preference-center' })
};

// Convert a URL pathname into the internal page state used by the renderer.
export function pathToState(pathname) {
  const segments = String(pathname).split('/').filter(Boolean);
  const first = segments[0] || '';
  const second = segments[1] ? decodeURIComponent(segments[1]) : '';
  const resolver = FIRST_SEGMENT[first];
  if (!resolver) return { page: 'not-found' };
  return { param: '', ...resolver(second) };
}
