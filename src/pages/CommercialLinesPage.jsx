import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';

const PRODUCTS = [
  {
    id: 'gl', name: 'General Liability', icon: '⚖️',
    summary: 'Third-party bodily injury, property damage, and personal/advertising injury for a business.',
    coverages: ['Premises & operations liability', 'Products & completed operations', 'Personal & advertising injury', 'Medical payments'],
    intake: ['Legal business name & FEIN', 'Operations description', 'Annual revenue & payroll', 'Subcontractor use', 'Loss history'],
    service: 'COI requests, additional insured, and waiver of subrogation are common GL service items.'
  },
  {
    id: 'business-auto', name: 'Business Auto', icon: '🚚',
    summary: 'Liability and physical damage for vehicles owned, hired, or used by the business.',
    coverages: ['Liability (owned/hired/non-owned)', 'Collision & comprehensive', 'Uninsured motorist', 'Medical payments'],
    intake: ['Vehicles & VINs', 'Drivers & MVR consent', 'Radius of operation', 'Cargo / use', 'Lienholders'],
    service: 'Driver adds/removes and vehicle changes are frequent business-auto service requests.'
  },
  {
    id: 'bop', name: 'Business Owners Policy (BOP)', icon: '🏬',
    summary: 'Packaged property + liability coverage for eligible small businesses.',
    coverages: ['Building & business personal property', 'Business income / extra expense', 'General liability', 'Equipment breakdown (optional)'],
    intake: ['Location(s) & square footage', 'Building vs tenant', 'Annual sales', 'Protection class / alarms', 'Prior losses'],
    service: 'Endorsements, location changes, and renewal reviews are common BOP service items.'
  },
  {
    id: 'workers-comp', name: 'Workers Compensation', icon: '👷',
    summary: 'Statutory coverage for work-related employee injuries and lost wages.',
    coverages: ['Statutory workers compensation', "Employer's liability", 'Medical & indemnity benefits'],
    intake: ['Payroll by class code', 'Number of employees', 'Owner inclusion/exclusion', 'States of operation', 'Prior experience mod'],
    service: 'Payroll updates and annual audits are the core workers-comp service tasks.'
  },
  {
    id: 'commercial-property', name: 'Commercial Property', icon: '🏭',
    summary: 'Coverage for buildings, contents, and business income at insured locations.',
    coverages: ['Building', 'Business personal property', 'Business income', 'Inland marine (optional)'],
    intake: ['Location details & construction', 'Building value / replacement cost', 'Contents value', 'Protective safeguards', 'Lender/mortgagee'],
    service: 'Evidence of insurance and lender updates are frequent commercial-property requests.'
  },
  {
    id: 'coi', name: 'Certificates of Insurance', icon: '📜',
    summary: 'Proof-of-coverage documents issued to certificate holders.',
    coverages: ['Evidence of GL / Auto / WC / Property', 'Additional insured (when endorsed)', 'Waiver of subrogation (when endorsed)'],
    intake: ['Certificate holder name & address', 'Required wording / contract reference', 'Which policies to list', 'Deadline'],
    service: 'A VA can prepare and route COI drafts; issuance is licensed work in most states.'
  }
];

export default function CommercialLinesPage({ onNavigate }) {
  const [activeId, setActiveId] = useState('gl');
  const product = PRODUCTS.find((item) => item.id === activeId);

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Commercial Lines</p>
          <h1>Commercial Lines Products <InfoTip text="Pick a coverage to review the basics and the intake a VA should gather. Use the buttons to create commercial leads, accounts, or service requests." /></h1>
          <span>General Liability, Business Auto, BOP, Workers Comp, Commercial Property, and Certificates of Insurance.</span>
        </div>
        <div className="header-actions">
          <button className="primary-button" onClick={() => onNavigate('service-requests')}>Open Service Requests</button>
        </div>
      </div>

      <ComplianceBanner compact />

      <div className="lob-layout">
        <Panel title="Coverages" className="lob-rail">
          <div className="lob-rail-list">
            {PRODUCTS.map((item) => (
              <button
                key={item.id}
                className={`lob-rail-item ${item.id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(item.id)}
              >
                <span className="lob-icon">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel title={`${product.icon} ${product.name}`} className="lob-detail">
          <p className="helper-text">{product.summary}</p>
          <div className="lob-grid">
            <div className="lob-card">
              <h3>What it covers</h3>
              <ul>{product.coverages.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
            <div className="lob-card">
              <h3>Intake to collect</h3>
              <ul>{product.intake.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          </div>
          <div className="lob-cross-sell">
            <strong>Common service work:</strong> {product.service}
          </div>
          <div className="button-row">
            <button className="primary-button" onClick={() => onNavigate('accounts')}>Create commercial account</button>
            <button className="outline-button" onClick={() => onNavigate('leads')}>Create commercial lead</button>
            <button className="outline-button" onClick={() => onNavigate('service-requests')}>New service request</button>
          </div>
        </Panel>
      </div>
    </main>
  );
}
