import { useRef, useState } from 'react';
import { LEAD_INTERESTS, LINES } from '../data/leads.js';
import { todayISO } from '../utils/dates.js';

const SAMPLE = `Name,Email,Phone,Line,Interest,Product,State,Premium\nAva Morgan,ava.morgan@example.com,(555) 910-1001,Personal Lines,Home,Homeowners,AZ,1920\nCopper Ridge Services,admin@copperridge.example,(555) 910-1002,Commercial Lines,Commercial,Business Owner Policy,CA,6410`;

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).filter(Boolean);
  const dataRows = rows[0]?.toLowerCase().includes('name') ? rows.slice(1) : rows;
  return dataRows.map((row, index) => {
    const [name, email, phone, type, interest, product, state, premium] = row.split(',').map((value) => (value || '').trim());
    const missing = [];
    if (!name) missing.push('Name');
    if (!phone && !email) missing.push('Phone or Email');
    const lead = {
      name,
      email,
      phone,
      type: LINES.includes(type) ? type : 'Personal Lines',
      interest: LEAD_INTERESTS.includes(interest) ? interest : interest || 'Home',
      product: product || interest || 'Training Product',
      state: (state || 'AZ').toUpperCase().slice(0, 2),
      city: 'Imported',
      premium: Number(premium) || 0,
      status: 'New',
      priority: 'Medium',
      source: 'Agency Lead Import',
      owner: 'Training Team',
      createdDate: todayISO(),
      lastActivity: 'Imported through Agency Lead Import',
      notes: [{ date: todayISO(), author: 'Importer', text: `Imported from dummy CSV row ${index + 1}.` }]
    };
    return { ...lead, missing, valid: missing.length === 0 };
  });
}

export default function LeadImportPage({ onImport, onNavigate }) {
  const fileRef = useRef(null);
  const [step, setStep] = useState('upload');
  const [leadMode, setLeadMode] = useState('Scrub and Upload');
  const [leadType, setLeadType] = useState('Personal Lines');
  const [listName, setListName] = useState('Training Import List');
  const [sourceCategory, setSourceCategory] = useState('--None--');
  const [currentLeadSource, setCurrentLeadSource] = useState('--None--');
  const [xDateLob, setXDateLob] = useState('--None--');
  const [xDateProduct, setXDateProduct] = useState('--None--');
  const [text, setText] = useState(SAMPLE);
  const [rows, setRows] = useState([]);

  const preview = () => {
    const parsed = parseCsv(text).map((row) => ({ ...row, type: leadType }));
    setRows(parsed);
    setStep('preview');
  };

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result || ''));
    reader.readAsText(file);
    event.target.value = '';
  };

  const submit = () => {
    const valid = rows.filter((row) => row.valid).map(({ missing, valid, ...lead }) => lead);
    if (!valid.length) return;
    onImport(valid);
    setStep('submitted');
    window.setTimeout(() => onNavigate('leads'), 700);
  };

  return (
    <main className="sf-pattern-page sf-lead-import-page">
      <header className="sf-builder-title">
        <span className="sf-object-icon green">⇩</span>
        <h1>Agency Lead Import</h1>
      </header>

      <section className="sf-import-card">
        <h2>Import Lead Data into Salesforce</h2>
        <div className="sf-progress-path">
          <span className={step === 'upload' ? 'active' : step !== 'upload' ? 'done' : ''}>Upload a file</span>
          <span className={step === 'preview' ? 'active' : step === 'submitted' ? 'done' : ''}>Preview</span>
          <span className={step === 'submitted' ? 'active' : ''}>Submission Received</span>
        </div>
        <p>Please make sure you are using an acceptable file format for Personal Lines and Business Insurance leads. Use fictional training records only.</p>
        <p>For Personal Lines Lead Import, please download the <strong>Agency Import</strong> reference template. <button className="sf-download-link">⇩</button><br />For Business Insurance Lead import, please download the <strong>Business Insurance</strong> reference template. <button className="sf-download-link">⇩</button></p>

        {step !== 'submitted' ? (
          <div className="sf-import-form-grid">
            <section>
              <h3><span>*</span> What type of Leads are you importing?</h3>
              <label><input type="radio" checked={leadMode === 'Scrub and Upload'} onChange={() => setLeadMode('Scrub and Upload')} /> Scrub and Upload</label>
              <label><input type="radio" checked={leadMode === 'Scrub Only'} onChange={() => setLeadMode('Scrub Only')} /> Scrub Only</label>
              <label className="sf-field"><span>* Lead Type</span><select value={leadType} onChange={(e) => setLeadType(e.target.value)}><option>Personal Lines</option><option>Commercial Lines</option></select></label>
              <label className="sf-field"><span>* List Name / Marketing Source:</span><input value={listName} onChange={(e) => setListName(e.target.value)} /></label>
              <label className="sf-check"><input type="checkbox" /> Set Lead Status to Discovery</label>
              <p className="sf-import-note">If checked, imported leads will be placed in Discovery status and automated lead marketing may begin.</p>
              <label className="sf-check"><input type="checkbox" /> Append Lead Information</label>
              <p className="sf-import-note">If checked, matching blank fields may be updated with provided information.</p>
            </section>

            <section>
              <h3>Lead Source & X-Date Information</h3>
              <label className="sf-field"><span>* Source Category</span><select value={sourceCategory} onChange={(e) => setSourceCategory(e.target.value)}><option>--None--</option><option>Referral</option><option>Internet Lead</option><option>Direct Mail</option></select></label>
              <label className="sf-field"><span>Current Lead Source</span><select value={currentLeadSource} onChange={(e) => setCurrentLeadSource(e.target.value)}><option>--None--</option><option>Agency Website</option><option>Phone Inquiry</option><option>Marketing List</option></select></label>
              <label className="sf-field"><span>X-Date LOB</span><select value={xDateLob} onChange={(e) => setXDateLob(e.target.value)}><option>--None--</option><option>Auto</option><option>Home</option><option>Commercial</option></select></label>
              <label className="sf-field"><span>X-Date Product</span><select value={xDateProduct} onChange={(e) => setXDateProduct(e.target.value)}><option>--None--</option><option>Homeowners</option><option>Personal Auto</option><option>BOP</option></select></label>
            </section>

            <section>
              <h3>Where is your data located?</h3>
              <div className="sf-upload-drop" onClick={() => fileRef.current?.click()}><button>⇧ Upload Files</button><span>Or drop files</span></div>
              <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" hidden onChange={handleFile} />
              <p className="sf-import-note"><strong>*A maximum of 20,000 records can be uploaded at one time.</strong><br /><strong>*A maximum of 60,000 records or 30 files can be uploaded per day.</strong></p>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows="8" className="sf-import-textarea" />
              <button className="sf-import-primary" onClick={preview}>Preview</button>
            </section>
          </div>
        ) : (
          <div className="sf-submission-received"><h3>Submission Received</h3><p>Your valid dummy records were imported into the Leads module.</p></div>
        )}

        {step === 'preview' && (
          <section className="sf-import-preview">
            <h3>Preview</h3>
            <table className="sf-data-table">
              <thead><tr><th>Name</th><th>Line</th><th>Interest</th><th>State</th><th>Premium</th><th>Validation</th></tr></thead>
              <tbody>{rows.map((row, index) => <tr key={`${row.name}-${index}`}><td>{row.name || '(Missing name)'}</td><td>{row.type}</td><td>{row.interest}</td><td>{row.state}</td><td>${row.premium.toLocaleString()}</td><td>{row.valid ? 'Ready' : `Missing: ${row.missing.join(', ')}`}</td></tr>)}</tbody>
            </table>
            <div className="sf-import-preview-actions"><button onClick={() => setStep('upload')}>Back</button><button className="sf-import-primary" disabled={!rows.some((row) => row.valid)} onClick={submit}>Submit Import</button></div>
          </section>
        )}
      </section>
    </main>
  );
}
