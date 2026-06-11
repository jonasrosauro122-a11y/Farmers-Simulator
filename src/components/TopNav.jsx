import { useEffect, useMemo, useRef, useState } from 'react';

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

const MAX_VISIBLE_BEFORE_MORE = navItems.findIndex((item) => item.id === 'calendar');
const MIN_VISIBLE_ITEMS = 8;

function estimateTabWidth(item, unreadAlerts) {
  const labelWidth = item.label.length * 6.25;
  const dropdownWidth = item.dropdown ? 18 : 0;
  const badgeWidth = item.id === 'alerts' && unreadAlerts > 0 ? 22 : 0;
  return Math.ceil(22 + labelWidth + dropdownWidth + badgeWidth);
}

export default function TopNav({ currentPage, onNavigate, unreadAlerts, onSpecialAction, trainee, onLogout }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openMoreChild, setOpenMoreChild] = useState(null);
  const [visibleCount, setVisibleCount] = useState(MAX_VISIBLE_BEFORE_MORE);
  const navRef = useRef(null);
  const tabRowRef = useRef(null);

  useEffect(() => {
    if (!openMenu) return undefined;
    const onDocClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
        setOpenMoreChild(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openMenu]);

  useEffect(() => {
    const calculateVisibleTabs = () => {
      const row = tabRowRef.current;
      if (!row) return;

      const reserveForApexAndMore = 150;
      const available = Math.max(360, row.clientWidth - reserveForApexAndMore);
      const maxVisible = Math.min(MAX_VISIBLE_BEFORE_MORE, navItems.length);
      let used = 0;
      let count = 0;

      for (let index = 0; index < maxVisible; index += 1) {
        const itemWidth = estimateTabWidth(navItems[index], unreadAlerts);
        if (count >= MIN_VISIBLE_ITEMS && used + itemWidth > available) break;
        used += itemWidth;
        count += 1;
      }

      setVisibleCount(Math.max(Math.min(count, maxVisible), Math.min(MIN_VISIBLE_ITEMS, maxVisible)));
    };

    calculateVisibleTabs();
    const observer = new ResizeObserver(calculateVisibleTabs);
    if (tabRowRef.current) observer.observe(tabRowRef.current);
    window.addEventListener('resize', calculateVisibleTabs);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', calculateVisibleTabs);
    };
  }, [unreadAlerts]);

  const visibleItems = useMemo(() => navItems.slice(0, visibleCount), [visibleCount]);
  const moreItems = useMemo(() => navItems.slice(visibleCount), [visibleCount]);

  const handleLabelClick = (item) => {
    setOpenMenu(null);
    setOpenMoreChild(null);
    onNavigate(item.id);
  };

  const handleArrowClick = (event, item) => {
    event.stopPropagation();
    if (!item.dropdown) return;
    setOpenMoreChild(null);
    setOpenMenu(openMenu === item.id ? null : item.id);
  };

  const handleMoreClick = (event) => {
    event.stopPropagation();
    setOpenMenu(openMenu === 'more' ? null : 'more');
    setOpenMoreChild(null);
  };

  const handleMoreChildClick = (event, item) => {
    event.stopPropagation();
    if (!item.dropdown) return;
    setOpenMoreChild(openMoreChild === item.id ? null : item.id);
  };

  const handleSubClick = (sub) => {
    setOpenMenu(null);
    setOpenMoreChild(null);
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

  const moreHasActiveItem = moreItems.some((item) => isActive(item));

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
        <div className="nav-scroll farmers-nav-scroll" ref={tabRowRef}>
          {visibleItems.map((item) => (
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

        {moreItems.length > 0 && (
          <div className="nav-item-wrap farmers-nav-item-wrap farmers-more-wrap">
            <div className={`nav-combo farmers-more-combo ${moreHasActiveItem ? 'active' : ''}`}>
              <button
                className="nav-item nav-label farmers-more-button"
                aria-haspopup="menu"
                aria-expanded={openMenu === 'more'}
                onClick={handleMoreClick}
              >
                More <span className="farmers-more-caret">▾</span>
              </button>
            </div>
            {openMenu === 'more' && (
              <div className="dropdown-menu farmers-dropdown farmers-more-dropdown" role="menu">
                {moreItems.map((item) => (
                  <div className="farmers-more-group" key={`more-${item.id}`}>
                    <div className={`farmers-more-row ${isActive(item) ? 'active' : ''}`}>
                      <button className="farmers-more-label" role="menuitem" onClick={() => handleLabelClick(item)}>
                        {item.label}
                      </button>
                      {item.dropdown && (
                        <button
                          className="farmers-more-row-arrow"
                          aria-label={`Show ${item.label} quick actions`}
                          aria-expanded={openMoreChild === item.id}
                          onClick={(event) => handleMoreChildClick(event, item)}
                        >
                          {openMoreChild === item.id ? '▾' : '▸'}
                        </button>
                      )}
                    </div>
                    {openMoreChild === item.id && item.dropdown && (
                      <div className="farmers-more-submenu">
                        {item.dropdown.map((sub) => (
                          <button key={`more-${item.id}-${sub.id}`} role="menuitem" onClick={() => handleSubClick(sub)}>
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <button className="pencil-button farmers-pencil" title="Customize home page" onClick={() => onNavigate('custom-home')}>✎</button>
      </nav>
    </header>
  );
}
