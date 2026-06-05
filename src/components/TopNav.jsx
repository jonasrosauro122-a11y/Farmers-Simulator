import { useEffect, useRef, useState } from 'react';

// Top navigation modeled on a Salesforce/APEX-style CRM tab bar.
const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'leads', label: 'Leads', dropdown: [
    { id: 'leads', label: 'All Leads' },
    { id: 'new-lead', label: 'New Lead', special: true },
    { id: 'lead-depot', label: 'Lead Depot Queue' },
    { id: 'lead-import', label: 'Import Leads' }
  ] },
  { id: 'lead-depot', label: 'Lead Depot' },
  { id: 'reports-hub', label: 'Reports Hub' },
  { id: 'accounts', label: 'Accounts', dropdown: [
    { id: 'accounts', label: 'All Accounts' },
    { id: 'accounts-new', label: 'New Account', special: true },
    { id: 'report:policy-summary', label: 'Policy Summary Report' }
  ] },
  { id: 'tasks', label: 'Tasks', dropdown: [
    { id: 'tasks', label: 'All Tasks' },
    { id: 'tasks:today', label: 'Due Today' },
    { id: 'tasks:overdue', label: 'Overdue' },
    { id: 'tasks:agency', label: 'Agency Tasks' }
  ] },
  { id: 'reports', label: 'Reports', dropdown: [
    { id: 'reports-hub', label: 'Reports Hub' },
    { id: 'report:lead-conversion', label: 'Lead Conversion' },
    { id: 'report:open-tasks', label: 'Open Tasks' },
    { id: 'report:renewal', label: 'Renewal Report' },
    { id: 'analytics', label: 'APEX Analytics' }
  ] },
  { id: 'alerts-hub', label: 'Alerts Hub' },
  { id: 'alerts', label: 'Alerts', dropdown: [
    { id: 'alerts', label: 'All Alerts' },
    { id: 'alerts:Critical', label: 'Critical Alerts' },
    { id: 'alerts:Renewal', label: 'Renewal Alerts' },
    { id: 'alerts:Claims', label: 'Claims Alerts' }
  ] },
  { id: 'custom-home', label: 'Custom Home Page' },
  { id: 'analytics', label: 'APEX Analytics' },
  { id: 'lead-import', label: 'Agency Lead Import' },
  { id: 'direct-mail', label: 'Direct Mail' },
  { id: 'more', label: 'More', dropdown: [
    { id: 'training', label: 'Training Center' },
    { id: 'custom-home', label: 'Customize Home Page' },
    { id: 'settings', label: 'Settings' },
    { id: 'reset-demo', label: 'Reset Demo Data', special: true }
  ] }
];

export default function TopNav({ currentPage, onNavigate, unreadAlerts, onSpecialAction }) {
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  // Close any open dropdown when clicking elsewhere on the page.
  useEffect(() => {
    if (!openMenu) return;
    const onDocClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openMenu]);

  const handleItemClick = (item) => {
    if (item.dropdown) {
      setOpenMenu(openMenu === item.id ? null : item.id);
      return;
    }
    setOpenMenu(null);
    onNavigate(item.id);
  };

  const handleSubClick = (sub) => {
    setOpenMenu(null);
    if (sub.special) {
      onSpecialAction(sub.id);
      return;
    }
    onNavigate(sub.id);
  };

  const isActive = (item) => currentPage === item.id || (item.id === 'leads' && currentPage === 'lead-detail') || (item.id === 'accounts' && currentPage === 'account-detail');

  return (
    <header className="top-shell">
      <nav className="top-nav" aria-label="Main navigation" ref={navRef}>
        <button className="app-launcher" title="App launcher" onClick={() => onNavigate('home')}>
          <span /> <span /> <span /> <span /> <span /> <span /> <span /> <span /> <span />
        </button>
        <div className="brand" onClick={() => onNavigate('home')} title="APEX Insurance CRM Simulator">APEX</div>
        <div className="nav-scroll">
          {navItems.map((item) => (
            <div className="nav-item-wrap" key={item.id}>
              <button
                className={`nav-item ${isActive(item) ? 'active' : ''}`}
                onClick={() => handleItemClick(item)}
                aria-haspopup={item.dropdown ? 'menu' : undefined}
                aria-expanded={item.dropdown ? openMenu === item.id : undefined}
              >
                {item.label}
                {item.id === 'alerts' && unreadAlerts > 0 && <span className="nav-badge">{unreadAlerts}</span>}
                {item.dropdown && <span className="chevron">⌄</span>}
              </button>
              {openMenu === item.id && item.dropdown && (
                <div className="dropdown-menu" role="menu">
                  {item.dropdown.map((sub) => (
                    <button key={sub.id} role="menuitem" onClick={() => handleSubClick(sub)}>{sub.label}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="pencil-button" title="Customize home page" onClick={() => onNavigate('custom-home')}>✎</button>
      </nav>
    </header>
  );
}
