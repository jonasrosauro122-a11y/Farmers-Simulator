import { useMemo, useState } from 'react';
import lavaWordmark from '../assets/lava-wordmark.png';
import lavaIcon from '../assets/lava-icon.png';
import { getSupabase } from '../lib/supabaseClient.js';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// supabaseReady = real Supabase auth is configured.
// onLocalEnter   = fallback used only when Supabase keys are not set yet.
export default function LoginPage({ supabaseReady, onLocalEnter }) {
  const supabase = getSupabase();
  const [mode, setMode] = useState('login');
  const [notice, setNotice] = useState('');
  const [touched, setTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [createForm, setCreateForm] = useState({
    firstName: '', lastName: '', email: '', batch: '', password: '', confirmPassword: ''
  });
  const [resetForm, setResetForm] = useState({ email: '' });
  const [localForm, setLocalForm] = useState({ firstName: '', lastName: '', batch: '' });

  const createErrors = useMemo(() => {
    const result = {};
    if (!createForm.firstName.trim()) result.firstName = 'First name is required.';
    if (!createForm.lastName.trim()) result.lastName = 'Last name is required.';
    if (!createForm.batch.trim()) result.batch = 'Training batch is required.';
    if (!isEmail(normalizeEmail(createForm.email))) result.email = 'Enter a valid email address.';
    if (createForm.password.length < 8) result.password = 'Password must be at least 8 characters.';
    if (createForm.confirmPassword !== createForm.password) result.confirmPassword = 'Passwords must match.';
    return result;
  }, [createForm]);

  const loginErrors = useMemo(() => {
    const result = {};
    if (!isEmail(normalizeEmail(loginForm.email))) result.email = 'Enter your registered email address.';
    if (!loginForm.password) result.password = 'Password is required.';
    return result;
  }, [loginForm]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setTouched(false);
    setNotice('');
  };

  const updateLogin = (field, value) => setLoginForm((c) => ({ ...c, [field]: value }));
  const updateCreate = (field, value) => setCreateForm((c) => ({ ...c, [field]: value }));
  const updateLocal = (field, value) => setLocalForm((c) => ({ ...c, [field]: value }));

  // ---- Supabase auth handlers (the gate's onAuthStateChange picks up success) ----
  const handleLogin = async (event) => {
    event.preventDefault();
    setTouched(true);
    setNotice('');
    if (Object.keys(loginErrors).length > 0) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(loginForm.email),
      password: loginForm.password
    });
    setBusy(false);
    if (error) setNotice(error.message || 'We could not verify that email and password.');
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    setTouched(true);
    setNotice('');
    if (Object.keys(createErrors).length > 0) return;
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: normalizeEmail(createForm.email),
      password: createForm.password,
      options: {
        data: {
          first_name: createForm.firstName.trim(),
          last_name: createForm.lastName.trim(),
          batch: createForm.batch.trim()
        }
      }
    });
    setBusy(false);
    if (error) {
      setNotice(error.message || 'Could not create that account.');
      return;
    }
    // If email confirmation is OFF, a session is returned and the gate signs you in.
    // If it is ON, no session is returned and the trainee must confirm by email first.
    if (!data.session) {
      switchMode('login');
      setNotice('Account created. Check your email to confirm it, then sign in. (You can also turn off email confirmation in Supabase → Authentication → Providers.)');
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setTouched(true);
    setNotice('');
    if (!isEmail(normalizeEmail(resetForm.email))) {
      setNotice('Enter your registered email address.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(resetForm.email), {
      redirectTo: window.location.origin + '/login'
    });
    setBusy(false);
    if (error) setNotice(error.message || 'Could not start the password reset.');
    else {
      switchMode('login');
      setNotice('If an account exists for that email, a password reset link is on its way.');
    }
  };

  // ---- local preview fallback (no Supabase keys configured) ----
  const handleLocalEnter = (event) => {
    event.preventDefault();
    setTouched(true);
    if (!localForm.firstName.trim() || !localForm.lastName.trim()) {
      setNotice('Enter a first and last name to continue.');
      return;
    }
    onLocalEnter({
      firstName: localForm.firstName.trim(),
      lastName: localForm.lastName.trim(),
      batch: localForm.batch.trim() || 'Local Preview'
    });
  };

  return (
    <main className="login-page lava-login-page">
      <section className="login-hero lava-login-hero">
        <div className="login-brand-block lava-brand-block">
          <div className="lava-logo-shell">
            <img src={lavaWordmark} alt="LAVA Automation" />
          </div>
          <div>
            <p className="eyebrow">Insurance Operations Training Environment</p>
            <h1>LAVA Insurance Training Portal</h1>
          </div>
        </div>

        <h2>Secure VA access for insurance training, dashboard practice, and workflow simulation.</h2>
        <p>
          {supabaseReady
            ? 'Create your trainee account, sign in, and practice the Salesforce-style insurance CRM dashboard. Data is shared across all signed-in trainees and stored securely in Supabase.'
            : 'Practice the Salesforce-style insurance CRM dashboard using training-safe dummy data. Add your Supabase keys to enable real accounts and shared cloud data.'}
        </p>

        <div className="login-feature-grid lava-feature-grid">
          <article><strong>Account Access</strong><span>{supabaseReady ? 'Real signup and login backed by Supabase Auth.' : 'Local preview profile until Supabase is configured.'}</span></article>
          <article><strong>Workflow Practice</strong><span>Leads, Accounts, Alerts, Quote Center, Policies, Training, and dashboard navigation in one controlled space.</span></article>
          <article><strong>Training Safe</strong><span>No real customer data, no live carrier login, and no real policy processing inside the simulator.</span></article>
        </div>
      </section>

      <section className="login-card lava-login-card" aria-label="VA login and account access form">
        <div className="login-card-header lava-login-card-header">
          <img src={lavaIcon} alt="" aria-hidden="true" />
          <div>
            <p className="eyebrow">Authorized Training Access</p>
            <h2>{!supabaseReady ? 'Local Preview' : mode === 'create' ? 'Create Account' : mode === 'reset' ? 'Reset Password' : 'Trainee Login'}</h2>
            <span>LAVA Insurance Operations Training Portal</span>
          </div>
        </div>

        {!supabaseReady && (
          <div className="auth-notice" role="status">
            Supabase is not configured yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to a <code>.env</code> file to enable real accounts and shared cloud data. You can preview locally below.
          </div>
        )}

        {supabaseReady && (
          <div className="auth-tabs" role="tablist" aria-label="Login options">
            <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Sign In</button>
            <button type="button" className={mode === 'create' ? 'active' : ''} onClick={() => switchMode('create')}>Create Account</button>
            <button type="button" className={mode === 'reset' ? 'active' : ''} onClick={() => switchMode('reset')}>Forgot Password</button>
          </div>
        )}

        {notice && <div className="auth-notice" role="status">{notice}</div>}

        {!supabaseReady && (
          <form onSubmit={handleLocalEnter} noValidate className="login-form lava-auth-form">
            <div className="two-field-grid">
              <label>
                <span>First Name</span>
                <input className="input" value={localForm.firstName} onChange={(e) => updateLocal('firstName', e.target.value)} placeholder="Example: Jonas" />
              </label>
              <label>
                <span>Last Name</span>
                <input className="input" value={localForm.lastName} onChange={(e) => updateLocal('lastName', e.target.value)} placeholder="Example: Rosauro" />
              </label>
            </div>
            <label>
              <span>Training Batch</span>
              <input className="input" value={localForm.batch} onChange={(e) => updateLocal('batch', e.target.value)} placeholder="Example: Training Batch 01 - June 2026" />
            </label>
            <button className="primary-button login-submit" type="submit">Enter Local Preview</button>
            <p className="auth-fine-print">Local preview mode keeps data only in this browser. Configure Supabase for real accounts and shared data.</p>
          </form>
        )}

        {supabaseReady && mode === 'login' && (
          <form onSubmit={handleLogin} noValidate className="login-form lava-auth-form">
            <label>
              <span>Email Address</span>
              <input className="input" value={loginForm.email} onChange={(e) => updateLogin('email', e.target.value)} onBlur={() => setTouched(true)} autoComplete="email" placeholder="example@lavaautomation.com" />
              {touched && loginErrors.email && <small className="form-error">{loginErrors.email}</small>}
            </label>
            <label>
              <span>Password</span>
              <input className="input" type="password" value={loginForm.password} onChange={(e) => updateLogin('password', e.target.value)} onBlur={() => setTouched(true)} autoComplete="current-password" placeholder="Enter your password" />
              {touched && loginErrors.password && <small className="form-error">{loginErrors.password}</small>}
            </label>
            <div className="auth-row-actions">
              <button type="button" onClick={() => switchMode('reset')}>Forgot password?</button>
              <button type="button" onClick={() => switchMode('create')}>New trainee? Create account</button>
            </div>
            <button className="primary-button login-submit" type="submit" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign In to Training Portal'}
            </button>
          </form>
        )}

        {supabaseReady && mode === 'create' && (
          <form onSubmit={handleCreateAccount} noValidate className="login-form lava-auth-form">
            <div className="two-field-grid">
              <label>
                <span>First Name</span>
                <input className="input" value={createForm.firstName} onChange={(e) => updateCreate('firstName', e.target.value)} onBlur={() => setTouched(true)} autoComplete="given-name" placeholder="Example: Jonas" />
                {touched && createErrors.firstName && <small className="form-error">{createErrors.firstName}</small>}
              </label>
              <label>
                <span>Last Name</span>
                <input className="input" value={createForm.lastName} onChange={(e) => updateCreate('lastName', e.target.value)} onBlur={() => setTouched(true)} autoComplete="family-name" placeholder="Example: Rosauro" />
                {touched && createErrors.lastName && <small className="form-error">{createErrors.lastName}</small>}
              </label>
            </div>
            <label>
              <span>Email Address</span>
              <input className="input" value={createForm.email} onChange={(e) => updateCreate('email', e.target.value)} onBlur={() => setTouched(true)} autoComplete="email" placeholder="example@lavaautomation.com" />
              {touched && createErrors.email && <small className="form-error">{createErrors.email}</small>}
            </label>
            <label>
              <span>Training Batch</span>
              <input className="input" value={createForm.batch} onChange={(e) => updateCreate('batch', e.target.value)} onBlur={() => setTouched(true)} placeholder="Example: Training Batch 01 - June 2026" />
              {touched && createErrors.batch && <small className="form-error">{createErrors.batch}</small>}
            </label>
            <div className="two-field-grid">
              <label>
                <span>Password</span>
                <input className="input" type="password" value={createForm.password} onChange={(e) => updateCreate('password', e.target.value)} onBlur={() => setTouched(true)} autoComplete="new-password" placeholder="Minimum 8 characters" />
                {touched && createErrors.password && <small className="form-error">{createErrors.password}</small>}
              </label>
              <label>
                <span>Confirm Password</span>
                <input className="input" type="password" value={createForm.confirmPassword} onChange={(e) => updateCreate('confirmPassword', e.target.value)} onBlur={() => setTouched(true)} autoComplete="new-password" placeholder="Re-enter password" />
                {touched && createErrors.confirmPassword && <small className="form-error">{createErrors.confirmPassword}</small>}
              </label>
            </div>
            <button className="primary-button login-submit" type="submit" disabled={busy}>
              {busy ? 'Creating…' : 'Create Account'}
            </button>
            <p className="auth-fine-print">This is a training account. Please do not reuse a real production password.</p>
          </form>
        )}

        {supabaseReady && mode === 'reset' && (
          <form onSubmit={handleResetPassword} noValidate className="login-form lava-auth-form">
            <label>
              <span>Registered Email Address</span>
              <input className="input" value={resetForm.email} onChange={(e) => setResetForm({ email: e.target.value })} onBlur={() => setTouched(true)} autoComplete="email" placeholder="example@lavaautomation.com" />
            </label>
            <button className="primary-button login-submit" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send Reset Link'}
            </button>
            <p className="auth-fine-print">A password reset link is emailed by Supabase. Configure an email provider in your Supabase project for delivery.</p>
          </form>
        )}
      </section>
    </main>
  );
}
