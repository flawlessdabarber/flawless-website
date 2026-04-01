import React from 'react';
import ReactMarkdown from 'react-markdown';

const policy = `
# Policy & Terms and Conditions

## 1. Introduction
Welcome to Flawless Da Barber. By using our services, you agree to these terms.

## 2. Appointments
- **Cancellations:** Must be made at least 24 hours in advance.
- **No-Shows:** May result in a fee or loss of membership privileges.
- **Mobile Visits:** Require a safe and clean environment for the barber.

## 3. Memberships
- Memberships are non-transferable.
- Monthly fees are billed automatically.
- Corporate and Investment packages require a separate contract.

## 4. Privacy
We value your privacy. Your data is used solely to enhance your grooming experience and manage your account.

## 5. Merchandise
- Returns are accepted within 14 days for unopened products.
- Apparel must be unworn and in original packaging.

## 6. AI Concierge
Our AI agent is here to assist you. While we strive for accuracy, please confirm critical booking details with your barber.
`;

export default function Legal() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-3xl">
        <div className="glass p-12 rounded-3xl">
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{policy}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
