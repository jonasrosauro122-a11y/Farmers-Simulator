import { useMemo, useState } from 'react';

function formatLoginTime(value) {
  if (!value) return 'No previous login recorded yet.';
  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function LoginPage({ onLogin, lastLogin }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', batch: '' });
  const [touched, setTouched] = useState(false);

  const errors = useMemo(() => {
    const result = {};
    if (!form.firstName.trim()) result.firstName = 'First name is required.';
    if (!form.lastName.trim()) result.lastName = 'Last name is required.';
    if (!form.batch.trim()) result.batch = 'Trainee batch is required.';
    return result;
  }, [form]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (Object.keys(errors).length > 0) return;
    onLogin({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      batch: form.batch.trim()
    });
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-brand-block">
          <div className="login-app-launcher" aria-hidden="true">
            <span /><span /><span /><span /><span /><span /><span /><span /><span />
          </div>
          <div>
            <p className="eyebrow">Insurance Training Simulator</p>
            <h1>APEX CRM Simulator</h1>
          </div>
        </div>
        <h2>Practice insurance CRM navigation before working live accounts.</h2>
        <p>
          Log in as a trainee to personalize the dashboard, save your local simulator data, and track your training batch.
        </p>
        <div className="login-feature-grid">
          <article><strong>Navigation Practice</strong><span>Home, Leads, Lead Depot, Accounts, Tasks, Reports, Alerts, and utilities.</span></article>
          <article><strong>Insurance Workflows</strong><span>Quote follow-up, renewals, claims routing, billing reminders, and compliance practice.</span></article>
          <article><strong>Training Safe</strong><span>Mock data only. No real customers, no protected carrier branding, and no live sending.</span></article>
        </div>
      </section>

      <section className="login-card" aria-label="Trainee login form">
        <div className="login-card-header">
          <p className="eyebrow">Trainee Access</p>
          <h2>Login Landing Page</h2>
          <span>Enter your name and trainee batch to start.</span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="login-form">
          <label>
            <span>First Name</span>
            <input
              className="input"
              value={form.firstName}
              onChange={(event) => update('firstName', event.target.value)}
              onBlur={() => setTouched(true)}
              autoComplete="given-name"
              placeholder="Example: Jonas"
            />
            {touched && errors.firstName && <small className="form-error">{errors.firstName}</small>}
          </label>

          <label>
            <span>Last Name</span>
            <input
              className="input"
              value={form.lastName}
              onChange={(event) => update('lastName', event.target.value)}
              onBlur={() => setTouched(true)}
              autoComplete="family-name"
              placeholder="Example: Rosauro"
            />
            {touched && errors.lastName && <small className="form-error">{errors.lastName}</small>}
          </label>

          <label>
            <span>Batch of Trainees</span>
            <input
              className="input"
              value={form.batch}
              onChange={(event) => update('batch', event.target.value)}
              onBlur={() => setTouched(true)}
              placeholder="Example: Batch 01 - June 2026"
            />
            {touched && errors.batch && <small className="form-error">{errors.batch}</small>}
          </label>

          <div className="last-login-box">
            <strong>Last Login Time</strong>
            <span>{formatLoginTime(lastLogin?.loginAt)}</span>
            {lastLogin?.displayName && <em>Previous trainee: {lastLogin.displayName} · {lastLogin.batch}</em>}
          </div>

          <button className="primary-button login-submit" type="submit">Enter CRM Simulator</button>
        </form>
      </section>
    </main>
  );
}
