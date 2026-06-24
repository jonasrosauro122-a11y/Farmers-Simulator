import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';

const STAGES = [
  { id: 'new', label: 'New Lead', note: 'Lead just arrived. Verify contact info and lead source.' },
  { id: 'contacted', label: 'Contacted', note: 'First outreach made. Log the conversation and interest.' },
  { id: 'warm', label: 'Warm Lead', note: 'Engaged and interested. Confirm products to quote.' },
  { id: 'waiting', label: 'Waiting for Response', note: 'Awaiting info or a call back. Set a follow-up task.' },
  { id: 'quote-prepared', label: 'Quote Prepared', note: 'Intake complete; licensed agent prepares the quote.' },
  { id: 'quote-sent', label: 'Quote Sent', note: 'Quote delivered. Schedule a follow-up.' },
  { id: 'follow-up', label: 'Follow-Up Needed', note: 'Nudge the prospect with the approved script.' },
  { id: 'closed-won', label: 'Closed Won', note: 'Bound by a licensed agent. Convert to an account.' },
  { id: 'closed-lost', label: 'Closed Lost', note: 'Did not move forward. Record the reason.' }
];

const PRODUCT_MATCH = [
  { need: 'Buying a single-family home they will live in', answer: 'Home', options: ['Home', 'Renters', 'Condo', 'Dwelling Fire'] },
  { need: 'Renting an apartment, wants contents covered', answer: 'Renters', options: ['Home', 'Renters', 'Umbrella', 'Condo'] },
  { need: 'Owns a unit in an HOA building', answer: 'Condo', options: ['Home', 'Condo', 'Dwelling Fire', 'Auto'] },
  { need: 'Has assets and wants extra liability protection', answer: 'Umbrella', options: ['Auto', 'Umbrella', 'Renters', 'Home'] },
  { need: 'Two cars and two drivers in the household', answer: 'Auto', options: ['Auto', 'Umbrella', 'Home', 'Condo'] }
];

export default function ProductLearningPage({ onNavigate }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [picks, setPicks] = useState({});
  const stage = STAGES[stageIndex];
  const correct = PRODUCT_MATCH.filter((q, i) => picks[i] === q.answer).length;

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Sales · Product Learning</p>
          <h1>Lead Stages & Product Matching <InfoTip text="Walk a sample lead through the sales stages, then match customer needs to the right product. This is learning practice — no real customer is affected." /></h1>
          <span>Understand the sales pipeline from new lead to closed, and practice matching needs to products.</span>
        </div>
      </div>

      <ComplianceBanner compact />

      <Panel title="Lead Stage Flow" icon="🧭">
        <p className="helper-text">Advance the sample lead through each stage. A VA moves leads and logs activity; only a licensed agent binds coverage at Closed Won.</p>
        <div className="stage-flow">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              className={`stage-chip ${i === stageIndex ? 'active' : ''} ${i < stageIndex ? 'done' : ''} ${s.id === 'closed-won' ? 'won' : ''} ${s.id === 'closed-lost' ? 'lost' : ''}`}
              onClick={() => setStageIndex(i)}
            >
              <span className="stage-num">{i + 1}</span>
              {s.label}
            </button>
          ))}
        </div>
        <div className="stage-detail">
          <strong>{stage.label}</strong>
          <p>{stage.note}</p>
          <div className="button-row">
            <button className="outline-button" onClick={() => setStageIndex((v) => Math.max(0, v - 1))} disabled={stageIndex === 0}>← Previous</button>
            <button className="primary-button" onClick={() => setStageIndex((v) => Math.min(STAGES.length - 1, v + 1))} disabled={stageIndex === STAGES.length - 1}>Advance stage →</button>
          </div>
        </div>
      </Panel>

      <Panel title="Product Matching Practice" icon="🎯">
        <p className="helper-text">Pick the best-fit product for each prospect. Matching the need to the product is a sales skill a VA uses during intake.</p>
        <div className="match-list">
          {PRODUCT_MATCH.map((q, i) => (
            <div className="match-row" key={q.need}>
              <span className="match-need">{q.need}</span>
              <div className="match-options">
                {q.options.map((opt) => {
                  const chosen = picks[i] === opt;
                  const state = chosen ? (opt === q.answer ? 'correct' : 'incorrect') : '';
                  return (
                    <button
                      key={opt}
                      className={`match-option ${chosen ? 'selected' : ''} ${state}`}
                      onClick={() => setPicks((prev) => ({ ...prev, [i]: opt }))}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="match-score">Score: {correct}/{PRODUCT_MATCH.length}{correct === PRODUCT_MATCH.length ? ' — all matched! 🎉' : ''}</div>
      </Panel>

      <Panel title="Practice Next" icon="📚">
        <div className="button-row">
          <button className="primary-button" onClick={() => onNavigate('leads')}>Work a lead</button>
          <button className="outline-button" onClick={() => onNavigate('quote-center')}>Prepare quote intake</button>
          <button className="outline-button" onClick={() => onNavigate('scenarios')}>Run a scenario</button>
        </div>
      </Panel>
    </main>
  );
}
