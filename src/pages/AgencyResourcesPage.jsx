import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import Modal from '../components/Modal.jsx';
import { agencyUpdates, keyDates, rateRules, resourceTiles } from '../data/portalData.js';

// Dummy long-form training content shown when a resource card is opened.
const RESOURCE_LIBRARY = {
  'Personal Lines Resources': {
    meta: 'Resource Library · Personal Lines',
    body: 'Reference material for homeowners, auto, renters, condo, dwelling fire, and umbrella servicing. Use these as a training reference only — coverage interpretation must be escalated to licensed staff.',
    bullets: ['Homeowners intake checklist and required documents', 'Personal auto endorsement request workflow', 'Umbrella underlying-limit reference', 'Mortgagee / lienholder change steps'],
    link: 'personal-lines'
  },
  'Commercial Lines Resources': {
    meta: 'Resource Library · Commercial Lines',
    body: 'Reference material for general liability, business auto, BOP, workers comp, and commercial property servicing, plus certificate handling.',
    bullets: ['Certificate of Insurance request workflow', 'Additional insured & waiver of subrogation basics', 'Class code / payroll change intake', 'Location and vehicle/equipment change steps'],
    link: 'commercial-lines'
  },
  'Training Resources': {
    meta: 'Resource Library · Training',
    body: 'Onboarding and skills practice for new VAs. Pair these with the Training Center and Scenarios for hands-on reps.',
    bullets: ['VA compliance guardrails (gather, document, escalate)', 'CRM navigation fundamentals', 'Service request lifecycle', 'Documenting customer requests verbatim'],
    link: 'training'
  },
  'Underwriting Reminders': {
    meta: 'Resource Library · Underwriting',
    body: 'High-level reminders on eligibility and risk signals. VAs identify and route — they never decide eligibility or interpret coverage.',
    bullets: ['Flag pending underwriting conditions in Alerts', 'Collect missing documents and route', 'Never confirm bind/issue status', 'Escalate eligibility questions to licensed staff'],
    link: 'alerts-hub'
  },
  'Manuals & Product Guides': {
    meta: 'Resource Library · Manuals (placeholder)',
    body: 'Placeholder for product manuals and underwriting guides. In a live environment these would link to carrier guides; here they are training stand-ins.',
    bullets: ['Personal Lines product guide (placeholder)', 'Commercial Lines product guide (placeholder)', 'Billing & payments guide (placeholder)'],
    link: 'product-learning'
  }
};

export default function AgencyResourcesPage({ onNavigate, onToast }) {
  const [detail, setDetail] = useState(null);

  const openUpdate = (item) => setDetail({
    title: item.title,
    meta: `${item.date} · ${item.category}`,
    body: item.summary,
    bullets: ['Read the full bulletin before working related accounts.', 'Document any customer-facing change in the CRM.', 'Escalate licensed questions to a licensed agent.']
  });

  const openRule = (item) => setDetail({
    title: item.title,
    meta: `${item.date} · ${item.line} Lines · ${item.state}`,
    body: 'Rate and rule reminder for training. Apply the documented workflow and route any coverage or eligibility decision to licensed staff.',
    bullets: ['Confirm the current rule version before advising.', 'Collect and document required details only.', 'Escalate interpretation to a licensed agent.']
  });

  const openLibrary = (title) => {
    const entry = RESOURCE_LIBRARY[title];
    if (entry) setDetail({ title, ...entry });
  };

  return (
    <main className="workspace page-bg agency-resources-page">
      <div className="agency-resource-topbar">
        <input placeholder="Search resources…" />
        <button onClick={() => onToast?.('Resource search is simulated in training.')}>SEARCH</button>
        <span>🔍</span><span>🔔</span>
        <button onClick={() => onToast?.('Logged out of resources area (simulated).')}>Logout</button>
      </div>

      <nav className="agency-resource-nav">
        {['Distribution Updates', 'Personal Lines Resources', 'Commercial Lines Resources', 'Training Resources', 'Underwriting Reminders', 'Manuals & Product Guides'].map((item) => (
          <button key={item} onClick={() => openLibrary(item)}>{item}</button>
        ))}
      </nav>

      <div className="page-header compact-resource-header">
        <div>
          <p className="eyebrow">Agency News &amp; Resources</p>
          <h1>Training Resource Portal <InfoTip text="Separate portal area for news, product links, and internal resources. This does not change customer, policy, billing, or CRM records." /></h1>
          <span>Click any card to open dummy training content. This area is separate from customer, policy, and billing records.</span>
        </div>
      </div>

      <div className="resource-dashboard-grid">
        <Panel title="Distribution Updates" icon="📰" className="resource-news-panel">
          <div className="resource-hero-card">
            <div>
              <strong>2026</strong>
              <span>New Personal Lines brand strategy</span>
              <button onClick={() => openLibrary('Training Resources')}>Learn More</button>
            </div>
          </div>
          {agencyUpdates.map((item) => (
            <article key={`${item.date}-${item.title}`} className="resource-news-item resource-clickable" onClick={() => openUpdate(item)}>
              <small>{item.date} | {item.category}</small>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
            </article>
          ))}
        </Panel>

        <Panel title="Key Dates" icon="📅">
          <div className="resource-date-list">{keyDates.map((item) => <div key={item.label}><strong>{item.date}</strong><span>{item.label}</span></div>)}</div>
        </Panel>

        <Panel title="Rate and Rules" icon="📌">
          <div className="resource-rules-list">{rateRules.map((item) => <article key={item.title}><small>{item.date} · {item.line} · {item.state}</small><button onClick={() => openRule(item)}>{item.title}</button></article>)}</div>
        </Panel>
      </div>

      <section className="resource-product-page">
        <div className="resource-product-hero">
          <h2>RESOURCE SHORTCUTS</h2>
          {resourceTiles.map((tile) => <button key={tile.title} onClick={() => onNavigate(tile.target)} title={tile.description}>{tile.title}</button>)}
        </div>
        <div className="resource-link-columns">
          <div><h3>Personal Lines</h3><button onClick={() => openLibrary('Personal Lines Resources')}>Resource Library</button><button onClick={() => onNavigate('personal-lines')}>Open Portal</button></div>
          <div><h3>Commercial Lines</h3><button onClick={() => openLibrary('Commercial Lines Resources')}>Resource Library</button><button onClick={() => onNavigate('commercial-lines')}>Open Portal</button></div>
          <div><h3>Training &amp; Manuals</h3><button onClick={() => openLibrary('Training Resources')}>Training Resources</button><button onClick={() => openLibrary('Manuals & Product Guides')}>Manuals &amp; Guides</button><button onClick={() => openLibrary('Underwriting Reminders')}>Underwriting Reminders</button></div>
        </div>
      </section>

      {detail && (
        <Modal title={detail.title} onClose={() => setDetail(null)}>
          <div className="sf-modal-detail-copy">
            {detail.meta && <p className="eyebrow">{detail.meta}</p>}
            <p>{detail.body}</p>
            {detail.bullets && (
              <ul className="module-list">{detail.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            )}
          </div>
          <div className="button-row right">
            {detail.link && <button className="outline-button" onClick={() => { onNavigate(detail.link); setDetail(null); }}>Open Related Page</button>}
            <button className="primary-button" onClick={() => setDetail(null)}>Close</button>
          </div>
        </Modal>
      )}
    </main>
  );
}
