import { useEffect, useRef, useState } from 'react';

// Dashboard-first navigation modeled after the Farmers/APEX Salesforce-style tab bar.
// Label clicks navigate. Arrow clicks open the requested quick-create menu.
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'leads', label: 'Leads', dropdown: [{ id: 'new-lead', label: '+ New Lead', special: true }] },
  { id: 'lead-depot', label: 'Lead Depot' },
  { id: 'reports-hub', label: 'Reports Hub' },
  { id: 'accounts', label: 'Accounts', dropdown: [{ id: 'accounts-new', label: '+ New Account', special: true }] },
  { id: 'tasks', label: 'Tasks', dropdown: [
    { id: 'tasks:today', label: 'Due Today' },
    { id: 'tasks:overdue', label: 'Overdue' },
    { id: 'tasks:agency', label: 'Agency Tasks' }
  ] },
  { id: 'reports', label: 'Reports', dropdown: [
    { id: 'reports-hub', label: 'Reports Hub' },
    { id: 'report:lead-conversion', label: 'Lead Conversion' },
    { id: 'report:renewal', label: 'Renewal Report' },
    { id: 'analytics', label: 'APEX Analytics' }
  ] },
  { id: 'alerts-hub', label: 'Alerts Hub' },
  { id: 'alerts', label: 'Alerts', dropdown: [{ id: 'new-alert', label: '+ New Alert', special: true }] },
  { id: 'custom-home', label: 'Custom Home Page' },
  { id: 'analytics', label: 'APEX Analytics' },
  { id: 'lead-import', label: 'Agency Lead Import' },
  { id: 'direct-mail', label: 'Direct Mail' },
  { id: 'opportunities', label: 'Opportunities', dropdown: [{ id: 'leads', label: 'Open Opportunities' }, { id: 'new-lead', label: '+ New Opportunity', special: true }] },
  { id: 'insurance-policies', label: 'Insurance Policies', dropdown: [{ id: 'accounts', label: 'Policy List' }, { id: 'report:policy-summary', label: 'Policy Summary Report' }] },
  { id: 'claims', label: 'Claims', dropdown: [{ id: 'alerts:Claims', label: 'Claims Alerts' }, { id: 'training', label: 'Claims Training' }] },
  { id: 'calendar', label: 'Calendar', dropdown: [{ id: 'tasks:today', label: 'Today\'s Work' }, { id: 'tasks', label: 'All Tasks' }] },
  { id: 'workable-lists', label: 'Workable Lists', dropdown: [{ id: 'reports-hub', label: 'Open Lists' }, { id: 'report:open-tasks', label: 'Open Tasks' }] },
  { id: 'account-tags', label: 'Account Tags', dropdown: [{ id: 'accounts', label: 'Tagged Accounts' }] },
  { id: 'preference-center', label: 'Preference Center', dropdown: [{ id: 'settings', label: 'Simulator Preferences' }] }
];

const utilityButtons = [
  { label: 'Favorites', icon: '☆' },
  { label: 'Global actions', icon: '＋' },
  { label: 'Help', icon: '?' },
  { label: 'Setup', icon: '⚙' },
  { label: 'Notifications', icon: '🔔' }
];

export default function TopNav({ currentPage, onNavigate, unreadAlerts, onSpecialAction, trainee, onLogout }) {
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onDocClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openMenu]);

  const handleLabelClick = (item) => {
    setOpenMenu(null);
    onNavigate(item.id);
  };

  const handleArrowClick = (event, item) => {
    event.stopPropagation();
    if (!item.dropdown) return;
    setOpenMenu(openMenu === item.id ? null : item.id);
  };

  const handleSubClick = (sub) => {
    setOpenMenu(null);
    if (sub.special) {
      onSpecialAction(sub.id);
      return;
    }
    onNavigate(sub.id);
  };

  const isActive = (item) => (
    currentPage === item.id ||
    (item.id === 'leads' && currentPage === 'lead-detail') ||
    (item.id === 'accounts' && currentPage === 'account-detail') ||
    (item.id === 'alerts' && currentPage === 'alerts-hub')
  );

  return (
    <header className="top-shell farmers-top-shell">
      <div className="farmers-utility-row">
        <button className="app-launcher farmers-launcher" title="App launcher" onClick={() => onNavigate('home')}>
          <span /> <span /> <span /> <span /> <span /> <span /> <span /> <span /> <span />
        </button>
        <button className="farmers-brand" onClick={() => onNavigate('home')} title="Farmers/APEX Training Simulator">
          <span className="brand-mark">⌂</span>
          <span className="brand-copy"><strong>FARMERS</strong><em>INSURANCE</em></span>
        </button>
        <div className="farmers-search-area">
          <select aria-label="Search scope" defaultValue="all">
            <option value="all">Search: All</option>
            <option value="accounts">Accounts</option>
            <option value="leads">Leads</option>
            <option value="policies">Policies</option>
          </select>
          <input aria-label="Global search" placeholder="Search..." onKeyDown={(event) => { if (event.key === 'Enter') onNavigate('reports-hub'); }} />
        </div>
        <div className="farmers-utility-actions">
          {utilityButtons.map((button) => (
            <button key={button.label} title={button.label} onClick={() => onNavigate(button.label === 'Setup' ? 'settings' : 'home')}>
              {button.icon}
              {button.label === 'Notifications' && unreadAlerts > 0 && <span>{unreadAlerts}</span>}
            </button>
          ))}
          {trainee && (
            <button className="farmers-user" title={`${trainee.displayName} · ${trainee.batch}`} onClick={() => onNavigate('settings')}>
              {trainee.initials || 'JR'}
            </button>
          )}
          {onLogout && <button className="farmers-logout" title="Log out trainee" onClick={onLogout}>↪</button>}
        </div>
      </div>

      <nav className="top-nav farmers-tab-row" aria-label="Main navigation" ref={navRef}>
        <div className="brand apex-brand" onClick={() => onNavigate('home')} title="APEX">APEX</div>
        <div className="nav-scroll farmers-nav-scroll">
          {navItems.map((item) => (
            <div className="nav-item-wrap farmers-nav-item-wrap" key={item.id}>
              <div className={`nav-combo ${isActive(item) ? 'active' : ''}`}>
                <button className="nav-item nav-label" onClick={() => handleLabelClick(item)}>
                  {item.label}
                  {item.id === 'alerts' && unreadAlerts > 0 && <span className="nav-badge">{unreadAlerts}</span>}
                </button>
                {item.dropdown && (
                  <button
                    className="nav-arrow"
                    aria-label={`Open ${item.label} quick actions`}
                    aria-haspopup="menu"
                    aria-expanded={openMenu === item.id}
                    onClick={(event) => handleArrowClick(event, item)}
                  >
                    ▾
                  </button>
                )}
              </div>
              {openMenu === item.id && item.dropdown && (
                <div className="dropdown-menu farmers-dropdown" role="menu">
                  {item.dropdown.map((sub) => (
                    <button key={`${item.id}-${sub.id}`} role="menuitem" onClick={() => handleSubClick(sub)}>{sub.label}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="pencil-button farmers-pencil" title="Customize home page" onClick={() => onNavigate('custom-home')}>✎</button>
      </nav>
    </header>
  );
}
