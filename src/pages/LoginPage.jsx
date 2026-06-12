import { useMemo, useState } from 'react';
import lavaWordmark from '../assets/lava-wordmark.png';
import lavaIcon from '../assets/lava-icon.png';

const ACCOUNT_STORAGE_KEY = 'apexCrm2.vaAccounts';

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

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function loadAccounts() {
  try {
    const raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function makePassword() {
  const groups = ['ABCDEFGHJKLMNPQRSTUVWXYZ', 'abcdefghijkmnopqrstuvwxyz', '23456789', '!@#$%'];
  const required = groups.map((chars) => chars[Math.floor(Math.random() * chars.length)]);
  const pool = groups.join('');
  const rest = Array.from({ length: 8 }, () => pool[Math.floor(Math.random() * pool.length)]);
  return [...required, ...rest].sort(() => Math.random() - 0.5).join('');
}

export default function LoginPage({ onLogin, lastLogin }) {
  const [mode, setMode] = useState('login');
  const [notice, setNotice] = useState('');
  const [touched, setTouched] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    batch: '',
    password: '',
    confirmPassword: ''
  });
  const [resetForm, setResetForm] = useState({ email: '', password: '', confirmPassword: '' });

  const [accountCount, setAccountCount] = useState(() => loadAccounts().length);

  const createErrors = useMemo(() => {
    const result = {};
    if (!createForm.firstName.trim()) result.firstName = 'First name is required.';
    if (!createForm.lastName.trim()) result.lastName = 'Last name is required.';
    if (!createForm.batch.trim()) result.batch = 'Training batch is required.';
    if (!isEmail(normalizeEmail(createForm.email))) result.email = 'Enter a valid company email address.';
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

  const resetErrors = useMemo(() => {
    const result = {};
    if (!isEmail(normalizeEmail(resetForm.email))) result.email = 'Enter your registered email address.';
    if (resetForm.password.length < 8) result.password = 'New password must be at least 8 characters.';
    if (resetForm.confirmPassword !== resetForm.password) result.confirmPassword = 'Passwords must match.';
    return result;
  }, [resetForm]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setTouched(false);
    setNotice('');
  };

  const updateLogin = (field, value) => setLoginForm((current) => ({ ...current, [field]: value }));
  const updateCreate = (field, value) => setCreateForm((current) => ({ ...current, [field]: value }));
  const updateReset = (field, value) => setResetForm((current) => ({ ...current, [field]: value }));

  const handleLogin = (event) => {
    event.preventDefault();
    setTouched(true);
    setNotice('');
    if (Object.keys(loginErrors).length > 0) return;

    const accounts = loadAccounts();
    const email = normalizeEmail(loginForm.email);
    const account = accounts.find((item) => normalizeEmail(item.email) === email);
    if (!account || account.password !== loginForm.password) {
      setNotice('We could not verify that email and password. Please try again or reset your password.');
      return;
    }

    const updatedAccount = { ...account, lastLoginAt: new Date().toISOString() };
    saveAccounts(accounts.map((item) => (normalizeEmail(item.email) === email ? updatedAccount : item)));
    onLogin({
      firstName: updatedAccount.firstName,
      lastName: updatedAccount.lastName,
      batch: updatedAccount.batch,
      email: updatedAccount.email
    });
  };

  const handleCreateAccount = (event) => {
    event.preventDefault();
    setTouched(true);
    setNotice('');
    if (Object.keys(createErrors).length > 0) return;

    const accounts = loadAccounts();
    const email = normalizeEmail(createForm.email);
    if (accounts.some((item) => normalizeEmail(item.email) === email)) {
      setNotice('An account already exists for this email. Please sign in or use Forgot Password.');
      return;
    }

    const account = {
      id: `VA-${Date.now()}`,
      firstName: createForm.firstName.trim(),
      lastName: createForm.lastName.trim(),
      email,
      batch: createForm.batch.trim(),
      password: createForm.password,
      createdAt: new Date().toISOString(),
      lastLoginAt: ''
    };
    saveAccounts([account, ...accounts]);
    setAccountCount(accounts.length + 1);
    setLoginForm({ email, password: '' });
    setCreateForm({ firstName: '', lastName: '', email: '', batch: '', password: '', confirmPassword: '' });
    switchMode('login');
    setNotice('Account created successfully. Please sign in using the password you created.');
  };

  const handleResetPassword = (event) => {
    event.preventDefault();
    setTouched(true);
    setNotice('');
    if (Object.keys(resetErrors).length > 0) return;

    const accounts = loadAccounts();
    const email = normalizeEmail(resetForm.email);
    const existing = accounts.find((item) => normalizeEmail(item.email) === email);
    if (!existing) {
      setNotice('No simulator account was found for that email. Please create a new account.');
      return;
    }

    saveAccounts(accounts.map((item) => (
      normalizeEmail(item.email) === email ? { ...item, password: resetForm.password, passwordUpdatedAt: new Date().toISOString() } : item
    )));
    setLoginForm({ email, password: '' });
    setResetForm({ email: '', password: '', confirmPassword: '' });
    switchMode('login');
    setNotice('Password updated. Please sign in with your new password.');
  };

  const useGeneratedCreatePassword = () => {
    const password = makePassword();
    setCreateForm((current) => ({ ...current, password, confirmPassword: password }));
    setNotice('A simulator password was generated. Please save it before signing in.');
  };

  const useGeneratedResetPassword = () => {
    const password = makePassword();
    setResetForm((current) => ({ ...current, password, confirmPassword: password }));
    setNotice('A new simulator password was generated. Please save it before signing in.');
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
          Create your VA simulator account, sign in with your password, and practice the Farmers/APEX-style dashboard using training-safe dummy data only.
        </p>

        <div className="login-feature-grid lava-feature-grid">
          <article><strong>VA Account Access</strong><span>Each trainee creates a local simulator profile before entering the training portal.</span></article>
          <article><strong>Workflow Practice</strong><span>Practice Leads, Accounts, Alerts, Quote New Account, Helpful Links, and dashboard navigation in one controlled training space.</span></article>
          <article><strong>Training Safe</strong><span>No real customer data, no live carrier login, and no real policy processing inside the simulator.</span></article>
        </div>
      </section>

      <section className="login-card lava-login-card" aria-label="VA login and account access form">
        <div className="login-card-header lava-login-card-header">
          <img src={lavaIcon} alt="" aria-hidden="true" />
          <div>
            <p className="eyebrow">Authorized Training Access</p>
            <h2>{mode === 'create' ? 'Create VA Account' : mode === 'reset' ? 'Reset Password' : 'VA Login'}</h2>
            <span>LAVA Insurance Operations Training Portal</span>
          </div>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Login options">
          <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Sign In</button>
          <button type="button" className={mode === 'create' ? 'active' : ''} onClick={() => switchMode('create')}>Create Account</button>
          <button type="button" className={mode === 'reset' ? 'active' : ''} onClick={() => switchMode('reset')}>Forgot Password</button>
        </div>

        {notice && <div className="auth-notice" role="status">{notice}</div>}

        {mode === 'login' && (
          <form onSubmit={handleLogin} noValidate className="login-form lava-auth-form">
            <label>
              <span>Email Address</span>
              <input
                className="input"
                value={loginForm.email}
                onChange={(event) => updateLogin('email', event.target.value)}
                onBlur={() => setTouched(true)}
                autoComplete="email"
                placeholder="example@lavaautomation.com"
              />
              {touched && loginErrors.email && <small className="form-error">{loginErrors.email}</small>}
            </label>

            <label>
              <span>Password</span>
              <input
                className="input"
                type="password"
                value={loginForm.password}
                onChange={(event) => updateLogin('password', event.target.value)}
                onBlur={() => setTouched(true)}
                autoComplete="current-password"
                placeholder="Enter your password"
              />
              {touched && loginErrors.password && <small className="form-error">{loginErrors.password}</small>}
            </label>

            <div className="auth-row-actions">
              <button type="button" onClick={() => switchMode('reset')}>Forgot password?</button>
              <button type="button" onClick={() => switchMode('create')}>New VA? Create account</button>
            </div>

            <div className="last-login-box">
              <strong>Last Simulator Login</strong>
              <span>{formatLoginTime(lastLogin?.loginAt)}</span>
              {lastLogin?.displayName && <em>Previous trainee: {lastLogin.displayName} · {lastLogin.batch}</em>}
            </div>

            <button className="primary-button login-submit" type="submit">Sign In to Training Portal</button>
          </form>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreateAccount} noValidate className="login-form lava-auth-form">
            <div className="two-field-grid">
              <label>
                <span>First Name</span>
                <input className="input" value={createForm.firstName} onChange={(event) => updateCreate('firstName', event.target.value)} onBlur={() => setTouched(true)} autoComplete="given-name" placeholder="Example: Jonas" />
                {touched && createErrors.firstName && <small className="form-error">{createErrors.firstName}</small>}
              </label>
              <label>
                <span>Last Name</span>
                <input className="input" value={createForm.lastName} onChange={(event) => updateCreate('lastName', event.target.value)} onBlur={() => setTouched(true)} autoComplete="family-name" placeholder="Example: Rosauro" />
                {touched && createErrors.lastName && <small className="form-error">{createErrors.lastName}</small>}
              </label>
            </div>

            <label>
              <span>Company Email Address</span>
              <input className="input" value={createForm.email} onChange={(event) => updateCreate('email', event.target.value)} onBlur={() => setTouched(true)} autoComplete="email" placeholder="example@lavaautomation.com" />
              {touched && createErrors.email && <small className="form-error">{createErrors.email}</small>}
            </label>

            <label>
              <span>Training Batch</span>
              <input className="input" value={createForm.batch} onChange={(event) => updateCreate('batch', event.target.value)} onBlur={() => setTouched(true)} placeholder="Example: Farmers Batch 01 - June 2026" />
              {touched && createErrors.batch && <small className="form-error">{createErrors.batch}</small>}
            </label>

            <div className="password-toolbar">
              <span>Create a password for this simulator account.</span>
              <button type="button" onClick={useGeneratedCreatePassword}>Generate Password</button>
            </div>

            <div className="two-field-grid">
              <label>
                <span>Password</span>
                <input className="input" type="password" value={createForm.password} onChange={(event) => updateCreate('password', event.target.value)} onBlur={() => setTouched(true)} autoComplete="new-password" placeholder="Minimum 8 characters" />
                {touched && createErrors.password && <small className="form-error">{createErrors.password}</small>}
              </label>
              <label>
                <span>Confirm Password</span>
                <input className="input" type="password" value={createForm.confirmPassword} onChange={(event) => updateCreate('confirmPassword', event.target.value)} onBlur={() => setTouched(true)} autoComplete="new-password" placeholder="Re-enter password" />
                {touched && createErrors.confirmPassword && <small className="form-error">{createErrors.confirmPassword}</small>}
              </label>
            </div>

            <button className="primary-button login-submit" type="submit">Create Account</button>
            <p className="auth-fine-print">This creates a local simulator account for training only. Do not use a real production password.</p>
          </form>
        )}

        {mode === 'reset' && (
          <form onSubmit={handleResetPassword} noValidate className="login-form lava-auth-form">
            <label>
              <span>Registered Email Address</span>
              <input className="input" value={resetForm.email} onChange={(event) => updateReset('email', event.target.value)} onBlur={() => setTouched(true)} autoComplete="email" placeholder="example@lavaautomation.com" />
              {touched && resetErrors.email && <small className="form-error">{resetErrors.email}</small>}
            </label>

            <div className="password-toolbar">
              <span>Enter a new password or let the simulator generate one.</span>
              <button type="button" onClick={useGeneratedResetPassword}>Generate Password</button>
            </div>

            <div className="two-field-grid">
              <label>
                <span>New Password</span>
                <input className="input" type="password" value={resetForm.password} onChange={(event) => updateReset('password', event.target.value)} onBlur={() => setTouched(true)} autoComplete="new-password" placeholder="Minimum 8 characters" />
                {touched && resetErrors.password && <small className="form-error">{resetErrors.password}</small>}
              </label>
              <label>
                <span>Confirm New Password</span>
                <input className="input" type="password" value={resetForm.confirmPassword} onChange={(event) => updateReset('confirmPassword', event.target.value)} onBlur={() => setTouched(true)} autoComplete="new-password" placeholder="Re-enter new password" />
                {touched && resetErrors.confirmPassword && <small className="form-error">{resetErrors.confirmPassword}</small>}
              </label>
            </div>

            <button className="primary-button login-submit" type="submit">Update Password</button>
            <p className="auth-fine-print">Password reset is handled inside this simulator. No email is sent because this is not connected to a live authentication service.</p>
          </form>
        )}

        <div className="auth-footer-strip">
          <strong>{accountCount}</strong>
          <span>local VA simulator account{accountCount === 1 ? '' : 's'} registered on this device</span>
        </div>
      </section>
    </main>
  );
}
