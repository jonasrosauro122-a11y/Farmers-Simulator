import { useMemo, useState } from 'react';
import Panel from '../components/Panel.jsx';
import { chatTranscripts, serviceOpsAnswers } from '../data/portalData.js';
import { todayISO } from '../utils/dates.js';

function findAnswer(question) {
  const term = question.toLowerCase();
  const found = serviceOpsAnswers.find((item) => item.keywords.some((word) => term.includes(word)));
  return found || serviceOpsAnswers[0];
}

export default function ServiceOpsPage({ serviceRequests = [], onCreateRequest, onNavigate, onCreateTask, onToast }) {
  const [tab, setTab] = useState('Home');
  const [question, setQuestion] = useState('can you request a change on a policy that is moving in a few days');
  const [answer, setAnswer] = useState(findAnswer(question));
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState({ customer: '', policyNumber: '', lob: 'Personal Lines', inquiry: 'Policy Change', summary: '' });

  const openRequests = useMemo(() => serviceRequests.filter((request) => request.status === 'Open'), [serviceRequests]);

  const ask = () => {
    const result = findAnswer(question);
    setAnswer(result);
    onToast?.('Service Ops answer generated from simulator knowledge.');
  };

  const createRequest = () => {
    if (!draft.customer.trim()) return;
    const priority = draft.inquiry.includes('Cancellation') || draft.inquiry.includes('Billing') ? 'High' : 'Normal';
    const created = onCreateRequest?.({
      customer: draft.customer,
      household: `${draft.customer} Account`,
      subStatus: 'Customer/Agent Review',
      policyNumber: draft.policyNumber || 'Pending',
      lob: draft.lob,
      inquiry: draft.inquiry,
      owner: 'Service Ops Queue',
      priority,
      summary: draft.summary || 'New simulated service request created by trainee.'
    });
    if (created) {
      setSelected(created);
      setTab('View Service Requests');
      onCreateTask?.({ title: `Service request follow-up — ${draft.customer}`, relatedTo: draft.customer, relatedType: 'Service Request', priority: priority === 'High' ? 'High' : 'Medium', dueDate: todayISO(), notes: `Created ${created.id}: ${created.inquiry}` });
    }
    setDraft({ customer: '', policyNumber: '', lob: 'Personal Lines', inquiry: 'Policy Change', summary: '' });
    onToast?.('Service request created and follow-up task added.');
  };

  return (
    <main className="service-ops-page">
      <header className="service-ops-topbar">
        <div className="service-ops-brand"><span>▲</span><strong>LAVA Service Ops</strong></div>
        <select aria-label="Agent Code"><option>Allison Demo Agency (9532C1)</option><option>Training Agency (0000)</option></select>
      </header>

      <nav className="service-ops-nav">
        {['Home', 'View Service Requests', 'Create Service Request', 'Find Customer Chat Transcripts'].map((item) => <button key={item} className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}
      </nav>

      {tab === 'Home' && (
        <section className="service-ops-home">
          <h1>Ask Service Ops</h1>
          <div className="service-ops-prompt-cards">
            {['How do I request a policy change?', 'How do I update billing?', 'How can I access an issued policy?', 'What is required for service request setup?'].map((item) => <button key={item} onClick={() => { setQuestion(item); setAnswer(findAnswer(item)); }}>{item}</button>)}
          </div>
          <div className="ask-service-box">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question. Add specifics: line, status, product, system mode." />
            <select defaultValue="CA"><option>CA</option><option>AZ</option><option>TX</option><option>All</option></select>
            <button onClick={ask}>Search</button>
          </div>
          <Panel title={answer.title} icon="💬" className="service-answer-card">
            <p>{answer.answer}</p>
            <div className="service-answer-flow">
              <span>Collect details</span><span>Create request</span><span>Route to licensed staff</span><span>Document activity</span>
            </div>
            <div className="button-row">
              <button className="primary-button" onClick={() => setTab('Create Service Request')}>Create Service Request</button>
              <button className="outline-button" onClick={() => onNavigate('customer-info')}>Open Customer Info</button>
            </div>
          </Panel>
        </section>
      )}

      {tab === 'View Service Requests' && (
        <section className="service-ops-list-section">
          <div className="service-ops-filterbar"><input placeholder="Filter by customer, search status" /><button disabled>Filter</button><button onClick={() => setTab('Create Service Request')}>New</button></div>
          <h1>Service Requests</h1>
          <p>Customer report status needed. Service requests should 45 days and over as not able to be opened.</p>
          <div className="service-table-wrap service-ops-table-wrap">
            <table className="service-requests-table">
              <thead><tr><th>View</th><th>Brand</th><th>Date Opened</th><th>Last Modified</th><th>Date Closed</th><th>SR #</th><th>Status</th><th>Insured</th><th>Inquiry Type</th><th>Source</th><th>Contact</th></tr></thead>
              <tbody>
                {openRequests.slice(0, 12).map((request) => (
                  <tr key={request.id} className={selected?.id === request.id ? 'selected' : ''}>
                    <td><button className="service-link" onClick={() => setSelected(request)}>View</button></td>
                    <td>LAVA</td><td>{request.dateOpened}</td><td>{request.estimatedCompletion}</td><td>—</td><td>{request.id.replace('SR-', '')}</td><td><button>{request.status}</button></td><td>{request.customer}</td><td>{request.inquiry}</td><td>Email</td><td>Training Queue</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selected && (
            <aside className="service-ops-side-card">
              <h2>{selected.id} · {selected.inquiry}</h2>
              <p>{selected.summary}</p>
              <dl><div><dt>Customer</dt><dd>{selected.customer}</dd></div><div><dt>Policy</dt><dd>{selected.policyNumber}</dd></div><div><dt>LOB</dt><dd>{selected.lob}</dd></div><div><dt>Owner</dt><dd>{selected.owner}</dd></div></dl>
              <button onClick={() => onCreateTask?.({ title: `Work ${selected.id}`, relatedTo: selected.customer, relatedType: 'Service Request', priority: 'Medium', dueDate: todayISO() })}>Create Activity</button>
            </aside>
          )}
        </section>
      )}

      {tab === 'Create Service Request' && (
        <section className="workspace page-bg service-ops-create">
          <Panel title="Create Service Request" icon="🛠️">
            <p className="helper-text">Create a dummy service request for endorsements, billing, documents, COI, ID card, cancellation, claim follow-up, or audit support.</p>
            <div className="form-grid">
              <label><span>Customer / Business Name</span><input className="input" value={draft.customer} onChange={(e) => setDraft({ ...draft, customer: e.target.value })} /></label>
              <label><span>Policy Number</span><input className="input" value={draft.policyNumber} onChange={(e) => setDraft({ ...draft, policyNumber: e.target.value })} /></label>
              <label><span>Line</span><select className="input" value={draft.lob} onChange={(e) => setDraft({ ...draft, lob: e.target.value })}><option>Personal Lines</option><option>Commercial Lines</option><option>Billing</option><option>Claims</option></select></label>
              <label><span>Inquiry Type</span><select className="input" value={draft.inquiry} onChange={(e) => setDraft({ ...draft, inquiry: e.target.value })}><option>Policy Change</option><option>Billing Question</option><option>Document Request</option><option>Certificate Request</option><option>Driver Update</option><option>Cancellation Question</option><option>Audit Payroll</option></select></label>
            </div>
            <label><span>Request Details</span><textarea className="input" rows="4" value={draft.summary} onChange={(e) => setDraft({ ...draft, summary: e.target.value })} placeholder="Document the request exactly. Licensed questions must be escalated." /></label>
            <div className="button-row right"><button className="outline-button" onClick={() => setTab('Home')}>Cancel</button><button className="primary-button" disabled={!draft.customer.trim()} onClick={createRequest}>Create Request</button></div>
          </Panel>
        </section>
      )}

      {tab === 'Find Customer Chat Transcripts' && (
        <section className="workspace page-bg service-ops-create">
          <Panel title="Customer Chat Transcripts" icon="💬">
            <div className="table-wrap"><table className="data-table"><thead><tr><th>Transcript</th><th>Customer</th><th>Topic</th><th>Result</th></tr></thead><tbody>{chatTranscripts.map((row) => <tr key={row.id}><td><button className="table-text-link" onClick={() => onToast?.(`Opened ${row.id} (simulated).`)}>{row.id}</button></td><td>{row.customer}</td><td>{row.topic}</td><td>{row.result}</td></tr>)}</tbody></table></div>
          </Panel>
        </section>
      )}
    </main>
  );
}
