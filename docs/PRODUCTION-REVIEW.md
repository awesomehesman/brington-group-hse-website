# Production review — 15 September 2026

## Improvements implemented

- Replaced incomplete service content and unsupported statistics with seven clearly described services and the four business pillars.
- Improved brand presentation, hierarchy, corporate navy/gold palette, photography, service cards and alternating page sections.
- Added a sticky compact header, usable mobile navigation, Escape dismissal, skip link, focus indicators and reduced-motion support.
- Replaced the disconnected enquiry form with a working client-side draft/review flow for WhatsApp and email; no false delivery claims or backend dependency.
- Added all seven requested form fields, useful inline validation, explicit privacy information and copy-message fallback.
- Centralised service and contact data and rendered essential content at build time for no-JavaScript resilience and SEO.
- Self-hosted compressed responsive photography and fonts; added favicons, social card, structured data and domain-aware metadata.
- Added static/Worker security headers and explicit 404/405 behavior.

## Validation

- Production build and built page, image, anchor and metadata checks.
- Six Node/jsdom tests for validation, encoding, safe text rendering, error recovery and static contacts/content.
- Chromium checks at 320, 375, 430, 768, 1024, 1440 and 1920px: no horizontal overflow, image loading, no page/console errors and axe WCAG 2/2.1/2.2 A/AA rules.
- Browser interaction checks for mobile navigation, keyboard dismissal, service preselection, form errors, draft review, metadata, privacy/credits pages, reduced motion and disabled-JavaScript fallbacks.
- Desktop and mobile screenshots reviewed using an isolated headless Chromium session. The connected Browser runtime had no available browser.

Automated accessibility checks are not a full WCAG certification. Testing used Chromium with simulated viewport sizes, not physical iOS/Android devices. WhatsApp/email destinations were inspected without sending a message or opening an external account. Messages are sent only by visitors in the receiving app. Email app availability and long message support depend on the visitor’s device; copying and direct contact remain available.

## Publication

The code supports a private Sites deployment and a separate Vercel/static-host deployment. Public launch needs the owner's chosen public domain/audience. Set SITE_URL for canonical URLs on a custom static-host domain.

## Business confirmation

No company accreditation, client list, years of experience, guaranteed approvals or street address have been invented. Training accreditation should be confirmed before strengthening that wording. The enquiry notice describes this website's behavior; business record retention after receipt remains an owner policy matter.
