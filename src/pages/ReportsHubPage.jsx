import { useMemo, useState } from 'react';

const columns = [
  {
    title: 'By Date',
    cards: [
      { id: 'opportunities-new-week', icon: '▤', title: 'Opportunities New This Week', description: "All opportunities created this week and Stage is not 'Closed Lost', 'Closed Won', or 'Rejected'" },
      { id: 'opportunities-closing-month', icon: '▤', title: 'Opportunities Closing This Month', description: "All opportunities that are closing this month and stage is not 'Closed Lost', 'Closed Won', or 'Rejected'" },
      { id: 'opportunities-next-month', icon: '▤', title: 'Opportunities Closing Next Month', description: "All opportunities that are closing next month and stage is not 'Closed Lost', 'Closed Won', or 'Rejected'" },
      { id: 'accounts-priority', icon: '▣', title: 'Accounts List with Priority', description: 'Priority Report', tone: 'green' },
      { id: 'vip-prospect', icon: '▣', title: 'VIP Prospect Report', description: 'VIP Prospect Report', tone: 'green' }
    ]
  },
  {
    title: 'By Origin',
    cards: [
      { id: 'my-open-rec-engine', icon: '▤', title: 'My Open Rec Engine Opportunities', description: 'List of all Open Recommendation Engine opportunities that are assigned to me.' },
      { id: 'open-rec-engine', icon: '▤', title: 'Open Rec Engine Opportunities', description: 'All opportunities provided by Recommendation Engine that are in the Open Stage.' },
      { id: 'pl-ffq-prospects', icon: '▤', title: 'PL FFQ Prospects', description: 'All prospects where the origin is FFQ.' },
      { id: 'quotewizard-leads', icon: '▤', title: 'QuoteWizard Leads', description: 'Leads that have a lead source of QuoteWizard.com.' },
      { id: 'internet-leads', icon: '▤', title: 'Internet Leads - LeadCloud', description: 'Internet leads from partner sources. Dummy training records only.' }
    ]
  },
  {
    title: 'By Status',
    cards: [
      { id: 'training-qnc-dashboard', icon: '▥', title: "Training QNC's - Select Zip Codes", description: 'A dashboard of all quotes not closed in my agency with a residence zip code within a selected training group.', tone: 'purple' },
      { id: 'my-open-opportunities', icon: '▤', title: 'My Open Opportunities', description: "All opportunities assigned to me, and Stage is not 'Closed Lost', 'Closed Won', or 'Rejected'." },
      { id: 'opportunities-closed-lost', icon: '▤', title: 'Opportunities Closed Lost', description: "All opportunities where the Stage is 'Closed Lost'." },
      { id: 'opportunities-closed-won', icon: '▤', title: 'Opportunities Closed Won', description: "All opportunities where the stage is 'Closed Won'." },
      { id: 'quotes-not-closed', icon: '▤', title: 'Quotes Not Closed', description: "All quotes where the status is not 'Converted'." }
    ]
  }
];

export default function ReportsHubPage({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('Sales');

  const filteredColumns = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return columns;
    return columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => `${card.title} ${card.description}`.toLowerCase().includes(term))
    }));
  }, [search]);

  return (
    <main className="sf-reports-hub-page">
      <div className="sf-hub-title-bar">Reports Hub</div>
      <div className="sf-hub-search-row">
        <label>
          <span>⌕</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search Lists, Reports, and Analytics..." />
        </label>
        <button className="sf-info-button" title="About Reports Hub">ⓘ</button>
      </div>

      <nav className="sf-hub-tabs" aria-label="Reports Hub tabs">
        {['Sales', 'Customers & Policies', 'Manage Agency'].map((item) => (
          <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>
        ))}
      </nav>

      <section className="sf-recent-report-panel">
        <h2>Recent</h2>
        <button onClick={() => onNavigate('report:cross-sell-opportunities')}>
          <span className="sf-report-icon orange">▤</span>
          <strong>New Rec Engine: Cross Sell Opportunities</strong>
          <em>Cross-sell Opportunities provided by Recommendation Engine</em>
        </button>
      </section>

      <section className="sf-report-columns">
        {filteredColumns.map((column) => (
          <div className="sf-report-column" key={column.title}>
            <h2>{column.title}</h2>
            <div className="sf-report-column-scroll">
              {column.cards.map((card) => (
                <button key={card.id} className="sf-report-hub-card" onClick={() => onNavigate(`report:${card.id}`)}>
                  <span className={`sf-report-icon ${card.tone || 'orange'}`}>{card.icon}</span>
                  <span>
                    <strong>{card.title}</strong>
                    <em>{card.description}</em>
                  </span>
                </button>
              ))}
              {column.cards.length === 0 && <p className="sf-column-empty">No reports match this search.</p>}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
