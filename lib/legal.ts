// Website legal documents. Inline links use [text](href).
// Source: "Privacy Policy" and "Website Terms of Use", Version 1.0, 16 October 2026.
// The drafts' internal implementation notes are not published.

export type LegalBlock =
  | string
  | { lead: string; text: string }
  | { lead: string; address: string[] };

export type LegalSection = { id: string; title: string; body: LegalBlock[] };

export type LegalDoc = {
  slug: 'privacy' | 'terms';
  title: string;
  shortTitle: string;
  description: string;
  version: string;
  date: string;
  sections: LegalSection[];
};

const ADDRESS = 'AGEX TECH PTE. LTD., 6 Battery Road, #17-06, Six Battery Road, Singapore 049909';

export const PRIVACY: LegalDoc = {
  slug: 'privacy',
  title: 'Privacy Policy',
  shortTitle: 'Privacy Policy',
  description: 'How AGEX TECH PTE. LTD. collects, uses, discloses, protects and retains personal data through its corporate website and business communications.',
  version: 'Version 1.0',
  date: '16 October 2026',
  sections: [
    {
      id: 'about', title: 'About this Privacy Policy', body: [
        'This Privacy Policy explains how AGEX TECH PTE. LTD. (‘AGEX’, ‘we’, ‘us’ or ‘our’) collects, uses, discloses, protects and retains personal data when individuals visit our corporate website, contact us about mobility technology solutions, request demonstrations, or submit investor or strategic-partner inquiries. AGEX is based in Singapore at 6 Battery Road, #17-06, Six Battery Road, Singapore 049909.',
        'This Policy is intended to address our corporate website and related business communications. It does not by itself govern personal data processed within ride-hailing, delivery or fleet-management systems operated by our customers. Such processing is addressed by the applicable customer agreement, data-processing terms and end-user notices, as appropriate.',
      ],
    },
    {
      id: 'data-we-collect', title: 'Personal data we collect', body: [
        { lead: 'Information you provide:', text: 'name, business email address, company or organisation, country and target market, selected solution, business stage, inquiry category, messages, and any information you choose to include in communications or meeting requests.' },
        { lead: 'Information collected automatically:', text: 'depending on website configuration, IP address, browser and device information, referring pages, approximate location derived from IP, timestamps, pages viewed, website interaction logs, and cookie or similar identifiers.' },
        'We do not ask for identity documents, payment card data, passenger information or other sensitive data through the public inquiry forms. Please do not submit them.',
        { lead: 'Business interactions:', text: 'correspondence, meeting notes, and professional contact information obtained directly from you or from legitimate business introductions and publicly available professional sources, where permitted by law.' },
      ],
    },
    {
      id: 'purposes', title: 'Purposes of collection, use and disclosure', body: [
        'We process personal data to respond to inquiries; assess business opportunities and market requirements; arrange calls or demonstrations; prepare proposals; manage potential or existing business relationships; respond to investor or strategic-partner interest; operate, maintain and secure the website; detect misuse; keep reasonable business records; and comply with applicable legal obligations.',
        'Where permitted and with any consent required by applicable law, we may send relevant business communications about AGEX products or services. You may opt out of promotional messages using the instructions in the message or by contacting us through the website.',
        'We do not sell personal data.',
      ],
    },
    {
      id: 'consent', title: 'Consent and other lawful bases', body: [
        'Where Singapore’s Personal Data Protection Act 2012 (‘PDPA’) requires consent, we obtain consent or rely on a recognised exception or other basis permitted by law. By submitting a form, you request that we use the information supplied to respond to that inquiry. Any optional marketing consent should be separate from the consent or acknowledgement needed to process an inquiry.',
        'You may withdraw consent, subject to legal or contractual restrictions and reasonable notice. Withdrawal may affect our ability to respond to or continue an interaction. For individuals in jurisdictions with additional privacy laws, applicable rights and legal bases may differ.',
      ],
    },
    {
      id: 'cookies', title: 'Cookies and analytics', body: [
        'We may use strictly necessary cookies or similar technologies to operate the website and remember basic preferences. Analytics or advertising technologies, if implemented, will be described in an updated cookie notice and deployed with consent or other controls where required by applicable law.',
        'You may manage cookies through browser settings and, where offered, the website’s cookie controls. Disabling certain technologies may affect functionality.',
      ],
    },
    {
      id: 'recipients', title: 'Who receives personal data', body: [
        'We may share relevant personal data with authorised AGEX personnel and group or affiliated service teams involved in the inquiry; hosting, form, CRM, email, cybersecurity, analytics and other vendors acting on our instructions; professional advisers; and public authorities or other parties when disclosure is required or permitted by law.',
        'We limit access according to role and business need, and seek appropriate confidentiality, security and contractual safeguards. We do not publish contact-form submissions or disclose them to unrelated businesses for their own marketing purposes without an appropriate basis.',
      ],
    },
    {
      id: 'transfers', title: 'International transfers', body: [
        'Because AGEX engages with international markets, personal data may be accessed or processed outside Singapore. Where the PDPA applies, we take steps to ensure that overseas recipients provide a standard of protection comparable to that under the PDPA, or that another permitted transfer mechanism applies. Additional safeguards may be required under the laws of other relevant jurisdictions.',
      ],
    },
    {
      id: 'retention', title: 'Retention', body: [
        'We retain personal data only for as long as reasonably necessary to fulfil the purposes described in this Policy, meet legal or business record-keeping requirements, resolve disputes and protect legitimate interests. When no longer required, we will delete, anonymise or otherwise cease retaining personal data in accordance with applicable law and reasonable retention procedures.',
      ],
    },
    {
      id: 'security', title: 'Security and data breaches', body: [
        'We implement reasonable administrative, technical and physical measures appropriate to the nature of the data, including access restrictions, service-provider controls and secure transmission where supported. No internet-based system is completely secure, and we cannot guarantee absolute security.',
        'We assess suspected data breaches and notify the Personal Data Protection Commission and affected individuals where the PDPA requires it, within applicable statutory timeframes. Our obligations may differ where we act solely as a data intermediary for a customer.',
      ],
    },
    {
      id: 'rights', title: 'Your choices and rights', body: [
        'Subject to the PDPA and other applicable law, you may request access to personal data about you, request correction of inaccurate or incomplete data, withdraw consent, or raise a privacy concern. We may verify your identity, apply statutory exceptions, and charge a reasonable access fee where legally permitted and notified in advance.',
        'If you receive optional marketing communications, you may opt out without withdrawing the information necessary to handle an active business inquiry. Individuals covered by other privacy laws may have additional rights, which we will assess where applicable.',
      ],
    },
    {
      id: 'dpo', title: 'Data Protection Officer and privacy contact', body: [
        'AGEX will designate a Data Protection Officer (‘DPO’) as required by Singapore law and make the DPO’s business contact information publicly available.',
        'Until a dedicated privacy contact channel is confirmed, privacy requests may be submitted through the [website contact form](/contact?topic=privacy) by selecting or stating ‘Privacy / Data Protection Request’.',
        { lead: 'Postal address', address: ['Data Protection Officer', 'AGEX TECH PTE. LTD.', '6 Battery Road, #17-06', 'Six Battery Road', 'Singapore 049909'] },
      ],
    },
    {
      id: 'links-children', title: 'External links and children', body: [
        'Our website may link to third-party websites with their own privacy practices; we do not control those websites.',
        'The corporate website is intended for business audiences and is not directed at children. If we learn that personal data was collected from a child inappropriately, we will take appropriate steps under applicable law.',
      ],
    },
    {
      id: 'updates', title: 'Updates and contact', body: [
        'We may update this Policy to reflect legal, technical or business changes. The revised version will be posted on the website with an updated effective date. Material changes will be communicated by appropriate means where required.',
        'Questions may be sent through the [website contact form](/contact) or by post to the [DPO address above](#dpo).',
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: 'terms',
  title: 'Website Terms of Use',
  shortTitle: 'Terms of Use',
  description: 'The terms that govern access to and use of the AGEX TECH PTE. LTD. corporate website and its inquiry features.',
  version: 'Version 1.0',
  date: '16 October 2026',
  sections: [
    {
      id: 'acceptance', title: 'Acceptance and scope', body: [
        'These Website Terms of Use (‘Terms’) govern access to and use of the public corporate website operated by AGEX TECH PTE. LTD. (‘AGEX’, ‘we’, ‘us’ or ‘our’), a Singapore company with its headquarters at 6 Battery Road, #17-06, Six Battery Road, Singapore 049909. By accessing or using the website, you agree to these Terms to the extent permitted by applicable law. If you do not agree, do not use the website.',
        'These Terms cover the public website and its inquiry features only. They do not grant access to, or govern use of, any AGEX software platform, application programming interface, hosted service, customer dashboard, or licensed mobility technology. Those services require separate written agreements.',
      ],
    },
    {
      id: 'not-an-offer', title: 'Website information is not an offer', body: [
        'The website describes AGEX’s technology, potential solutions and business approach for informational and preliminary discussion purposes. It is not a binding offer, proposal, warranty, financial projection or promise of service availability in any market. Features, modules, integrations, implementation timelines and support arrangements are subject to assessment, technical readiness, licensing requirements and written agreement.',
        'Submitting an inquiry, requesting a demonstration or discussing a market does not create a customer, investor, partnership, agency, fiduciary or other contractual relationship. AGEX may accept or decline an inquiry at its discretion, subject to applicable law.',
      ],
    },
    {
      id: 'local-operations', title: 'Local operating responsibilities', body: [
        'AGEX provides mobility technology and may offer agreed business-model, implementation and technical support services. Unless expressly agreed otherwise in a signed contract, AGEX does not act as the local transport, delivery or fleet operator; obtain or guarantee local licences; employ or supervise local drivers; or assume responsibility for customer operations, regulatory approvals, insurance, tax or local consumer obligations.',
        'Prospective operators remain responsible for assessing their local market, securing necessary authorisations, establishing an operating team and complying with applicable laws. Nothing on the website constitutes legal, regulatory, financial or investment advice.',
      ],
    },
    {
      id: 'permitted-use', title: 'Permitted use', body: [
        'You may view, download and print reasonable portions of the website for your internal, lawful business evaluation, provided that copyright and other proprietary notices are preserved.',
        'You must not misuse the website, interfere with its operation, probe for vulnerabilities without permission, upload malicious code, impersonate others, scrape content at scale without permission, or use the website in violation of applicable law.',
      ],
    },
    {
      id: 'intellectual-property', title: 'Intellectual property', body: [
        'The website, including its design, text, graphics, product descriptions, visualisations, software elements, trade names and logos, is owned by AGEX or its licensors and protected by applicable intellectual property laws. AGEX and associated marks may not be used without prior written permission except as permitted by law. No rights in AGEX technology or source code are transferred by visiting the website.',
      ],
    },
    {
      id: 'inquiries', title: 'Inquiries and submitted information', body: [
        'You are responsible for the accuracy and lawfulness of information you submit. Do not send passwords, payment details, personal identity documents, confidential source code, sensitive personal data or information belonging to third parties without authorisation.',
        'Unless we have expressly agreed to confidentiality in writing, unsolicited ideas, proposals and materials submitted through public forms are not treated as confidential. You retain ownership of materials you submit. You grant AGEX a limited, non-exclusive right to use the submission as reasonably necessary to review, respond to and discuss your inquiry. AGEX’s handling of personal data is governed by its [Privacy Policy](/privacy).',
      ],
    },
    {
      id: 'third-party', title: 'Third-party links and resources', body: [
        'The website may contain links to third-party websites, services or materials. These links are provided for convenience and do not imply endorsement. AGEX is not responsible for third-party content, availability or practices. Your use of third-party services is subject to their own terms and policies.',
      ],
    },
    {
      id: 'availability', title: 'Availability and changes', body: [
        'We may update, modify, suspend or discontinue the website or any content at any time, subject to applicable law. We do not guarantee continuous availability, uninterrupted access, error-free operation or compatibility with every device or browser. We may take reasonable steps to maintain security and service continuity but are not obliged to preserve public website content indefinitely.',
      ],
    },
    {
      id: 'disclaimers', title: 'Disclaimers', body: [
        'To the fullest extent permitted by applicable law, the website and its content are provided on an ‘as is’ and ‘as available’ basis, without warranties or representations, express or implied, including as to accuracy, completeness, currency, fitness for a particular purpose or non-infringement.',
        'We aim to keep information reasonably accurate but do not warrant that every description or illustration reflects a currently released feature. Nothing in these Terms excludes any statutory guarantee or right that cannot lawfully be excluded.',
      ],
    },
    {
      id: 'liability', title: 'Limitation of liability', body: [
        'To the fullest extent permitted by applicable law, AGEX and its officers, employees and suppliers will not be liable for indirect, incidental, special, consequential or punitive loss, loss of profits, revenue, business opportunities, goodwill or data arising from use of or inability to use the public website, even if advised of the possibility of such loss.',
        'For claims arising solely from use of the public website and not under a separately signed agreement, AGEX’s aggregate liability is limited to SGD 100, to the extent such a limitation is lawful, reasonable and enforceable in the circumstances. This limitation does not apply to fraud, wilful misconduct or liabilities that cannot lawfully be excluded or limited.',
      ],
    },
    {
      id: 'privacy', title: 'Privacy', body: [
        'Our collection and use of personal data through the website is described in the AGEX [Privacy Policy](/privacy). If you submit information about another person, you must have the authority and legal basis to do so and provide any necessary notices. Use of optional analytics or cookies is addressed in the Privacy Policy and applicable website controls.',
      ],
    },
    {
      id: 'governing-law', title: 'Governing law and disputes', body: [
        'These Terms and disputes arising from the public website are governed by the laws of Singapore, without regard to conflict-of-law principles. Subject to any mandatory applicable consumer or other legal protections, the courts of Singapore have exclusive jurisdiction over disputes relating to these Terms. Parties may first seek to resolve disputes through good-faith discussions.',
      ],
    },
    {
      id: 'severability', title: 'Severability, waiver and entire agreement', body: [
        'If any provision is found invalid or unenforceable, the remaining provisions continue in effect to the extent lawful. A failure to enforce a provision is not a waiver. These Terms and the [Privacy Policy](/privacy) constitute the relevant notices for use of the public website, but do not replace any separately executed agreement with AGEX.',
      ],
    },
    {
      id: 'changes', title: 'Changes and contact', body: [
        'We may revise these Terms from time to time. Updated Terms take effect when published on the website unless otherwise stated. Continued use after publication constitutes acceptance to the extent permitted by law.',
        `Questions about these Terms may be sent through the [website contact form](/contact) or by post to ${ADDRESS}.`,
      ],
    },
  ],
};

export const LEGAL_DOCS = [PRIVACY, TERMS];
