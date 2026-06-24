import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import CustomersPage from './pages/CustomersPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ReportsHubPage from './pages/ReportsHubPage.jsx';
import ReportsPage from './pages/ReportsPage.jsx';
import AlertsHubPage from './pages/AlertsHubPage.jsx';
import AlertsPage from './pages/AlertsPage.jsx';
import ServiceRequestsPage from './pages/ServiceRequestsPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import LeadImportPage from './pages/LeadImportPage.jsx';
import DirectMailPage from './pages/DirectMailPage.jsx';
import CustomHomePage from './pages/CustomHomePage.jsx';
import TrainingPage from './pages/TrainingPage.jsx';
import ScenariosPage from './pages/ScenariosPage.jsx';
import ProductLearningPage from './pages/ProductLearningPage.jsx';
import QuoteCenterPage from './pages/QuoteCenterPage.jsx';
import PoliciesPage from './pages/PoliciesPage.jsx';
import PersonalLinesPage from './pages/PersonalLinesPage.jsx';
import CommercialLinesPage from './pages/CommercialLinesPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import { initialDepotLeads, initialLeads } from './data/leads.js';
import { initialAccounts } from './data/accounts.js';
import { initialTasks } from './data/tasks.js';
import { initialAlerts } from './data/alerts.js';
import { initialCampaigns } from './data/campaigns.js';
import { defaultUser } from './data/users.js';
import { clearStoreKeys, hydrateStore, loadLocal, nextId, saveLocal } from './utils/storage.js';
import { addDaysISO, todayISO } from './utils/dates.js';
import { pathToState, targetToPath } from './routes.js';
import { getSupabase, isSupabaseConfigured } from './lib/supabaseClient.js';

// Default home dashboard layout. Order matters — Custom Home Page lets trainees reorder it.
export const defaultWidgetLayout = [
  { key: 'notes', label: 'Sticky Note', visible: true },
  { key: 'birthdays', label: 'Upcoming Birthdays', visible: true },
  { key: 'reports', label: 'Reports Hub', visible: true },
  { key: 'serviceAlerts', label: 'Service Alerts & Notifications', visible: true },
  { key: 'recommendations', label: 'Recommendation Engine', visible: true },
  { key: 'marketing', label: 'Sales & Marketing Notifications', visible: true },
  { key: 'tasks', label: 'Tasks Due Today', visible: true },
  { key: 'news', label: 'Agency News & Resources', visible: true },
  { key: 'whatsNew', label: 'Helpful Links', visible: true }
];

function Toast({ toast }) {
  if (!toast) return null;
  return <div className="toast" role="status">{toast}</div>;
}

function Workspace({ session, onSignOut }) {
  // ---- routing (URL-driven) ----
  const location = useLocation();
  const routerNavigate = useNavigate();
  const route = useMemo(() => pathToState(location.pathname), [location.pathname]);
  const currentPage = route.page;
  const pageParam = route.param || '';
  const selectedLeadId = route.leadId || null;
  const selectedAccountId = route.accountId || null;

  // ---- trainee identity (from Supabase Auth, or the local preview session) ----
  const [trainee, setTrainee] = useState(session.profile);

  // ---- persisted simulator data ----
  const [user, setUser] = useState(() => ({
    ...defaultUser,
    name: session.profile.firstName,
    fullName: session.profile.displayName,
    firstName: session.profile.firstName,
    lastName: session.profile.lastName,
    batch: session.profile.batch,
    role: 'Insurance CRM Trainee'
  }));
  const [leads, setLeads] = useState(() => loadLocal('apexCrm3.leads', initialLeads));
  const [depotLeads, setDepotLeads] = useState(() => loadLocal('apexCrm3.depot', initialDepotLeads));
  const [claimedHistory, setClaimedHistory] = useState(() => loadLocal('apexCrm3.claimed', []));
  const [accounts, setAccounts] = useState(() => loadLocal('apexCrm3.accounts', initialAccounts));
  const [tasks, setTasks] = useState(() => loadLocal('apexCrm3.tasks', initialTasks));
  const [alerts, setAlerts] = useState(() => loadLocal('apexCrm3.alerts', initialAlerts));
  const [campaigns, setCampaigns] = useState(() => loadLocal('apexCrm3.campaigns', initialCampaigns));
  const [widgetLayout, setWidgetLayout] = useState(() => loadLocal('apexCrm3.widgets', defaultWidgetLayout));
  const [recentReports, setRecentReports] = useState(() => loadLocal('apexCrm3.recentReports', []));
  const [stickyNote, setStickyNote] = useState(() => loadLocal('apexCrm3.stickyNote', ''));

  // ---- ui state ----
  const [leadModal, setLeadModal] = useState(null);   // { mode: 'new' | 'account' }
  const [taskModal, setTaskModal] = useState(null);   // { defaults: {...} }
  const [toast, setToast] = useState('');

  useEffect(() => saveLocal('apexCrm3.user', user), [user]);
  useEffect(() => saveLocal('apexCrm3.leads', leads), [leads]);
  useEffect(() => saveLocal('apexCrm3.depot', depotLeads), [depotLeads]);
  useEffect(() => saveLocal('apexCrm3.claimed', claimedHistory), [claimedHistory]);
  useEffect(() => saveLocal('apexCrm3.accounts', accounts), [accounts]);
  useEffect(() => saveLocal('apexCrm3.tasks', tasks), [tasks]);
  useEffect(() => saveLocal('apexCrm3.alerts', alerts), [alerts]);
  useEffect(() => saveLocal('apexCrm3.campaigns', campaigns), [campaigns]);
  useEffect(() => saveLocal('apexCrm3.widgets', widgetLayout), [widgetLayout]);
  useEffect(() => saveLocal('apexCrm3.recentReports', recentReports), [recentReports]);
  useEffect(() => saveLocal('apexCrm3.stickyNote', stickyNote), [stickyNote]);
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  // Send the root and the old /login path to the dashboard once signed in.
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/login') {
      routerNavigate('/dashboard', { replace: true });
    }
  }, [location.pathname, routerNavigate]);

  const selectedLead = useMemo(() => leads.find((lead) => lead.id === selectedLeadId), [leads, selectedLeadId]);
  const selectedAccount = useMemo(() => accounts.find((account) => account.id === selectedAccountId), [accounts, selectedAccountId]);
  const unreadAlerts = alerts.filter((alert) => !alert.read).length;
  const relatedOptions = useMemo(() => ([
    ...leads.map((lead) => ({ name: lead.name, type: 'Lead' })),
    ...accounts.map((account) => ({ name: account.household, type: 'Account' }))
  ]), [leads, accounts]);

  const showToast = (message) => setToast(message);

  // Editing the profile in Settings updates the in-session display name and,
  // when Supabase auth is active, the trainee's auth metadata.
  const updateTrainee = (next) => {
    setTrainee(next);
    const supabase = getSupabase();
    if (supabase && !session.local) {
      supabase.auth
        .updateUser({ data: { first_name: next.firstName, last_name: next.lastName, batch: next.batch } })
        .catch((error) => console.error('Profile update failed', error));
    }
  };

  const handleLogout = () => {
    onSignOut();
  };

  // Navigation accepts "page" or "page:param" (e.g. tasks:today, alerts:Critical, report:renewal).
  const navigate = (target) => {
    const [page, param = ''] = String(target).split(':');
    if (page === 'report' && param) {
      setRecentReports((items) => [param, ...items.filter((id) => id !== param)].slice(0, 5));
    }
    routerNavigate(targetToPath(target));
    window.scrollTo({ top: 0 });
  };

  const selectLead = (id) => { routerNavigate(`/leads/${id}`); window.scrollTo({ top: 0 }); };
  const selectAccount = (id) => { routerNavigate(`/accounts/${id}`); window.scrollTo({ top: 0 }); };

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
      category: 'Critical & Pending Alerts',
      severity: 'Medium',
      date: todayISO(),
      read: false,
      title: 'New training alert created',
      body: 'This is a simulator alert created from the navigation dropdown. Review it, mark it read, or create a task from it.',
      relatedTo: 'Training Simulator',
      suggestedAction: 'Review the alert and route it according to the training workflow.'
    };
    setAlerts((items) => [alert, ...items]);
    routerNavigate('/alerts/Critical%20%26%20Pending%20Alerts');
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
    clearStoreKeys(['apexCrm3.book', 'apexCrm3.training', 'apexCrm3.scenarioScores']).catch((error) => console.error(error));
    routerNavigate('/dashboard');
    showToast('Demo data reset to defaults.');
  };

  const handleSpecialAction = (action) => {
    if (action === 'reset-demo') resetDemoData();
    if (action === 'accounts-new') setLeadModal({ mode: 'account' });
    if (action === 'new-lead') setLeadModal({ mode: 'new' });
    if (action === 'new-alert') createTrainingAlert();
  };

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
      case 'customers':
        return <CustomersPage onNavigate={navigate} onToast={showToast} />;
      case 'tasks':
        return <TasksPage tasks={tasks} user={user} initialView={pageParam} onUpdateTask={updateTask} onNewTask={() => openTaskModal()} />;
      case 'reports-hub':
        return <ReportsHubPage recentReports={recentReports} onNavigate={navigate} />;
      case 'reports':
        return <ReportsPage reportId={pageParam} leads={leads} accounts={accounts} tasks={tasks} onNavigate={navigate} onToast={showToast} />;
      case 'alerts-hub':
        return <AlertsHubPage alerts={alerts} onNavigate={navigate} />;
      case 'alerts':
        return <AlertsPage alerts={alerts} categoryFilter={pageParam || 'All'} onSetRead={setAlertRead} onMarkAllRead={markAllAlertsRead} onCreateTask={(defaults) => openTaskModal(defaults)} onCreateAlert={createTrainingAlert} />;
      case 'service-requests':
        return <ServiceRequestsPage onToast={showToast} onCreateTask={(defaults) => openTaskModal(defaults)} />;
      case 'analytics':
        return <AnalyticsPage leads={leads} accounts={accounts} tasks={tasks} claimedHistory={claimedHistory} />;
      case 'lead-import':
        return <LeadImportPage onImport={addImportedLeads} onNavigate={navigate} />;
      case 'direct-mail':
        return <DirectMailPage campaigns={campaigns} setCampaigns={setCampaigns} onToast={showToast} />;
      case 'custom-home':
        return <CustomHomePage widgetLayout={widgetLayout} onChange={setWidgetLayout} onReset={() => { setWidgetLayout(defaultWidgetLayout); showToast('Default layout restored.'); }} onNavigate={navigate} />;
      case 'training':
        return <TrainingPage onNavigate={navigate} onToast={showToast} onNewLead={() => setLeadModal({ mode: 'new' })} onNewAccount={() => setLeadModal({ mode: 'account' })} onNewTask={(defaults) => openTaskModal(defaults)} />;
      case 'scenarios':
        return <ScenariosPage onNavigate={navigate} onToast={showToast} />;
      case 'product-learning':
        return <ProductLearningPage onNavigate={navigate} />;
      case 'quote-center':
        return <QuoteCenterPage onNavigate={navigate} onToast={showToast} onNewLead={() => setLeadModal({ mode: 'new' })} onNewTask={(defaults) => openTaskModal(defaults)} />;
      case 'policies':
        return <PoliciesPage onNavigate={navigate} onToast={showToast} />;
      case 'personal-lines':
        return <PersonalLinesPage onNavigate={navigate} />;
      case 'commercial-lines':
        return <CommercialLinesPage onNavigate={navigate} />;
      case 'settings':
        return <SettingsPage user={user} setUser={setUser} trainee={trainee} setTrainee={updateTrainee} onResetData={resetDemoData} onLogout={handleLogout} />;
      case 'opportunities':
      case 'claims':
      case 'calendar':
      case 'workable-lists':
      case 'account-tags':
      case 'preference-center':
        return <PlaceholderPage pageId={currentPage} onNavigate={navigate} />;
      case 'not-found':
        return <NotFoundPage onNavigate={navigate} />;
      default:
        return <HomePage user={user} leads={leads} accounts={accounts} tasks={tasks} alerts={alerts} depotLeads={depotLeads} onNavigate={navigate} onNewLead={() => setLeadModal({ mode: 'new' })} widgetLayout={widgetLayout} stickyNote={stickyNote} onStickyNoteChange={setStickyNote} />;
    }
  };

  return (
    <div className="app-shell">
      <TopNav currentPage={currentPage} onNavigate={navigate} unreadAlerts={unreadAlerts} onSpecialAction={handleSpecialAction} trainee={trainee} onLogout={handleLogout} />
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

// Build the trainee profile shown around the app from a Supabase auth user.
function profileFromUser(authUser) {
  const meta = authUser.user_metadata || {};
  const firstName = meta.first_name || (authUser.email || 'Trainee').split('@')[0];
  const lastName = meta.last_name || '';
  const displayName = `${firstName} ${lastName}`.trim() || 'Trainee';
  return {
    firstName,
    lastName,
    batch: meta.batch || 'Training Batch',
    displayName,
    initials: `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'TR',
    email: authUser.email || '',
    loginAt: new Date().toISOString()
  };
}

function profileFromLocal(form) {
  const firstName = form.firstName || 'Trainee';
  const lastName = form.lastName || '';
  return {
    firstName,
    lastName,
    batch: form.batch || 'Local Preview',
    displayName: `${firstName} ${lastName}`.trim() || 'Trainee',
    initials: `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() || 'TR',
    email: '',
    loginAt: new Date().toISOString()
  };
}

function BootScreen() {
  return (
    <div className="boot-screen">
      <div className="boot-spinner" aria-hidden="true" />
      <p>Loading your training workspace…</p>
    </div>
  );
}

// Auth gate: resolves the Supabase session (or local preview), hydrates shared +
// per-user data from Supabase, then mounts the workspace. Mounting only after
// hydration means the workspace's state initializers read the synced data.
function App() {
  const supabase = getSupabase();
  const [phase, setPhase] = useState('loading'); // 'loading' | 'auth' | 'ready'
  const [session, setSession] = useState(null);

  const enterSession = async (nextSession) => {
    setPhase('loading');
    const userId = nextSession.local ? null : nextSession.user.id;
    await hydrateStore(userId);
    setSession(nextSession);
    setPhase('ready');
  };

  useEffect(() => {
    let active = true;

    if (!supabase) {
      const guest = loadLocal('apexCrm3.localSession', null);
      if (guest) enterSession({ local: true, user: { id: 'local' }, profile: guest });
      else setPhase('auth');
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) enterSession({ user: data.session.user, profile: profileFromUser(data.session.user) });
      else setPhase('auth');
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!active) return;
      if (nextSession) enterSession({ user: nextSession.user, profile: profileFromUser(nextSession.user) });
      else {
        setSession(null);
        setPhase('auth');
      }
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocalEnter = (form) => {
    const profile = profileFromLocal(form);
    saveLocal('apexCrm3.localSession', profile);
    enterSession({ local: true, user: { id: 'local' }, profile });
  };

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    try {
      localStorage.removeItem('apexCrm3.localSession');
    } catch {
      // ignore
    }
    setSession(null);
    setPhase('auth');
  };

  if (phase === 'loading') return <BootScreen />;
  if (phase === 'auth' || !session) {
    return <LoginPage supabaseReady={isSupabaseConfigured()} onLocalEnter={handleLocalEnter} />;
  }
  return <Workspace key={session.user.id} session={session} onSignOut={handleSignOut} />;
}

export default App;
