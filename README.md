# Brington Group HSE Consultants

A professional, responsive HSE consultancy website for Johannesburg and nationwide South African clients. It retains the flat HTML/CSS/JavaScript and Vite architecture requested to match `PAINTERS-PAINTS`.

## Run locally

Use Node 22.13+ (Node 24 is recorded in `.nvmrc`) and npm.

```sh
nvm use
npm ci
npm run dev
npm run build
npm test
npm run preview
```

`npm run build` creates static files in `dist/client`, a self-contained Sites Worker in `dist/server/index.js`, and verifies the built pages. `npm run build:vercel` produces only the static host build; `vercel.json` configures the output and security headers. No lint command is configured.

## Browser tests

```sh
npx playwright install chromium
npm run build
npm run test:browser
```

Tests start a server for the built Worker on localhost port 4178. To use an existing Chromium installation, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its executable path. `QA_SCREENSHOTS=/absolute/path` optionally saves screenshots. Tests cover 320, 375, 430, 768, 1024, 1440 and 1920px, image loading, horizontal overflow, console errors, mobile navigation, form validation, generated contact URLs, no-JavaScript behavior, reduced motion, support pages and axe accessibility checks.

## Project structure

```text
assets/source/                Original logo and source photographs
public/
  images/                     Optimised logo and responsive WebP photographs
  fonts/                      Local WOFF2 fonts and licences
  og.png                      Branded social-sharing card
  favicon.png
  apple-touch-icon.png
scripts/
  render-page.mjs              Build-time HTML, contacts and SEO rendering
  prepare-assets.mjs           Reproducible image optimisation
  build-worker.mjs             Self-contained Sites Worker packaging
  check-build.mjs              Built page/asset/anchor validation
  serve-built.mjs              Local production Worker testing
tests/
  quote.test.mjs               Enquiry and rendered-content checks
  browser/site.spec.js         Browser integration and accessibility tests
docs/
  BRAND-GUIDE.md
  PRODUCTION-REVIEW.md
  social-preview-prompt.txt
.openai/hosting.json           Sites project reference
business-config.js            Confirmed business information
site-content.js               Seven services and dropdown options
quote.js                      Validation, message preparation and review
script.js                     Navigation, icons and service selection
index.html                    Homepage template, rendered by Vite
privacy.html                  Factual enquiry privacy notice
image-credits.html            Photography, font and icon credits
styles.css                    Responsive design and reduced-motion support
vite.config.js
vercel.json
playwright.config.js
```

There are no SPA routes. `/` contains Home, About, Services, Why Brington and Contact, with an anchored quote form. `/privacy.html` and `/image-credits.html` are independent pages. Content, contact links and navigation remain usable without JavaScript.

## Business configuration

Edit `business-config.js` to update the business name, phone, email, WhatsApp number, location or service area. Current owner-confirmed details:

- Calls: +27 78 093 8562
- WhatsApp: 27780938562 (international digits only)
- Email: nkomo07@gmail.com

The build renders contact links into HTML so they work without JavaScript. Rebuild after changing configuration. `site-content.js` supplies both the service cards and form choices.

## Quote delivery

The quote form validates required fields and prepares a reviewable message on the visitor’s device. Visitors choose WhatsApp, an email draft, or copying the message. They review and send through their chosen app. Opening WhatsApp or an email draft passes the message to that provider; preparation alone makes no network request.

The website does not store enquiries or claim delivery. No backend, API keys or database are needed for this contact flow. Direct call, email and WhatsApp links are available as fallbacks. App support for long pre-filled messages varies; visitors can copy the complete message when needed.

For future direct submission, add a separate API adapter with server-side validation, abuse protection, and verified delivery. Do not report success before the API confirms it. Update privacy disclosures to match actual collection and business record-handling practices.

## Assets and branding

The owner-supplied source is the BG emblem; its proportions and colours are retained. `npm run assets` creates optimised derivatives without overwriting source files. Website photographs are locally hosted, credited illustrative stock imagery, never represented as Brington staff or projects. Fonts are self-hosted; licences accompany them. Lucide supplies tree-shaken decorative icons. The social card uses the built-in ImageGen tool; its prompt is recorded in `docs/social-preview-prompt.txt` and the final asset is `public/og.png`.

## SEO and hosting

The homepage includes a title, description, Open Graph/X metadata and ProfessionalService structured data. Absolute URLs use `SITE_URL` when supplied; Vercel builds can infer the deployment origin. Set `SITE_URL` to the final public domain for custom-domain deployments. Copy `.env.example` to `.env.local` for local configuration. The Sites Worker derives missing social/canonical URLs from the request origin. No domain, street address or certification is invented.

Sites publishing is private by default. Public audience changes and custom domain selection are separate owner decisions. Production responses restrict framing, MIME sniffing and unnecessary browser capabilities. Content and fonts load locally; no analytics or marketing trackers are included. Do not overwrite `origin` with a Sites source remote.

## Remaining owner decisions

Confirm training accreditation/course availability before making accredited-provider claims. Supply a public street address, registration details, certifications and project imagery only if they should be shown. Confirm how the business handles messages after receipt before expanding the factual website notice into a broader company privacy policy. None of these require fake placeholders on the public page.

Validation evidence and limitations are in `docs/PRODUCTION-REVIEW.md`.
