import { useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { ComplianceBanner } from '../components/ComplianceGuard.jsx';

const PRODUCTS = [
  {
    id: 'home', name: 'Homeowners (HO-3)', icon: '🏠',
    summary: 'Owner-occupied home coverage on an open-perils dwelling basis.',
    coverages: [
      'Coverage A — Dwelling',
      'Coverage B — Other structures',
      'Coverage C — Personal property',
      'Coverage D — Loss of use',
      'Coverage E — Personal liability',
      'Coverage F — Medical payments'
    ],
    intake: ['Property address', 'Year built & square footage', 'Roof age & updates', 'Mortgagee/lender', 'Prior carrier & claims'],
    crossSell: 'Pair with Auto for a multi-policy household and add Umbrella for higher liability limits.'
  },
  {
    id: 'auto', name: 'Personal Auto', icon: '🚗',
    summary: 'Coverage for personal vehicles, drivers, and liability on the road.',
    coverages: ['Bodily injury & property damage liability', 'Collision & comprehensive', 'Uninsured/underinsured motorist', 'Medical payments / PIP', 'Roadside & rental reimbursement'],
    intake: ['Drivers (name, DOB, license)', 'Vehicles & VINs', 'Garaging address', 'Lienholder (if financed)', 'Prior coverage & claims'],
    crossSell: 'Bundle with Home or Renters; suggest Umbrella for households with assets to protect.'
  },
  {
    id: 'renters', name: 'Renters (HO-4)', icon: '🔑',
    summary: 'Personal property and liability protection for tenants.',
    coverages: ['Personal property', 'Personal liability', 'Loss of use', 'Medical payments'],
    intake: ['Rental address', 'Estimated contents value', 'Roommates / additional interests', 'Required by landlord?'],
    crossSell: 'Renters + Auto is a common first bundle for new customers.'
  },
  {
    id: 'condo', name: 'Condo (HO-6)', icon: '🏢',
    summary: 'Unit-owner coverage that fills gaps left by the master HOA policy.',
    coverages: ['Building/interior improvements', 'Personal property', 'Loss assessment', 'Personal liability', 'Loss of use'],
    intake: ['Unit address', 'HOA master policy type (bare walls vs all-in)', 'Improvements/betterments', 'Mortgagee'],
    crossSell: 'Add Auto and Umbrella; confirm loss assessment limit matches HOA exposure.'
  },
  {
    id: 'dwelling-fire', name: 'Dwelling Fire (DP-3)', icon: '🔥',
    summary: 'Coverage for rented or non-owner-occupied dwellings.',
    coverages: ['Dwelling', 'Other structures', 'Fair rental value', 'Personal liability (optional)'],
    intake: ['Property address', 'Occupancy (tenant/seasonal/vacant)', 'Lease term', 'Roof & systems age'],
    crossSell: 'Investors often need multiple Dwelling Fire policies plus an Umbrella.'
  },
  {
    id: 'umbrella', name: 'Personal Umbrella', icon: '☂️',
    summary: 'Extra liability limits above home and auto underlying policies.',
    coverages: ['Excess liability over auto/home', 'Broadened personal liability', 'Defense costs'],
    intake: ['Underlying auto/home limits', 'Number of vehicles & drivers', 'Rental properties', 'Watercraft / recreational exposure'],
    crossSell: 'Requires qualifying underlying limits — a natural add-on at quote and renewal.'
  }
];

export default function PersonalLinesPage({ onNavigate }) {
  const [activeId, setActiveId] = useState('home');
  const product = PRODUCTS.find((item) => item.id === activeId);

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Personal Lines</p>
          <h1>Personal Lines Products <InfoTip text="Pick a product to review what it covers and which intake details a VA should collect. Use the action buttons to start a lead or quote." /></h1>
          <span>Homeowners, Auto, Renters, Condo, Dwelling Fire, and Umbrella — coverage basics, intake checklists, and cross-sell prompts.</span>
        </div>
        <div className="header-actions">
          <button className="primary-button" onClick={() => onNavigate('quote-center')}>Open Quote Center</button>
        </div>
      </div>

      <ComplianceBanner compact />

      <div className="lob-layout">
        <Panel title="Products" className="lob-rail">
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
            <strong>Cross-sell:</strong> {product.crossSell}
          </div>
          <div className="button-row">
            <button className="primary-button" onClick={() => onNavigate('leads')}>Create a {product.name} lead</button>
            <button className="outline-button" onClick={() => onNavigate('quote-center')}>Prepare quote intake</button>
            <button className="outline-button" onClick={() => onNavigate('product-learning')}>Sales product learning</button>
          </div>
        </Panel>
      </div>
    </main>
  );
}
