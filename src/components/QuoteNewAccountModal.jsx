import { useMemo, useState } from 'react';
import { taskOwners } from '../data/users.js';
import { todayISO } from '../utils/dates.js';

const NONE = '--None--';

const initialPersonalDraft = {
  firstName: '',
  lastName: '',
  sourceCategory: NONE,
  leadSource: NONE,
  dob: '',
  email: '',
  phone: '',
  residenceAddressSearch: '',
  residenceCountry: NONE,
  residenceStreet: '',
  residenceCity: '',
  residenceState: NONE,
  residenceZip: '',
  preferredFirstName: '',
  maritalStatus: NONE,
  gender: NONE,
  driversLicenseNumber: '',
  driversLicenseStatus: NONE,
  description: '',
  primaryLanguage: NONE,
  secondaryLanguage: NONE,
  bestTimeToContact: NONE,
  occupationGroup: NONE,
  referredBy: '',
  xDate: '',
  xDateLOB: NONE,
  agency: '',
  carrier: '',
  premium: '',
  assignedTo: ''
};

const initialBusinessDraft = {
  businessEntity: NONE,
  firstName: '',
  lastName: '',
  workBusinessPhone: '',
  sourceCategory: NONE,
  leadSource: NONE,
  mailingAddressSearch: '',
  mailingCountry: NONE,
  mailingStreet: '',
  mailingCity: '',
  mailingState: NONE,
  mailingZip: '',
  sameAsMailing: false,
  officeAddressSearch: '',
  officeCountry: NONE,
  officeStreet: '',
  officeCity: '',
  officeState: NONE,
  officeZip: '',
  preferredBusinessName: '',
  industry: NONE,
  dbaName: '',
  sicCode: '',
  fein: '',
  employees: '',
  locations: '',
  yearEstablished: '',
  email: '',
  mobilePhone: '',
  preferredPhoneType: NONE,
  website: '',
  referredBy: '',
  franchise: NONE,
  annualSales: '',
  agency: '',
  agencyAOR: 'This field is calculated upon save',
  biXDate: '',
  xDateLOB: NONE,
  carrier: '',
  premium: ''
};

const sourceCategories = [NONE, 'Agency Generated', 'Digital Lead', 'Referral', 'Existing Customer', 'Walk-In', 'Call-In', 'Campaign'];
const leadSources = [NONE, 'Current Customer Referral', 'Agency Website', 'Lead Depot', 'Direct Mail', 'Agency Lead Import', 'Phone Inquiry', 'Walk-In', 'Manual Entry'];
const countries = [NONE, 'United States'];
const states = [NONE, 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'MI', 'MN', 'MO', 'NC', 'NJ', 'NV', 'NY', 'OH', 'OR', 'PA', 'TX', 'UT', 'VA', 'WA', 'WI'];
const languages = [NONE, 'English', 'Spanish', 'Tagalog', 'Vietnamese', 'Mandarin', 'Other'];
const maritalStatuses = [NONE, 'Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
const genders = [NONE, 'Female', 'Male', 'Non-binary', 'Prefer not to say'];
const dlStatuses = [NONE, 'Valid', 'Expired', 'Suspended', 'Revoked', 'Permit', 'Unknown'];
const contactTimes = [NONE, 'Morning', 'Afternoon', 'Evening', 'Anytime'];
const occupationGroups = [NONE, 'Business Owner', 'Healthcare', 'Education', 'Finance', 'Construction', 'Technology', 'Retired', 'Other'];
const lobs = [NONE, 'Auto', 'Home', 'Renters', 'Umbrella', 'Life', 'Business Insurance', 'BOP', 'Commercial Auto', 'General Liability', 'Workers Compensation'];
const businessEntities = [NONE, 'Individual/Sole Proprietor', 'LLC', 'Corporation', 'Partnership', 'Non-Profit', 'Trust'];
const industries = [NONE, 'Retail', 'Restaurant/Food Service', 'Contractor', 'Professional Services', 'Real Estate', 'Transportation', 'Healthcare', 'Manufacturing', 'Technology', 'Other'];
const phoneTypes = [NONE, 'Mobile', 'Work', 'Home', 'Main Office'];
const franchises = [NONE, 'Yes', 'No'];

function RequiredMark() {
  return <span className="quote-required-mark">*</span>;
}

function Field({ label, required = false, children, info = false, className = '' }) {
  return (
    <label className={`quote-field ${className}`.trim()}>
      <span className="quote-field-label">{required && <RequiredMark />}{label}{info && <span className="quote-info-dot">i</span>}</span>
      {children}
    </label>
  );
}

function TextInput({ value, onChange, placeholder = '', type = 'text' }) {
  return <input className="quote-control" type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function SelectInput({ value, onChange, options }) {
  return (
    <select className="quote-control quote-select" value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}

function DateInput({ value, onChange }) {
  return (
    <div className="quote-date-wrap">
      <input className="quote-control" value={value} placeholder="Format: 12/31/2024" onChange={(event) => onChange(event.target.value)} />
      <span aria-hidden="true">▦</span>
    </div>
  );
}

function LookupInput({ value, onChange, placeholder }) {
  return (
    <div className="quote-lookup-wrap">
      <input className="quote-control" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      <span aria-hidden="true">⌕</span>
    </div>
  );
}

function TextAreaInput({ value, onChange, placeholder = '' }) {
  return <textarea className="quote-control quote-textarea" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
}

function SectionHeader({ title }) {
  return <div className="quote-section-header"><span>⌄</span>{title}</div>;
}

export default function QuoteNewAccountModal({ defaultTab = 'personal', onClose, onSave }) {
  const [activeTab, setActiveTab] = useState(defaultTab === 'business' ? 'business' : 'personal');
  const [personal, setPersonal] = useState(initialPersonalDraft);
  const [business, setBusiness] = useState(initialBusinessDraft);
  const [error, setError] = useState('');

  const selectedOwner = useMemo(() => {
    const requestedOwner = activeTab === 'personal' ? personal.assignedTo : business.agency;
    return requestedOwner || taskOwners[0] || 'Jonas';
  }, [activeTab, personal.assignedTo, business.agency]);

  const setPersonalField = (key) => (value) => setPersonal((draft) => ({ ...draft, [key]: value }));
  const setBusinessField = (key) => (value) => setBusiness((draft) => ({ ...draft, [key]: value }));

  const savePersonal = () => {
    if (!personal.firstName.trim() || !personal.lastName.trim()) {
      setError('First Name and Last Name are required for Personal Lines Prospect.');
      return;
    }
    if (personal.sourceCategory === NONE) {
      setError('Source Category is required for Personal Lines Prospect.');
      return;
    }
    if (!personal.email.trim() && !personal.phone.trim()) {
      setError('One of the following fields is required: Email or Phone.');
      return;
    }

    const fullName = `${personal.firstName.trim()} ${personal.lastName.trim()}`;
    onSave({
      name: fullName,
      type: 'Personal Lines',
      interest: personal.xDateLOB !== NONE ? personal.xDateLOB : 'Personal Lines Prospect',
      product: personal.xDateLOB !== NONE ? personal.xDateLOB : 'Personal Lines Quote',
      status: 'New',
      priority: 'Medium',
      source: personal.leadSource !== NONE ? personal.leadSource : personal.sourceCategory,
      phone: personal.phone.trim(),
      email: personal.email.trim(),
      city: personal.residenceCity.trim(),
      state: personal.residenceState !== NONE ? personal.residenceState : '',
      premium: Number(personal.premium) || 0,
      owner: selectedOwner,
      createdDate: todayISO(),
      lastActivity: 'Quote New Account form saved from Personal Lines Prospect tab.',
      prospectDetails: { prospectType: 'Personal Lines Prospect', ...personal },
      notes: [{ date: todayISO(), author: selectedOwner, text: 'Personal Lines Prospect created from Quote New Account. VA may collect information only; licensed staff must review coverage decisions.' }]
    });
  };

  const saveBusiness = () => {
    if (business.businessEntity === NONE || !business.firstName.trim() || !business.lastName.trim() || !business.workBusinessPhone.trim()) {
      setError('Business Entity, First Name, Last Name, and Work/Business Phone are required for Business Insurance Prospect.');
      return;
    }
    if (business.sourceCategory === NONE) {
      setError('Source Category is required for Business Insurance Prospect.');
      return;
    }

    const businessName = business.preferredBusinessName.trim() || business.dbaName.trim() || `${business.firstName.trim()} ${business.lastName.trim()} Business`;
    onSave({
      name: businessName,
      type: 'Commercial Lines',
      interest: business.xDateLOB !== NONE ? business.xDateLOB : 'Business Insurance',
      product: business.xDateLOB !== NONE ? business.xDateLOB : 'Business Insurance Quote',
      status: 'New',
      priority: 'Medium',
      source: business.leadSource !== NONE ? business.leadSource : business.sourceCategory,
      phone: business.workBusinessPhone.trim() || business.mobilePhone.trim(),
      email: business.email.trim(),
      city: business.mailingCity.trim() || business.officeCity.trim(),
      state: business.mailingState !== NONE ? business.mailingState : business.officeState !== NONE ? business.officeState : '',
      premium: Number(business.premium) || 0,
      owner: selectedOwner,
      createdDate: todayISO(),
      lastActivity: 'Quote New Account form saved from Business Insurance Prospect tab.',
      prospectDetails: { prospectType: 'Business Insurance Prospect', ...business },
      notes: [{ date: todayISO(), author: selectedOwner, text: 'Business Insurance Prospect created from Quote New Account. VA may gather business details only; licensed staff must review coverage and eligibility.' }]
    });
  };

  const handleSave = () => {
    setError('');
    if (activeTab === 'personal') savePersonal();
    else saveBusiness();
  };

  const copyMailingToOffice = (checked) => {
    setBusiness((draft) => ({
      ...draft,
      sameAsMailing: checked,
      officeAddressSearch: checked ? draft.mailingAddressSearch : draft.officeAddressSearch,
      officeCountry: checked ? draft.mailingCountry : draft.officeCountry,
      officeStreet: checked ? draft.mailingStreet : draft.officeStreet,
      officeCity: checked ? draft.mailingCity : draft.officeCity,
      officeState: checked ? draft.mailingState : draft.officeState,
      officeZip: checked ? draft.mailingZip : draft.officeZip
    }));
  };

  return (
    <div className="modal-backdrop quote-modal-backdrop" role="dialog" aria-modal="true" aria-label="Quote New Account">
      <div className="quote-modal">
        <div className="quote-modal-title">Quote New Account</div>
        <div className="quote-tab-bar">
          <button className={activeTab === 'personal' ? 'active' : ''} onClick={() => setActiveTab('personal')}>Personal Lines Prospect</button>
          <button className={activeTab === 'business' ? 'active' : ''} onClick={() => setActiveTab('business')}>Business Insurance Prospect</button>
          <span className="quote-required-note"><RequiredMark /> = Required Information</span>
        </div>

        {error && <div className="quote-error">{error}</div>}

        <div className="quote-modal-body">
          {activeTab === 'personal' ? (
            <div className="quote-form-panel">
              <div className="quote-two-column quote-top-section">
                <div>
                  <div className="quote-grid two-cols">
                    <Field label="First Name" required><TextInput value={personal.firstName} onChange={setPersonalField('firstName')} /></Field>
                    <Field label="Last Name" required><TextInput value={personal.lastName} onChange={setPersonalField('lastName')} /></Field>
                    <Field label="Source Category" required><SelectInput value={personal.sourceCategory} onChange={setPersonalField('sourceCategory')} options={sourceCategories} /></Field>
                    <Field label="Lead Source"><SelectInput value={personal.leadSource} onChange={setPersonalField('leadSource')} options={leadSources} /></Field>
                    <Field label="DOB"><DateInput value={personal.dob} onChange={setPersonalField('dob')} /></Field>
                  </div>
                  <div className="quote-required-line"><RequiredMark /> One of the following fields is required</div>
                  <div className="quote-grid two-cols">
                    <Field label="Email" info><TextInput value={personal.email} onChange={setPersonalField('email')} /></Field>
                    <Field label="Phone" info><TextInput value={personal.phone} onChange={setPersonalField('phone')} /></Field>
                  </div>
                </div>
                <div>
                  <h3 className="quote-subtitle">Residence Address</h3>
                  <div className="quote-grid single-col">
                    <Field label="Search Address"><LookupInput value={personal.residenceAddressSearch} onChange={setPersonalField('residenceAddressSearch')} placeholder="Search Address" /></Field>
                    <Field label="Residence Country"><SelectInput value={personal.residenceCountry} onChange={setPersonalField('residenceCountry')} options={countries} /></Field>
                    <Field label="Residence Street"><TextAreaInput value={personal.residenceStreet} onChange={setPersonalField('residenceStreet')} /></Field>
                  </div>
                  <div className="quote-grid city-state">
                    <Field label="Residence City"><TextInput value={personal.residenceCity} onChange={setPersonalField('residenceCity')} /></Field>
                    <Field label="Residence State/Province"><SelectInput value={personal.residenceState} onChange={setPersonalField('residenceState')} options={states} /></Field>
                  </div>
                  <Field label="Residence Zip/PostalCode"><TextInput value={personal.residenceZip} onChange={setPersonalField('residenceZip')} /></Field>
                </div>
              </div>

              <SectionHeader title="Optional Contact Detail" />
              <div className="quote-two-column quote-section-content">
                <div className="quote-grid single-col">
                  <Field label="Preferred First Name"><TextInput value={personal.preferredFirstName} onChange={setPersonalField('preferredFirstName')} /></Field>
                  <Field label="Marital Status"><SelectInput value={personal.maritalStatus} onChange={setPersonalField('maritalStatus')} options={maritalStatuses} /></Field>
                  <Field label="Gender"><SelectInput value={personal.gender} onChange={setPersonalField('gender')} options={genders} /></Field>
                  <div className="quote-grid two-cols compressed">
                    <Field label="Driver's License Number"><TextInput value={personal.driversLicenseNumber} onChange={setPersonalField('driversLicenseNumber')} placeholder="Enter DL" /></Field>
                    <Field label="Driver's License Status"><SelectInput value={personal.driversLicenseStatus} onChange={setPersonalField('driversLicenseStatus')} options={dlStatuses} /></Field>
                  </div>
                  <Field label="Description" info><TextAreaInput value={personal.description} onChange={setPersonalField('description')} /></Field>
                </div>
                <div className="quote-grid single-col">
                  <Field label="Primary Language"><SelectInput value={personal.primaryLanguage} onChange={setPersonalField('primaryLanguage')} options={languages} /></Field>
                  <Field label="Secondary Language"><SelectInput value={personal.secondaryLanguage} onChange={setPersonalField('secondaryLanguage')} options={languages} /></Field>
                  <Field label="Best time to contact"><SelectInput value={personal.bestTimeToContact} onChange={setPersonalField('bestTimeToContact')} options={contactTimes} /></Field>
                  <Field label="Occupation Group"><SelectInput value={personal.occupationGroup} onChange={setPersonalField('occupationGroup')} options={occupationGroups} /></Field>
                  <Field label="Referred By"><LookupInput value={personal.referredBy} onChange={setPersonalField('referredBy')} placeholder="Search Contacts..." /></Field>
                </div>
              </div>

              <SectionHeader title="Preferred X-Date" />
              <div className="quote-two-column quote-section-content last-section">
                <div className="quote-grid single-col">
                  <Field label="X-Date"><DateInput value={personal.xDate} onChange={setPersonalField('xDate')} /></Field>
                  <Field label="X-Date LOB" info><SelectInput value={personal.xDateLOB} onChange={setPersonalField('xDateLOB')} options={lobs} /></Field>
                  <Field label="Agency"><LookupInput value={personal.agency} onChange={setPersonalField('agency')} placeholder="Search Accounts..." /></Field>
                </div>
                <div className="quote-grid single-col">
                  <Field label="Carrier"><LookupInput value={personal.carrier} onChange={setPersonalField('carrier')} placeholder="Search Prior Carriers..." /></Field>
                  <Field label="Premium"><TextInput value={personal.premium} onChange={setPersonalField('premium')} /></Field>
                  <Field label="Assigned To"><LookupInput value={personal.assignedTo} onChange={setPersonalField('assignedTo')} placeholder="Search People..." /></Field>
                </div>
              </div>
            </div>
          ) : (
            <div className="quote-form-panel business-form-panel">
              <div className="quote-two-column quote-top-section">
                <div className="quote-grid single-col">
                  <Field label="Business Entity" required><SelectInput value={business.businessEntity} onChange={setBusinessField('businessEntity')} options={businessEntities} /></Field>
                  <div className="quote-grid two-cols compressed">
                    <Field label="First Name" required><TextInput value={business.firstName} onChange={setBusinessField('firstName')} /></Field>
                    <Field label="Last Name" required><TextInput value={business.lastName} onChange={setBusinessField('lastName')} /></Field>
                  </div>
                  <Field label="Work/Business Phone" required><TextInput value={business.workBusinessPhone} onChange={setBusinessField('workBusinessPhone')} /></Field>
                  <div className="quote-grid two-cols compressed">
                    <Field label="Source Category" required><SelectInput value={business.sourceCategory} onChange={setBusinessField('sourceCategory')} options={sourceCategories} /></Field>
                    <Field label="Lead Source"><SelectInput value={business.leadSource} onChange={setBusinessField('leadSource')} options={leadSources} /></Field>
                  </div>
                </div>
                <div>
                  <h3 className="quote-subtitle">Mailing Address</h3>
                  <div className="quote-grid single-col">
                    <Field label="Search Address"><LookupInput value={business.mailingAddressSearch} onChange={setBusinessField('mailingAddressSearch')} placeholder="Search Address" /></Field>
                    <Field label="Mailing Country"><SelectInput value={business.mailingCountry} onChange={setBusinessField('mailingCountry')} options={countries} /></Field>
                    <Field label="Mailing Street"><TextAreaInput value={business.mailingStreet} onChange={setBusinessField('mailingStreet')} /></Field>
                  </div>
                  <div className="quote-grid city-state">
                    <Field label="Mailing City"><TextInput value={business.mailingCity} onChange={setBusinessField('mailingCity')} /></Field>
                    <Field label="Mailing State/Province"><SelectInput value={business.mailingState} onChange={setBusinessField('mailingState')} options={states} /></Field>
                  </div>
                  <Field label="Mailing Zip/PostalCode"><TextInput value={business.mailingZip} onChange={setBusinessField('mailingZip')} /></Field>
                </div>
              </div>

              <SectionHeader title="Business Address" />
              <div className="quote-business-address-block">
                <label className="quote-checkbox-row"><input type="checkbox" checked={business.sameAsMailing} onChange={(event) => copyMailingToOffice(event.target.checked)} /> Same as Mailing Address</label>
                <h3 className="quote-subtitle small">Office Address</h3>
                <div className="quote-grid business-office-grid">
                  <Field label="Search Address"><LookupInput value={business.officeAddressSearch} onChange={setBusinessField('officeAddressSearch')} placeholder="Search Address" /></Field>
                  <Field label="Office Country"><SelectInput value={business.officeCountry} onChange={setBusinessField('officeCountry')} options={countries} /></Field>
                  <Field label="Office Street"><TextAreaInput value={business.officeStreet} onChange={setBusinessField('officeStreet')} /></Field>
                  <div className="quote-grid city-state nested">
                    <Field label="Office City"><TextInput value={business.officeCity} onChange={setBusinessField('officeCity')} /></Field>
                    <Field label="Office State/Province"><SelectInput value={business.officeState} onChange={setBusinessField('officeState')} options={states} /></Field>
                  </div>
                  <Field label="Office Zip/PostalCode"><TextInput value={business.officeZip} onChange={setBusinessField('officeZip')} /></Field>
                </div>
              </div>

              <SectionHeader title="Account Information" />
              <div className="quote-two-column quote-section-content business-account-info">
                <div className="quote-grid single-col">
                  <Field label="Preferred Business Name"><TextInput value={business.preferredBusinessName} onChange={setBusinessField('preferredBusinessName')} /></Field>
                  <Field label="Industry"><SelectInput value={business.industry} onChange={setBusinessField('industry')} options={industries} /></Field>
                  <Field label="DBA Name"><TextInput value={business.dbaName} onChange={setBusinessField('dbaName')} /></Field>
                  <Field label="SIC Code"><LookupInput value={business.sicCode} onChange={setBusinessField('sicCode')} placeholder="Search SIC Code..." /></Field>
                  <Field label="FEIN"><TextInput value={business.fein} onChange={setBusinessField('fein')} /></Field>
                  <Field label="No. of Employees"><TextInput value={business.employees} onChange={setBusinessField('employees')} /></Field>
                  <Field label="No. of Locations"><TextInput value={business.locations} onChange={setBusinessField('locations')} /></Field>
                  <Field label="Year Established"><TextInput value={business.yearEstablished} onChange={setBusinessField('yearEstablished')} /></Field>
                </div>
                <div className="quote-grid single-col">
                  <Field label="Email"><TextInput value={business.email} onChange={setBusinessField('email')} /></Field>
                  <Field label="Mobile Phone"><TextInput value={business.mobilePhone} onChange={setBusinessField('mobilePhone')} /></Field>
                  <Field label="Preferred Phone Type"><SelectInput value={business.preferredPhoneType} onChange={setBusinessField('preferredPhoneType')} options={phoneTypes} /></Field>
                  <Field label="Website"><TextInput value={business.website} onChange={setBusinessField('website')} /></Field>
                  <Field label="Referred By"><LookupInput value={business.referredBy} onChange={setBusinessField('referredBy')} placeholder="Search Contacts..." /></Field>
                  <Field label="Franchise"><SelectInput value={business.franchise} onChange={setBusinessField('franchise')} options={franchises} /></Field>
                  <Field label="Annual Sales"><TextInput value={business.annualSales} onChange={setBusinessField('annualSales')} /></Field>
                  <Field label="Agency"><LookupInput value={business.agency} onChange={setBusinessField('agency')} placeholder="Search Accounts..." /></Field>
                  <div className="quote-calculated-note"><strong>Agency AOR</strong><em>This field is calculated upon save</em></div>
                </div>
              </div>

              <SectionHeader title="Preferred X Date" />
              <div className="quote-two-column quote-section-content last-section">
                <div className="quote-grid single-col">
                  <Field label="BI X-Date"><DateInput value={business.biXDate} onChange={setBusinessField('biXDate')} /></Field>
                  <Field label="X-Date LOB" info><SelectInput value={business.xDateLOB} onChange={setBusinessField('xDateLOB')} options={lobs} /></Field>
                </div>
                <div className="quote-grid single-col">
                  <Field label="Carrier" info><LookupInput value={business.carrier} onChange={setBusinessField('carrier')} placeholder="Search Prior Carriers..." /></Field>
                  <Field label="Premium"><TextInput value={business.premium} onChange={setBusinessField('premium')} /></Field>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="quote-modal-footer">
          <button className="quote-cancel-button" onClick={onClose}>Cancel</button>
          <button className="quote-save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
