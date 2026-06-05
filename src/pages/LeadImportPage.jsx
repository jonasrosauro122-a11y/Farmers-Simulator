import { useRef, useState } from 'react';
import Panel from '../components/Panel.jsx';
import InfoTip from '../components/InfoTip.jsx';
import { LEAD_INTERESTS, LINES } from '../data/leads.js';
import { todayISO } from '../utils/dates.js';

const EXPECTED_COLUMNS = ['Name', 'Email', 'Phone', 'Line', 'Interest', 'Product', 'State', 'Premium'];

const SAMPLE = `Name,Email,Phone,Line,Interest,Product,State,Premium
Ava Torres,ava.torres@example.com,(555) 999-1010,Personal Lines,Home,Homeowners,CA,1800
North Pier Coffee,hello@northpier.example,(555) 999-2020,Commercial Lines,Commercial,Business Owner Policy,OR,6200
Liam Chen,,(555) 999-3030,Personal Lines,Auto,Personal Auto,WA,1450
,missing.name@example.com,(555) 999-4040,Personal Lines,Renters,Renters,NV,320`;

function parseCsv(text) {
  const rows = text.trim().split(/\r?\n/).filter(Boolean);
  if (rows.length < 2) return [];
  // Skip the header row if it looks like one.
  const dataRows = /name/i.test(rows[0]) ? rows.slice(1) : rows;
  return dataRows.map((row, index) => {
    const [name, email, phone, type, interest, product, state, premium] = row.split(',').map((v) => (v || '').trim());
    const record = {
      name, email, phone,
      type: LINES.includes(type) ? type : 'Personal Lines',
      interest: LEAD_INTERESTS.includes(interest) ? interest : interest || '',
      product: product || interest || '',
      state: (state || '').toUpperCase().slice(0, 2),
      premium: Number(premium) || 0,
      city: 'Imported',
      status: 'New',
      priority: 'Medium',
      source: 'Agency Lead Import',
      owner: 'Training Team',
      createdDate: todayISO(),
      lastActivity: 'Imported via Agency Lead Import',
      notes: [{ date: todayISO(), author: 'Importer', text: `Imported from CSV row ${index + 1}.` }]
    };
    const missing = [];
    if (!record.name) missing.push('Name');
    if (!record.phone && !record.email) missing.push('Phone or Email');
    if (!record.interest) missing.push('Interest');
    return { ...record, missing, valid: missing.length === 0 };
  });
}

export default function LeadImportPage({ onImport, onNavigate }) {
  const [text, setText] = useState(SAMPLE);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const runPreview = (source = text) => setPreview(parseCsv(source));

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = String(reader.result || '');
      setText(content);
      setPreview(parseCsv(content));
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const validRows = (preview || []).filter((r) => r.valid);

  const importNow = () => {
    if (!validRows.length) return;
    onImport(validRows.map(({ missing, valid, ...lead }) => lead));
    setPreview(null);
    onNavigate('leads');
  };

  return (
    <main className="workspace page-bg">
      <div className="page-header">
        <div>
          <p className="eyebrow">Agency Lead Import</p>
          <h1>Import Leads <InfoTip text="Paste CSV text or upload a .csv file, preview the rows, fix anything flagged as missing, then import the valid records into the Leads module." /></h1>
          <span>Paste CSV text or upload a file, validate the rows, and import into Leads.</span>
        </div>
      </div>

      <Panel title="Expected Columns" icon="📚">
        <p className="helper-text">One lead per line, comma-separated, in this order (header row optional):</p>
        <div className="column-chips">
          {EXPECTED_COLUMNS.map((c) => <code key={c} className="column-chip">{c}</code>)}
        </div>
        <p className="helper-text">Name is required, plus at least a Phone or Email. Interest should be one of: {LEAD_INTERESTS.join(', ')}. Use fictional training data only.</p>
      </Panel>

      <div className="detail-grid wide-left">
        <Panel title="CSV Input" icon="📥">
          <textarea className="input monospace" rows="12" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="button-row">
            <button className="outline-button" onClick={() => fileRef.current?.click()}>Upload .csv File</button>
            <input ref={fileRef} type="file" accept=".csv,text/csv,text/plain" style={{ display: 'none' }} onChange={handleFile} />
            <button className="outline-button" onClick={() => runPreview()}>Preview & Validate</button>
            <button className="primary-button" onClick={importNow} disabled={!validRows.length}>
              Import {validRows.length || ''} Valid Lead{validRows.length === 1 ? '' : 's'}
            </button>
          </div>
        </Panel>

        <Panel title="Preview & Validation" icon="👀">
          {!preview ? (
            <div className="empty-state compact">Click “Preview & Validate” to check the rows before importing.</div>
          ) : preview.length === 0 ? (
            <div className="empty-state compact">No data rows found. Add at least one lead line under the header.</div>
          ) : (
            <div className="tile-list">
              {preview.map((row, i) => (
                <div className={`result-card static ${row.valid ? '' : 'invalid-row'}`} key={i}>
                  <strong>{row.name || '(missing name)'}</strong>
                  <span>{row.type} · {row.interest || '—'} · {row.product || '—'} · {row.state || '—'} · ${row.premium.toLocaleString()}</span>
                  <small>{row.email || 'no email'} · {row.phone || 'no phone'}</small>
                  {!row.valid && <em className="danger-text">Missing: {row.missing.join(', ')} — row will be skipped</em>}
                </div>
              ))}
              <p className="metric-caption">{validRows.length} of {preview.length} rows are valid and will be imported.</p>
            </div>
          )}
        </Panel>
      </div>
    </main>
  );
}
