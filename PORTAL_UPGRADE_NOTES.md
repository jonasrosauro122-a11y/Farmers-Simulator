# Portal Upgrade Notes

This version adds the Farmers-style training portal workflows requested from the reference PDF, using only fictional simulator data.

## New / upgraded modules

- Customer Info Portal (`/customer-info`)
  - Customer profile and contact card
  - Clickable policy number portal
  - Clickable billing account summary
  - Documents and activity timeline
  - Endorsement/change request routing

- Billing Center (`/billing`)
  - Billing account list
  - Payment/installment history
  - Policy list connected to billing account
  - Billing note and payment reminder task workflow

- Service Ops (`/service-ops`)
  - Ask Service Ops search
  - View service requests
  - Create service request
  - Find customer chat transcripts

- Agency News & Resources (`/agency-news-resources`)
  - Distribution updates
  - Key dates
  - Rate and rule reminders
  - Resource links to portal modules

- Personal Lines (`/personal-lines`)
  - Product learning kept
  - Added Personal Lines policy portal table
  - View docs and request endorsements

- Commercial Lines (`/commercial-lines`)
  - Product learning kept
  - Added Commercial Lines policy portal table
  - View docs and route COI / endorsement requests

- Lead Info
  - Seeded demo leads
  - Added opportunity score, preferred contact, x-date, and visual stage path

- Alerts Hub
  - Right-side panel remains
  - Mark selected alert as In Process / Completed
  - Assign selected alert to trainee queue

## Build verification

- `npm ci` completed
- `npm run build` completed
- `npm run lint` completed

## Notes

All customer names, policy numbers, billing accounts, and records are fictional and are for training only. Do not copy real carrier screenshots or real customer data into the public deployment.
