import { useState } from 'react';

export const VA_CAN = [
  'Collect information',
  'Enter data into the CRM',
  'Create tasks',
  'Prepare quote intake notes',
  'Upload documents',
  'Send approved follow-up reminders',
  'Route service requests',
  'Update CRM notes',
  'Prepare COI / service request drafts for review'
];

export const VA_CANNOT = [
  'Bind coverage',
  'Recommend coverage limits',
  'Interpret policy language',
  'Promise premium changes',
  'Confirm coverage decisions',
  'Approve claims',
  'Give legal or coverage advice',
  'Tell a customer they are covered without licensed review'
];

export const LICENSED_REVIEW_MESSAGE = 'Licensed agent review required before this action can be finalized.';

// Always-visible reminder of what an unlicensed VA may and may not do.
export function ComplianceBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="compliance-box" role="note">
        <strong>Unlicensed VA reminder:</strong> you may collect information, enter data, create tasks, and route requests.
        You may not bind, quote without approval, interpret coverage, or confirm a customer is covered. When in doubt, document and escalate.
      </div>
    );
  }
  return (
    <div className="compliance-split">
      <div className="compliance-col can">
        <h3>✓ A VA can</h3>
        <ul>{VA_CAN.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <div className="compliance-col cannot">
        <h3>✕ A VA cannot</h3>
        <ul>{VA_CANNOT.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
    </div>
  );
}

// Button that represents a licensed-only action. Clicking it surfaces the required review message
// instead of letting an unlicensed VA finalize the action.
export function RestrictedButton({ label, onBlocked }) {
  const [blocked, setBlocked] = useState(false);
  return (
    <span className="restricted-wrap">
      <button
        type="button"
        className="restricted-button"
        onClick={() => { setBlocked(true); if (onBlocked) onBlocked(LICENSED_REVIEW_MESSAGE); }}
      >
        🔒 {label}
      </button>
      {blocked && <span className="restricted-message" role="alert">{LICENSED_REVIEW_MESSAGE}</span>}
    </span>
  );
}
