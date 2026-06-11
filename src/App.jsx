import { useEffect, useMemo, useState } from 'react';
import TopNav from './components/TopNav.jsx';
import BottomUtilityBar from './components/BottomUtilityBar.jsx';
import QuoteNewAccountModal from './components/QuoteNewAccountModal.jsx';
import TaskFormModal from './components/TaskFormModal.jsx';
import HomePage from './pages/HomePage.jsx';
import LeadsPage from './pages/LeadsPage.jsx';
import LeadDetailPage from './pages/LeadDetailPage.jsx';
import LeadDepotPage from './pages/LeadDepotPage.jsx';
import AccountsPage from './pages/AccountsPage.jsx';
import AccountDetailPage from './pages/AccountDetailPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ReportsHubPage from './pages/ReportsHubPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import AlertsHubPage from './pages/AlertsHubPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import LeadImportPage from './pages/LeadImportPage.jsx';
import DirectMailPage from './pages/DirectMailPage.jsx';
import CustomHomePage from './pages/CustomHomePage.jsx';
import TrainingPage from './pages/TrainingPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { initialDepotLeads, initialLeads } from './data/leads.js';
import { initialAccounts } from './data/accounts.js';
import { initialTasks } from './data/tasks.js';
import { initialAlerts } from './data/alerts.js';
import { initialCampaigns } from './data/campaigns.js';
import { defaultUser } from './data/users.js';
import { loadLocal, nextId, saveLocal } from './utils/storage.js';
import { addDaysISO, todayISO } from './utils/dates.js';

// Default home dashboard layout. Order matters — Custom Home Page lets trainees reorder it.
export const defaultWidgetLayout = [
  { key: 'notes', label: 'Yellow Notes', visible: true },
  { key: 'birthdays', label: 'Upcoming Birthdays', visible: true },
  { key: 'reports', label: 'Reports Hub Shortcut', visible: true },
  { key: 'serviceAlerts', label: 'Service Alerts & Notifications', visible: true },
  { key: 'recommendations', label: 'Recommendation Engine', visible: true },
  { key: 'marketing', label: 'Sales & Marketing Notifications', visible: true },
  { key: 'tasks', label: 'Tasks - Due Today', visible: true },
  { key: 'news', label: 'Agency News & Resources', visible: true },
  { key: 'whatsNew', label: 'New to APEX / Help Resources', visible: true }
];

function Toast({ toast }) {
  if (!toast) return null;
  return <div className="toast" role="status">{toast}</div>;
}

function App() {
  // ---- routing ----
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParam, setPageParam] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  // ---- trainee login/session ----
  const [traineeSession, setTraineeSession] = useState(() => loadLocal('apexCrm2.traineeSession', null));
  const [lastLogin, setLastLogin] = useState(() => loadLocal('apexCrm2.lastLogin', null));

  // ---- persisted simulator data (v2 keys so older saves don't break the new shape) ----
  const [user, setUser] = useState(() => {
    const session = loadLocal('apexCrm2.traineeSession', null);
    return session
      ? { ...defaultUser, name: session.firstName, fullName: session.displayName, firstName: session.firstName, lastName: session.lastName, batch: session.batch, role: 'Insurance CRM Trainee' }
      : loadLocal('apexCrm2.user', defaultUser);
  });
  const [leads, setLeads] = useState(() => loadLocal('apexCrm2.leads', initialLeads));
  const [depotLeads, setDepotLeads] = useState(() => loadLocal('apexCrm2.depot', initialDepotLeads));
  const [claimedHistory, setClaimedHistory] = useState(() => loadLocal('apexCrm2.claimed', []));
  const [accounts, setAccounts] = useState(() => loadLocal('apexCrm2.accounts', initialAccounts));
  const [tasks, setTasks] = useState(() => loadLocal('apexCrm2.tasks', initialTasks));
  const [alerts, setAlerts] = useState(() => loadLocal('apexCrm2.alerts', initialAlerts));
  const [campaigns, setCampaigns] = useState(() => loadLocal('apexCrm2.campaigns', initialCampaigns));
  const [widgetLayout, setWidgetLayout] = useState(() => loadLocal('apexCrm2.widgets', defaultWidgetLayout));
  const [recentReports, setRecentReports] = useState(() => loadLocal('apexCrm2.recentReports', []));
  const [stickyNote, setStickyNote] = useState(() => loadLocal('apexCrm2.stickyNote', ''));

  // ---- ui state ----
  const [leadModal, setLeadModal] = useState(null);   // { mode: 'new' | 'account' }
  const [taskModal, setTaskModal] = useState(null);   // { defaults: {...} }
  const [toast, setToast] = useState('');

  useEffect(() => saveLocal('apexCrm2.traineeSession', traineeSession), [traineeSession]);
  useEffect(() => saveLocal('apexCrm2.lastLogin', lastLogin), [lastLogin]);
  useEffect(() => saveLocal('apexCrm2.user', user), [user]);
  useEffect(() => saveLocal('apexCrm2.leads', leads), [leads]);
  useEffect(() => saveLocal('apexCrm2.depot', depotLeads), [depotLeads]);
  useEffect(() => saveLocal('apexCrm2.claimed', claimedHistory), [claimedHistory]);
  useEffect(() => saveLocal('apexCrm2.accounts', accounts), [accounts]);
  useEffect(() => saveLocal('apexCrm2.tasks', tasks), [tasks]);
  useEffect(() => saveLocal('apexCrm2.alerts', alerts), [alerts]);
  useEffect(() => saveLocal('apexCrm2.campaigns', campaigns), [campaigns]);
  useEffect(() => saveLocal('apexCrm2.widgets', widgetLayout), [widgetLayout]);
  useEffect(() => saveLocal('apexCrm2.recentReports', recentReports), [recentReports]);
  useEffect(() => saveLocal('apexCrm2.stickyNote', stickyNote), [stickyNote]);
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId), [leads, selectedLeadId]);
  const selectedAccount = useMemo(() => accounts.find((account) => account.id === selectedAccountId), [accounts, selectedAccountId]);
  const unreadAlerts = alerts.filter((alert) => !alert.read).length;
  const relatedOptions = useMemo(() => ([
    ...leads.map((lead) => ({ name: lead.name, type: 'Lead' })),
    ...accounts.map((account) => ({ name: account.household, type: 'Account' }))
  ]), [leads, accounts]);

  const showToast = (message) => setToast(message);

  const handleLogin = ({ firstName, lastName, batch }) => {
    const now = new Date().toISOString();
    const displayName = `${firstName} ${lastName}`;
    const session = {
      firstName,
      lastName,
      batch,
      displayName,
      loginAt: now,
      initials: `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase()
    };
    setTraineeSession(session);
    setLastLogin(session);
    setUser({ ...defaultUser, name: firstName, fullName: displayName, firstName, lastName, batch, role: 'Insurance CRM Trainee' });
    setCurrentPage('home');
    setPageParam('');
    showToast(`Welcome, ${firstName}.`);
  };

  const handleLogout = () => {
    setTraineeSession(null);
    setCurrentPage('home');
    setPageParam('');
    setSelectedLeadId(null);
    setSelectedAccountId(null);
  };

  // Navigation accepts "page" or "page:param" (e.g. tasks:today, alerts:Critical, report:renewal).
  const navigate = (target) => {
    const [page, param = ''] = String(target).split(':');
    if (page === 'report' && param) {
      setRecentReports((items) => [param, ...items.filter((id) => id !== param)].slice(0, 5));
      setCurrentPage('reports');
      setPageParam(param);
    } else {
      setCurrentPage(page);
      setPageParam(param);
    }
    if (page !== 'lead-detail') setSelectedLeadId(null);
    if (page !== 'account-detail') setSelectedAccountId(null);
    window.scrollTo({ top: 0 });
  };

  const selectLead = (id) => { setSelectedLeadId(id); setCurrentPage('lead-detail'); setPageParam(''); window.scrollTo({ top: 0 }); };
  const selectAccount = (id) => { setSelectedAccountId(id); setCurrentPage('account-detail'); setPageParam(''); window.scrollTo({ top: 0 }); };

  // ---- lead actions ----
  const updateLead = (id, updates) => setLeads((items) => items.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead)));

  const addLead = (lead, { open = true } = {}) => {
    const newLead = { ...lead, id: nextId('L', leads) };
    setLeads((items) => [newLead, ...items]);
    setLeadModal(null);
    if (open) selectLead(newLead.id);
    showToast('Lead saved.');
  };

  const addImportedLeads = (newLeads) => {
    setLeads((items) => {
      let working = [...items];
      const withIds = newLeads.map((lead) => {
        const record = { ...lead, id: nextId('L', working) };
        working = [record, ...working];
        return record;
      });
      return [...withIds, ...items];
    });
    showToast(`${newLeads.length} lead${newLeads.length === 1 ? '' : 's'} imported into Leads.`);
  };

  const buildAccountFromLead = (lead, policyStatus) => ({
    id: nextId('A', accounts),
    household: lead.type === 'Commercial Lines' ? lead.name : `${lead.name} Household`,
    primaryContact: lead.name,
    status: 'Pending',
    type: lead.type,
    phone: lead.phone || '—',
    email: lead.email || '—',
    address: `${lead.city || 'Training City'}, ${lead.state || 'NA'}`,
    customerSince: todayISO(),
    accountManager: lead.owner || user.name,
    members: [{ name: lead.name, relation: lead.type === 'Commercial Lines' ? 'Owner / Primary Contact' : 'Primary Named Insured', dob: '—' }],
    policies: [{
      number: `SIM-${String(1000 + accounts.length + 1)}`,
      line: lead.product || lead.interest || 'Pending Line',
      status: policyStatus,
      effective: todayISO(),
      expiration: addDaysISO(365),
      premium: Number(lead.premium) || 0
    }],
    billing: { method: 'Not set up', balance: 0, nextDueDate: '—', nextDueAmount: 0, status: 'Awaiting Issue' },
    claims: [],
    documents: [],
    activity: [{ date: todayISO(), author: user.name, text: `Account created from lead ${lead.id || 'form'}. Licensed staff must complete bind/issue steps.` }]
  });

  const convertLead = (leadId) => {
    const lead = leads.find((item) => item.id === leadId);
    if (!lead) return;
    if (lead.status === 'Converted') { showToast('This lead was already converted.'); return; }
    const account = buildAccountFromLead(lead, 'Pending Issue');
    setAccounts((items) => [account, ...items]);
    updateLead(lead.id, { status: 'Converted', lastActivity: `Converted to account ${account.id}` });
    selectAccount(account.id);
    showToast(`${lead.name} converted to account.`);
  };

  const createAccountFromModal = (lead) => {
    const account = buildAccountFromLead(lead, 'Training Quote');
    setAccounts((items) => [account, ...items]);
    setLeadModal(null);
    selectAccount(account.id);
    showToast('Account created.');
  };

  // ---- Lead Depot: claim moves the record out of the depot into "My Leads" ----
  const claimDepotLead = (depotId) => {
    const record = depotLeads.find((item) => item.id === depotId);
    if (!record) return;
    const newLead = {
      id: nextId('L', leads),
      name: record.name, type: record.type, interest: record.interest, product: record.product,
      status: 'New', priority: record.priority, source: 'Lead Depot',
      phone: record.phone, email: record.email, city: record.city, state: record.state,
      premium: record.premium, owner: user.name, createdDate: todayISO(),
      lastActivity: 'Claimed from Lead Depot',
      notes: [{ date: todayISO(), author: user.name, text: `Claimed from Lead Depot. Depot summary: ${record.summary}` }]
    };
    setLeads((items) => [newLead, ...items]);
    setDepotLeads((items) => items.filter((item) => item.id !== depotId));
    setClaimedHistory((items) => [{ ...record, claimedBy: user.name, claimedOn: todayISO(), leadId: newLead.id }, ...items]);
    showToast(`${record.name} claimed and added to My Leads.`);
  };

  // ---- account actions ----
  const updateAccount = (id, updates) => setAccounts((items) => items.map((account) => (account.id === id ? { ...account, ...updates } : account)));

  // ---- task actions ----
  const updateTask = (id, updates) => setTasks((items) => items.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  const addTask = (task) => {
    setTasks((items) => [{ ...task, id: nextId('T', items) }, ...items]);
    setTaskModal(null);
    showToast('Task created successfully.');
  };
  const openTaskModal = (defaults = {}) => setTaskModal({ defaults });

  // ---- alert actions ----
  const setAlertRead = (id, read) => setAlerts((items) => items.map((alert) => (alert.id === id ? { ...alert, read } : alert)));
  const markAllAlertsRead = () => { setAlerts((items) => items.map((alert) => ({ ...alert, read: true }))); showToast('All alerts marked read.'); };
  const createTrainingAlert = () => {
    const alert = {
      id: nextId('AL', alerts),
      category: 'Pending',
      severity: 'Medium',
      date: todayISO(),
      read: false,
      title: 'New training alert created',
      body: 'This is a simulator alert created from the APEX navigation dropdown. Review it, mark it read, or create a task from it.',
      relatedTo: 'Training Simulator',
      suggestedAction: 'Review the alert and route it according to the training workflow.'
    };
    setAlerts((items) => [alert, ...items]);
    setCurrentPage('alerts');
    setPageParam('Pending');
    showToast('New alert created.');
  };

  const resetDemoData = () => {
    setLeads(initialLeads);
    setDepotLeads(initialDepotLeads);
    setClaimedHistory([]);
    setAccounts(initialAccounts);
    setTasks(initialTasks);
    setAlerts(initialAlerts);
    setCampaigns(initialCampaigns);
    setWidgetLayout(defaultWidgetLayout);
    setRecentReports([]);
    setStickyNote('');
    setSelectedLeadId(null);
    setSelectedAccountId(null);
    setCurrentPage('home');
    setPageParam('');
    showToast('Demo data reset to defaults.');
  };

  const handleSpecialAction = (action) => {
    if (action === 'reset-demo') resetDemoData();
    if (action === 'accounts-new') setLeadModal({ mode: 'account' });
    if (action === 'new-lead') setLeadModal({ mode: 'new' });
    if (action === 'new-alert') createTrainingAlert();
  };

  if (!traineeSession) {
    return <LoginPage onLogin={handleLogin} lastLogin={lastLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} leads={leads} accounts={accounts} tasks={tasks} alerts={alerts} depotLeads={depotLeads} onNavigate={navigate} onNewLead={() => setLeadModal({ mode: 'new' })} widgetLayout={widgetLayout} stickyNote={stickyNote} onStickyNoteChange={setStickyNote} />;
      case 'leads':
        return <LeadsPage leads={leads} onSelectLead={selectLead} onUpdateLead={updateLead} onConvertLead={convertLead} onNewLead={() => setLeadModal({ mode: 'new' })} />;
      case 'lead-detail':
        return <LeadDetailPage lead={selectedLead} user={user} onBack={() => navigate('leads')} onUpdateLead={updateLead} onConvertLead={convertLead} onCreateTask={(defaults) => openTaskModal(defaults)} />;
      case 'lead-depot':
        return <LeadDepotPage depotLeads={depotLeads} claimedHistory={claimedHistory} onClaim={claimDepotLead} onNavigate={navigate} />;
      case 'accounts':
        return <AccountsPage accounts={accounts} onSelectAccount={selectAccount} onNewAccount={() => setLeadModal({ mode: 'account' })} />;
      case 'account-detail':
        return <AccountDetailPage account={selectedAccount} user={user} tasks={tasks} onBack={() => navigate('accounts')} onUpdateAccount={updateAccount} onUpdateTask={updateTask} onCreateTask={(defaults) => openTaskModal(defaults)} onToast={showToast} />;
      case 'tasks':
        return <TasksPage tasks={tasks} user={user} initialView={pageParam} onUpdateTask={updateTask} onNewTask={() => openTaskModal()} />;
      case 'reports-hub':
        return <ReportsHubPage recentReports={recentReports} onNavigate={navigate} />;
      case 'reports':
        return <ReportsPage reportId={pageParam} leads={leads} accounts={accounts} tasks={tasks} onNavigate={navigate} onToast={showToast} />;
      case 'alerts-hub':
        return <AlertsHubPage alerts={alerts} onNavigate={navigate} />;
      case 'alerts':
        return <AlertsPage alerts={alerts} categoryFilter={pageParam || 'All'} onSetRead={setAlertRead} onMarkAllRead={markAllAlertsRead} onCreateTask={(defaults) => openTaskModal(defaults)} />;
      case 'analytics':
        return <AnalyticsPage leads={leads} accounts={accounts} tasks={tasks} claimedHistory={claimedHistory} />;
      case 'lead-import':
        return <LeadImportPage onImport={addImportedLeads} onNavigate={navigate} />;
      case 'direct-mail':
        return <DirectMailPage campaigns={campaigns} setCampaigns={setCampaigns} onToast={showToast} />;
      case 'custom-home':
        return <CustomHomePage widgetLayout={widgetLayout} onChange={setWidgetLayout} onReset={() => { setWidgetLayout(defaultWidgetLayout); showToast('Default layout restored.'); }} onNavigate={navigate} />;
      case 'training':
        return <TrainingPage onNavigate={navigate} onToast={showToast} />;
      case 'settings':
        return <SettingsPage user={user} setUser={setUser} trainee={traineeSession} setTrainee={setTraineeSession} onResetData={resetDemoData} onLogout={handleLogout} />;
      case 'opportunities':
      case 'insurance-policies':
      case 'claims':
      case 'calendar':
      case 'workable-lists':
      case 'account-tags':
      case 'preference-center':
        return <PlaceholderPage pageId={currentPage} onNavigate={navigate} />;
      default:
        return <HomePage user={user} leads={leads} accounts={accounts} tasks={tasks} alerts={alerts} depotLeads={depotLeads} onNavigate={navigate} onNewLead={() => setLeadModal({ mode: 'new' })} widgetLayout={widgetLayout} stickyNote={stickyNote} onStickyNoteChange={setStickyNote} />;
    }
  };

  return (
    <div className="app-shell">
      <TopNav currentPage={currentPage} onNavigate={navigate} unreadAlerts={unreadAlerts} onSpecialAction={handleSpecialAction} trainee={traineeSession} onLogout={handleLogout} />
      {renderPage()}
      <BottomUtilityBar accounts={accounts} leads={leads} onOpenAccount={selectAccount} onOpenLead={selectLead} onNavigate={navigate} onToast={showToast} />

      {leadModal && leadModal.mode === 'new' && (
        <QuoteNewAccountModal defaultTab="personal" onClose={() => setLeadModal(null)} onSave={addLead} />
      )}
      {leadModal && leadModal.mode === 'account' && (
        <QuoteNewAccountModal defaultTab="business" onClose={() => setLeadModal(null)} onSave={createAccountFromModal} />
      )}
      {taskModal && (
        <TaskFormModal relatedOptions={relatedOptions} defaults={{ owner: user.name, ...taskModal.defaults }} onClose={() => setTaskModal(null)} onSave={addTask} />
      )}
      <Toast toast={toast} />
    </div>
  );
}

export default App;
